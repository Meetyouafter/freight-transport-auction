import { describe, expect, it } from 'vitest'
import { bidFormSchema, createBidFormSchema } from './schema'

describe('bidFormSchema', () => {
  it('accepts a positive price', () => {
    expect(bidFormSchema.parse({ price: 100 })).toEqual({ price: 100 })
  })

  it('rejects zero and negative prices', () => {
    expect(bidFormSchema.safeParse({ price: 0 }).success).toBe(false)
    expect(bidFormSchema.safeParse({ price: -10 }).success).toBe(false)
  })
})

describe('createBidFormSchema', () => {
  it('has no bounds to enforce when everything is null', () => {
    const schema = createBidFormSchema({ min: null, max: null, step: null })

    expect(schema.safeParse({ price: 1 }).success).toBe(true)
    expect(schema.safeParse({ price: 1_000_000 }).success).toBe(true)
  })

  it('rejects a price below min', () => {
    const schema = createBidFormSchema({ min: 20000, max: null, step: null })

    const result = schema.safeParse({ price: 19999 })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Ставка не может быть меньше 20000 ₽')
  })

  it('accepts a price at exactly min', () => {
    const schema = createBidFormSchema({ min: 20000, max: null, step: null })

    expect(schema.safeParse({ price: 20000 }).success).toBe(true)
  })

  it('rejects a price above max', () => {
    const schema = createBidFormSchema({ min: null, max: 30000, step: null })

    const result = schema.safeParse({ price: 30001 })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Ставка не может быть больше 30000 ₽')
  })

  it('accepts a price at exactly max', () => {
    const schema = createBidFormSchema({ min: null, max: 30000, step: null })

    expect(schema.safeParse({ price: 30000 }).success).toBe(true)
  })

  it('accepts a price that lands exactly on a step from min', () => {
    const schema = createBidFormSchema({ min: 20000, max: null, step: 500 })

    expect(schema.safeParse({ price: 20500 }).success).toBe(true)
    expect(schema.safeParse({ price: 21500 }).success).toBe(true)
  })

  it('rejects a price that does not land on a step from min', () => {
    const schema = createBidFormSchema({ min: 20000, max: null, step: 500 })

    const result = schema.safeParse({ price: 20300 })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Ставка должна быть кратна шагу 500 ₽')
  })

  it('measures the step from zero when min is not set', () => {
    const schema = createBidFormSchema({ min: null, max: null, step: 500 })

    expect(schema.safeParse({ price: 1000 }).success).toBe(true)
    expect(schema.safeParse({ price: 1200 }).success).toBe(false)
  })

  it('requires a higher price than current for an "Up" auction', () => {
    const schema = createBidFormSchema({
      min: null,
      max: null,
      step: null,
      current: 30000,
      aucType: 'Up',
    })

    expect(schema.safeParse({ price: 30001 }).success).toBe(true)
    const result = schema.safeParse({ price: 30000 })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Ставка должна быть выше текущей цены 30000 ₽')
  })

  it('requires a lower price than current for a "Down" auction', () => {
    const schema = createBidFormSchema({
      min: null,
      max: null,
      step: null,
      current: 30000,
      aucType: 'Down',
    })

    expect(schema.safeParse({ price: 29999 }).success).toBe(true)
    const result = schema.safeParse({ price: 30000 })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Ставка должна быть ниже текущей цены 30000 ₽')
  })

  it('does not enforce a direction relative to current for other auction types', () => {
    const schema = createBidFormSchema({
      min: null,
      max: null,
      step: null,
      current: 30000,
      aucType: 'FixPrice',
    })

    expect(schema.safeParse({ price: 30000 }).success).toBe(true)
  })

  it('applies min, step and direction together', () => {
    const schema = createBidFormSchema({
      min: 20000,
      max: 65000,
      step: 1000,
      current: 58000,
      aucType: 'Up',
    })

    expect(schema.safeParse({ price: 59000 }).success).toBe(true)
    expect(schema.safeParse({ price: 58000 }).success).toBe(false)
    expect(schema.safeParse({ price: 58500 }).success).toBe(false)
    expect(schema.safeParse({ price: 19000 }).success).toBe(false)
    expect(schema.safeParse({ price: 66000 }).success).toBe(false)
  })
})
