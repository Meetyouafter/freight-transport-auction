import { Container, Typography } from '@mui/material'
import { useParams } from '@tanstack/react-router'

export function AuctionBidPage() {
  const { auctionId } = useParams({ from: '/auctions/$auctionId/bid' })

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Установка ставки
      </Typography>
      <Typography color="text.secondary">Маршрут: /auctions/{auctionId}/bid</Typography>
    </Container>
  )
}
