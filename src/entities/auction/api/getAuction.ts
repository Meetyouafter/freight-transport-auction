import { apiFetch } from '@shared/api/http'
import { auctionShowResponseSchema } from '../model/show'

export function getAuction(auctionUuid: string) {
  return apiFetch('/auctions/' + auctionUuid, { method: 'GET' }, (data) =>
    auctionShowResponseSchema.parse(data),
  )
}
