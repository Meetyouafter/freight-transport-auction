import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ruRU } from '@mui/x-date-pickers/locales'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import 'dayjs/locale/ru'
import type { PropsWithChildren } from 'react'
import { queryClient } from '@shared/api/query-client'
import { theme } from '@shared/theme'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="ru"
          localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          <CssBaseline />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
