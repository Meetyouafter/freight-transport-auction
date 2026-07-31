export function formatPrice(value: number | null | undefined): string {
  return value != null ? `${value} ₽` : '—'
}
