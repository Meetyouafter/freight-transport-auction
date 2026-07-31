import { http, HttpResponse } from 'msw'
import { setBetRequestSchema } from '@entities/bet'
import { findAuctionFixture } from '../fixtures/auctions'
import { addBet, getBets } from '../fixtures/bets'

const API_BASE = '/api/v1'

export const betHandlers = [
  http.get(`${API_BASE}/auctions/:auctionUuid/bets`, ({ params, request }) => {
    const auctionUuid = params.auctionUuid as string

    if (!findAuctionFixture(auctionUuid)) {
      return HttpResponse.json(
        { code: 'resource_not_found', title: 'Не найдено', message: 'Аукцион не найден' },
        { status: 404 },
      )
    }

    const includeCancelled = new URL(request.url).searchParams.get('all') === 'true'

    return HttpResponse.json({ bets: getBets(auctionUuid, includeCancelled) })
  }),

  http.post(`${API_BASE}/auctions/:auctionUuid/bets`, async ({ params, request }) => {
    const auctionUuid = params.auctionUuid as string
    const fixture = findAuctionFixture(auctionUuid)

    if (!fixture) {
      return HttpResponse.json(
        { code: 'resource_not_found', title: 'Не найдено', message: 'Аукцион не найден' },
        { status: 404 },
      )
    }

    const body: unknown = await request.json().catch(() => ({}))
    const parsed = setBetRequestSchema.safeParse(body)

    if (!parsed.success) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Запрос содержит некорректные поля.',
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
        },
        { status: 422 },
      )
    }

    if (!fixture.show.trading.can_set_bet) {
      return HttpResponse.json(
        {
          code: 'bet_not_allowed',
          title: 'Ставка невозможна',
          message: 'Аукцион не принимает ставки',
        },
        { status: 422 },
      )
    }

    const { price } = parsed.data
    const bet = addBet(auctionUuid, fixture.show.main.id, price)

    fixture.listItem.trading.price = {
      start: fixture.listItem.trading.price?.start ?? price,
      current: price,
      current_no_vat: bet.price_no_vat,
    }
    fixture.listItem.trading.your = { bet: true, last_bet: price }
    fixture.listItem.trading.status_mobile = 'Leading'

    fixture.show.trading.price.current = price
    fixture.show.trading.price.current_no_vat = bet.price_no_vat
    fixture.show.trading.your = { bet: true, last_bet: price, last_bet_with_vat: price, win: false }
    fixture.show.trading.status_mobile = 'Leading'

    return HttpResponse.json(bet)
  }),
]
