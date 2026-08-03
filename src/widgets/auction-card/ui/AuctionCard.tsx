import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined'
import EastIcon from '@mui/icons-material/East'
import GavelIcon from '@mui/icons-material/Gavel'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import { Box, Divider, Paper, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { auctionQueryOptions, type AuctionListItem } from '@entities/auction'
import { ROUTES } from '@shared/config/routes'
import { formatDate } from '@shared/lib/format/formatDate'
import { formatPrice } from '@shared/lib/format/formatPrice'
import { surfaceTokens } from '@shared/theme/tokens'
import { AppButton, IconText } from '@shared/ui'
import { getPrimaryBadge, getSecondaryBadges } from '../model/badges'
import { getCardSurface } from '../model/cardSurface'
import { getPrimaryAction } from '../model/primaryAction'
import { StatusBadge } from './StatusBadge'

interface AuctionCardProps {
  auction: AuctionListItem
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { main, route, cargo, trading } = auction
  const hasMyBid = Boolean(trading.your?.bet)
  const surface = getCardSurface(trading.status_mobile)
  const primaryBadge = getPrimaryBadge(auction)
  const secondaryBadges = getSecondaryBadges(auction, hasMyBid)
  const primaryAction = getPrimaryAction(auction)

  const goToDetails = () =>
    navigate({ to: ROUTES.auctionDetails, params: { auctionId: main.order_uid } })
  const goToBid = () => navigate({ to: ROUTES.auctionBid, params: { auctionId: main.order_uid } })
  const prefetchDetails = () => queryClient.prefetchQuery(auctionQueryOptions(main.order_uid))

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: '12px',
        bgcolor: surface.bg,
        borderColor: surface.border,
        boxShadow: surfaceTokens.cardShadow,
        cursor: 'pointer',
        transition: 'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          bgcolor: surface.bg,
          borderColor: surface.borderHover,
          boxShadow: surfaceTokens.cardShadowHover,
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
          <IconText icon={<CalendarTodayIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}>
            Погрузка {formatDate(route.load.date)}
          </IconText>
          <IconText icon={<CalendarTodayIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}>
            Выгрузка {formatDate(route.unload.date)}
          </IconText>
        </Stack>

        <IconText
          icon={<LocalShippingOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
        >
          {cargo.name} · {cargo.weight} т · {cargo.volume} м³ · {cargo.body_type}
        </IconText>
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
            {formatPrice(trading.price?.current)}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 0.25 }}>
            {main.price_per_km != null && (
              <Typography variant="body2" sx={{ color: 'primary.dark', fontWeight: 700 }}>
                {main.price_per_km} ₽/км
              </Typography>
            )}
            {trading.price?.step != null && (
              <Typography variant="body2" color="text.secondary">
                Шаг {formatPrice(trading.price.step)}
              </Typography>
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <AppButton
            size="medium"
            startIcon={<GavelIcon />}
            sx={{ minHeight: 40 }}
            disabled={primaryAction.disabled}
            onClick={(e) => {
              e.stopPropagation()
              if (primaryAction.target === 'bid') goToBid()
              else goToDetails()
            }}
          >
            {primaryAction.label}
          </AppButton>
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
