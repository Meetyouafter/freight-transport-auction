import { Container, Typography } from '@mui/material'
import { useParams } from '@tanstack/react-router'

export function AuctionDetailsPage() {
  const { auctionId } = useParams({ from: '/auctions/$auctionId/' })

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Карточка аукциона
      </Typography>
      <Typography color="text.secondary">Маршрут: /auctions/{auctionId}</Typography>
    </Container>
  )
}
