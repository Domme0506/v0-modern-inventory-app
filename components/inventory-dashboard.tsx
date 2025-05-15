import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductList } from "@/components/product-list"
import { InventoryStats } from "@/components/inventory-stats"
import { getInventoryStats } from "@/lib/data"

export async function InventoryDashboard() {
  const stats = await getInventoryStats()

  return (
    <div className="space-y-6">
      <InventoryStats stats={stats} />
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
