import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    // This is a simplified approach - in a real app, you'd use Prisma Migrate
    // Create tables if they don't exist

    // Check if tables exist by trying to query
    let tablesExist = false
    try {
      await prisma.item.findFirst()
      tablesExist = true
    } catch (error) {
      console.log("Tables don't exist yet, will create them")
    }

    if (!tablesExist) {
      // Create tables using Prisma's queryRaw
      // Note: This is a simplified approach and not recommended for production
      // In production, use Prisma Migrate

      // Create Item table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Item" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "quantity" INTEGER NOT NULL DEFAULT 0,
          "location" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL
        )
      `

      // Create Booking table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Booking" (
          "id" SERIAL PRIMARY KEY,
          "itemId" INTEGER NOT NULL,
          "quantity" INTEGER NOT NULL,
          "type" TEXT NOT NULL,
          "notes" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE
        )
      `
    }

    return NextResponse.json({
      success: true,
      message: "Database migration completed successfully",
    })
  } catch (error) {
    console.error("Database migration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to run migration",
      },
      { status: 500 },
    )
  }
}
