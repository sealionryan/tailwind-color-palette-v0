import { PaletteGenerator } from "@/components/palette-generator"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Tailwind Color Palette Generator</h1>
      <PaletteGenerator />
    </main>
  )
}
