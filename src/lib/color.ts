export interface RGB { r: number; g: number; b: number }
export interface HSL { h: number; s: number; l: number }

export function hexToRgb(hex: string): RGB | null {
  const match = hex.toLowerCase().match(/^#?([a-f0-9]{3}|[a-f0-9]{6})$/)
  if (!match) return null
  let h = match[1]
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('')
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rd = r / 255, gd = g / 255, bd = b / 255
  const max = Math.max(rd, gd, bd), min = Math.min(rd, gd, bd)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rd: h = ((gd - bd) / d + (gd < bd ? 6 : 0)) / 6; break
      case gd: h = ((bd - rd) / d + 2) / 6; break
      case bd: h = ((rd - gd) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const hd = h / 360, sd = s / 100, ld = l / 100
  let r = 0, g = 0, b = 0
  if (sd === 0) {
    r = g = b = ld
  } else {
    const q = ld < 0.5 ? ld * (1 + sd) : ld + sd - ld * sd
    const p = 2 * ld - q
    const hueToRgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1; if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    r = hueToRgb(p, q, hd + 1 / 3)
    g = hueToRgb(p, q, hd)
    b = hueToRgb(p, q, hd - 1 / 3)
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}
