import { http, HttpResponse } from 'msw'
import { betsPath, setBetRequestSchema } from '@entities/bet'
import { API_BASE_URL } from '@shared/api/http'
import { findAuction, placeBet } from '../fixtures'
import {
  notFoundResponse,
  problemResponse,
  validationProblemResponse,
} from '../utils/problemResponses'

export const betHandlers = [
  http.get(`${API_BASE_URL}${betsPath(':auctionUuid')}`, ({ params, request }) => {
    const auctionUuid = params.auctionUuid as string
    const auction = findAuction(auctionUuid)

    if (!auction) {
      return notFoundResponse('Аукцион не найден')
    }

    const includeCancelled = new URL(request.url).searchParams.get('all') === 'true'
    const result = includeCancelled ? auction.bets : auction.bets.filter((bet) => !bet.is_rejected)

    return HttpResponse.json({ bets: result })
  }),

  http.post(`${API_BASE_URL}${betsPath(':auctionUuid')}`, async ({ params, request }) => {
    const auctionUuid = params.auctionUuid as string
    const auction = findAuction(auctionUuid)

    if (!auction) {
      return notFoundResponse('Аукцион не найден')
    }

    const body: unknown = await request.json().catch(() => ({}))
    const parsed = setBetRequestSchema.safeParse(body)

    if (!parsed.success) {
      return validationProblemResponse(
        parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
      )
    }

    if (!auction.show.trading.can_set_bet) {
      return problemResponse(422, {
        code: 'bet_not_allowed',
        title: 'Ставка невозможна',
        message: 'Аукцион не принимает ставки',
      })
    }

    return HttpResponse.json(placeBet(auction, parsed.data.price))
  }),
]
