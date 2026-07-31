import {
  Alert,
  Chip,
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
import { AppButton, EmptyState, ErrorState, Loader } from '@shared/ui'

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        Активные аукционы
      </Typography>

      {isPending && <Loader />}
      {isError && <ErrorState />}
      {bidMutation.isError && <Alert severity="error">Не удалось сделать ставку</Alert>}

      {data && data.data.length === 0 && (
        <EmptyState text="На текущий момент нет открытых аукционов" />
      )}

      {data && data.data.length > 0 && (
        <List sx={{ width: '100%' }}>
          {data.data.map((auction) => (
            <ListItem
              key={auction.main.order_uid}
              divider
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: { xs: 1, sm: 2 },
                py: 2,
              }}
            >
              <ListItemText
                sx={{ m: 0, minWidth: 0, wordBreak: 'break-word' }}
                primary={
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}
                  >
                    <span>{auction.cargo.name}</span>
                    <Chip size="small" label={auction.trading.status_mobile} />
                  </Stack>
                }
                secondary={`${auction.route.load.city} → ${auction.route.unload.city} · Current bid: ${auction.trading.price?.current ?? '—'} ₽`}
              />
              {auction.trading.can_set_bet && (
                <AppButton
                  size="small"
                  onClick={() => openBidDialog(auction.main.order_uid)}
                  sx={{ alignSelf: { xs: 'stretch', sm: 'center' }, flexShrink: 0 }}
                >
                  Ставка
                </AppButton>
              )}
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={isBidDialogOpen} onClose={closeBidDialog} fullWidth>
        <DialogTitle>Сделать ставку</DialogTitle>
        <DialogContent>
          <Stack sx={{ pt: 1 }}>
            <BidForm onSubmit={(values) => bidMutation.mutate(values.price)} />
          </Stack>
        </DialogContent>
      </Dialog>
    </Container>
  )
}
