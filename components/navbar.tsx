"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Boxes, QrCode, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navItems = [
    {
      name: "Artikel",
      href: "/items",
      icon: <Boxes className="h-5 w-5 mr-2" />,
    },
    {
      name: "QR-Code scannen",
      href: "/scan",
      icon: <QrCode className="h-5 w-5 mr-2" />,
    },
  ]

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Boxes className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Inventarverwaltung</span>
            </Link>
          </div>

          {/* Desktop-Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile-Menü-Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menü umschalten">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile-Menü */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pt-2 pb-4 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-base font-medium",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
