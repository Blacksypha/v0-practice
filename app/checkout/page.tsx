"use client"
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe'

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Lock, CreditCard } from "lucide-react"

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    try {
      const headersList = await headers()
      const origin = headersList.get('origin')
  
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, price_1234) of the product you want to sell
            price: 'price_1SrdGu2eZvKYlo2C3G9T6lXK',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${origin ?? ''}/success?session_id={CHECKOUT_SESSION_ID}`,
      });
      if (!session.url) {
        throw new Error('Failed to create Stripe checkout session URL.');
      }
      return NextResponse.redirect(session.url, 303)
    } catch (err) {
      return NextResponse.json(
        { error: (err as Error).message },
        { status: (err as Error & { statusCode?: number }).statusCode || 500 }
      )
    }
    setTimeout(() => {
      alert("Stripe integration placeholder - Payment would be processed here!")
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 grid grid-cols-5">
        {/* Checkout Form */}
        <div className="col-span-3 px-12 py-8 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                Contact Information
              </h2>
              <Input type="email" placeholder="Email address" className="bg-secondary border-border" required />
            </div>

            {/* Shipping */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First name" className="bg-secondary border-border" required />
                <Input placeholder="Last name" className="bg-secondary border-border" required />
                <Input placeholder="Address" className="col-span-2 bg-secondary border-border" required />
                <Input placeholder="City" className="bg-secondary border-border" required />
                <Input placeholder="ZIP code" className="bg-secondary border-border" required />
              </div>
            </div>

            {/* Payment - Stripe Placeholder */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Payment</h2>
              <div className="p-6 border border-border rounded-lg bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-accent" />
                  <span className="font-medium">Card Details</span>
                  <span className="ml-auto text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
                    Stripe Placeholder
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Card Number</Label>
                    <Input placeholder="4242 4242 4242 4242" className="bg-secondary border-border font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Expiry</Label>
                      <Input placeholder="MM/YY" className="bg-secondary border-border" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">CVC</Label>
                      <Input placeholder="123" className="bg-secondary border-border" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  This is a placeholder. Stripe Elements will be integrated here.
                </p>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full gap-2" disabled={isProcessing}>
              <Lock className="w-4 h-4" />
              {isProcessing ? "Processing..." : "Pay $299.00"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-span-2 bg-card border-l border-border px-8 py-8">
          <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center">
              <img src="/wireless-earbuds-product-thumbnail.jpg" alt="NexPods Pro" className="w-14 h-14 object-contain" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">NexPods Pro</h3>
              <p className="text-sm text-muted-foreground">Premium Wireless Earbuds</p>
              <p className="text-sm mt-1">Qty: 1</p>
            </div>
            <p className="font-medium">$299</p>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>$299.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-accent">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>$0.00</span>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>$299.00</span>
          </div>

          <div className="mt-8 p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-accent" />
              <span>Secure checkout powered by Stripe</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
