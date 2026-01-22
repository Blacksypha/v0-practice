import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    let body: any = {}
    try {
      body = await request.json()
    } catch (e) {
      // If no JSON body was sent, continue with defaults
      body = {}
    }

    const { productId = 'nexpods-pro', quantity = 1 } = body

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
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe session creation error:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
