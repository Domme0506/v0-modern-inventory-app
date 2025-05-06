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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Formularschema definieren
const formSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  quantity: z.coerce.number().int().min(0, "Menge muss 0 oder größer sein"),
  cabinet: z.string().min(1, "Schrank ist erforderlich"),
  position: z.string().min(1, "Position ist erforderlich"),
  side: z.string().min(1, "Seite ist erforderlich"),
})

// Schränke definieren
const cabinets = Array.from({ length: 9 }, (_, i) => `Schrank ${i + 1}`)
const positions = ["oben", "mitte", "unten"]
const sides = ["links", "rechts"]

interface ItemFormProps {
  item?: Item
}

export default function ItemForm({ item }: ItemFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Standort aus den Einzelteilen zusammensetzen
  const parseLocation = (location: string) => {
    try {
      const parts = location.split(", ")
      const cabinet = parts[0]
      const [side, position] = parts[1].split(" ")
      return { cabinet, side, position }
    } catch (e) {
      return { cabinet: "Schrank 1", side: "links", position: "oben" }
    }
  }

  // Standort in Einzelteile zerlegen, falls ein Item bearbeitet wird
  const locationParts = item ? parseLocation(item.location) : { cabinet: "", side: "", position: "" }

  // Formular mit Standardwerten oder vorhandenem Item initialisieren
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      quantity: item?.quantity || 0,
      cabinet: locationParts.cabinet || "Schrank 1",
      position: locationParts.position || "oben",
      side: locationParts.side || "links",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Standort aus den Einzelteilen zusammensetzen
      const location = `${values.cabinet}, ${values.side} ${values.position}`

      const url = item ? `/api/items/${item.id}` : "/api/items"
      const method = item ? "PUT" : "POST"

      console.log("Formular wird gesendet:", { url, method, values, location })

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Speichern des Artikels")
      }

      toast({
        title: "Erfolg",
        description: item ? "Artikel erfolgreich aktualisiert" : "Artikel erfolgreich erstellt",
      })

      // Weiterleitung zur Artikeldetailseite oder Artikelliste
      router.push(item ? `/items/${item.id}` : "/items")
      router.refresh()
    } catch (error) {
      console.error("Fehler beim Speichern des Artikels:", error)
      setError(error instanceof Error ? error.message : "Fehler beim Speichern des Artikels")
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
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
          name="position"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Position</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {positions.map((position) => (
                    <div key={position} className="flex items-center space-x-2">
                      <RadioGroupItem value={position} id={`position-${position}`} />
                      <Label htmlFor={`position-${position}`}>
                        {position.charAt(0).toUpperCase() + position.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="side"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Seite</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  {sides.map((side) => (
                    <div key={side} className="flex items-center space-x-2">
                      <RadioGroupItem value={side} id={`side-${side}`} />
                      <Label htmlFor={`side-${side}`}>{side.charAt(0).toUpperCase() + side.slice(1)}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
