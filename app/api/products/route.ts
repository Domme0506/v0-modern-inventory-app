import { type NextRequest, NextResponse } from "next/server"
import { getProducts, addProduct } from "@/lib/store"

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(getProducts())
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  const newProduct = addProduct(data)

  return NextResponse.json(newProduct, { status: 201 })
}
