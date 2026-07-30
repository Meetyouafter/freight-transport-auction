import { createTheme } from '@mui/material/styles'
import { paletteTokens, shapeTokens, spacingTokenBaseUnit } from './tokens'

export const theme = createTheme({
  palette: {
    mode: 'light',
    ...paletteTokens,
  },
  shape: {
    borderRadius: shapeTokens.borderRadius,
  },
  spacing: spacingTokenBaseUnit,
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
  },
})
