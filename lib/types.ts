export interface Product {
  id: string
  name: string
  sku: string
  description?: string
  category: string
  price: number
  stock: number
  createdAt: string
  updatedAt: string
}

export interface InventoryStats {
  totalProducts: number
  totalValue: number
  lowStock: number
  changePercentage: number
}
