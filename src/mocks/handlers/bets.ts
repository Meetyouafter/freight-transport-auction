import { http, HttpResponse } from 'msw'
import { betsPath, setBetRequestSchema } from '@entities/bet'
import { API_BASE_URL } from '@shared/api/http'
import { findAuctionFixture } from '../fixtures/auctions'
import { addBet, getBets } from '../fixtures/bets'
import { MOCK_UNAUTHORIZED, MOCK_UNAVAILABLE } from '../utils/mockFlags'
import { serviceUnavailableResponse, unauthorizedResponse } from '../utils/problemResponses'

export const betHandlers = [
  http.get(`${API_BASE_URL}${betsPath(':auctionUuid')}`, ({ params, request }) => {
    if (MOCK_UNAUTHORIZED) return unauthorizedResponse()
    if (MOCK_UNAVAILABLE) return serviceUnavailableResponse()

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

  http.post(`${API_BASE_URL}${betsPath(':auctionUuid')}`, async ({ params, request }) => {
    if (MOCK_UNAUTHORIZED) return unauthorizedResponse()
    if (MOCK_UNAVAILABLE) return serviceUnavailableResponse()

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
    const { min, max, step } = fixture.show.trading.price
    const boundsError = validateBounds(price, { min, max, step })

    if (boundsError) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Запрос содержит некорректные поля.',
          errors: [{ field: 'price', message: boundsError, code: 'out_of_bounds' }],
        },
        { status: 422 },
      )
    }

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
    updatePriceBounds(
      fixture.show.trading.price,
      fixture.show.main.auc_type,
      price,
      bet.price_no_vat,
    )
    fixture.show.trading.your = { bet: true, last_bet: price, last_bet_with_vat: price, win: false }
    fixture.show.trading.status_mobile = 'Leading'

    return HttpResponse.json(bet)
  }),
]

function validateBounds(
  price: number,
  bounds: { min: number | null; max: number | null; step: number | null },
) {
  const { min, max, step } = bounds

  if (min != null && price < min) return `Ставка не может быть меньше ${min} ₽`
  if (max != null && price > max) return `Ставка не может быть больше ${max} ₽`
  if (step) {
    const base = min ?? 0
    const steps = (price - base) / step

    if (Math.abs(steps - Math.round(steps)) > 1e-6)
      return `Ставка должна быть кратна шагу ${step} ₽`
  }

  return null
}

/**
 * After a bid, the trading bounds shift so a follow-up bid validates against the auction's real
 * direction: `Down` accepts only lower bids next (new ceiling), `Up` only higher (new floor).
 */
function updatePriceBounds(
  price: {
    max: number | null
    max_no_vat: number | null
    min: number | null
    min_no_vat: number | null
  },
  aucType: string,
  newPrice: number,
  newPriceNoVat: number,
) {
  if (aucType === 'Down') {
    price.max = newPrice
    price.max_no_vat = newPriceNoVat
  } else if (aucType === 'Up') {
    price.min = newPrice
    price.min_no_vat = newPriceNoVat
  }
}
