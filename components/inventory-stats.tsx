import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Package, ShoppingCart } from "lucide-react"

interface StatsProps {
  stats: {
    totalProducts: number
    totalValue: number
    lowStock: number
    changePercentage: number
  }
}

export function InventoryStats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {stats.changePercentage > 0 ? (
              <span className="flex items-center text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                {stats.changePercentage}% from last month
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <ArrowDown className="h-3 w-3 mr-1" />
                {Math.abs(stats.changePercentage)}% from last month
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <ShoppingCart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.lowStock}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Items need reordering</p>
        </CardContent>
      </Card>
    </div>
  )
}
