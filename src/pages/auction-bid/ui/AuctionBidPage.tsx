import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Container, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { auctionErrorState, auctionQueryOptions, betUnavailableReason } from '@entities/auction'
import { BidForm, defaultBidPrice } from '@features/bid-form'
import { ROUTES } from '@shared/config/routes'
import { formatPrice } from '@shared/lib/format/formatPrice'
import { ErrorState, SectionCard } from '@shared/ui'

export function AuctionBidPage() {
  const { auctionId } = useParams({ from: ROUTES.auctionBid })
  const navigate = useNavigate()
  const { data, isPending, isError, error } = useQuery(auctionQueryOptions(auctionId))

  if (isError) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <ErrorState {...auctionErrorState(error)} />
      </Container>
    )
  }

  if (isPending) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="rounded" height={100} sx={{ mt: 2 }} />
        <Skeleton variant="rounded" height={140} sx={{ mt: 2 }} />
      </Container>
    )
  }

  const { main, trading } = data
  const { price, can_set_bet: canSetBet } = trading

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => navigate({ to: ROUTES.auctionDetails, params: { auctionId } })}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: 'inherit',
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2">К аукциону</Typography>
        </Box>
      </Box>

      <Typography variant="h5" component="h1" gutterBottom>
        Ставка по заявке № {main.cargo_num}
      </Typography>

      <SectionCard title="Параметры торгов">
        <Stack spacing={0.5}>
          <Typography sx={{ fontSize: 28, fontWeight: 500 }}>
            {formatPrice(price.current)}
          </Typography>
          {price.available != null && (
            <Typography variant="body2" color="text.secondary">
              Доступная цена: {formatPrice(price.available)}
            </Typography>
          )}
        </Stack>
      </SectionCard>

      <Box sx={{ mt: 3 }}>
        <BidForm
          auctionUuid={main.order_uid}
          min={price.min}
          max={price.max}
          step={price.step}
          current={price.current}
          aucType={main.auc_type}
          defaultPrice={defaultBidPrice({
            aucType: main.auc_type,
            current: price.current,
            min: price.min,
            max: price.max,
            step: price.step,
          })}
          disabled={!canSetBet}
          disabledReason={!canSetBet ? betUnavailableReason(trading) : undefined}
          onSuccess={() => navigate({ to: ROUTES.auctionDetails, params: { auctionId } })}
        />
      </Box>
    </Container>
  )
}
