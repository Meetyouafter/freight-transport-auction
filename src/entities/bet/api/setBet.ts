import { apiFetch } from '@shared/api/http'
import { betItemSchema, type SetBetRequest } from '../model/types'

export function setBet(auctionUuid: string, request: SetBetRequest) {
  return apiFetch(
    `/auctions/${auctionUuid}/bets`,
    { method: 'POST', body: JSON.stringify(request) },
    (data) => betItemSchema.parse(data),
  )
}
