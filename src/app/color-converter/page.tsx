'use client'
import { useState } from 'react'
import { hexToRgb, rgbToHex, rgbToHsl } from '@/lib/color'
import { AdBanner } from '@/components/AdBanner'

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#3b82f6')
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })

  const handleHexChange = (value: string) => {
    setHex(value)
    const result = hexToRgb(value)
    if (result) {
      setRgb(result)
      setHsl(rgbToHsl(result.r, result.g, result.b))
    }
  }

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [channel]: Math.max(0, Math.min(255, value)) }
    setRgb(newRgb)
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">色码在线转换</h1>
      <p className="text-gray-600 mb-6">HEX ↔ RGB ↔ HSL 互转，实时颜色预览。</p>
      <AdBanner />
      <div className="mt-6 flex gap-6 items-start flex-wrap">
        <div className="w-32 h-32 rounded-lg border border-gray-300 shadow" style={{ backgroundColor: hex }} />
        <div className="space-y-4 flex-1 min-w-[300px]">
          <div>
            <label className="block text-sm font-medium mb-1">HEX</label>
            <div className="flex gap-2">
              <input className="flex-1 p-2 border border-gray-300 rounded-lg font-mono text-sm" value={hex} onChange={(e) => handleHexChange(e.target.value)} />
              <input type="color" value={hex} onChange={(e) => handleHexChange(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">RGB</label>
            <div className="flex gap-2">
              {(['r', 'g', 'b'] as const).map((ch) => (
                <div key={ch} className="flex-1">
                  <span className="text-xs text-gray-500 uppercase">{ch}</span>
                  <input type="number" min={0} max={255} className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm" value={rgb[ch]} onChange={(e) => handleRgbChange(ch, +e.target.value || 0)} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">HSL</label>
            <div className="flex gap-2">
              {(['h', 's', 'l'] as const).map((ch) => (
                <div key={ch} className="flex-1">
                  <span className="text-xs text-gray-500">{ch === 'h' ? 'H' : ch === 's' ? 'S%' : 'L%'}</span>
                  <input className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50" value={hsl[ch]} readOnly />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
