import { Box, CircularProgress, useTheme } from '@mui/material'

interface LoaderProps {
  /** Covers the whole viewport as a fixed overlay instead of centering within its parent. */
  fullScreen?: boolean
  size?: number
}

export function Loader({ fullScreen = false, size = 56 }: LoaderProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: fullScreen ? 'fixed' : 'relative',
        inset: fullScreen ? 0 : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: fullScreen ? undefined : 240,
        zIndex: fullScreen ? theme.zIndex.modal - 1 : undefined,
      }}
    >
      <CircularProgress size={size} thickness={4} />
    </Box>
  )
}
