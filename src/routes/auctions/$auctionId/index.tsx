import { createFileRoute } from '@tanstack/react-router'
import { AuctionDetailsPage } from '@pages/auction-details'
import { ROUTES } from '@shared/config/routes'

export const Route = createFileRoute(ROUTES.auctionDetailsId)({
  component: AuctionDetailsPage,
})
