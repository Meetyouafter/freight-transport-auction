import { describe, expect, it } from 'vitest'
import { makeAuctionShowTrading } from './auctionShowTrading.fixture'
import {
  auctionDirectionBadge,
  dealStatusBadge,
  myBetStatus,
  participationBadge,
} from './statusMaps'

describe('dealStatusBadge', () => {
  it('maps a deal status to its label and variant', () => {
    expect(dealStatusBadge('Auction')).toEqual({ variant: 'rising', label: 'Торги идут' })
    expect(dealStatusBadge('Canceled')).toEqual({ variant: 'rejected', label: 'Отменён' })
  })
})

describe('participationBadge', () => {
  it('maps a known trading status to a badge', () => {
    expect(participationBadge('Leading')).toEqual({ variant: 'rising', label: 'Лидирую' })
  })

  it('returns null for a status with no participation badge', () => {
    expect(participationBadge('NotParticipating')).toBeNull()
  })
})

describe('auctionDirectionBadge', () => {
  it('shows an "up" indicator for an Up auction while trading is live', () => {
    const badge = auctionDirectionBadge('Up', 'Auction')

    expect(badge).toMatchObject({ variant: 'rising', label: 'На повышение' })
  })

  it('shows a "down" indicator for a Down auction while trading is live', () => {
    const badge = auctionDirectionBadge('Down', 'Auction')

    expect(badge).toMatchObject({ variant: 'neutral', label: 'На понижение' })
  })

  it('returns null once trading is no longer in the Auction phase', () => {
    expect(auctionDirectionBadge('Up', 'Finished')).toBeNull()
  })

  it('returns null for auction types with no direction (FixPrice, Request)', () => {
    expect(auctionDirectionBadge('FixPrice', 'Auction')).toBeNull()
    expect(auctionDirectionBadge('Request', 'Auction')).toBeNull()
  })
})

describe('myBetStatus', () => {
  it('reports non-participation when the user never bid', () => {
    const trading = makeAuctionShowTrading({
      your: { bet: false, last_bet: null, last_bet_with_vat: null, win: false },
    })

    expect(myBetStatus(trading)).toEqual({ variant: 'neutral', label: 'Вы не участвуете' })
  })

  it('reports a win regardless of status_mobile', () => {
    const trading = makeAuctionShowTrading({
      your: { bet: true, last_bet: 1000, last_bet_with_vat: 1000, win: true },
      status_mobile: 'Losing',
    })

    expect(myBetStatus(trading)).toEqual({ variant: 'confirmed', label: 'Вы выиграли' })
  })

  it('reports being outbid, preferring the VAT-inclusive amount', () => {
    const trading = makeAuctionShowTrading({
      your: { bet: true, last_bet: 1000, last_bet_with_vat: 1200, win: false },
      status_mobile: 'Losing',
    })

    expect(myBetStatus(trading)).toEqual({
      variant: 'waiting',
      label: 'Ваша ставка: 1200 ₽ — перебита',
      hint: 'Текущая цена ниже вашей — обновите ставку',
    })
  })

  it('falls back to the no-VAT amount when last_bet_with_vat is null', () => {
    const trading = makeAuctionShowTrading({
      your: { bet: true, last_bet: 1000, last_bet_with_vat: null, win: false },
      status_mobile: 'Leading',
    })

    expect(myBetStatus(trading).label).toBe('Ваша ставка: 1000 ₽ — лидирует')
  })

  it('reports leading', () => {
    const trading = makeAuctionShowTrading({
      your: { bet: true, last_bet: 1000, last_bet_with_vat: 1000, win: false },
      status_mobile: 'Leading',
    })

    expect(myBetStatus(trading)).toEqual({
      variant: 'rising',
      label: 'Ваша ставка: 1000 ₽ — лидирует',
    })
  })

  it('reports a loss once the auction is Finished with no other status match', () => {
    const trading = makeAuctionShowTrading({
      your: { bet: true, last_bet: 1000, last_bet_with_vat: 1000, win: false },
      status_mobile: 'NotParticipating',
      status: 'Finished',
    })

    expect(myBetStatus(trading)).toEqual({ variant: 'rejected', label: 'Вы проиграли' })
  })

  it('reports a neutral placed-bid status otherwise', () => {
    const trading = makeAuctionShowTrading({
      your: { bet: true, last_bet: 1000, last_bet_with_vat: 1000, win: false },
      status_mobile: 'OnPending',
      status: 'DeterminateWinner',
    })

    expect(myBetStatus(trading)).toEqual({ variant: 'neutral', label: 'Ваша ставка: 1000 ₽' })
  })
})
