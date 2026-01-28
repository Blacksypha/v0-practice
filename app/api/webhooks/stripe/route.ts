import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPostHogClient } from '@/lib/posthog-server';

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing Stripe environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
    const posthog = getPostHogClient();
    const rawBody = Buffer.from(await request.arrayBuffer());
    const signature = request.headers.get('stripe-signature') || '';

    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
    } catch (err) {
        const error = err as Error;
        console.error('Error verifying webhook signature:', error);

        // Capture webhook signature error event
        posthog.capture({
            distinctId: 'system',
            event: 'webhook_signature_error',
            properties: {
                error_message: error.message,
                webhook_type: 'stripe',
                source: 'api'
            }
        });

        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session);

        // Use customer email as distinct ID for user correlation
        const distinctId = session.customer_email || session.customer?.toString() || 'anonymous';

        // Capture payment succeeded event (without PII)
        posthog.capture({
            distinctId: distinctId,
            event: 'payment_succeeded',
            properties: {
                stripe_session_id: session.id,
                currency: session.currency,
                source: 'webhook'
            }
        });

        // Here you can fulfill the order, e.g., update your database
    }

    // Handle payment intent failures
    if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent failed:', paymentIntent);

        // Use metadata or customer ID if available
        const distinctId = paymentIntent.customer?.toString() || 'anonymous';

        // Capture payment failed event (without PII)
        posthog.capture({
            distinctId: distinctId,
            event: 'payment_failed',
            properties: {
                stripe_payment_intent_id: paymentIntent.id,
                failure_code: paymentIntent.last_payment_error?.code || 'unknown',
                currency: paymentIntent.currency,
                source: 'webhook'
            }
        });
    }

    return NextResponse.json({ received: true }, { status: 200 });
}