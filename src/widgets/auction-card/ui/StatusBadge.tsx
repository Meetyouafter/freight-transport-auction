import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { statusTokens, type StatusTokenKey } from '@shared/theme/tokens'

interface StatusBadgeProps {
  variant: StatusTokenKey
  label: string
  icon?: ReactNode
  tone?: 'solid' | 'outline'
}

export function StatusBadge({ variant, label, icon, tone = 'solid' }: StatusBadgeProps) {
  const { fill, tint, text } = statusTokens[variant]

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        bgcolor: tone === 'solid' ? fill : tint,
        border: tone === 'outline' ? '1.5px solid' : 'none',
        borderColor: text,
        color: text,
        borderRadius: '20px',
        px: '12px',
        py: '9px',
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {label}
    </Box>
  )
}
