import { Container, Typography } from '@mui/material'

export function AuctionListPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Список аукционов
      </Typography>
      <Typography color="text.secondary">Маршрут: /auctions</Typography>
    </Container>
  )
}
