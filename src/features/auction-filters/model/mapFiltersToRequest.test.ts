import { describe, expect, it } from 'vitest'
import { CITIES } from '@entities/city'
import { mapFiltersToRequest } from './mapFiltersToRequest'
import { defaultAuctionFiltersFormValues, type AuctionFiltersFormValues } from './schema'

describe('mapFiltersToRequest', () => {
  it('maps empty form values to an all-undefined request', () => {
    const request = mapFiltersToRequest(defaultAuctionFiltersFormValues)

    expect(request).toEqual({
      cargo_num: undefined,
      customer: undefined,
      auc_type: undefined,
      status: undefined,
      statuses: undefined,
      body_types: undefined,
      load_city: undefined,
      load_gc_id: undefined,
      unload_city: undefined,
      unload_gc_id: undefined,
      load_date_from: undefined,
      load_date_to: undefined,
      current_price_from: undefined,
      current_price_to: undefined,
      is_favorite: undefined,
      is_bidder: undefined,
      is_available: undefined,
    })
  })

  it('splits a selected city into its name and gcId', () => {
    const perm = CITIES.find((city) => city.name === 'Пермь')!
    const values: AuctionFiltersFormValues = { ...defaultAuctionFiltersFormValues, load_city: perm }

    const request = mapFiltersToRequest(values)

    expect(request.load_city).toBe('Пермь')
    expect(request.load_gc_id).toBe(perm.gcId)
  })

  it('converts price strings to numbers under the current_price_* keys', () => {
    const values: AuctionFiltersFormValues = {
      ...defaultAuctionFiltersFormValues,
      price_from: '1000',
      price_to: '2500',
    }

    const request = mapFiltersToRequest(values)

    expect(request.current_price_from).toBe(1000)
    expect(request.current_price_to).toBe(2500)
  })

  it('keeps empty arrays out of the request as undefined', () => {
    const request = mapFiltersToRequest({ ...defaultAuctionFiltersFormValues, auc_type: [] })

    expect(request.auc_type).toBeUndefined()
  })

  it('passes through a populated array as-is', () => {
    const request = mapFiltersToRequest({
      ...defaultAuctionFiltersFormValues,
      auc_type: ['Up', 'Down'],
    })

    expect(request.auc_type).toEqual(['Up', 'Down'])
  })
})
