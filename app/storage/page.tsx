import { Suspense } from "react"
import { Header } from "@/components/header"
import { StorageView } from "@/components/storage-view"

export default function StoragePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Storage Management</h1>

        <Suspense fallback={<div>Loading storage map...</div>}>
          <StorageView />
        </Suspense>
      </div>
    </main>
  )
}
