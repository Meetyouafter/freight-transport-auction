import { describe, expect, it } from 'vitest'
import { auctionStatusSchema, auctionTypeSchema } from '@entities/auction'
import { API_BASE_URL } from '@shared/api/http'
import { problemDetailSchema } from '@shared/api/problemDetail'
import { AUCTION_COUNT, BASE_AUCTION_UUID } from '../fixtures'
import { auctionHandlers } from './auctions'

const ORIGIN = 'http://localhost'
const [listHandler, getHandler] = auctionHandlers
const AUCTION_UUID = BASE_AUCTION_UUID

function run(handler: (typeof auctionHandlers)[number], request: Request) {
  return handler.run({ request, requestId: 'test', resolutionContext: { baseUrl: ORIGIN } })
}

describe('POST /auctions/list', () => {
  it('returns every seeded auction with pagination meta', async () => {
    const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const result = await run(listHandler, request)
    const body: { data: unknown[]; meta: { total: number } } = await result!.response!.json()

    expect(body.data).toHaveLength(AUCTION_COUNT)
    expect(body.meta.total).toBe(AUCTION_COUNT)
  })

  it('covers every AuctionStatus', async () => {
    const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ per_page: AUCTION_COUNT }),
    })
    const result = await run(listHandler, request)
    const body: { data: { trading: { status: string } }[] } = await result!.response!.json()
    const statuses = new Set(body.data.map((item) => item.trading.status))

    for (const status of auctionStatusSchema.options) {
      expect(statuses.has(status)).toBe(true)
    }
  })

  it('covers every AuctionType, and opens bidding on more than one direction', async () => {
    const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ per_page: AUCTION_COUNT }),
    })
    const result = await run(listHandler, request)
    const body: {
      data: { main: { auc_type: string }; trading: { can_set_bet: boolean } }[]
    } = await result!.response!.json()
    const types = new Set(body.data.map((item) => item.main.auc_type))
    const openTypes = new Set(
      body.data.filter((item) => item.trading.can_set_bet).map((item) => item.main.auc_type),
    )

    for (const aucType of auctionTypeSchema.options) {
      expect(types.has(aucType)).toBe(true)
    }
    expect(openTypes.size).toBeGreaterThan(1)
  })

  it('has a won and a lost outcome among the Finished auctions', async () => {
    const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ per_page: AUCTION_COUNT }),
    })
    const result = await run(listHandler, request)
    const body: { data: { trading: { status: string; status_mobile: string } }[] } =
      await result!.response!.json()
    const finished = body.data.filter((item) => item.trading.status === 'Finished')

    expect(finished.some((item) => item.trading.status_mobile === 'Winner')).toBe(true)
    expect(finished.some((item) => item.trading.status_mobile === 'Losing')).toBe(true)
  })

  it('paginates with per_page', async () => {
    const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 2, per_page: 5 }),
    })
    const result = await run(listHandler, request)
    const body: { data: unknown[]; meta: { current_page: number; last_page: number } } =
      await result!.response!.json()

    expect(body.data).toHaveLength(5)
    expect(body.meta.current_page).toBe(2)
    expect(body.meta.last_page).toBe(Math.ceil(AUCTION_COUNT / 5))
  })

  it('rejects a malformed filter with a 422 validation problem', async () => {
    const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'not-a-number' }),
    })
    const result = await run(listHandler, request)

    expect(result!.response!.status).toBe(422)
  })
})

describe('GET /auctions/{uuid}', () => {
  it('returns the seeded auction detail', async () => {
    const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/${AUCTION_UUID}`)
    const result = await run(getHandler, request)

    expect(result!.response!.status).toBe(200)
  })

  it('answers an unknown auction with a 404 problem document', async () => {
    const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/does-not-exist`)
    const result = await run(getHandler, request)
    const response = result!.response!

    expect(response.status).toBe(404)
    expect(problemDetailSchema.parse(await response.json()).code).toBe('resource_not_found')
  })
})
