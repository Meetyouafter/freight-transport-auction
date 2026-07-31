import { apiFetch } from '@shared/api/http'
import { type AuctionListRequest, auctionListResponseSchema } from '../model/list'

export function listAuctions(request: AuctionListRequest = {}) {
  return apiFetch('/auctions/list', { method: 'POST', body: JSON.stringify(request) }, (data) =>
    auctionListResponseSchema.parse(data),
  )
}
