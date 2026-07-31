import { apiFetch } from '@shared/api/http'
import { AUCTIONS_LIST_PATH } from '../model/apiRoutes'
import { type AuctionListRequest, auctionListResponseSchema } from '../model/list'

export function listAuctions(request: AuctionListRequest = {}, signal?: AbortSignal) {
  return apiFetch(
    AUCTIONS_LIST_PATH,
    { method: 'POST', body: JSON.stringify(request) },
    (data) => auctionListResponseSchema.parse(data),
    signal,
  )
}
