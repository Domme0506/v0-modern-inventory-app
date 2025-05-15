"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"

interface StorageMapProps {
  products: Product[]
}

export function StorageMap({ products }: StorageMapProps) {
  const [activeHeight, setActiveHeight] = useState<string>("top")
  const [activeSide, setActiveSide] = useState<string>("all")

  const filteredProducts = products.filter((product) => {
    if (!product.storageLocation) return false

    const heightMatch = product.storageLocation.height === activeHeight
    const sideMatch = activeSide === "all" || product.storageLocation.side === activeSide

    return heightMatch && sideMatch
  })

  const getProductsAtPosition = (position: number) => {
    return filteredProducts.filter((product) => product.storageLocation?.position === position)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Tabs value={activeHeight} onValueChange={setActiveHeight}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="top">Top</TabsTrigger>
                  <TabsTrigger value="middle">Middle</TabsTrigger>
                  <TabsTrigger value="bottom">Bottom</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex-1">
              <Tabs value={activeSide} onValueChange={setActiveSide}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="left">Left</TabsTrigger>
                  <TabsTrigger value="right">Right</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((position) => {
              const positionProducts = getProductsAtPosition(position)

              return (
                <Card
                  key={position}
                  className={`p-3 ${positionProducts.length > 0 ? "border-green-500 dark:border-green-700" : ""}`}
                >
                  <div className="text-center font-bold mb-2">Position {position}</div>
                  {positionProducts.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm">Empty</div>
                  ) : (
                    <div className="space-y-2">
                      {positionProducts.map((product) => (
                        <div key={product.id} className="text-sm">
                          <Badge className="mb-1" variant="outline">
                            {product.storageLocation?.height} {product.storageLocation?.side}
                          </Badge>
                          <div className="font-medium truncate" title={product.name}>
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">Stock: {product.stock}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
