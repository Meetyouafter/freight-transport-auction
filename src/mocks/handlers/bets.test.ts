import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '@shared/api/http'
import { problemDetailSchema, validationProblemSchema } from '@shared/api/problemDetail'
import { BASE_AUCTION_UUID } from '../fixtures'
import { betHandlers } from './bets'

const ORIGIN = 'http://localhost'
const [listBetsHandler, setBetHandler] = betHandlers
const AUCTION_UUID = BASE_AUCTION_UUID

function run(handler: (typeof betHandlers)[number], request: Request) {
  return handler.run({ request, requestId: 'test', resolutionContext: { baseUrl: ORIGIN } })
}

describe('GET /auctions/{uuid}/bets', () => {
  it('lists the seeded bet for the known auction', async () => {
    const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/${AUCTION_UUID}/bets`)
    const result = await run(listBetsHandler, request)
    const body: { bets: unknown[] } = await result!.response!.json()

    expect(body.bets).toHaveLength(1)
  })

  it('answers an unknown auction with a 404 problem document', async () => {
    const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/does-not-exist/bets`)
    const result = await run(listBetsHandler, request)
    const response = result!.response!

    expect(response.status).toBe(404)
    expect(response.headers.get('Content-Type')).toBe('application/problem+json')
    expect(problemDetailSchema.parse(await response.json()).code).toBe('resource_not_found')
  })
})

describe('POST /auctions/{uuid}/bets', () => {
  async function setBet(auctionUuid: string, body: unknown) {
    const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/${auctionUuid}/bets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const result = await run(setBetHandler, request)

    return result!.response!
  }

  it('places a bet and returns the created BetItem', async () => {
    const response = await setBet(AUCTION_UUID, { price: 42000 })

    expect(response.status).toBe(200)
    const bet: { price_with_vat: number } = await response.json()

    expect(bet.price_with_vat).toBe(42000)
  })

  it('rejects a non-positive price with a 422 validation problem', async () => {
    const response = await setBet(AUCTION_UUID, { price: -1 })

    expect(response.status).toBe(422)
    expect(response.headers.get('Content-Type')).toBe('application/problem+json')
    const problem = validationProblemSchema.parse(await response.json())

    expect(problem.errors[0].field).toBe('price')
  })

  it('answers an unknown auction with a 404 problem document', async () => {
    const response = await setBet('does-not-exist', { price: 1000 })

    expect(response.status).toBe(404)
  })
})
