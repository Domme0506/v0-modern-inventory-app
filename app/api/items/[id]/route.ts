import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.item.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Artikel nicht gefunden" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Fehler beim Laden des Artikels:", error)
    return NextResponse.json({ error: "Fehler beim Laden des Artikels" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const item = await prisma.item.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name: body.name,
        quantity: body.quantity,
        location: body.location,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Artikels:", error)
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Artikels" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.booking.deleteMany({
      where: {
        itemId: Number.parseInt(params.id),
      },
    })

    await prisma.item.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Fehler beim Löschen des Artikels:", error)
    return NextResponse.json({ error: "Fehler beim Löschen des Artikels" }, { status: 500 })
  }
}
