import { describe, expect, it } from 'vitest'
import { defaultBidPrice } from './defaultBidPrice'

describe('defaultBidPrice', () => {
  it('suggests one step above the current price on an Up auction', () => {
    expect(
      defaultBidPrice({ aucType: 'Up', current: 58000, min: 59000, max: 65000, step: 1000 }),
    ).toBe(59000)
  })

  it('suggests one step below the current price on a Down auction', () => {
    expect(
      defaultBidPrice({ aucType: 'Down', current: 30000, min: 20000, max: 29500, step: 500 }),
    ).toBe(29500)
  })

  it('keeps the current price when the auction has no direction or no step', () => {
    expect(defaultBidPrice({ aucType: 'FixPrice', current: 45000, step: null })).toBe(45000)
    expect(defaultBidPrice({ aucType: 'Request', current: 45000, step: 1000 })).toBe(45000)
  })

  it('clamps the suggestion into the allowed range', () => {
    expect(
      defaultBidPrice({ aucType: 'Up', current: 64500, min: null, max: 65000, step: 1000 }),
    ).toBe(65000)
    expect(
      defaultBidPrice({ aucType: 'Down', current: 20200, min: 20000, max: null, step: 500 }),
    ).toBe(20000)
  })

  it('falls back to 0 when there is no current price', () => {
    expect(defaultBidPrice({ aucType: 'Up', current: null, step: 1000 })).toBe(0)
  })
})
