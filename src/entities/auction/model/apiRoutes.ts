export const AUCTIONS_LIST_PATH = '/auctions/list'

export function auctionPath(auctionUuid: string) {
  return `/auctions/${auctionUuid}`
}
