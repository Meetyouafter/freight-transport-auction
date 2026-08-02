import { describe, expect, it } from 'vitest'
import {
  auctionListItemSchema,
  auctionShowResponseSchema,
  auctionStatusSchema,
  auctionTypeSchema,
  listItemTradingStatusMobileSchema,
} from '@entities/auction'
import { BODY_TYPE_OPTIONS } from '@features/auction-filters'
import { auctionFixtures, findAuctionFixture } from './auctions'

const listItems = auctionFixtures.map((fixture) => fixture.listItem)

/** Smallest option of `PER_PAGE_OPTIONS`, i.e. the page size both list screens start with. */
const DEFAULT_PAGE_SIZE = 10

describe('auction fixtures: shape', () => {
  it('matches the list and show DTO schemas', () => {
    for (const fixture of auctionFixtures) {
      expect(auctionListItemSchema.safeParse(fixture.listItem).success).toBe(true)
      expect(auctionShowResponseSchema.safeParse(fixture.show).success).toBe(true)
    }
  })

  it('keeps list and show in sync and every uuid unique', () => {
    const uuids = auctionFixtures.map((fixture) => fixture.show.main.order_uid)

    for (const fixture of auctionFixtures) {
      expect(fixture.listItem.main.order_uid).toBe(fixture.show.main.order_uid)
      expect(fixture.listItem.main.auc_type).toBe(fixture.show.main.auc_type)
      expect(fixture.listItem.trading.status).toBe(fixture.show.trading.status)
    }

    expect(new Set(uuids).size).toBe(uuids.length)
    expect(findAuctionFixture(uuids[0])?.show.main.order_uid).toBe(uuids[0])
  })

  it('keeps bid bounds on the side the auction direction allows', () => {
    for (const { show } of auctionFixtures) {
      const { current, min, max } = show.trading.price

      if (current == null) continue
      if (show.main.auc_type === 'Up' && min != null) expect(min).toBeGreaterThan(current)
      if (show.main.auc_type === 'Down' && max != null) expect(max).toBeLessThan(current)
    }
  })
})

describe('auction fixtures: state coverage', () => {
  it('covers every auction status', () => {
    const statuses = new Set(listItems.map((item) => item.trading.status))

    for (const status of auctionStatusSchema.options) {
      expect(statuses).toContain(status)
    }
  })

  it('covers every trading status of the current user', () => {
    const statuses = new Set(listItems.map((item) => item.trading.status_mobile))

    for (const status of listItemTradingStatusMobileSchema.options) {
      expect(statuses).toContain(status)
    }
  })

  it('covers every auction type', () => {
    const types = new Set(listItems.map((item) => item.main.auc_type))

    for (const type of auctionTypeSchema.options) {
      expect(types).toContain(type)
    }
  })

  it('covers both bid-allowed and bid-closed auctions', () => {
    expect(listItems.some((item) => item.trading.can_set_bet)).toBe(true)
    expect(listItems.some((item) => !item.trading.can_set_bet)).toBe(true)
  })

  it('gives every open auction an available price inside its own bid range', () => {
    const open = auctionFixtures.filter((fixture) => fixture.show.trading.can_set_bet)

    expect(open.length).toBeGreaterThan(0)

    for (const { show } of open) {
      const { available, min, max, step } = show.trading.price

      if (step == null) continue

      expect(available).not.toBeNull()
      if (min != null) expect(available).toBeGreaterThanOrEqual(min)
      if (max != null) expect(available).toBeLessThanOrEqual(max)
    }
  })

  it('covers both sides of the counter-bids setting', () => {
    const shows = auctionFixtures.map((fixture) => fixture.show)

    expect(shows.some((show) => show.trading.allow_counter_bets)).toBe(true)
    expect(shows.some((show) => !show.trading.allow_counter_bets)).toBe(true)
  })

  it('covers every organiser restriction flag', () => {
    const shows = auctionFixtures.map((fixture) => fixture.show)

    expect(shows.some((show) => show.trading.hide_bets_history)).toBe(true)
    expect(shows.some((show) => show.trading.hide_points_address_and_contacts)).toBe(true)
    expect(shows.some((show) => show.trading.no_view_cargo_price)).toBe(true)
  })
})

describe('auction fixtures: filters and pagination', () => {
  it('fills more than one page of the list', () => {
    expect(listItems.length).toBeGreaterThan(DEFAULT_PAGE_SIZE * 2)
  })

  it('fills more than one page of "my bets"', () => {
    const mine = listItems.filter((item) => item.trading.is_bidder)

    expect(mine.length).toBeGreaterThan(DEFAULT_PAGE_SIZE)
  })

  it('has records on both sides of every boolean filter', () => {
    for (const flag of ['is_favorite', 'is_bidder', 'is_available'] as const) {
      expect(listItems.some((item) => item.trading[flag])).toBe(true)
      expect(listItems.some((item) => !item.trading[flag])).toBe(true)
    }
  })

  it('covers every body type offered by the filter', () => {
    const bodyTypes = new Set(listItems.map((item) => item.cargo.body_type))

    for (const option of BODY_TYPE_OPTIONS) {
      expect(bodyTypes).toContain(option.value)
    }
  })

  it('spreads customers, cities, dates and prices so each filter cuts a subset', () => {
    const customers = new Set(listItems.map((item) => item.organizer.organization_name))
    const loadCities = new Set(listItems.map((item) => item.route.load.city_gc_id))
    const loadDates = listItems.map((item) => item.route.load.date).sort()
    const prices = listItems.map((item) => item.trading.price?.current ?? 0)

    expect(customers.size).toBeGreaterThanOrEqual(3)
    expect(loadCities.size).toBeGreaterThanOrEqual(5)
    expect(loadDates.at(-1)).not.toBe(loadDates[0])
    expect(Math.max(...prices) - Math.min(...prices)).toBeGreaterThan(100_000)
  })

  it('gives the cargo-number filter a unique match per auction', () => {
    const numbers = listItems.map((item) => item.main.cargo_num)

    expect(new Set(numbers).size).toBe(numbers.length)
  })
})
