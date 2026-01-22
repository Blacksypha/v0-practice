'use client'
import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Lock, CreditCard } from "lucide-react"

export default function PreviewPage() {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 'nexpods-pro', quantity: 1 })
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
        return
      }
      throw new Error(data?.error || 'Failed to create Checkout session')
    } catch (err) {
      console.error(err)
      alert((err.message).message || 'Checkout failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto">
        {/* Order Details */}
        <div className="max-w-2xl mx-auto px-12 py-8">
          <h1 className="text-2xl font-bold mb-6">Order Preview</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 border border-border rounded-lg bg-card">
              <h2 className="text-lg font-semibold mb-4">Review Your Order</h2>
              <p className="text-muted-foreground mb-6">
                Please review your order details below. You'll enter your shipping and payment information on the next page.
              </p>
              
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center">
                  <img src="/wireless-earbuds-product-thumbnail.jpg" alt="NexPods Pro" className="w-14 h-14 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">NexPods Pro</h3>
                  <p className="text-sm text-muted-foreground">Premium Wireless Earbuds</p>
                  <p className="text-sm mt-1">Qty: 1</p>
                </div>
                <p className="font-medium">$299.00</p>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3 text-sm mb-6">
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

              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>$299.00</span>
              </div>

              <div className="p-4 bg-secondary rounded-lg mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-accent" />
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full gap-2" disabled={isProcessing}>
              <Lock className="w-4 h-4" />
              {isProcessing ? "Redirecting..." : "Proceed to Checkout"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
