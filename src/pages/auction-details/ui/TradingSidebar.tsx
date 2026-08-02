import { Box, Divider, Stack, Typography } from '@mui/material'
import type { AuctionShowTrading, AuctionType } from '@entities/auction'
import { BidForm, defaultBidPrice } from '@features/bid-form'
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
            Доступная цена: {formatPrice(price.available)}
            {price.available_no_vat != null && ` (${formatPrice(price.available_no_vat)} без НДС)`}
          </Typography>
        )}
        {price.start != null && (
          <Typography variant="caption" sx={{ color: colorTokens.moss, display: 'block' }}>
            Стартовая цена организатора: {formatPrice(price.start)}
          </Typography>
        )}
      </Box>

      <Divider />

      <MyBetStatus trading={trading} />

      {trading.allow_counter_bets && (
        <Typography variant="caption" sx={{ color: colorTokens.moss }}>
          Организатор допускает встречные ставки: после определения победителя вашу цену могут
          попросить пересмотреть.
        </Typography>
      )}

      <Divider />

      <BidForm
        auctionUuid={auctionUuid}
        min={price.min}
        max={price.max}
        step={price.step}
        current={price.current}
        aucType={aucType}
        defaultPrice={defaultBidPrice({
          aucType,
          current: price.current,
          min: price.min,
          max: price.max,
          step: price.step,
        })}
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
