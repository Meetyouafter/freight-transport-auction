import { createFileRoute } from '@tanstack/react-router'
import { auctionFiltersSearchSchema } from '@features/auction-filters'
import { HomePage } from '@pages/home'

export const Route = createFileRoute('/')({
  validateSearch: auctionFiltersSearchSchema,
  component: HomePage,
})
