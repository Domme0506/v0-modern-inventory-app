import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Package, Plus, Settings, User } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Package className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          <span className="font-bold text-xl text-gray-900 dark:text-white">InventoryPro</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>

          <Link href="/settings" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <Settings className="h-5 w-5" />
          </Link>

          <Link href="/profile" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <User className="h-5 w-5" />
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
