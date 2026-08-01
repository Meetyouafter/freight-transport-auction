import { describe, expect, it } from 'vitest'
import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  it('appends the ruble sign to a number', () => {
    expect(formatPrice(30000)).toBe('30000 ₽')
  })

  it('formats zero as a price, not a missing value', () => {
    expect(formatPrice(0)).toBe('0 ₽')
  })

  it('renders a dash for null', () => {
    expect(formatPrice(null)).toBe('—')
  })

  it('renders a dash for undefined', () => {
    expect(formatPrice(undefined)).toBe('—')
  })
})
