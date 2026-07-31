import { List, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { listBets } from '@entities/bet'
import { formatDateTime } from '@shared/lib/format/formatDate'
import { formatPrice } from '@shared/lib/format/formatPrice'
import { EmptyState, RestrictedField, SectionCard } from '@shared/ui'

interface BetsHistorySectionProps {
  auctionUuid: string
  hidden: boolean
}

export function BetsHistorySection({ auctionUuid, hidden }: BetsHistorySectionProps) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['auction', auctionUuid, 'bets'],
    queryFn: () => listBets(auctionUuid),
    enabled: !hidden,
  })

  return (
    <SectionCard title="История ставок">
      {hidden && <RestrictedField reason="История ставок скрыта организатором" />}

      {!hidden && isPending && (
        <Stack spacing={1}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="50%" />
        </Stack>
      )}

      {!hidden && isError && (
        <Typography variant="body2" color="error">
          Не удалось загрузить историю ставок
        </Typography>
      )}

      {!hidden &&
        !isPending &&
        !isError &&
        (data.bets.length === 0 ? (
          <EmptyState text="Ставок пока нет" />
        ) : (
          <List disablePadding>
            {data.bets.map((bet) => (
              <ListItem
                key={bet.id}
                disableGutters
                divider
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(bet.created_at)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatPrice(bet.price_with_vat)}
                </Typography>
              </ListItem>
            ))}
          </List>
        ))}
    </SectionCard>
  )
}
