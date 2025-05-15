import { ProductForm } from "@/components/product-form"
import { Header } from "@/components/header"

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Add New Product</h1>
        <ProductForm />
      </div>
    </main>
  )
}
