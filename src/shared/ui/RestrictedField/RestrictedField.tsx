import LockIcon from '@mui/icons-material/LockOutlined'
import { Box, Typography } from '@mui/material'
import { colorTokens } from '@shared/theme/tokens'

interface RestrictedFieldProps {
  reason: string
}

export function RestrictedField({ reason }: RestrictedFieldProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colorTokens.moss }}>
      <LockIcon sx={{ fontSize: 14 }} />
      <Typography variant="caption">{reason}</Typography>
    </Box>
  )
}
