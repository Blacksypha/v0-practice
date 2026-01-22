'use client'
import { useState } from 'react'

export default function IndexPage() {
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
      alert(err.message || 'Checkout failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <button type="submit" role="link" disabled={isProcessing}>
          {isProcessing ? 'Redirecting…' : 'Checkout'}
        </button>
      </section>
    </form>
  )
}