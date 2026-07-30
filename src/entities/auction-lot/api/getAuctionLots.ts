import { auctionLotListSchema } from '../model/types'

export async function getAuctionLots() {
  const response = await fetch('/api/auction-lots')

  if (!response.ok) {
    throw new Error(`Failed to load auction lots: ${response.status}`)
  }

  return auctionLotListSchema.parse(await response.json())
}
