import { apiFetch } from '@shared/api/http'
import { auctionPath } from '../model/apiRoutes'
import { auctionShowResponseSchema } from '../model/show'

export function getAuction(auctionUuid: string) {
  return apiFetch(auctionPath(auctionUuid), { method: 'GET' }, (data) =>
    auctionShowResponseSchema.parse(data),
  )
}
