import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { Product } from "@/lib/types"

// In-memory database for demo purposes
// In a real app, you would use a database like MongoDB, PostgreSQL, etc.
const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    sku: "WH-1000",
    description: "Premium wireless headphones with noise cancellation",
    category: "electronics",
    price: 249.99,
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    sku: "EOC-500",
    description: "Comfortable office chair with lumbar support",
    category: "furniture",
    price: 199.99,
    stock: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Smart Watch",
    sku: "SW-2023",
    description: "Fitness tracker and smartwatch with heart rate monitor",
    category: "electronics",
    price: 179.99,
    stock: 22,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Cotton T-Shirt",
    sku: "CTS-M",
    description: "Medium-sized cotton t-shirt in black",
    category: "clothing",
    price: 19.99,
    stock: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Organic Coffee Beans",
    sku: "OCB-500",
    description: "500g of organic, fair-trade coffee beans",
    category: "food",
    price: 14.99,
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Wireless Keyboard",
    sku: "WK-2000",
    description: "Slim wireless keyboard with backlight",
    category: "electronics",
    price: 59.99,
    stock: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Desk Lamp",
    sku: "DL-LED",
    description: "Adjustable LED desk lamp with multiple brightness levels",
    category: "furniture",
    price: 34.99,
    stock: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Protein Powder",
    sku: "PP-1KG",
    description: "1kg of whey protein powder, chocolate flavor",
    category: "food",
    price: 29.99,
    stock: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newProduct: Product = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  products.push(newProduct)

  return NextResponse.json(newProduct, { status: 201 })
}
