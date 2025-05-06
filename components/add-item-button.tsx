import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AddItemButton() {
  return (
    <Button asChild>
      <Link href="/items/add">
        <Plus className="mr-2 h-4 w-4" />
        Artikel hinzufügen
      </Link>
    </Button>
  )
}
