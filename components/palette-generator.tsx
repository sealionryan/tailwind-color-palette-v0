"use client"

import { useState } from "react"
import { ColorPalette } from "@/components/color-palette"
import { ColorInput } from "@/components/color-input"
import { Plus } from "lucide-react"
import { generateColorPalette, findBaseShade } from "@/lib/color-utils"
import { TAILWIND_COLORS } from "@/lib/tailwind-colors"

export type Palette = {
  id: string
  name: string
  baseColor: string
  baseShade: number
  colors: { shade: number; hex: string }[]
}

export function PaletteGenerator() {
  const [palettes, setPalettes] = useState<Palette[]>([])

  const addPalette = (color: string, name?: string) => {
    if (palettes.length >= 5) return

    const baseShade = findBaseShade(color)
    const colors = generateColorPalette(color, baseShade)

    const newPalette: Palette = {
      id: Date.now().toString(),
      name: name || "Custom",
      baseColor: color,
      baseShade,
      colors,
    }

    setPalettes((prev) => [...prev, newPalette])
  }

  const removePalette = (id: string) => {
    setPalettes((prev) => prev.filter((palette) => palette.id !== id))
  }

  const handleTailwindColorSelect = (colorName: string, colorValue: string) => {
    addPalette(colorValue, colorName)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {palettes.length === 0 && (
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center max-w-md mx-auto">
          <h2 className="text-lg font-medium mb-2">Create your first color palette</h2>
          <p className="text-gray-500 mb-4">Enter a HEX color or select a Tailwind color to get started</p>
          <ColorInput
            onColorSubmit={addPalette}
            onTailwindColorSelect={handleTailwindColorSelect}
            tailwindColors={TAILWIND_COLORS}
          />
        </div>
      )}

      {palettes.length > 0 && (
        <>
          <div className="mb-6 max-w-md mx-auto">
            <ColorInput
              onColorSubmit={addPalette}
              onTailwindColorSelect={handleTailwindColorSelect}
              tailwindColors={TAILWIND_COLORS}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {palettes.map((palette) => (
              <ColorPalette key={palette.id} palette={palette} onRemove={() => removePalette(palette.id)} />
            ))}
            {palettes.length < 5 && (
              <div
                className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                style={{ height: "calc(100% - 8px)", margin: "4px 0" }}
                onClick={() => document.getElementById("hex-input")?.focus()}
              >
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
