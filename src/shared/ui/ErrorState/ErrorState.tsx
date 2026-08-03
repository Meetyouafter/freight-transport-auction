import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import { Box, Stack, Typography } from '@mui/material'
import { Link, useLocation } from '@tanstack/react-router'
import { ROUTES } from '@shared/config/routes'
import { AppButton } from '../AppButton/AppButton'

interface ErrorStateProps {
  title?: string
  description?: string
}

export function ErrorState({
  title = 'Возникла ошибка.',
  description = 'Наши разработчики уже занимаются решением проблемы.',
}: ErrorStateProps) {
  const { pathname } = useLocation()
  const isHome = pathname === ROUTES.home

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
      <Stack spacing={1} useFlexGap sx={{ alignItems: 'center' }}>
        <ErrorOutlineIcon color="error" fontSize="large" />
        <Typography variant="subtitle1">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
        {isHome ? (
          <AppButton onClick={() => window.location.reload()} size="large" sx={{ mt: 2 }}>
            Обновить страницу
          </AppButton>
        ) : (
          <AppButton component={Link} to={ROUTES.home} size="large" sx={{ mt: 2 }}>
            Вернуться на главную
          </AppButton>
        )}
      </Stack>
    </Box>
  )
}
