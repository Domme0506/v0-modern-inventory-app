import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.item.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Failed to fetch item:", error)
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 })
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
    console.error("Failed to update item:", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
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
    console.error("Failed to delete item:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
