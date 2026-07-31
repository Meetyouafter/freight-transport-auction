import { createFileRoute } from '@tanstack/react-router'
import { auctionFiltersSearchSchema } from '@features/auction-filters'
import { HomePage } from '@pages/home'
import { ROUTES } from '@shared/config/routes'

export const Route = createFileRoute(ROUTES.home)({
  validateSearch: auctionFiltersSearchSchema,
  component: HomePage,
})
