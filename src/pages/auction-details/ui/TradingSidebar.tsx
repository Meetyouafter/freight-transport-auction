import { Box, Divider, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { auctionQueryOptions, type AuctionShowTrading } from '@entities/auction'
import { setBet } from '@entities/bet'
import { BidForm, type BidFormValues } from '@features/bid-form'
import { colorTokens } from '@shared/theme/tokens'
import { MyBetStatus } from './MyBetStatus'

interface TradingSidebarProps {
  auctionUuid: string
  trading: AuctionShowTrading
}

export function TradingSidebar({ auctionUuid, trading }: TradingSidebarProps) {
  const queryClient = useQueryClient()
  const { price, can_set_bet: canSetBet } = trading
  const mutation = useMutation({
    mutationFn: (values: BidFormValues) => setBet(auctionUuid, { price: values.price }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: auctionQueryOptions(auctionUuid).queryKey })
      void queryClient.invalidateQueries({ queryKey: ['auctions'] })
    },
  })

  return (
    <Stack spacing={2}>
      <Box>
        <Typography sx={{ fontSize: 24, fontWeight: 500, color: 'text.primary' }}>
          {price.current != null ? `${price.current} ₽` : '—'}
        </Typography>
        {price.available != null && (
          <Typography variant="caption" sx={{ color: colorTokens.moss, display: 'block' }}>
            Стартовая цена организатора: {price.available} ₽
          </Typography>
        )}
      </Box>

      <Divider />

      <MyBetStatus trading={trading} />

      <Divider />

      <BidForm
        min={price.min}
        max={price.max}
        step={price.step}
        defaultPrice={trading.your.last_bet_with_vat ?? trading.your.last_bet ?? price.current ?? 0}
        disabled={!canSetBet}
        disabledReason={dealDisabledReason(trading)}
        submitting={mutation.isPending}
        onSubmit={(values) => mutation.mutate(values)}
      />

      {mutation.isError && (
        <Typography variant="caption" color="error">
          Не удалось сделать ставку. Попробуйте ещё раз.
        </Typography>
      )}
    </Stack>
  )
}

function dealDisabledReason(trading: AuctionShowTrading) {
  if (trading.status === 'Finished' || trading.status === 'WaitDeal') return 'Торги закрыты'
  if (trading.status === 'Canceled') return 'Аукцион отменён'
  if (trading.status === 'Stopped') return 'Аукцион остановлен'

  return 'У вас нет доступа к участию в торгах'
}
