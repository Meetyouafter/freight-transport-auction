import {
  Alert,
  Box,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { listAuctions } from '@entities/auction'
import { setBet } from '@entities/bet'
import { BidForm } from '@features/bid-form'
import { useUiStore } from '@shared/lib/store/useUiStore'
import { AppButton, EmptyState, ErrorState } from '@shared/ui'
import { AuctionListSkeleton } from './AuctionListSkeleton'

const PER_PAGE_OPTIONS = [10, 20, 50, 100] as const

export function HomePage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState<(typeof PER_PAGE_OPTIONS)[number]>(10)
  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ['auctions', page, perPage],
    queryFn: () => listAuctions({ page, per_page: perPage }),
    placeholderData: keepPreviousData,
  })
  const isRefetching = isFetching && !isPending
  const { isBidDialogOpen, bidDialogAuctionUuid, openBidDialog, closeBidDialog } = useUiStore()

  const bidMutation = useMutation({
    mutationFn: (price: number) => setBet(bidDialogAuctionUuid!, { price }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
      closeBidDialog()
    },
  })

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        Активные аукционы
      </Typography>

      {isPending && <AuctionListSkeleton />}
      {!isPending && isError && <ErrorState />}
      {bidMutation.isError && <Alert severity="error">Не удалось сделать ставку</Alert>}

      {!isPending && !isError && data && (
        <Box sx={{ position: 'relative' }}>
          {isRefetching && (
            <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          )}

          <Box
            sx={{
              opacity: isRefetching ? 0.5 : 1,
              pointerEvents: isRefetching ? 'none' : 'auto',
              transition: 'opacity 0.15s ease',
            }}
          >
            {data.data.length === 0 && (
              <EmptyState text="На текущий момент нет открытых аукционов" />
            )}

            {data.data.length > 0 && (
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

            {data.data.length > 0 && (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ alignItems: 'center', justifyContent: 'center', mt: 3 }}
              >
                {data.meta.last_page > 1 && (
                  <Pagination
                    count={data.meta.last_page}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    disabled={isRefetching}
                  />
                )}
                <FormControl size="small" sx={{ minWidth: 120 }} disabled={isRefetching}>
                  <InputLabel id="per-page-label">На странице</InputLabel>
                  <Select
                    labelId="per-page-label"
                    label="На странице"
                    value={perPage}
                    onChange={(event) => {
                      setPerPage(Number(event.target.value) as (typeof PER_PAGE_OPTIONS)[number])
                      setPage(1)
                    }}
                  >
                    {PER_PAGE_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}
          </Box>
        </Box>
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
