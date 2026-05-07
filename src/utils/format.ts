export function formatDisplayDate(value: string | Date = new Date()): string {
  const date = value instanceof Date ? value : new Date(`${value}T12:00:00`)

  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function shortDate(value: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T12:00:00`))
}
