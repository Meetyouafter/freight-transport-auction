import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Container, LinearProgress, Pagination, Stack, Typography } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { listAuctions } from '@entities/auction'
import { ROUTES } from '@shared/config/routes'
import { EmptyState, ErrorState, PerPageSelect } from '@shared/ui'
import { AuctionCard } from '@widgets/auction-card'
import { DEFAULT_PAGE_SIZE, PER_PAGE_OPTIONS } from '../model/constants'
import { MyBetsListSkeleton } from './MyBetsListSkeleton'

export function MyBetsPage() {
  const navigate = useNavigate({ from: ROUTES.myBets })
  const search = useSearch({ from: ROUTES.myBetsId })
  const page = search.page ?? 1
  const perPage = (search.per_page ?? DEFAULT_PAGE_SIZE) as (typeof PER_PAGE_OPTIONS)[number]
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
        <Box sx={{ mt: 3 }}>
          {isRefetching && <LinearProgress sx={{ mb: 2 }} />}

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

            {data.meta.total >= 10 && (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ alignItems: 'center', justifyContent: 'center', mt: 3 }}
              >
                <Pagination
                  count={data.meta.last_page}
                  page={page}
                  onChange={(_, value) =>
                    navigate({ search: (prev) => ({ ...prev, page: value }) })
                  }
                  color="primary"
                  disabled={isRefetching}
                />
                <PerPageSelect
                  options={PER_PAGE_OPTIONS}
                  value={perPage}
                  onChange={(value) =>
                    navigate({ search: (prev) => ({ ...prev, per_page: value, page: undefined }) })
                  }
                  disabled={isRefetching}
                />
              </Stack>
            )}
          </Box>
        </Box>
      )}
    </Container>
  )
}
