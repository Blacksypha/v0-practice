import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getPostHogClient } from '@/lib/posthog-server'

export async function POST(request: Request) {
  const posthog = getPostHogClient()

  // Get client-side PostHog IDs for correlation
  const clientDistinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') || 'anonymous'
  const clientSessionId = request.headers.get('X-POSTHOG-SESSION-ID')

  try {
    let body: any = {}
    try {
      body = await request.json()
    } catch (e) {
      // If no JSON body was sent, continue with defaults
      body = {}
    }

    const { productId = 'nexpods-pro', quantity = 1, email } = body

    // Server-side mapping of product -> price ID (do NOT accept price IDs from the client)
    const PRICE_MAP: Record<string, string> = {
      'nexpods-pro': 'price_1SsIHf9ztXFb0sAoGpMYq4FL'
      // add other productId -> price_id mappings here
    }

    const price = PRICE_MAP[productId]
    if (!price) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 })
    }

    const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price,
          quantity: Number(quantity) || 1
        }
      ],
      // Use 'payment' for one-time, 'subscription' for recurring. Adjust as needed per product.
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Add countries you ship to
      },
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout`,
      customer_email: email || undefined,
    })

    // Capture server-side checkout session created event
    posthog.capture({
      distinctId: email || clientDistinctId,
      event: 'checkout_session_created',
      properties: {
        product_id: productId,
        quantity: Number(quantity) || 1,
        stripe_session_id: session.id,
        $session_id: clientSessionId,
        source: 'api'
      }
    })

    // Identify user on server side if email is provided
    if (email) {
      posthog.identify({
        distinctId: email,
        properties: {
          email: email,
          last_checkout_session: session.id
        }
      })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const error = err as Error
    console.error('Stripe session creation error:', error)

    // Capture server-side checkout error event
    posthog.capture({
      distinctId: clientDistinctId,
      event: 'checkout_session_error',
      properties: {
        error_message: error.message,
        error_type: 'stripe_session_creation_failed',
        source: 'api'
      }
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
