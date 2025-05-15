import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductList } from "@/components/product-list"
import { InventoryStats } from "@/components/inventory-stats"
import { StorageMap } from "@/components/storage-map"
import { getInventoryStats, getProducts } from "@/lib/data"

export async function InventoryDashboard() {
  const stats = await getInventoryStats()
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <InventoryStats stats={stats} />

      <StorageMap products={products} />

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductList />
        </CardContent>
      </Card>
    </div>
  )
}
