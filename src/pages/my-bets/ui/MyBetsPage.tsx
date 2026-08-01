import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Container, LinearProgress, Pagination, Stack, Typography } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { listAuctions } from '@entities/auction'
import { ROUTES } from '@shared/config/routes'
import { usePagination } from '@shared/lib/pagination/usePagination'
import { EmptyState, ErrorState, PerPageSelect } from '@shared/ui'
import { AuctionCard } from '@widgets/auction-card'
import { DEFAULT_PAGE_SIZE, PER_PAGE_OPTIONS } from '../model/constants'
import { MyBetsListSkeleton } from './MyBetsListSkeleton'

export function MyBetsPage() {
  const { page, perPage, setPage, changePerPage } = usePagination<
    (typeof PER_PAGE_OPTIONS)[number]
  >({ defaultPerPage: DEFAULT_PAGE_SIZE })
  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ['auctions', 'my-bets', page, perPage],
    queryFn: ({ signal }) => listAuctions({ is_bidder: true, page, per_page: perPage }, signal),
    placeholderData: keepPreviousData,
  })
  const isRefetching = isFetching && !isPending

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Box
          component={Link}
          to={ROUTES.home}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2">К списку аукционов</Typography>
        </Box>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        Мои ставки
      </Typography>

      {isPending && (
        <Box sx={{ mt: 3 }}>
          <MyBetsListSkeleton />
        </Box>
      )}
      {!isPending && isError && <ErrorState />}

      {!isPending && !isError && data && (
        <Box sx={{ position: 'relative', mt: 3 }}>
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
            {data.data.length === 0 && <EmptyState text="Вы пока не участвовали в аукционах" />}

            {data.data.length > 0 && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Показано {data.meta.from}–{data.meta.to} из {data.meta.total} заявок
                </Typography>
                <Stack spacing={2}>
                  {data.data.map((auction) => (
                    <AuctionCard key={auction.main.order_uid} auction={auction} />
                  ))}
                </Stack>
              </>
            )}

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ alignItems: 'center', justifyContent: 'center', mt: 3 }}
            >
              <Pagination
                count={data.meta.last_page}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                disabled={isRefetching}
              />
              <PerPageSelect
                options={PER_PAGE_OPTIONS}
                value={perPage}
                onChange={changePerPage}
                disabled={isRefetching}
              />
            </Stack>
          </Box>
        </Box>
      )}
    </Container>
  )
}
