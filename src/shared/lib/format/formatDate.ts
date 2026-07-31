import dayjs from 'dayjs'

export function formatDate(date: string): string {
  return dayjs(date).format('DD.MM.YYYY')
}

export function formatDateTime(date: string): string {
  return dayjs(date).format('DD.MM.YYYY HH:mm')
}

/** Formats a start–end window, collapsing the date when both ends fall on the same day. */
export function formatDateWindow(start: string, end: string): string {
  const from = dayjs(start)
  const to = dayjs(end)

  if (from.isSame(to, 'day')) {
    return `${from.format('DD.MM.YYYY')}, ${from.format('HH:mm')}–${to.format('HH:mm')}`
  }

  return `${from.format('DD.MM.YYYY HH:mm')} – ${to.format('DD.MM.YYYY HH:mm')}`
}
