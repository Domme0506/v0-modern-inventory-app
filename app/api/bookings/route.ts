import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get("itemId")

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        ...(itemId ? { itemId: Number.parseInt(itemId) } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        item: true,
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Fehler beim Laden der Buchungen:", error)
    return NextResponse.json({ error: "Fehler beim Laden der Buchungen" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Transaktion starten, um sowohl Buchung als auch Artikel zu aktualisieren
    const result = await prisma.$transaction(async (tx) => {
      // Buchung erstellen
      const booking = await tx.booking.create({
        data: {
          itemId: body.itemId,
          quantity: body.quantity,
          type: body.type,
          notes: body.notes,
        },
      })

      // Artikel-Menge aktualisieren
      const item = await tx.item.findUnique({
        where: { id: body.itemId },
      })

      if (!item) {
        throw new Error("Artikel nicht gefunden")
      }

      // Neue Menge basierend auf Buchungstyp berechnen
      const newQuantity = body.type === "in" ? item.quantity + body.quantity : item.quantity - body.quantity

      // Sicherstellen, dass die Menge nicht unter Null fällt
      if (newQuantity < 0) {
        throw new Error("Unzureichende Menge")
      }

      // Artikel aktualisieren
      await tx.item.update({
        where: { id: body.itemId },
        data: { quantity: newQuantity },
      })

      return booking
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Fehler beim Erstellen der Buchung:", error)

    // Spezifische Fehler behandeln
    if (error instanceof Error) {
      if (error.message === "Unzureichende Menge") {
        return NextResponse.json({ error: "Unzureichende verfügbare Menge" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Fehler beim Erstellen der Buchung" }, { status: 500 })
  }
}
