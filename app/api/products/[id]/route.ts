import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/lib/types"

// This is a reference to the in-memory database from the products route
// In a real app, you would use a database like MongoDB, PostgreSQL, etc.
declare global {
  var products: Product[]
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const product = global.products?.find((p) => p.id === params.id)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()

  const productIndex = global.products?.findIndex((p) => p.id === params.id)

  if (productIndex === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const updatedProduct = {
    ...global.products[productIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  global.products[productIndex] = updatedProduct

  return NextResponse.json(updatedProduct)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const productIndex = global.products?.findIndex((p) => p.id === params.id)

  if (productIndex === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  global.products.splice(productIndex, 1)

  return NextResponse.json({ success: true })
}
