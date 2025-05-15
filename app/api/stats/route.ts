import { NextResponse } from "next/server"
import { getProducts } from "@/lib/store"

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  const products = getProducts()

  const totalProducts = products.length
  const lowStock = products.filter((product) => product.stock < 10).length

  // Simulate a change percentage (in a real app, this would be calculated from historical data)
  const changePercentage = Math.floor(Math.random() * 21) - 10 // Random number between -10 and 10

  return NextResponse.json({
    totalProducts,
    lowStock,
    changePercentage,
  })
}
