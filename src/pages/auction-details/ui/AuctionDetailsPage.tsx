import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Container, Drawer, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { getAuction } from '@entities/auction'
import { ErrorState } from '@shared/ui'
import { StatusBadge } from '@widgets/auction-card'
import { dealStatusBadge, participationBadge } from '../model/statusMaps'
import { BetsHistorySection } from './BetsHistorySection'
import { CargoSection } from './CargoSection'
import { OrganizerSection } from './OrganizerSection'
import { PaymentSection } from './PaymentSection'
import { RouteSection } from './RouteSection'
import { TradingSidebar } from './TradingSidebar'

function DetailsSkeleton() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="text" width="30%" height={40} />
      <Skeleton variant="rounded" height={160} />
      <Skeleton variant="rounded" height={160} />
      <Skeleton variant="rounded" height={120} />
    </Stack>
  )
}

export function AuctionDetailsPage() {
  const { auctionId } = useParams({ from: '/auctions/$auctionId/' })
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { data, isPending, isError } = useQuery({
    queryKey: ['auction', auctionId],
    queryFn: () => getAuction(auctionId),
  })

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorState title="Не удалось загрузить аукцион" />
      </Container>
    )
  }

  if (isPending) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <DetailsSkeleton />
      </Container>
    )
  }

  const { main, organizer, contacts, cargo, trading, payment, routes } = data
  const firstPointCargo = routes[0]?.cargo ?? null
  const ownBadge = participationBadge(trading.status_mobile)

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: { xs: 12, md: 4 } }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Box>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">К списку аукционов</Typography>
          </Link>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="h5" component="h1">
            Заявка № {main.cargo_num}
          </Typography>
          <StatusBadge tone="solid" {...dealStatusBadge(trading.status)} />
          {ownBadge && <StatusBadge tone="outline" {...ownBadge} />}
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Stack spacing={3} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <RouteSection
            points={routes}
            hideAddressAndContacts={trading.hide_points_address_and_contacts}
          />
          <CargoSection
            cargo={cargo}
            cargoName={firstPointCargo?.name ?? null}
            cargoWeight={firstPointCargo?.weight ?? null}
            cargoVolume={firstPointCargo?.volume ?? null}
            showPrice={!trading.no_view_cargo_price}
          />
          <PaymentSection payment={payment} />
          <OrganizerSection
            organizer={organizer}
            contacts={contacts}
            hideContacts={trading.hide_points_address_and_contacts}
          />
          <BetsHistorySection auctionUuid={main.order_uid} hidden={trading.hide_bets_history} />
        </Stack>

        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: 360,
            flexShrink: 0,
            position: 'sticky',
            top: 88,
            p: 3,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 4,
          }}
        >
          <TradingSidebar auctionUuid={main.order_uid} trading={trading} />
        </Box>
      </Stack>

      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 2,
          py: 1.5,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          boxShadow: 4,
          cursor: 'pointer',
        }}
        onClick={() => setMobileSidebarOpen(true)}
      >
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
            {trading.price.current != null ? `${trading.price.current} ₽` : '—'}
          </Typography>
        </Box>
        <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
          {trading.can_set_bet ? 'Сделать ставку' : 'Подробнее о торгах'}
        </Typography>
      </Box>

      <Drawer
        anchor="bottom"
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        slotProps={{ paper: { sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, p: 3 } } }}
      >
        <TradingSidebar auctionUuid={main.order_uid} trading={trading} />
      </Drawer>
    </Container>
  )
}
