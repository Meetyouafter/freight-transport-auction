import { HttpResponse, delay, http } from 'msw'
import {
  AUCTIONS_LIST_PATH,
  AUCTION_STATUS_IDS,
  auctionListRequestSchema,
  auctionPath,
  type AuctionListItem,
} from '@entities/auction'
import { API_BASE_URL } from '@shared/api/http'
import { auctionFixtures, findAuctionFixture } from '../fixtures/auctions'
import {
  MOCK_DELAY_MS,
  MOCK_EMPTY,
  MOCK_ERROR,
  MOCK_UNAUTHORIZED,
  MOCK_UNAVAILABLE,
} from '../utils/mockFlags'
import { serviceUnavailableResponse, unauthorizedResponse } from '../utils/problemResponses'

function matchesFilters(
  item: AuctionListItem,
  filters: ReturnType<typeof auctionListRequestSchema.parse>,
) {
  if (filters.cargo_num && !item.main.cargo_num.includes(filters.cargo_num)) return false
  if (
    filters.customer &&
    !item.organizer.organization_name.toLowerCase().includes(filters.customer.toLowerCase())
  )
    return false
  if (filters.auc_type?.length && !filters.auc_type.includes(item.main.auc_type as never))
    return false
  if (filters.status?.length && !filters.status.includes(item.trading.status_mobile as never))
    return false
  if (
    filters.statuses?.length &&
    !filters.statuses.includes(AUCTION_STATUS_IDS[item.trading.status])
  )
    return false
  if (filters.load_gc_id !== undefined && item.route.load.city_gc_id !== filters.load_gc_id)
    return false
  if (filters.unload_gc_id !== undefined && item.route.unload.city_gc_id !== filters.unload_gc_id)
    return false
  if (filters.load_date_from && item.route.load.date < filters.load_date_from) return false
  if (filters.load_date_to && item.route.load.date > filters.load_date_to) return false
  if (
    filters.current_price_from !== undefined &&
    filters.current_price_from !== null &&
    (item.trading.price?.current ?? 0) < filters.current_price_from
  )
    return false
  if (
    filters.current_price_to !== undefined &&
    filters.current_price_to !== null &&
    (item.trading.price?.current ?? 0) > filters.current_price_to
  )
    return false
  if (filters.is_favorite !== undefined && item.trading.is_favorite !== filters.is_favorite)
    return false
  if (filters.is_available !== undefined && item.trading.is_available !== filters.is_available)
    return false
  if (filters.is_bidder !== undefined && item.trading.is_bidder !== filters.is_bidder) return false

  return true
}

function sortItems(
  items: AuctionListItem[],
  filters: ReturnType<typeof auctionListRequestSchema.parse>,
) {
  const sorted = [...items]
  const sortEntry = filters.sort ? Object.entries(filters.sort)[0] : undefined

  if (sortEntry) {
    const [field, direction] = sortEntry
    sorted.sort((a, b) => {
      const valueA =
        field === 'price_per_km' ? (a.main.price_per_km ?? 0) : (a.trading.price?.current ?? 0)
      const valueB =
        field === 'price_per_km' ? (b.main.price_per_km ?? 0) : (b.trading.price?.current ?? 0)

      return direction === 'asc' ? valueA - valueB : valueB - valueA
    })
  } else {
    sorted.sort((a, b) => {
      const diff = new Date(a.main.created_at).getTime() - new Date(b.main.created_at).getTime()

      return filters.is_oldest ? diff : -diff
    })
  }

  return sorted
}

export const auctionHandlers = [
  http.post(`${API_BASE_URL}${AUCTIONS_LIST_PATH}`, async ({ request }) => {
    await delay(MOCK_DELAY_MS)

    if (MOCK_UNAUTHORIZED) return unauthorizedResponse()
    if (MOCK_UNAVAILABLE) return serviceUnavailableResponse()

    if (MOCK_ERROR) {
      return HttpResponse.json(
        {
          code: 'internal_error',
          title: 'Ошибка сервера',
          message: 'Мок: имитация серверной ошибки',
        },
        { status: 500 },
      )
    }

    const body = request.body ? await request.json().catch(() => ({})) : {}
    const parsed = auctionListRequestSchema.safeParse(body)

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

    const filters = parsed.data
    const page = filters.page ?? 1
    const perPage = filters.per_page ?? 20

    const filtered = MOCK_EMPTY
      ? []
      : sortItems(
          auctionFixtures
            .map((fixture) => fixture.listItem)
            .filter((item) => matchesFilters(item, filters)),
          filters,
        )
    const start = (page - 1) * perPage
    const data = filtered.slice(start, start + perPage)

    return HttpResponse.json({
      data,
      meta: {
        current_page: page,
        from: filtered.length === 0 ? 0 : start + 1,
        last_page: Math.max(1, Math.ceil(filtered.length / perPage)),
        per_page: perPage,
        to: Math.min(start + perPage, filtered.length),
        total: filtered.length,
      },
    })
  }),

  http.get(`${API_BASE_URL}${auctionPath(':auctionUuid')}`, ({ params }) => {
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

    return HttpResponse.json(fixture.show)
  }),
]
