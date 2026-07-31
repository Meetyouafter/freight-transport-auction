import { List, ListItem, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { listBets } from '@entities/bet'
import { EmptyState, RestrictedField } from '@shared/ui'

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
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 4 }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        История ставок
      </Typography>

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
                  {dayjs(bet.created_at).format('DD.MM.YYYY HH:mm')}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {bet.price_with_vat} ₽
                </Typography>
              </ListItem>
            ))}
          </List>
        ))}
    </Paper>
  )
}
