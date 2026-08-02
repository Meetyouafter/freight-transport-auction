import { describe, expect, it } from 'vitest'
import { makeAuctionListItem } from './auctionListItem.fixture'
import { getPrimaryBadge, getSecondaryBadges } from './badges'
import { MAX_SECONDARY_BADGES } from './constants'

describe('getPrimaryBadge', () => {
  it('shows the auction status while trading is running', () => {
    const auction = makeAuctionListItem({ trading: { status: 'Auction' } })

    expect(getPrimaryBadge(auction)).toEqual({ variant: 'rising', label: 'Торги идут' })
  })

  it('shows a cancelled auction as cancelled regardless of the user status', () => {
    const auction = makeAuctionListItem({
      trading: { status_mobile: 'Confirmed', status: 'Canceled' },
    })

    expect(getPrimaryBadge(auction)).toEqual({ variant: 'rejected', label: 'Отменён' })
  })

  it('shows a stopped auction as stopped', () => {
    const auction = makeAuctionListItem({
      trading: { status_mobile: 'NotParticipating', status: 'Stopped' },
    })

    expect(getPrimaryBadge(auction)).toEqual({ variant: 'rejected', label: 'Остановлен' })
  })
})

describe('getSecondaryBadges', () => {
  it('always leads with the auction-type badge', () => {
    const auction = makeAuctionListItem({ main: { auc_type: 'Down' } })

    const badges = getSecondaryBadges(auction, false)

    expect(badges[0]).toEqual({ variant: 'waiting', label: 'На понижение' })
  })

  it('shows the auction type, the trading status and the bid flag at the same time', () => {
    const auction = makeAuctionListItem({
      main: { auc_type: 'Up' },
      trading: { status: 'Auction', status_mobile: 'Leading' },
    })

    const labels = getSecondaryBadges(auction, true).map((badge) => badge.label)

    expect(labels).toEqual(['На повышение', 'Лидирую', 'Ставка сделана'])
  })

  it('marks that no bid was placed otherwise', () => {
    const auction = makeAuctionListItem()

    const badges = getSecondaryBadges(auction, false)

    expect(badges.some((badge) => badge.label === 'Моей ставки нет')).toBe(true)
  })

  it('gives the winning status a trophy icon', () => {
    const auction = makeAuctionListItem({ trading: { status_mobile: 'Winner' } })

    const badge = getSecondaryBadges(auction, true).find((item) => item.label === 'Победитель')

    expect(badge?.variant).toBe('confirmed')
    expect(badge?.icon).toBeDefined()
  })

  it('never returns more than MAX_SECONDARY_BADGES badges', () => {
    const auction = makeAuctionListItem({ trading: { status: 'WaitDeal' } })

    const badges = getSecondaryBadges(auction, true)

    expect(badges.length).toBeLessThanOrEqual(MAX_SECONDARY_BADGES)
  })
})
