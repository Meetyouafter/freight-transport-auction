import {
  Box,
  Container,
  LinearProgress,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Typography,
} from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { listAuctions } from '@entities/auction'
import {
  AuctionFiltersPanel,
  filtersToSearch,
  mapFiltersToRequest,
  searchToFilters,
} from '@features/auction-filters'
import { AppButton, EmptyState, ErrorState } from '@shared/ui'
import { AuctionCard } from '@widgets/auction-card'
import { AuctionListSkeleton } from './AuctionListSkeleton'

const PER_PAGE_OPTIONS = [10, 20, 50, 100] as const

export function HomePage() {
  const navigate = useNavigate({ from: '/' })
  const search = useSearch({ from: '/' })
  const filterValues = searchToFilters(search)
  const appliedFilters = mapFiltersToRequest(filterValues)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState<(typeof PER_PAGE_OPTIONS)[number]>(10)
  const [perPageMenuAnchor, setPerPageMenuAnchor] = useState<HTMLElement | null>(null)
  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ['auctions', page, perPage, appliedFilters],
    queryFn: ({ signal }) => listAuctions({ ...appliedFilters, page, per_page: perPage }, signal),
    placeholderData: keepPreviousData,
  })
  const isRefetching = isFetching && !isPending

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        Активные аукционы
      </Typography>

      <AuctionFiltersPanel
        values={filterValues}
        onApply={(values) => {
          navigate({ search: filtersToSearch(values) })
          setPage(1)
        }}
        onReset={() => {
          navigate({ search: {} })
          setPage(1)
        }}
      />

      {isPending && (
        <Box sx={{ mt: 3 }}>
          <AuctionListSkeleton />
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
              <Stack spacing={2}>
                {data.data.map((auction) => (
                  <AuctionCard key={auction.main.order_uid} auction={auction} />
                ))}
              </Stack>
            )}

            {data.data.length > 0 && data.meta.total >= 10 && data.meta.last_page > 1 && (
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
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    На странице
                  </Typography>
                  <AppButton
                    id="per-page-button"
                    size="small"
                    disabled={isRefetching}
                    onClick={(event) => setPerPageMenuAnchor(event.currentTarget)}
                  >
                    {perPage}
                  </AppButton>
                  <Menu
                    anchorEl={perPageMenuAnchor}
                    open={Boolean(perPageMenuAnchor)}
                    onClose={() => setPerPageMenuAnchor(null)}
                    slotProps={{
                      paper: {
                        sx: {
                          bgcolor: 'background.paper',
                          border: 1,
                          borderColor: 'divider',
                          boxShadow: 4,
                        },
                      },
                      list: {
                        'aria-labelledby': 'per-page-button',
                      },
                    }}
                  >
                    {PER_PAGE_OPTIONS.map((option) => (
                      <MenuItem
                        key={option}
                        selected={option === perPage}
                        onClick={() => {
                          setPerPage(option)
                          setPage(1)
                          setPerPageMenuAnchor(null)
                        }}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>
                </Stack>
              </Stack>
            )}
          </Box>
        </Box>
      )}
    </Container>
  )
}
