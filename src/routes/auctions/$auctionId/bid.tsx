import { createFileRoute } from '@tanstack/react-router'
import { AuctionBidPage } from '@pages/auction-bid'
import { ROUTES } from '@shared/config/routes'

export const Route = createFileRoute(ROUTES.auctionBid)({
  component: AuctionBidPage,
})
