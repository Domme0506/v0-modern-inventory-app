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

// Formularschema definieren
const formSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  quantity: z.coerce.number().int().min(0, "Menge muss 0 oder größer sein"),
  cabinet: z.string().min(1, "Schrank ist erforderlich"),
  position: z.string().min(1, "Position ist erforderlich"),
  side: z.string().min(1, "Seite ist erforderlich"),
})

// Schränke definieren
const cabinets = [
  "Schrank 1",
  "Schrank 2",
  "Schrank 3",
  "Schrank 4",
  "Schrank 5",
  "Schrank 6",
  "Schrank 7",
  "Schrank 8",
  "Schrank 9",
]

const sides = ["links", "rechts"]
const positions = ["oben", "mitte", "unten"]

interface ItemFormProps {
  item?: Item
}

export default function ItemForm({ item }: ItemFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Standort in seine Komponenten aufteilen, wenn ein Artikel bearbeitet wird
  const parseLocation = (location?: string) => {
    if (!location) return { cabinet: "", position: "", side: "" }

    try {
      // Format: "Schrank X, links/rechts oben/mitte/unten"
      const parts = location.split(", ")
      const cabinet = parts[0] // "Schrank X"

      if (parts.length < 2) return { cabinet, position: "", side: "" }

      const positionParts = parts[1].split(" ") // ["links/rechts", "oben/mitte/unten"]
      const side = positionParts[0] // "links" oder "rechts"
      const position = positionParts.length > 1 ? positionParts[1] : "" // "oben", "mitte" oder "unten"

      return { cabinet, position, side }
    } catch (error) {
      console.error("Fehler beim Parsen des Standorts:", error)
      return { cabinet: "", position: "", side: "" }
    }
  }

  const locationParts = parseLocation(item?.location)

  // Formular mit Standardwerten oder vorhandenem Item initialisieren
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      quantity: item?.quantity || 0,
      cabinet: locationParts.cabinet || "",
      position: locationParts.position || "",
      side: locationParts.side || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // Standortkomponenten zu einem String zusammenführen
      const location = `${values.cabinet}, ${values.side} ${values.position}`

      const url = item ? `/api/items/${item.id}` : "/api/items"
      const method = item ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          quantity: values.quantity,
          location: location,
        }),
      })

      if (!response.ok) {
        throw new Error("Fehler beim Speichern des Artikels")
      }

      const savedItem = await response.json()

      toast({
        title: "Erfolg",
        description: item ? "Artikel erfolgreich aktualisiert" : "Artikel erfolgreich erstellt",
      })

      // Weiterleitung zur Artikeldetailseite oder Artikelliste
      router.push(item ? `/items/${item.id}` : "/items")
      router.refresh()
    } catch (error) {
      console.error("Fehler beim Speichern des Artikels:", error)
      toast({
        title: "Fehler",
        description: "Fehler beim Speichern des Artikels",
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
                <Input placeholder="Artikelname" {...field} />
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
              <FormLabel>Menge</FormLabel>
              <FormControl>
                <Input type="number" min={0} placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="cabinet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schrank</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Schrank auswählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cabinets.map((cabinet) => (
                      <SelectItem key={cabinet} value={cabinet}>
                        {cabinet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="side"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seite</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seite auswählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sides.map((side) => (
                      <SelectItem key={side} value={side}>
                        {side}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Position auswählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Abbrechen
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2">
                  <span className="animate-spin inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                </span>
                {item ? "Aktualisiere..." : "Erstelle..."}
              </>
            ) : item ? (
              "Artikel aktualisieren"
            ) : (
              "Artikel erstellen"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
