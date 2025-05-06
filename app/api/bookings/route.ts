import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
    console.error("Failed to fetch bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Start a transaction to update both booking and item
    const result = await prisma.$transaction(async (tx) => {
      // Create booking
      const booking = await tx.booking.create({
        data: {
          itemId: body.itemId,
          quantity: body.quantity,
          type: body.type,
          notes: body.notes,
        },
      })

      // Update item quantity
      const item = await tx.item.findUnique({
        where: { id: body.itemId },
      })

      if (!item) {
        throw new Error("Item not found")
      }

      // Calculate new quantity based on booking type
      const newQuantity = body.type === "in" ? item.quantity + body.quantity : item.quantity - body.quantity

      // Ensure quantity doesn't go below zero
      if (newQuantity < 0) {
        throw new Error("Insufficient quantity")
      }

      // Update item
      await tx.item.update({
        where: { id: body.itemId },
        data: { quantity: newQuantity },
      })

      return booking
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Failed to create booking:", error)

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Insufficient quantity") {
        return NextResponse.json({ error: "Insufficient quantity available" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
