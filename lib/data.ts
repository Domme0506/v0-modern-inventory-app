import { prisma } from "./prisma"
import type { Item, Booking } from "./types"

export async function getItems(
  search?: string,
  location?: string,
  sortBy = "name",
  sortOrder: "asc" | "desc" = "asc",
): Promise<Item[]> {
  return prisma.item.findMany({
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
}

export async function getItem(id: number): Promise<Item | null> {
  return prisma.item.findUnique({
    where: { id },
  })
}

export async function getBookings(itemId?: number): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: {
      ...(itemId ? { itemId } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      item: true,
    },
  })
}
