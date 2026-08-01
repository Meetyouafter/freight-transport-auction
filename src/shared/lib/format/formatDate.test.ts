import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime, formatDateWindow } from './formatDate'

describe('formatDate', () => {
  it('formats an ISO date as DD.MM.YYYY', () => {
    expect(formatDate('2026-05-04T14:49:09')).toBe('04.05.2026')
  })
})

describe('formatDateTime', () => {
  it('formats an ISO date as DD.MM.YYYY HH:mm', () => {
    expect(formatDateTime('2026-05-04T14:49:09')).toBe('04.05.2026 14:49')
  })
})

describe('formatDateWindow', () => {
  it('collapses to a single date when start and end fall on the same day', () => {
    expect(formatDateWindow('2026-05-26T09:00:00', '2026-05-26T09:20:00')).toBe(
      '26.05.2026, 09:00–09:20',
    )
  })

  it('shows both full dates when start and end fall on different days', () => {
    expect(formatDateWindow('2026-05-26T09:00:00', '2026-05-27T18:00:00')).toBe(
      '26.05.2026 09:00 – 27.05.2026 18:00',
    )
  })
})
