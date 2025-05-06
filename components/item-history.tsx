"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp } from "lucide-react"
import type { Booking } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

interface ItemHistoryProps {
  itemId: number
}

export default function ItemHistory({ itemId }: ItemHistoryProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/bookings?itemId=${itemId}`)
        if (!response.ok) throw new Error("Fehler beim Laden der Buchungen")

        const data = await response.json()
        setBookings(data)
      } catch (error) {
        console.error("Fehler beim Laden der Buchungen:", error)
        toast({
          title: "Fehler",
          description: "Fehler beim Laden der Artikelhistorie",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [itemId, toast])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artikelhistorie</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">Keine Historie für diesen Artikel verfügbar.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead className="text-right">Menge</TableHead>
                <TableHead>Notizen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="whitespace-nowrap">{new Date(booking.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {booking.type === "in" ? (
                        <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      {booking.type === "in" ? "Eingang" : "Ausgang"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{booking.quantity}</TableCell>
                  <TableCell>{booking.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
