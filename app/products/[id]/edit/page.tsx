import { ProductForm } from "@/components/product-form"
import { Header } from "@/components/header"
import { getProductById } from "@/lib/data"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Edit Product</h1>
        <ProductForm initialData={product} />
      </div>
    </main>
  )
}
