import { List, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { listBets } from '@entities/bet'
import { formatDateTime } from '@shared/lib/format/formatDate'
import { formatPrice } from '@shared/lib/format/formatPrice'
import { EmptyState, RestrictedField, SectionCard } from '@shared/ui'
import { StatusBadge } from '@widgets/auction-card'

interface BetsHistorySectionProps {
  auctionUuid: string
  hidden: boolean
}

export function BetsHistorySection({ auctionUuid, hidden }: BetsHistorySectionProps) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['auction', auctionUuid, 'bets', 'all'],
    queryFn: () => listBets(auctionUuid, true),
    enabled: !hidden,
  })

  const bets = data?.bets ?? []
  const participantsCount = new Set(bets.map((bet) => bet.organization_id)).size

  return (
    <SectionCard title="Ставки">
      {hidden && <RestrictedField reason="История ставок скрыта организатором" />}

      {!hidden && isPending && (
        <Stack spacing={1}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="50%" />
        </Stack>
      )}

      {!hidden && isError && (
        <Typography variant="body2" color="error">
          Не удалось загрузить ставки
        </Typography>
      )}

      {!hidden &&
        !isPending &&
        !isError &&
        (bets.length === 0 ? (
          <EmptyState text="Ставок пока нет" />
        ) : (
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              Участников: {participantsCount}
            </Typography>

            <List disablePadding>
              {bets.map((bet) => (
                <ListItem key={bet.id} disableGutters divider sx={{ display: 'block', py: 1.5 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      {bet.place != null && (
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          #{bet.place}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(bet.created_at)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      {bet.is_win && <StatusBadge variant="confirmed" label="Победитель" />}
                      {bet.is_counter && (
                        <StatusBadge tone="outline" variant="neutral" label="Встречная" />
                      )}
                      {bet.is_rejected && <StatusBadge variant="rejected" label="Отменена" />}
                    </Stack>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mt: 0.5 }}
                  >
                    <Typography variant="body2">
                      {bet.organization_name || 'Перевозчик не указан'}
                    </Typography>

                    <Stack sx={{ alignItems: 'flex-end' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatPrice(bet.price_with_vat)} с НДС
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatPrice(bet.price_no_vat)} без НДС
                      </Typography>
                    </Stack>
                  </Stack>

                  {bet.is_rejected && bet.cancel_reason && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                      Причина отмены: {bet.cancel_reason}
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          </Stack>
        ))}
    </SectionCard>
  )
}
