import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined'
import EastIcon from '@mui/icons-material/East'
import { Box, Divider, Paper, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'
import {
  auctionQueryOptions,
  TRADING_STATUS_MOBILE_LABELS,
  type AuctionListItem
} from '@entities/auction'
import { cardTokens, type StatusTokenKey } from '@shared/theme/tokens'
import { AppButton } from '@shared/ui'
import { MAX_SECONDARY_BADGES } from '../model/constants'
import { StatusBadge } from './StatusBadge'

function formatDate(date: string) {
  return dayjs(date).format('DD.MM.YYYY')
}

interface Badge {
  variant: StatusTokenKey
  label: string
  icon?: React.ReactNode
}

function getPrimaryBadge(auction: AuctionListItem): Badge | null {
  const { trading } = auction

  if (trading.status_mobile === 'Confirmed') {
    return { variant: 'confirmed', label: TRADING_STATUS_MOBILE_LABELS.Confirmed }
  }
  if (trading.status_mobile === 'Winner') {
    return { variant: 'confirmed', label: TRADING_STATUS_MOBILE_LABELS.Winner }
  }
  if (trading.status === 'Canceled' || trading.status === 'Stopped') {
    return { variant: 'rejected', label: trading.status === 'Canceled' ? 'Отменён' : 'Остановлен' }
  }
  if (trading.status_mobile === 'Losing') {
    return { variant: 'rejected', label: TRADING_STATUS_MOBILE_LABELS.Losing }
  }

  return null
}

function getSecondaryBadges(auction: AuctionListItem, hasMyBid: boolean): Badge[] {
  const { main, trading } = auction
  const badges: Badge[] = []

  if (main.auc_type === 'Up' && trading.status === 'Auction') {
    badges.push({
      variant: 'rising',
      label: 'На повышение',
      icon: <ArrowUpwardIcon sx={{ fontSize: 14 }} />,
    })
  }
  if (trading.status === 'WaitDeal') {
    badges.push({ variant: 'waiting', label: 'Ожидание сделки' })
  }
  if (!hasMyBid) {
    badges.push({ variant: 'neutral', label: 'Моей ставки нет' })
  }

  return badges.slice(0, MAX_SECONDARY_BADGES)
}

interface AuctionCardProps {
  auction: AuctionListItem
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { main, route, cargo, trading } = auction
  const hasMyBid = Boolean(trading.your?.bet)
  const canBid = trading.can_set_bet
  const primaryBadge = getPrimaryBadge(auction)
  const secondaryBadges = getSecondaryBadges(auction, hasMyBid)

  const goToDetails = () =>
    navigate({ to: '/auctions/$auctionId', params: { auctionId: main.order_uid } })
  const goToBid = () =>
    navigate({ to: '/auctions/$auctionId/bid', params: { auctionId: main.order_uid } })
  const prefetchDetails = () => queryClient.prefetchQuery(auctionQueryOptions(main.order_uid))

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: '12px',
        bgcolor: hasMyBid ? cardTokens.participatingBg : 'transparent',
        boxShadow: 4,
        cursor: 'pointer',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        '&:hover': {
          bgcolor: hasMyBid ? cardTokens.participatingBg : 'action.hover',
          borderColor: 'primary.main',
        },
      }}
      onClick={goToDetails}
      onMouseEnter={prefetchDetails}
      onFocus={prefetchDetails}
    >
      <Stack sx={{ px: { xs: 2, sm: 3 }, pt: 2, pb: 1.5 }} spacing={1.5}>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            rowGap: 1,
          }}
        >
          <Typography variant="subtitle1" component="h3" sx={{ color: 'text.primary' }}>
            Заявка № {main.cargo_num}
          </Typography>
          {primaryBadge && <StatusBadge tone="solid" {...primaryBadge} />}
        </Stack>

        {secondaryBadges.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
            {secondaryBadges.map((badge) => (
              <StatusBadge key={badge.label} tone="outline" {...badge} />
            ))}
          </Stack>
        )}

        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
            {route.load.city}
          </Typography>
          <EastIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
            {route.unload.city}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}
        >
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Погрузка {formatDate(route.load.date)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Выгрузка {formatDate(route.unload.date)}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {cargo.name} · {cargo.weight} т · {cargo.volume} м³ · {cargo.body_type}
        </Typography>
      </Stack>

      <Divider />

      <Stack
        direction="row"
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1.5,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          rowGap: 1.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: { xs: 22, sm: 24 }, fontWeight: 500, color: 'text.primary' }}>
            {trading.price?.current != null ? `${trading.price.current} ₽` : '—'}
          </Typography>
          {main.price_per_km != null && (
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
              {main.price_per_km} ₽/км
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1}>
          {canBid && (
            <AppButton
              size="medium"
              sx={{ minHeight: 40 }}
              onClick={(e) => {
                e.stopPropagation()
                goToBid()
              }}
            >
              Сделать ставку
            </AppButton>
          )}
          <AppButton
            variant="outlined"
            size="medium"
            sx={{ minHeight: 40 }}
            onClick={(e) => {
              e.stopPropagation()
              goToDetails()
            }}
          >
            Детали
          </AppButton>
        </Stack>
      </Stack>
    </Paper>
  )
}
