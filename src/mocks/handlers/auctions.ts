import { http, HttpResponse } from 'msw'
import { AUCTIONS_LIST_PATH, auctionListRequestSchema, auctionPath } from '@entities/auction'
import { API_BASE_URL } from '@shared/api/http'
import { findAuction, listAuctionItems } from '../fixtures'
import { notFoundResponse, validationProblemResponse } from '../utils/problemResponses'

export const auctionHandlers = [
  http.post(`${API_BASE_URL}${AUCTIONS_LIST_PATH}`, async ({ request }) => {
    const body: unknown = await request.json().catch(() => ({}))
    const parsed = auctionListRequestSchema.safeParse(body)

    if (!parsed.success) {
      return validationProblemResponse(
        parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
      )
    }

    const { page = 1, per_page: perPage = 20 } = parsed.data
    const all = listAuctionItems()
    const from = (page - 1) * perPage
    const data = all.slice(from, from + perPage)
    const lastPage = Math.max(1, Math.ceil(all.length / perPage))

    return HttpResponse.json({
      data,
      meta: {
        current_page: page,
        from: data.length ? from + 1 : 0,
        last_page: lastPage,
        per_page: perPage,
        to: from + data.length,
        total: all.length,
      },
    })
  }),

  http.get(`${API_BASE_URL}${auctionPath(':auctionUuid')}`, ({ params }) => {
    const auctionUuid = params.auctionUuid as string
    const auction = findAuction(auctionUuid)

    if (!auction) {
      return notFoundResponse('Аукцион не найден')
    }

    return HttpResponse.json(auction.show)
  }),
]
