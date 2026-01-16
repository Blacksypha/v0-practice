import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-border">
      <Link href="/" className="text-xl font-bold tracking-tight">
        NexTech
      </Link>
      <nav className="flex items-center gap-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
        <Link href="/product" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Product
        </Link>
        <Link href="/checkout" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Checkout
        </Link>
        <Link href="/checkout" className="relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
            1
          </span>
        </Link>
      </nav>
    </header>
  )
}
