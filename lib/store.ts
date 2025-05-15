import type { Product } from "./types"

// Create a global store for our products
// In a real app, you would use a database
if (!global.products) {
  global.products = [
    {
      id: "1",
      name: "Wireless Headphones",
      description: "Premium wireless headphones with noise cancellation",
      stock: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Ergonomic Office Chair",
      description: "Comfortable office chair with lumbar support",
      stock: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Smart Watch",
      description: "Fitness tracker and smartwatch with heart rate monitor",
      stock: 22,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Cotton T-Shirt",
      description: "Medium-sized cotton t-shirt in black",
      stock: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Organic Coffee Beans",
      description: "500g of organic, fair-trade coffee beans",
      stock: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

// Add TypeScript global declaration
declare global {
  var products: Product[]
}

// Export functions to interact with the store
export function getProducts(): Product[] {
  return global.products
}

export function getProductById(id: string): Product | undefined {
  return global.products.find((p) => p.id === id)
}

export function addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
  const newProduct: Product = {
    id: String(global.products.length + 1),
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  global.products.push(newProduct)
  return newProduct
}

export function updateProductById(id: string, data: Partial<Product>): Product | null {
  const index = global.products.findIndex((p) => p.id === id)

  if (index === -1) {
    return null
  }

  const updatedProduct = {
    ...global.products[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  global.products[index] = updatedProduct
  return updatedProduct
}

export function deleteProductById(id: string): boolean {
  const initialLength = global.products.length
  global.products = global.products.filter((p) => p.id !== id)
  return global.products.length < initialLength
}
