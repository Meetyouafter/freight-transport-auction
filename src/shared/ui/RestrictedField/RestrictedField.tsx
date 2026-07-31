import LockIcon from '@mui/icons-material/LockOutlined'
import { Box, Typography } from '@mui/material'
import { colorTokens } from '@shared/theme/tokens'

interface RestrictedFieldProps {
  reason: string
}

/**
 * Единая заглушка для данных, скрытых по правилам аукциона (`hide_bets_history`,
 * `hide_points_address_and_contacts`, `no_view_cargo_price`, disabled `can_set_bet`).
 * Один визуальный язык, чтобы пользователь не путал скрытые данные с ошибкой загрузки.
 */
export function RestrictedField({ reason }: RestrictedFieldProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colorTokens.moss }}>
      <LockIcon sx={{ fontSize: 14 }} />
      <Typography variant="caption">{reason}</Typography>
    </Box>
  )
}
