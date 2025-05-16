"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Item } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// Define form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.coerce.number().int().min(0, "Quantity must be 0 or greater"),
  location: z.string().min(1, "Location is require  'Quantity must be 0 or greater"),
  location: z.string().min(1, "Location is required"),
})

// Define cabinet locations
const cabinets = [
  "Cabinet 1",
  "Cabinet 2",
  "Cabinet 3",
  "Cabinet 4",
  "Cabinet 5",
  "Cabinet 6",
  "Cabinet 7",
  "Cabinet 8",
  "Cabinet 9",
]

const sides = ["left", "right"]
const shelves = ["top", "middle", "bottom"]

// Generate all possible locations
const locations = cabinets.flatMap((cabinet) =>
  sides.flatMap((side) => shelves.map((shelf) => `${cabinet}, ${side} ${shelf}`)),
)

interface ItemFormProps {
  item?: Item
}

export default function ItemForm({ item }: ItemFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values or existing item
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      quantity: item?.quantity || 0,
      location: item?.location || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      const url = item ? `/api/items/${item.id}` : "/api/items"

      const method = item ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to save item")
      }

      const savedItem = await response.json()

      toast({
        title: "Success",
        description: item ? "Item updated successfully" : "Item created successfully",
      })

      // Redirect to item detail or items list
      router.push(item ? `/items/${item.id}` : "/items")
      router.refresh()
    } catch (error) {
      console.error("Error saving item:", error)
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" min={0} placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2">
                  <span className="animate-spin inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                </span>
                {item ? "Updating..." : "Creating..."}
              </>
            ) : item ? (
              "Update Item"
            ) : (
              "Create Item"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
