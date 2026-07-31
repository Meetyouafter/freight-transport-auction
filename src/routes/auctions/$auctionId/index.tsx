import { createFileRoute } from '@tanstack/react-router'
import { AuctionDetailsPage } from '@pages/auction-details'

export const Route = createFileRoute('/auctions/$auctionId/')({
  component: AuctionDetailsPage,
})
