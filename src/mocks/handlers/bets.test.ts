import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '@shared/api/http'
import { validationProblemSchema } from '@shared/api/problemDetail'
import { auctionFixtures } from '../fixtures/auctions'
import { betHandlers } from './bets'

const ORIGIN = 'http://localhost'
const setBetHandler = betHandlers[1]

async function setBet(auctionUuid: string, price: number) {
  const request = new Request(`${ORIGIN}${API_BASE_URL}/auctions/${auctionUuid}/bets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price }),
  })
  const result = await setBetHandler.run({
    request,
    requestId: 'test',
    resolutionContext: { baseUrl: ORIGIN },
  })

  return result!.response!
}

function openAuction(aucType: 'Up' | 'Down') {
  return auctionFixtures.find(
    (fixture) =>
      fixture.show.main.auc_type === aucType &&
      fixture.show.trading.can_set_bet &&
      fixture.show.trading.price.step != null,
  )!
}

describe('POST /auctions/{uuid}/bets', () => {
  it('rejects a bid against the direction of an "Up" auction', async () => {
    const { show } = openAuction('Up')
    const { current, step } = show.trading.price

    const response = await setBet(show.main.order_uid, current! - step!)

    expect(response.status).toBe(422)
    expect(response.headers.get('Content-Type')).toBe('application/problem+json')

    const problem = validationProblemSchema.parse(await response.json())

    expect(problem.errors[0].field).toBe('price')
  })

  it('rejects a bid against the direction of a "Down" auction', async () => {
    const { show } = openAuction('Down')
    const { current, step } = show.trading.price

    const response = await setBet(show.main.order_uid, current! + step!)

    expect(response.status).toBe(422)

    const problem = validationProblemSchema.parse(await response.json())

    expect(problem.errors[0].field).toBe('price')
  })

  it('answers an unknown auction with a 404 problem document', async () => {
    const response = await setBet('does-not-exist-uuid', 1000)

    expect(response.status).toBe(404)
    expect(response.headers.get('Content-Type')).toBe('application/problem+json')
  })
})
