import {
  Alert,
  Button,
  Chip,
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listAuctions } from '@entities/auction'
import { setBet } from '@entities/bet'
import { BidForm } from '@features/bid-form'
import { useUiStore } from '@shared/lib/store/useUiStore'

const AUCTIONS_QUERY_KEY = ['auctions']

export function HomePage() {
  const queryClient = useQueryClient()
  const { data, isPending, isError } = useQuery({
    queryKey: AUCTIONS_QUERY_KEY,
    queryFn: () => listAuctions({ per_page: 20 }),
  })
  const { isBidDialogOpen, bidDialogAuctionUuid, openBidDialog, closeBidDialog } = useUiStore()

  const bidMutation = useMutation({
    mutationFn: (price: number) => setBet(bidDialogAuctionUuid!, { price }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUCTIONS_QUERY_KEY })
      closeBidDialog()
    },
  })

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Active auctions
      </Typography>

      {isPending && <CircularProgress />}
      {isError && <Alert severity="error">Failed to load auctions</Alert>}
      {bidMutation.isError && <Alert severity="error">Failed to place bid</Alert>}

      {data && (
        <List>
          {data.data.map((auction) => (
            <ListItem
              key={auction.main.order_uid}
              divider
              secondaryAction={
                auction.trading.can_set_bet && (
                  <Button size="small" onClick={() => openBidDialog(auction.main.order_uid)}>
                    Bid
                  </Button>
                )
              }
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <span>{auction.cargo.name}</span>
                    <Chip size="small" label={auction.trading.status_mobile} />
                  </Stack>
                }
                secondary={`${auction.route.load.city} → ${auction.route.unload.city} · Current bid: ${auction.trading.price?.current ?? '—'} ₽`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={isBidDialogOpen} onClose={closeBidDialog} fullWidth>
        <DialogTitle>Place a bid</DialogTitle>
        <DialogContent>
          <Stack sx={{ pt: 1 }}>
            <BidForm onSubmit={(values) => bidMutation.mutate(values.price)} />
          </Stack>
        </DialogContent>
      </Dialog>
    </Container>
  )
}
