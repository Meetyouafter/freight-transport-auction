import { describe, expect, it } from 'vitest'
import { betListResponseSchema } from '@entities/bet'
import { auctionFixtures } from './auctions'
import { betsByAuction, getBets } from './bets'

describe('bet fixtures', () => {
  it('matches the bets DTO schema', () => {
    for (const [, bets] of betsByAuction) {
      expect(betListResponseSchema.safeParse({ bets }).success).toBe(true)
    }
  })

  it('gives every auction we bid on a history', () => {
    const mine = auctionFixtures.filter((fixture) => fixture.listItem.trading.is_bidder)

    for (const fixture of mine) {
      expect(getBets(fixture.show.main.order_uid, false).length).toBeGreaterThan(0)
    }
  })

  it('includes rival bids and cancelled ones', () => {
    const all = [...betsByAuction.values()].flat()

    expect(all.some((bet) => bet.subscriber_id !== 13)).toBe(true)
    expect(all.some((bet) => bet.is_rejected)).toBe(true)
    expect(all.some((bet) => bet.is_win)).toBe(true)
  })

  it('includes counter bids only where the organiser allows them', () => {
    const counterAuctions = [...betsByAuction.entries()].filter(([, bets]) =>
      bets.some((bet) => bet.is_counter),
    )

    expect(counterAuctions.length).toBeGreaterThan(0)

    for (const [uuid] of counterAuctions) {
      const fixture = auctionFixtures.find((item) => item.show.main.order_uid === uuid)

      expect(fixture?.show.trading.allow_counter_bets).toBe(true)
    }
  })

  it('hides cancelled bids unless all=true is requested', () => {
    const [uuid] = [...betsByAuction.entries()].find(([, bets]) =>
      bets.some((bet) => bet.is_rejected),
    )!

    expect(getBets(uuid, false).length).toBeLessThan(getBets(uuid, true).length)
  })

  it('numbers every bet uniquely', () => {
    const ids = [...betsByAuction.values()].flat().map((bet) => bet.id)

    expect(new Set(ids).size).toBe(ids.length)
  })
})
