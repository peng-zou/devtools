export function timestampToDate(ts: number): string {
  const isMilliseconds = ts > 1000000000000
  const ms = isMilliseconds ? ts : ts * 1000
  return new Date(ms).toISOString()
}

export function dateToTimestamp(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000)
}

export function nowTimestamp(): number {
  return Math.floor(Date.now() / 1000)
}
