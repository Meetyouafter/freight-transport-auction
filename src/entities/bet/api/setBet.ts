import { apiFetch } from '@shared/api/http'
import { betsPath } from '../model/apiRoutes'
import { betItemSchema, type SetBetRequest } from '../model/types'

export function setBet(auctionUuid: string, request: SetBetRequest) {
  return apiFetch(
    betsPath(auctionUuid),
    { method: 'POST', body: JSON.stringify(request) },
    (data) => betItemSchema.parse(data),
  )
}
