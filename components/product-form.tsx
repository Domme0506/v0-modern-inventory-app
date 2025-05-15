"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StorageLocationSelector } from "@/components/storage-location-selector"
import { createProduct, updateProduct } from "@/lib/actions"
import type { Product, StorageLocation } from "@/lib/types"

// Update the form schema to include storage location
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  stock: z.coerce.number().int().nonnegative("Stock must be 0 or greater"),
  storageLocation: z
    .object({
      position: z.number().min(1).max(9),
      height: z.enum(["top", "middle", "bottom"]),
      side: z.enum(["left", "right"]),
    })
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData?: Product
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [storageLocation, setStorageLocation] = useState<StorageLocation | undefined>(initialData?.storageLocation)

  // Update the default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      stock: initialData?.stock || 0,
      storageLocation: initialData?.storageLocation,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      // Include the storage location in the form data
      const productData = {
        ...data,
        storageLocation,
      }

      if (initialData) {
        await updateProduct(initialData.id, productData)
      } else {
        await createProduct(productData)
      }
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to save product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStorageLocationChange = (location: StorageLocation) => {
    setStorageLocation(location)
    form.setValue("storageLocation", location)
  }

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="storage">Storage Location</TabsTrigger>
        </TabsList>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TabsContent value="details">
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" {...form.register("name")} error={form.formState.errors.name?.message} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} rows={4} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" {...form.register("stock")} />
                {form.formState.errors.stock && (
                  <p className="text-sm text-red-500">{form.formState.errors.stock.message}</p>
                )}
              </div>

              <div className="pt-2">
                <Button type="button" onClick={() => setActiveTab("storage")}>
                  Next: Set Storage Location
                </Button>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="storage">
            <CardContent className="pt-6">
              <StorageLocationSelector value={storageLocation} onChange={handleStorageLocationChange} />
            </CardContent>
          </TabsContent>

          <CardFooter className="flex justify-between border-t p-6">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Create Product"}
            </Button>
          </CardFooter>
        </form>
      </Tabs>
    </Card>
  )
}
