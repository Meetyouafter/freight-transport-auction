import { describe, expect, it } from 'vitest'
import { statusTokens, surfaceTokens } from '@shared/theme/tokens'
import { getCardSurface } from './cardSurface'

describe('getCardSurface', () => {
  it('paints the card green while I am ahead in live trading', () => {
    expect(getCardSurface('Leading')).toEqual({
      bg: statusTokens.rising.tint,
      border: statusTokens.rising.bg,
      borderHover: statusTokens.rising.text,
    })
  })

  it('paints the card blue once the order is closed in my favour', () => {
    expect(getCardSurface('Winner').bg).toBe(statusTokens.confirmed.tint)
    expect(getCardSurface('Confirmed').bg).toBe(statusTokens.confirmed.tint)
  })

  it('paints the card red once my bid is being outbid', () => {
    expect(getCardSurface('Losing').bg).toBe(statusTokens.rejected.tint)
  })

  it('leaves auctions I am not in on plain paper', () => {
    expect(getCardSurface('NotParticipating')).toEqual({
      bg: 'background.paper',
      border: surfaceTokens.cardBorder,
      borderHover: surfaceTokens.cardBorderHover,
    })
    expect(getCardSurface('Unknown').bg).toBe('background.paper')
  })

  it('keeps the fill and the outline on the same status colour', () => {
    const surface = getCardSurface('Losing')

    expect(surface.border).toBe(statusTokens.rejected.bg)
    expect(surface.borderHover).toBe(statusTokens.rejected.text)
  })
})
