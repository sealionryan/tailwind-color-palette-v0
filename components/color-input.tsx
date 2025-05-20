"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isValidHex } from "@/lib/color-utils"

interface ColorInputProps {
  onColorSubmit: (color: string) => void
  onTailwindColorSelect: (colorName: string, colorValue: string) => void
  tailwindColors: Record<string, Record<string, string>>
}

export function ColorInput({ onColorSubmit, onTailwindColorSelect, tailwindColors }: ColorInputProps) {
  const [hexValue, setHexValue] = useState("")
  const [hexError, setHexError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleHexSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!hexValue) return

    const formattedHex = hexValue.startsWith("#") ? hexValue : `#${hexValue}`

    if (isValidHex(formattedHex)) {
      onColorSubmit(formattedHex)
      setHexValue("")
      setHexError(false)
    } else {
      setHexError(true)
    }
  }

  const handleTailwindSelect = (value: string) => {
    const colorName = value
    // Use the 500 shade as the representative color for each category
    if (colorName && tailwindColors[colorName] && tailwindColors[colorName]["500"]) {
      onTailwindColorSelect(colorName.charAt(0).toUpperCase() + colorName.slice(1), tailwindColors[colorName]["500"])
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="hex-input" className="block text-sm font-medium mb-1">
          Enter HEX Color
        </label>
        <form onSubmit={handleHexSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-sm border border-gray-300"
              style={{ backgroundColor: isValidHex(hexValue) ? hexValue : "#ffffff" }}
            />
            <Input
              id="hex-input"
              ref={inputRef}
              value={hexValue}
              onChange={(e) => {
                setHexValue(e.target.value)
                if (hexError) setHexError(false)
              }}
              placeholder="#FF6B6B"
              className={`pl-10 ${hexError ? "border-red-500" : ""}`}
              maxLength={7}
            />
            {hexError && <p className="text-red-500 text-xs mt-1">Please enter a valid HEX color</p>}
          </div>
          <Button type="submit">Generate</Button>
        </form>
      </div>

      <div>
        <label htmlFor="tailwind-select" className="block text-sm font-medium mb-1">
          Tailwind Colors
        </label>
        <Select onValueChange={handleTailwindSelect}>
          <SelectTrigger id="tailwind-select" className="w-full">
            <SelectValue placeholder="Select Tailwind Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(tailwindColors).map(([colorName, shades]) => (
                <SelectItem key={colorName} value={colorName}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: shades["500"] }} />
                    <span>{colorName.charAt(0).toUpperCase() + colorName.slice(1)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
