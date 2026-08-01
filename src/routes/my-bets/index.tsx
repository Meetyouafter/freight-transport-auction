import { createFileRoute } from '@tanstack/react-router'
import { MyBetsPage } from '@pages/my-bets'
import { ROUTES } from '@shared/config/routes'
import { paginationSearchSchema } from '@shared/lib/pagination/paginationSearchSchema'

export const Route = createFileRoute(ROUTES.myBetsId)({
  validateSearch: paginationSearchSchema.catch({}),
  component: MyBetsPage,
})
