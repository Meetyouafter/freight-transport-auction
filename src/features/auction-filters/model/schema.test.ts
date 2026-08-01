import { describe, expect, it } from 'vitest'
import { auctionFiltersFormSchema, defaultAuctionFiltersFormValues } from './schema'

describe('defaultAuctionFiltersFormValues', () => {
  it('satisfies its own form schema', () => {
    expect(() => auctionFiltersFormSchema.parse(defaultAuctionFiltersFormValues)).not.toThrow()
  })

  it('starts with every filter empty/off', () => {
    expect(defaultAuctionFiltersFormValues).toMatchObject({
      cargo_num: '',
      customer: '',
      auc_type: [],
      status: [],
      statuses: [],
      body_types: [],
      load_city: null,
      unload_city: null,
      is_favorite: false,
      is_bidder: false,
      is_available: false,
    })
  })
})

describe('auctionFiltersFormSchema', () => {
  it('rejects an auc_type value outside the filter enum', () => {
    expect(() =>
      auctionFiltersFormSchema.parse({
        ...defaultAuctionFiltersFormValues,
        auc_type: ['Unknown'],
      }),
    ).toThrow()
  })

  it('rejects a city missing required fields', () => {
    expect(() =>
      auctionFiltersFormSchema.parse({
        ...defaultAuctionFiltersFormValues,
        load_city: { name: 'Пермь' },
      }),
    ).toThrow()
  })
})
