export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function decodeBase64(encoded: string): string | null {
  try {
    const binary = atob(encoded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
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
