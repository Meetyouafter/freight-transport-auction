import { Stack, Typography } from '@mui/material'
import type { AuctionShowTrading } from '@entities/auction'
import { StatusBadge } from '@widgets/auction-card'
import { myBetStatus } from '../model/statusMaps'

interface MyBetStatusProps {
  trading: AuctionShowTrading
}

export function MyBetStatus({ trading }: MyBetStatusProps) {
  const status = myBetStatus(trading)

  return (
    <Stack spacing={0.5}>
      <StatusBadge variant={status.variant} label={status.label} tone="solid" />
      {status.hint && (
        <Typography variant="caption" color="text.secondary">
          {status.hint}
        </Typography>
      )}
    </Stack>
  )
}
