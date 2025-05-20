"use client"

import { useState } from "react"
import { Copy, Trash2, ClipboardCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import type { Palette } from "@/components/palette-generator"

const getContrastTextColor = (hexColor: string): string => {
  // Convert hex to RGB
  const r = Number.parseInt(hexColor.slice(1, 3), 16)
  const g = Number.parseInt(hexColor.slice(3, 5), 16)
  const b = Number.parseInt(hexColor.slice(5, 7), 16)

  // Calculate luminance - human perception of brightness
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? "text-gray-900" : "text-white"
}

interface ColorPaletteProps {
  palette: Palette
  onRemove: () => void
}

export function ColorPalette({ palette, onRemove }: ColorPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text).then(() => {
      if (index !== undefined) {
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 1500)
      } else {
        toast({
          title: "Copied to clipboard",
          description: "All colors have been copied to your clipboard",
        })
      }
    })
  }

  const copyAllColors = () => {
    const allColors = palette.colors.map((color) => `${color.hex}`).join("\n")
    copyToClipboard(allColors)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-3 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="font-medium text-sm">
            {palette.name} <span className="text-gray-500 text-xs">(Base: {palette.baseShade})</span>
          </h3>
        </div>
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAllColors}>
                  <Copy className="h-3 w-3 text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy all colors</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
                  <Trash2 className="h-3 w-3 text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove palette</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div>
        {palette.colors.map((color, index) => {
          const textColorClass = getContrastTextColor(color.hex)
          return (
            <TooltipProvider key={color.shade}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="w-full h-12 flex items-center justify-center transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyToClipboard(color.hex, index)}
                  >
                    <span
                      className={`font-mono text-xs ${textColorClass} ${
                        color.shade === palette.baseShade ? "font-bold" : ""
                      }`}
                    >
                      {color.shade === palette.baseShade ? `*${color.shade}*` : color.shade}
                    </span>
                    {copiedIndex === index && (
                      <span
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 ${textColorClass} bg-opacity-70 px-2 py-1 rounded text-xs`}
                      >
                        <ClipboardCheck className="h-3 w-3" />
                        Copied!
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{color.hex}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}
