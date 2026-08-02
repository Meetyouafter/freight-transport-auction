import { Paper, Typography } from '@mui/material'
import { cardTokens, surfaceTokens } from '@shared/theme/tokens'

interface SectionCardProps {
  title: string
  children: React.ReactNode
}

/** The bordered, titled card wrapper shared by all `auction-details` sections. */
export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        boxShadow: surfaceTokens.cardShadow,
        bgcolor: cardTokens.participatingBg,
      }}
    >
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  )
}
