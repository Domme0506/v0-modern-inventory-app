"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { deleteProduct as deleteProductAction } from "@/lib/actions"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductAction(id)
      setProducts(products.filter((product) => product.id !== id))
      return true
    } catch (error) {
      console.error("Error deleting product:", error)
      return false
    }
  }

  return {
    products,
    isLoading,
    deleteProduct,
  }
}
