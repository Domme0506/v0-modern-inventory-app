"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Edit, Trash2, Plus, Minus, Search, X } from "lucide-react"
import type { Item } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
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
import BookItemDialog from "@/components/book-item-dialog"

export default function ItemsTable() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name")
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc")
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [bookingType, setBookingType] = useState<"in" | "out">("in")

  // Standort aus URL holen, falls vorhanden
  const locationFilter = searchParams.get("location")

  useEffect(() => {
    fetchItems()
  }, [searchTerm, sortBy, sortOrder, locationFilter])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (sortBy) params.append("sortBy", sortBy)
      if (sortOrder) params.append("sortOrder", sortOrder)
      if (locationFilter) params.append("location", locationFilter)

      const response = await fetch(`/api/items?${params.toString()}`)
      if (!response.ok) throw new Error("Fehler beim Laden der Artikel")

      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Fehler beim Laden der Artikel:", error)
      toast({
        title: "Fehler",
        description: "Fehler beim Laden der Artikel",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // URL mit Suchparametern aktualisieren
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set("search", searchTerm)
    } else {
      params.delete("search")
    }

    router.push(`/items?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearchTerm("")

    // Suchparameter aus URL entfernen
    const params = new URLSearchParams(searchParams)
    params.delete("search")
    router.push(`/items?${params.toString()}`)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Fehler beim Löschen des Artikels")

      // Artikel aus dem State entfernen
      setItems(items.filter((item) => item.id !== id))

      toast({
        title: "Erfolg",
        description: "Artikel erfolgreich gelöscht",
      })
    } catch (error) {
      console.error("Fehler beim Löschen des Artikels:", error)
      toast({
        title: "Fehler",
        description: "Fehler beim Löschen des Artikels",
        variant: "destructive",
      })
    }
  }

  const openBookDialog = (item: Item, type: "in" | "out") => {
    setSelectedItem(item)
    setBookingType(type)
  }

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return null

    return sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      {/* Standortfilter-Anzeige */}
      {locationFilter && (
        <div className="bg-blue-50 p-3 rounded-md flex items-center justify-between">
          <div>
            <span className="font-medium">Gefiltert nach Standort:</span> {locationFilter}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              params.delete("location")
              router.push(`/items?${params.toString()}`)
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Filter löschen
          </Button>
        </div>
      )}

      {/* Suchformular */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Artikel nach Name oder Standort suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit">Suchen</Button>
      </form>

      {/* Artikeltabelle */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center">
                  Name
                  {renderSortIcon("name")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("quantity")}>
                <div className="flex items-center justify-end">
                  Menge
                  {renderSortIcon("quantity")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("location")}>
                <div className="flex items-center">
                  Standort
                  {renderSortIcon("location")}
                </div>
              </TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Keine Artikel gefunden.
                  <Link href="/items/add" className="text-primary hover:underline ml-1">
                    Ersten Artikel hinzufügen
                  </Link>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link href={`/items/${item.id}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "font-medium",
                        item.quantity <= 0 ? "text-red-600" : item.quantity < 5 ? "text-amber-600" : "",
                      )}
                    >
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openBookDialog(item, "in")}
                        title="Einbuchen"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openBookDialog(item, "out")}
                        title="Ausbuchen"
                        disabled={item.quantity <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/items/edit/${item.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
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
                              Sind Sie sicher, dass Sie "{item.name}" löschen möchten? Diese Aktion kann nicht
                              rückgängig gemacht werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Buchungsdialog */}
      {selectedItem && (
        <BookItemDialog
          item={selectedItem}
          type={bookingType}
          onClose={() => setSelectedItem(null)}
          onSuccess={fetchItems}
        />
      )}
    </div>
  )
}
