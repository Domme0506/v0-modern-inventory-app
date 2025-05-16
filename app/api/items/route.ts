import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const location = searchParams.get("location")
  const sortBy = searchParams.get("sortBy") || "name"
  const sortOrder = searchParams.get("sortOrder") || "asc"

  try {
    const items = await prisma.item.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(location ? { location } : {}),
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Failed to fetch items:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const item = await prisma.item.create({
      data: {
        name: body.name,
        quantity: body.quantity,
        location: body.location,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Failed to create item:", error)
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}
