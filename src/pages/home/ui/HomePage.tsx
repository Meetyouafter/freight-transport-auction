import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getAuctionLots } from '@entities/auction-lot'
import { BidForm } from '@features/bid-form'
import { useUiStore } from '@shared/lib/store/useUiStore'

export function HomePage() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['auction-lots'],
    queryFn: getAuctionLots,
  })
  const { isBidDialogOpen, openBidDialog, closeBidDialog } = useUiStore()

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Active lots
      </Typography>

      {isPending && <CircularProgress />}
      {isError && <Alert severity="error">Failed to load auction lots</Alert>}

      {data && (
        <List>
          {data.map((lot) => (
            <ListItem
              key={lot.id}
              divider
              secondaryAction={
                <Button size="small" onClick={openBidDialog}>
                  Bid
                </Button>
              }
            >
              <ListItemText primary={lot.title} secondary={`Current bid: $${lot.currentBid}`} />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={isBidDialogOpen} onClose={closeBidDialog} fullWidth>
        <DialogTitle>Place a bid</DialogTitle>
        <DialogContent>
          <Stack sx={{ pt: 1 }}>
            <BidForm
              onSubmit={(values) => {
                console.info('bid submitted', values)
                closeBidDialog()
              }}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </Container>
  )
}
