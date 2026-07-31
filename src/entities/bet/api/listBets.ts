import { apiFetch } from '@shared/api/http'
import { betListResponseSchema } from '../model/types'

export function listBets(auctionUuid: string, all?: boolean) {
  const query = all ? '?all=true' : ''

  return apiFetch(`/auctions/${auctionUuid}/bets${query}`, { method: 'GET' }, (data) =>
    betListResponseSchema.parse(data),
  )
}
