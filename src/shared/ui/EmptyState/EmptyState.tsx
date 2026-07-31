import { Box, Typography } from '@mui/material'

interface EmptyStateProps {
  text: string
}

export function EmptyState({ text }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        minHeight: 240,
        p: 3,
      }}
    >
      <Typography variant="h6" color="text.secondary">
        {text}
      </Typography>
    </Box>
  )
}
