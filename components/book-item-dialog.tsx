"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Item } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ArrowDown, ArrowUp } from "lucide-react"

// Define form schema
const formSchema = z.object({
  quantity: z.coerce.number().int().positive("Quantity must be greater than 0"),
  notes: z.string().optional(),
})

interface BookItemDialogProps {
  item: Item
  type: "in" | "out"
  onClose: () => void
  onSuccess: () => void
}

export default function BookItemDialog({ item, type, onClose, onSuccess }: BookItemDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      notes: "",
    },
  })

  // Get form values
  const quantity = form.watch("quantity")

  // Check if quantity is valid for booking out
  const isQuantityValid = type === "in" || (type === "out" && quantity <= item.quantity)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (type === "out" && values.quantity > item.quantity) {
      form.setError("quantity", {
        type: "manual",
        message: "Cannot book out more than available quantity",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: item.id,
          quantity: values.quantity,
          type,
          notes: values.notes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to book item")
      }

      toast({
        title: "Success",
        description: `Item ${type === "in" ? "booked in" : "booked out"} successfully`,
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error booking item:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book item",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "in" ? (
              <span className="flex items-center">
                <ArrowDown className="mr-2 h-5 w-5 text-green-500" />
                Book In
              </span>
            ) : (
              <span className="flex items-center">
                <ArrowUp className="mr-2 h-5 w-5 text-red-500" />
                Book Out
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {type === "in"
              ? `Add quantity to "${item.name}"`
              : `Remove quantity from "${item.name}" (${item.quantity} available)`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={type === "out" ? item.quantity : undefined} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any additional information..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isQuantityValid}
                variant={type === "in" ? "default" : "destructive"}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">
                      <span className="animate-spin inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    </span>
                    Processing...
                  </>
                ) : type === "in" ? (
                  "Book In"
                ) : (
                  "Book Out"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
