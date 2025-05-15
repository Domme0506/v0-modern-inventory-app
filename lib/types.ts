export interface Product {
  id: string
  name: string
  description?: string
  stock: number
  storageLocation?: StorageLocation
  createdAt: string
  updatedAt: string
}

export interface StorageLocation {
  position: number // 1-9
  height: "top" | "middle" | "bottom"
  side: "left" | "right"
}

export interface InventoryStats {
  totalProducts: number
  lowStock: number
  changePercentage: number
}
