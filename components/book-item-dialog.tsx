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

// Formularschema definieren
const formSchema = z.object({
  quantity: z.coerce.number().int().positive("Menge muss größer als 0 sein"),
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

  // Formular initialisieren
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      notes: "",
    },
  })

  // Formularwerte abrufen
  const quantity = form.watch("quantity")

  // Prüfen, ob die Menge für die Ausbuchung gültig ist
  const isQuantityValid = type === "in" || (type === "out" && quantity <= item.quantity)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (type === "out" && values.quantity > item.quantity) {
      form.setError("quantity", {
        type: "manual",
        message: "Kann nicht mehr ausbuchen als verfügbar ist",
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
        throw new Error(errorData.error || "Fehler beim Buchen des Artikels")
      }

      toast({
        title: "Erfolg",
        description: `Artikel erfolgreich ${type === "in" ? "eingebucht" : "ausgebucht"}`,
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Fehler beim Buchen des Artikels:", error)
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Fehler beim Buchen des Artikels",
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
                Einbuchen
              </span>
            ) : (
              <span className="flex items-center">
                <ArrowUp className="mr-2 h-5 w-5 text-red-500" />
                Ausbuchen
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {type === "in"
              ? `Menge zu "${item.name}" hinzufügen`
              : `Menge von "${item.name}" entfernen (${item.quantity} verfügbar)`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menge</FormLabel>
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
                  <FormLabel>Notizen (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Zusätzliche Informationen hinzufügen..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Abbrechen
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
                    Verarbeite...
                  </>
                ) : type === "in" ? (
                  "Einbuchen"
                ) : (
                  "Ausbuchen"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
