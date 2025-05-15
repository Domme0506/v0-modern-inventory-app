export interface Product {
  id: string
  name: string
  description?: string
  stock: number
  createdAt: string
  updatedAt: string
}

export interface InventoryStats {
  totalProducts: number
  lowStock: number
  changePercentage: number
}
