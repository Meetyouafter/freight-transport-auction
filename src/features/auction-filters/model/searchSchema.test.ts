import { describe, expect, it } from 'vitest'
import { CITIES } from '@entities/city'
import { defaultAuctionFiltersFormValues, type AuctionFiltersFormValues } from './schema'
import { auctionFiltersSearchSchema, filtersToSearch, searchToFilters } from './searchSchema'

describe('auctionFiltersSearchSchema', () => {
  it('parses a fully populated search string', () => {
    const result = auctionFiltersSearchSchema.parse({
      cargo_num: '001',
      auc_type: ['Up', 'Down'],
      status: ['Leading'],
      load_gc_id: 59,
      price_from: '1000',
      is_favorite: true,
      page: 2,
    })

    expect(result).toEqual({
      cargo_num: '001',
      auc_type: ['Up', 'Down'],
      status: ['Leading'],
      load_gc_id: 59,
      price_from: '1000',
      is_favorite: true,
      page: 2,
    })
  })

  it('drops an invalid enum value in an array field instead of throwing', () => {
    expect(auctionFiltersSearchSchema.parse({ auc_type: ['NotARealType'] })).toEqual({})
  })

  it('drops a malformed top-level shape entirely via the outer .catch({})', () => {
    expect(auctionFiltersSearchSchema.parse('not-an-object')).toEqual({})
  })

  it('accepts an empty search', () => {
    expect(auctionFiltersSearchSchema.parse({})).toEqual({})
  })

  it('normalises digit-only params that parseSearch turns into numbers', () => {
    expect(auctionFiltersSearchSchema.parse({ cargo_num: 12345, price_from: 1000 })).toEqual({
      cargo_num: '12345',
      price_from: '1000',
    })
  })
})

describe('filtersToSearch / searchToFilters round trip', () => {
  it('omits falsy/empty values when converting form values to a search object', () => {
    const search = filtersToSearch(defaultAuctionFiltersFormValues)

    expect(search).toEqual({
      cargo_num: undefined,
      customer: undefined,
      auc_type: undefined,
      status: undefined,
      statuses: undefined,
      body_types: undefined,
      load_gc_id: undefined,
      unload_gc_id: undefined,
      load_date_from: undefined,
      load_date_to: undefined,
      price_from: undefined,
      price_to: undefined,
      is_favorite: undefined,
      is_bidder: undefined,
      is_available: undefined,
    })
  })

  it('carries a selected city through as its gcId', () => {
    const perm = CITIES.find((city) => city.name === 'Пермь')!
    const values: AuctionFiltersFormValues = {
      ...defaultAuctionFiltersFormValues,
      load_city: perm,
    }

    expect(filtersToSearch(values).load_gc_id).toBe(perm.gcId)
  })

  it('round-trips form values through a search object', () => {
    const perm = CITIES.find((city) => city.name === 'Пермь')!
    const values: AuctionFiltersFormValues = {
      ...defaultAuctionFiltersFormValues,
      cargo_num: '001',
      auc_type: ['Up'],
      load_city: perm,
      price_from: '1000',
      is_favorite: true,
    }

    const restored = searchToFilters(filtersToSearch(values))

    expect(restored).toEqual(values)
  })

  it('resolves an unknown gcId back to null rather than a partial city', () => {
    const restored = searchToFilters({ load_gc_id: 999999 })

    expect(restored.load_city).toBeNull()
  })

  it('falls back to defaults for fields absent from the search object', () => {
    expect(searchToFilters({})).toEqual(defaultAuctionFiltersFormValues)
  })
})
