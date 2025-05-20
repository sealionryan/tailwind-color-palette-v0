import chroma from "chroma-js"

// Tailwind shade levels
const SHADE_LEVELS = [50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 925, 950]

// Check if a string is a valid hex color
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)
}

// Find the base shade for a given color
export function findBaseShade(hex: string): number {
  const color = chroma(hex)
  const luminance = color.luminance()

  // Map luminance to Tailwind shade
  if (luminance > 0.8) return 100
  if (luminance > 0.6) return 200
  if (luminance > 0.45) return 300
  if (luminance > 0.3) return 400
  if (luminance > 0.2) return 500
  if (luminance > 0.1) return 600
  if (luminance > 0.05) return 700
  if (luminance > 0.025) return 800
  if (luminance > 0.01) return 900
  return 950
}

// Generate a complete color palette based on a base color and its shade
export function generateColorPalette(baseHex: string, baseShade: number) {
  const baseColor = chroma(baseHex)
  const baseHsl = baseColor.hsl()
  const [baseHue, baseSaturation, baseLightness] = baseHsl

  // Create a palette with all shade levels
  return SHADE_LEVELS.map((shade) => {
    let h = baseHue
    let s = baseSaturation
    let l = baseLightness

    // Adjust lightness based on shade difference from base
    if (shade < baseShade) {
      // Lighter colors: increase lightness, decrease saturation
      const factor = 1 - shade / baseShade
      l = Math.min(0.97, l + (0.9 - l) * factor)
      s = Math.max(0.03, s - s * 0.3 * factor)

      // Slight hue shift for very light colors
      if (shade <= 100) {
        h = (h + 5) % 360 // Slight hue shift for very light colors
      }
    } else if (shade > baseShade) {
      // Darker colors: decrease lightness, adjust saturation
      const factor = (shade - baseShade) / (950 - baseShade)
      l = Math.max(0.03, l - l * 0.85 * factor)

      // Increase saturation for mid-dark colors, then decrease for very dark
      if (shade < 700) {
        s = Math.min(1, s + 0.15 * factor)
      } else {
        s = Math.max(0.05, s - s * 0.3 * factor)
      }

      // Hue shift for very dark colors
      if (shade >= 900) {
        h = (h - 5 + 360) % 360 // Slight hue shift for very dark colors
      }
    }

    // Create color from adjusted HSL values
    const color = chroma.hsl(h, s, l)

    return {
      shade,
      hex: color.hex(),
    }
  })
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [h * 360, s, l]
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number) {
  h /= 360
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

// Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// Convert HEX to RGB
export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
    : null
}

// Determine if text should be light or dark based on background color
export function getTextColor(bgColor: string): string {
  const color = chroma(bgColor)
  // Using luminance for better perceptual contrast
  return color.luminance() > 0.5 ? "#000000" : "#ffffff"
}
