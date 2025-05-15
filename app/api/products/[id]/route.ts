import { type NextRequest, NextResponse } from "next/server"
import { getProductById, updateProductById, deleteProductById } from "@/lib/store"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const product = getProductById(params.id)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()
  const updatedProduct = updateProductById(params.id, data)

  if (!updatedProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(updatedProduct)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const success = deleteProductById(params.id)

  if (!success) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
