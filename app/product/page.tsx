"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, Check, Truck, RotateCcw } from "lucide-react"
import posthog from "posthog-js"

const PRODUCT = {
  id: 'nexpods-pro',
  name: 'NexPods Pro',
  price: 299,
  originalPrice: 349,
  category: 'wireless-earbuds'
}

export default function ProductPage() {
  // Track product view on page load (top of conversion funnel)
  useEffect(() => {
    posthog.capture('product_viewed', {
      product_id: PRODUCT.id,
      product_name: PRODUCT.name,
      product_price: PRODUCT.price,
      product_category: PRODUCT.category,
      discount_amount: PRODUCT.originalPrice - PRODUCT.price
    })
  }, [])

  const handleBuyNowClick = () => {
    posthog.capture('clicked_product', {
      product_id: PRODUCT.id,
      product_name: PRODUCT.name
    })
  }

  const handleAddToCartClick = () => {
    posthog.capture('add_to_cart_clicked', {
      product_id: PRODUCT.id,
      product_name: PRODUCT.name,
      product_price: PRODUCT.price,
      quantity: 1
    })
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 grid grid-cols-2">
        {/* Product Image */}
        <div className="flex items-center justify-center bg-card p-8">
          <div className="relative w-full max-w-md aspect-square rounded-2xl bg-secondary flex items-center justify-center">
            <img
              src="/premium-wireless-earbuds-black-sleek-modern-tech-p.jpg"
              alt="NexPods Pro - Premium Wireless Earbuds"
              className="w-3/4 h-3/4 object-contain"
            />
            <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">New Release</Badge>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center px-12 py-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(2,847 reviews)</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-2">NexPods Pro</h1>
          <p className="text-muted-foreground mb-6">Premium Wireless Earbuds</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold">$299</span>
            <span className="text-lg text-muted-foreground line-through">$349</span>
            <Badge variant="secondary" className="text-accent">
              Save $50
            </Badge>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-accent" />
              <span>Active Noise Cancellation with -45dB reduction</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-accent" />
              <span>36-hour total battery life with case</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-accent" />
              <span>IPX5 water and sweat resistant</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-accent" />
              <span>Spatial audio with head tracking</span>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <Button asChild size="lg" className="flex-1" onClick={handleBuyNowClick}>
              <Link href="/preview">Buy Now</Link>
            </Button>
            <Button variant="outline" size="lg" className="flex-1 bg-transparent" onClick={handleAddToCartClick}>
              Add to Cart
            </Button>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Free shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
