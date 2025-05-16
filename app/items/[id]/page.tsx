import { notFound } from "next/navigation"
import { getItem } from "@/lib/data"
import ItemDetail from "@/components/item-detail"
import ItemHistory from "@/components/item-history"
import BackButton from "@/components/back-button"

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = await getItem(Number.parseInt(params.id))

  if (!item) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <BackButton href="/items" label="Zurück zu Artikeln" />

      <div className="grid gap-6 md:grid-cols-2">
        <ItemDetail item={item} />
        <ItemHistory itemId={item.id} />
      </div>
    </div>
  )
}
