"use server"

import { revalidatePath } from "next/cache"
import type { Product } from "./types"

export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  try {
    const response = await fetch(
      `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    )

    if (!response.ok) {
      throw new Error("Failed to create product")
    }

    revalidatePath("/")
    return await response.json()
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function updateProduct(id: string, data: Partial<Product>) {
  try {
    const response = await fetch(
      `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/products/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    )

    if (!response.ok) {
      throw new Error("Failed to update product")
    }

    revalidatePath("/")
    revalidatePath(`/products/${id}/edit`)
    return await response.json()
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  try {
    const response = await fetch(
      `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/products/${id}`,
      {
        method: "DELETE",
      },
    )

    if (!response.ok) {
      throw new Error("Failed to delete product")
    }

    revalidatePath("/")
    return true
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}
