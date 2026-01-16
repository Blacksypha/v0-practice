import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowRight, Zap, Shield, Headphones, Mail } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 grid grid-cols-2 gap-0">
        {/* Hero Section */}
        <div className="flex flex-col justify-center px-12 border-r border-border">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Premium Technology</p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight mb-6 text-balance">
            The future of audio, delivered today.
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Experience revolutionary sound quality with our cutting-edge wireless earbuds. Engineered for perfection.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/product">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features + Contact Grid */}
        <div className="grid grid-rows-2">
          {/* Features Row */}
          <div className="grid grid-cols-3 border-b border-border">
            <div className="flex flex-col items-center justify-center p-6 border-r border-border text-center">
              <Zap className="w-6 h-6 mb-3 text-accent" />
              <h3 className="font-semibold mb-1">Fast Charging</h3>
              <p className="text-xs text-muted-foreground">5 min = 2 hours</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 border-r border-border text-center">
              <Shield className="w-6 h-6 mb-3 text-accent" />
              <h3 className="font-semibold mb-1">2 Year Warranty</h3>
              <p className="text-xs text-muted-foreground">Full coverage</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Headphones className="w-6 h-6 mb-3 text-accent" />
              <h3 className="font-semibold mb-1">Active ANC</h3>
              <p className="text-xs text-muted-foreground">-45dB reduction</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex items-center justify-center p-8 bg-card">
            <div className="w-full max-w-md">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold">Get in Touch</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions? Subscribe for updates and exclusive offers.
              </p>
              <form className="flex gap-3">
                <Input type="email" placeholder="Enter your email" className="flex-1 bg-secondary border-border" />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-xs text-muted-foreground mt-3">
                Or reach us at{" "}
                <a href="mailto:hello@nextech.com" className="text-accent hover:underline">
                  hello@nextech.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
