export interface Item {
  id: number
  name: string
  quantity: number
  location: string
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: number
  itemId: number
  quantity: number
  type: "in" | "out"
  notes?: string
  createdAt: string
  item?: Item
}
