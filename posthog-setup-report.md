# PostHog post-wizard report

The wizard has completed a deep integration of your NexTech Store project with PostHog analytics. The integration includes client-side event tracking via `instrumentation-client.ts` for Next.js 15.3+, server-side tracking using `posthog-node` for API routes and webhooks, a reverse proxy configuration to avoid ad blockers, and automatic error tracking with exception capture.

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `newsletter_subscribed` | User subscribes to newsletter via email form on landing page | `app/page.tsx` |
| `shop_now_clicked` | User clicks 'Shop Now' CTA button on landing page hero section | `app/page.tsx` |
| `learn_more_clicked` | User clicks 'Learn More' button on landing page | `app/page.tsx` |
| `product_viewed` | User views the product detail page (top of conversion funnel) | `app/product/page.tsx` |
| `buy_now_clicked` | User clicks 'Buy Now' button on product page | `app/product/page.tsx` |
| `add_to_cart_clicked` | User clicks 'Add to Cart' button on product page | `app/product/page.tsx` |
| `checkout_started` | User initiates checkout process by submitting the form | `app/checkout/page.tsx` |
| `checkout_error` | Error occurs during checkout process (client-side) | `app/checkout/page.tsx` |
| `checkout_session_created` | Server-side: Stripe checkout session successfully created | `app/api/checkout/route.ts` |
| `checkout_session_error` | Server-side: Error creating Stripe checkout session | `app/api/checkout/route.ts` |
| `payment_completed` | Server-side: Stripe webhook confirms checkout.session.completed | `app/api/webhooks/stripe/route.ts` |
| `webhook_signature_error` | Server-side: Invalid Stripe webhook signature received | `app/api/webhooks/stripe/route.ts` |

## Files Created/Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `.env.local` | Modified | Added PostHog environment variables |
| `instrumentation-client.ts` | Created | Client-side PostHog initialization for Next.js 15.3+ |
| `lib/posthog-server.ts` | Created | Server-side PostHog client singleton |
| `next.config.mjs` | Modified | Added reverse proxy rewrites for PostHog |
| `app/page.tsx` | Modified | Added newsletter and CTA click tracking |
| `app/product/page.tsx` | Modified | Added product view and button click tracking |
| `app/checkout/page.tsx` | Modified | Added checkout flow tracking with error capture |
| `app/api/checkout/route.ts` | Modified | Added server-side checkout session events |
| `app/api/webhooks/stripe/route.ts` | Modified | Added payment completed and webhook error events |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/300074/dashboard/1148200) - Core analytics dashboard with conversion funnel and key metrics

### Insights
- [Conversion Funnel - Product to Purchase](https://us.posthog.com/project/300074/insights/HGUCZsWN) - Tracks user journey from product view to completed purchase
- [Daily Events Overview](https://us.posthog.com/project/300074/insights/nV5MQzih) - Trends of key user actions over time
- [Newsletter Signups](https://us.posthog.com/project/300074/insights/960j0qIU) - Track newsletter subscription events from landing page
- [Checkout Errors](https://us.posthog.com/project/300074/insights/cePug0Qe) - Monitor checkout errors and failures
- [Add to Cart Activity](https://us.posthog.com/project/300074/insights/CbxiNiIq) - Track add to cart clicks and engagement

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
