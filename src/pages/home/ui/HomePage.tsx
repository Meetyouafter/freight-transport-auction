import {
  Box,
  Container,
  Divider,
  LinearProgress,
  Pagination,
  Stack,
  Typography,
} from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { listAuctions } from '@entities/auction'
import {
  AuctionFiltersPanel,
  filtersToSearch,
  mapFiltersToRequest,
  searchToFilters,
} from '@features/auction-filters'
import { ROUTES } from '@shared/config/routes'
import { usePagination } from '@shared/lib/pagination/usePagination'
import { EmptyState, ErrorState, PerPageSelect } from '@shared/ui'
import { AuctionCard } from '@widgets/auction-card'
import { DEFAULT_PAGE_SIZE, PER_PAGE_OPTIONS } from '../model/constants'
import { AuctionListSkeleton } from './AuctionListSkeleton'

export function HomePage() {
  const navigate = useNavigate({ from: ROUTES.home })
  const search = useSearch({ from: ROUTES.home })
  const filterValues = searchToFilters(search)
  const appliedFilters = mapFiltersToRequest(filterValues)
  const { page, perPage, setPage, changePerPage, resetPage } = usePagination<
    (typeof PER_PAGE_OPTIONS)[number]
  >({ defaultPerPage: DEFAULT_PAGE_SIZE })
  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ['auctions', page, perPage, appliedFilters],
    queryFn: ({ signal }) => listAuctions({ ...appliedFilters, page, per_page: perPage }, signal),
    placeholderData: keepPreviousData,
  })
  const isRefetching = isFetching && !isPending

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 1 }}>
        <Box
          component={Link}
          to={ROUTES.myBets}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 600,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Мои ставки
          </Typography>
        </Box>
      </Stack>

      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        Активные аукционы
      </Typography>

      <AuctionFiltersPanel
        values={filterValues}
        onApply={(values) => {
          navigate({ search: filtersToSearch(values) })
          resetPage()
        }}
        onReset={() => {
          navigate({ search: {} })
          resetPage()
        }}
      />

      <Divider sx={{ mt: 3 }} />

      {isPending && (
        <Box sx={{ mt: 3 }}>
          <AuctionListSkeleton />
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
            {data.data.length === 0 && (
              <EmptyState
                text={
                  Object.values(appliedFilters).some((value) => value !== undefined)
                    ? 'На текущий момент нет открытых аукционов, соответствующих выбранным фильтрам'
                    : 'На текущий момент нет открытых аукционов'
                }
              />
            )}

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
            )}
          </Box>
        </Box>
      )}
    </Container>
  )
}
