import { Suspense } from "react"
import { InventoryDashboard } from "@/components/inventory-dashboard"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Inventory Management</h1>
        <Suspense fallback={<DashboardSkeleton />}>
          <InventoryDashboard />
        </Suspense>
      </div>
    </main>
  )
}
