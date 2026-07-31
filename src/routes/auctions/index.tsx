import { createFileRoute } from '@tanstack/react-router'
import { AuctionListPage } from '@pages/auction-list'
import { ROUTES } from '@shared/config/routes'

export const Route = createFileRoute(ROUTES.auctionsListId)({
  component: AuctionListPage,
})
