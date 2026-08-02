import SearchOffIcon from '@mui/icons-material/SearchOffOutlined'
import { Container, Stack, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'
import { ROUTES } from '@shared/config/routes'
import { AppButton } from '@shared/ui'

export function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Stack spacing={2} useFlexGap sx={{ alignItems: 'center', textAlign: 'center' }}>
        <SearchOffIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
        <Typography variant="h4" component="h1">
          Страница не найдена
        </Typography>
        <Typography color="text.secondary">
          Такой страницы не существует или она была перемещена.
        </Typography>
        <AppButton component={Link} to={ROUTES.home} size="large" sx={{ mt: 2 }}>
          Вернуться к списку аукционов
        </AppButton>
      </Stack>
    </Container>
  )
}
