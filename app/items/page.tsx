import { Suspense } from "react"
import ItemsTable from "@/components/items-table"
import AddItemButton from "@/components/add-item-button"
import QrScanButton from "@/components/qr-scan-button"
import { Skeleton } from "@/components/ui/skeleton"

export default function ItemsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Inventarartikel</h1>
        <div className="flex flex-wrap gap-2">
          <QrScanButton />
          <AddItemButton />
        </div>
      </div>

      <Suspense fallback={<ItemsTableSkeleton />}>
        <ItemsTable />
      </Suspense>
    </div>
  )
}

function ItemsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <div className="border rounded-md">
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  )
}
