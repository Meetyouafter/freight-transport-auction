import { Stack, Typography } from '@mui/material'
import { PAYMENT_DELAY_TYPE_LABELS, type AuctionShowResponse } from '@entities/auction'
import { SectionCard } from '@shared/ui'

interface PaymentSectionProps {
  payment: AuctionShowResponse['payment']
}

export function PaymentSection({ payment }: PaymentSectionProps) {
  return (
    <SectionCard title="Условия оплаты">
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
    </SectionCard>
  )
}
