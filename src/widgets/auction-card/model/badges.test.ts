import { describe, expect, it } from 'vitest'
import { makeAuctionListItem } from './auctionListItem.fixture'
import { getPrimaryBadge, getSecondaryBadges } from './badges'
import { MAX_SECONDARY_BADGES } from './constants'

describe('getPrimaryBadge', () => {
  it('returns the Confirmed badge when status_mobile is Confirmed', () => {
    const auction = makeAuctionListItem({ trading: { status_mobile: 'Confirmed' } })

    expect(getPrimaryBadge(auction)).toMatchObject({ variant: 'confirmed', label: 'Подтверждено' })
  })

  it('returns a Winner badge with an icon', () => {
    const auction = makeAuctionListItem({ trading: { status_mobile: 'Winner' } })

    const badge = getPrimaryBadge(auction)

    expect(badge).toMatchObject({ variant: 'confirmed', label: 'Победитель' })
    expect(badge?.icon).toBeDefined()
  })

  it('prioritizes status_mobile over a Canceled/Stopped auction status', () => {
    const auction = makeAuctionListItem({
      trading: { status_mobile: 'Confirmed', status: 'Canceled' },
    })

    expect(getPrimaryBadge(auction)?.label).toBe('Подтверждено')
  })

  it('falls back to the auction status when Canceled', () => {
    const auction = makeAuctionListItem({
      trading: { status_mobile: 'NotParticipating', status: 'Canceled' },
    })

    expect(getPrimaryBadge(auction)).toEqual({ variant: 'rejected', label: 'Отменён' })
  })

  it('falls back to the auction status when Stopped', () => {
    const auction = makeAuctionListItem({
      trading: { status_mobile: 'NotParticipating', status: 'Stopped' },
    })

    expect(getPrimaryBadge(auction)).toEqual({ variant: 'rejected', label: 'Остановлен' })
  })

  it('returns a Losing badge when the user is losing', () => {
    const auction = makeAuctionListItem({
      trading: { status_mobile: 'Losing', status: 'Auction' },
    })

    expect(getPrimaryBadge(auction)).toEqual({ variant: 'rejected', label: 'Проигрываю' })
  })

  it('returns null when nothing warrants a primary badge', () => {
    const auction = makeAuctionListItem({
      trading: { status_mobile: 'NotParticipating', status: 'Auction' },
    })

    expect(getPrimaryBadge(auction)).toBeNull()
  })
})

describe('getSecondaryBadges', () => {
  it('always leads with the auction-type badge', () => {
    const auction = makeAuctionListItem({ main: { auc_type: 'Down' } })

    const badges = getSecondaryBadges(auction, false)

    expect(badges[0]).toEqual({ variant: 'waiting', label: 'На понижение' })
  })

  it('marks a bid as placed when the user has bid', () => {
    const auction = makeAuctionListItem()

    const badges = getSecondaryBadges(auction, true)

    expect(badges.some((badge) => badge.label === 'Ставка сделана')).toBe(true)
  })

  it('marks that no bid was placed otherwise', () => {
    const auction = makeAuctionListItem()

    const badges = getSecondaryBadges(auction, false)

    expect(badges.some((badge) => badge.label === 'Моей ставки нет')).toBe(true)
  })

  it('adds a waiting-for-deal badge when status is WaitDeal', () => {
    const auction = makeAuctionListItem({ trading: { status: 'WaitDeal' } })

    const badges = getSecondaryBadges(auction, false)

    expect(badges.some((badge) => badge.label === 'Ожидание сделки')).toBe(true)
  })

  it('never returns more than MAX_SECONDARY_BADGES badges', () => {
    const auction = makeAuctionListItem({ trading: { status: 'WaitDeal' } })

    const badges = getSecondaryBadges(auction, true)

    expect(badges.length).toBeLessThanOrEqual(MAX_SECONDARY_BADGES)
  })
})
