import { StorageMap } from "@/components/storage-map"
import { getProducts } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export async function StorageView() {
  const products = await getProducts()

  // Calculate storage statistics
  const totalLocations = 9 * 2 * 3 // 9 positions, 2 sides, 3 heights
  const usedLocations = products.filter((p) => p.storageLocation).length
  const utilizationRate = Math.round((usedLocations / totalLocations) * 100)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Storage Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Used Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usedLocations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationRate}%</div>
          </CardContent>
        </Card>
      </div>

      <StorageMap products={products} />

      <Card>
        <CardHeader>
          <CardTitle>Storage Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Our storage system is organized into 9 positions (1-9), each with 6 possible locations:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
            <li>Each position has a top, middle, and bottom shelf</li>
            <li>Each shelf has a left and right side</li>
            <li>Use the storage map above to see what's stored where</li>
            <li>When adding or editing a product, you can specify its storage location</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
