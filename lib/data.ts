import type { InventoryStats, Product } from "./types"

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}/api/products`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}/api/products/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error("Failed to fetch product")
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    return null
  }
}

export async function getInventoryStats(): Promise<InventoryStats> {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}/api/stats`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch inventory stats")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching inventory stats:", error)
    return {
      totalProducts: 0,
      totalValue: 0,
      lowStock: 0,
      changePercentage: 0,
    }
  }
}
