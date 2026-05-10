export function encodeBase64(text: string): string {
  return btoa(unescape(encodeURIComponent(text)))
}

export function decodeBase64(encoded: string): string | null {
  try {
    return decodeURIComponent(escape(atob(encoded)))
  } catch {
    return null
  }
}

export function isBase64(str: string): boolean {
  return /^[A-Za-z0-9+/]*={0,2}$/.test(str)
}

export function encodeURL(url: string): string {
  return encodeURIComponent(url)
}

export function decodeURL(encoded: string): string {
  return decodeURIComponent(encoded)
}
