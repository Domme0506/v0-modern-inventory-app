import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Check if tables exist by querying for items
    const itemCount = await prisma.item.count()

    return NextResponse.json({
      success: true,
      message: "Database is set up correctly",
      itemCount,
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to set up database. Please run migrations.",
      },
      { status: 500 },
    )
  }
}
