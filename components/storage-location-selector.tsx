"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { StorageLocation } from "@/lib/types"

interface StorageLocationSelectorProps {
  value?: StorageLocation
  onChange: (location: StorageLocation) => void
}

export function StorageLocationSelector({ value, onChange }: StorageLocationSelectorProps) {
  const [selectedPosition, setSelectedPosition] = useState<number>(value?.position || 1)
  const [selectedHeight, setSelectedHeight] = useState<"top" | "middle" | "bottom">(value?.height || "middle")
  const [selectedSide, setSelectedSide] = useState<"left" | "right">(value?.side || "left")

  const handlePositionSelect = (position: number) => {
    setSelectedPosition(position)
    onChange({
      position,
      height: selectedHeight,
      side: selectedSide,
    })
  }

  const handleHeightChange = (height: "top" | "middle" | "bottom") => {
    setSelectedHeight(height)
    onChange({
      position: selectedPosition,
      height,
      side: selectedSide,
    })
  }

  const handleSideChange = (side: "left" | "right") => {
    setSelectedSide(side)
    onChange({
      position: selectedPosition,
      height: selectedHeight,
      side,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block">Storage Position (1-9)</Label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((position) => (
            <Button
              key={position}
              type="button"
              variant={selectedPosition === position ? "default" : "outline"}
              className="h-12 w-full text-lg"
              onClick={() => handlePositionSelect(position)}
            >
              {position}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block">Height</Label>
          <RadioGroup
            value={selectedHeight}
            onValueChange={(value) => handleHeightChange(value as "top" | "middle" | "bottom")}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="top" id="height-top" />
              <Label htmlFor="height-top">Top</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="middle" id="height-middle" />
              <Label htmlFor="height-middle">Middle</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bottom" id="height-bottom" />
              <Label htmlFor="height-bottom">Bottom</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-2 block">Side</Label>
          <RadioGroup
            value={selectedSide}
            onValueChange={(value) => handleSideChange(value as "left" | "right")}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="left" id="side-left" />
              <Label htmlFor="side-left">Left</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="right" id="side-right" />
              <Label htmlFor="side-right">Right</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Card className="mt-4">
        <CardContent className="pt-4">
          <div className="text-sm font-medium">Selected Storage Location:</div>
          <div className="mt-1 text-lg">
            Position {selectedPosition}, {selectedHeight} {selectedSide}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
