import type { Item } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"
import DeleteItemButton from "@/components/delete-item-button"

interface ItemDetailProps {
  item: Item
}

export default function ItemDetail({ item }: ItemDetailProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/items/edit/${item.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteItemButton id={item.id} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Menge</p>
              <p className="text-lg font-medium">{item.quantity}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Standort</p>
              <p className="text-lg font-medium">{item.location}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Erstellt</p>
            <p className="text-sm">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Zuletzt aktualisiert</p>
            <p className="text-sm">{new Date(item.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
