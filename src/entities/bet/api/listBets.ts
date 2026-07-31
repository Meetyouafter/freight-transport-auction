import { apiFetch } from '@shared/api/http'
import { betsPath } from '../model/apiRoutes'
import { betListResponseSchema } from '../model/types'

export function listBets(auctionUuid: string, all?: boolean) {
  const query = all ? '?all=true' : ''

  return apiFetch(`${betsPath(auctionUuid)}${query}`, { method: 'GET' }, (data) =>
    betListResponseSchema.parse(data),
  )
}
