import { notFound } from "next/navigation"
import { getItem } from "@/lib/data"
import ItemForm from "@/components/item-form"
import BackButton from "@/components/back-button"

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const item = await getItem(Number.parseInt(params.id))

  if (!item) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <BackButton href={`/items/${params.id}`} label="Back to Item" />
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Edit Item</h1>
        <ItemForm item={item} />
      </div>
    </div>
  )
}
