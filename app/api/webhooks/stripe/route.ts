import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing Stripe environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
    const rawBody = Buffer.from(await request.arrayBuffer());
    const signature = request.headers.get('stripe-signature') || '';

    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
    } catch (err) {
        console.error('Error verifying webhook signature:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        console.log('Checkout session completed:', event.data.object);
        // Here you can fulfill the order, e.g., update your database
    }

    return NextResponse.json({ received: true }, { status: 200 });
}