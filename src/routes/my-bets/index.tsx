import { createFileRoute } from '@tanstack/react-router'
import { MyBetsPage } from '@pages/my-bets'
import { ROUTES } from '@shared/config/routes'

export const Route = createFileRoute(ROUTES.myBets)({
  component: MyBetsPage,
})
