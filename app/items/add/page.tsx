import ItemForm from "@/components/item-form"
import BackButton from "@/components/back-button"

export default function AddItemPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <BackButton href="/items" label="Back to Items" />
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Add New Item</h1>
        <ItemForm />
      </div>
    </div>
  )
}
