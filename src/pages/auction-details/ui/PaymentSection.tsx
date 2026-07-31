import { Paper, Stack, Typography } from '@mui/material'
import { PAYMENT_DELAY_TYPE_LABELS, type AuctionShowResponse } from '@entities/auction'

interface PaymentSectionProps {
  payment: AuctionShowResponse['payment']
}

export function PaymentSection({ payment }: PaymentSectionProps) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 4 }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        Условия оплаты
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Форма расчёта: {payment.form}
        </Typography>
        {payment.delay != null && (
          <Typography variant="body2" color="text.secondary">
            Отсрочка платежа: {payment.delay}{' '}
            {PAYMENT_DELAY_TYPE_LABELS[payment.delay_type ?? 'Unknown']}
          </Typography>
        )}
        {payment.condition && (
          <Typography variant="body2" color="text.secondary">
            Условие оплаты: {payment.condition}
          </Typography>
        )}
        {payment.prepay != null && payment.prepay !== '0' && (
          <Typography variant="body2" color="text.secondary">
            Предоплата: {payment.prepay} ₽
          </Typography>
        )}
      </Stack>
    </Paper>
  )
}
