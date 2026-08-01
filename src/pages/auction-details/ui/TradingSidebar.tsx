import { Box, Divider, Stack, Typography } from '@mui/material'
import type { AuctionShowTrading, AuctionType } from '@entities/auction'
import { BidForm } from '@features/bid-form'
import { formatPrice } from '@shared/lib/format/formatPrice'
import { colorTokens } from '@shared/theme/tokens'
import { StatusBadge } from '@widgets/auction-card'
import { auctionDirectionBadge } from '../model/statusMaps'
import { MyBetStatus } from './MyBetStatus'

interface TradingSidebarProps {
  auctionUuid: string
  aucType: AuctionType
  trading: AuctionShowTrading
  onBidSuccess?: () => void
}

export function TradingSidebar({
  auctionUuid,
  aucType,
  trading,
  onBidSuccess,
}: TradingSidebarProps) {
  const { price, can_set_bet: canSetBet } = trading
  const directionBadge = auctionDirectionBadge(aucType, trading.status)

  return (
    <Stack spacing={2}>
      <Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: 24, fontWeight: 500, color: 'text.primary' }}>
            {formatPrice(price.current)}
          </Typography>
          {directionBadge && <StatusBadge tone="outline" {...directionBadge} />}
        </Stack>
        {price.available != null && (
          <Typography variant="caption" sx={{ color: colorTokens.moss, display: 'block' }}>
            Стартовая цена организатора: {formatPrice(price.available)}
          </Typography>
        )}
      </Box>

      <Divider />

      <MyBetStatus trading={trading} />

      <Divider />

      <BidForm
        auctionUuid={auctionUuid}
        min={price.min}
        max={price.max}
        step={price.step}
        defaultPrice={trading.your.last_bet_with_vat ?? trading.your.last_bet ?? price.current ?? 0}
        disabled={!canSetBet}
        disabledReason={dealDisabledReason(trading)}
        onSuccess={onBidSuccess}
      />
    </Stack>
  )
}

function dealDisabledReason(trading: AuctionShowTrading) {
  if (trading.status === 'Finished' || trading.status === 'WaitDeal') return 'Торги закрыты'
  if (trading.status === 'Canceled') return 'Аукцион отменён'
  if (trading.status === 'Stopped') return 'Аукцион остановлен'

  return 'У вас нет доступа к участию в торгах'
}
