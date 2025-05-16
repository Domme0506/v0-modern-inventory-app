"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

interface DeleteItemButtonProps {
  id: number
}

export default function DeleteItemButton({ id }: DeleteItemButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Fehler beim Löschen des Artikels")
      }

      toast({
        title: "Erfolg",
        description: "Artikel erfolgreich gelöscht",
      })

      router.push("/items")
      router.refresh()
    } catch (error) {
      console.error("Fehler beim Löschen des Artikels:", error)
      toast({
        title: "Fehler",
        description: "Fehler beim Löschen des Artikels",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Artikel löschen</AlertDialogTitle>
          <AlertDialogDescription>
            Sind Sie sicher, dass Sie diesen Artikel löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600" disabled={isDeleting}>
            {isDeleting ? "Löschen..." : "Löschen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
