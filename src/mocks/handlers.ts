import { auctionHandlers } from './handlers/auctions'
import { betHandlers } from './handlers/bets'

export const handlers = [...auctionHandlers, ...betHandlers]
