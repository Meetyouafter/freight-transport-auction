import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { formatPrice } from '@shared/lib/format/formatPrice'
import { AppButton, RestrictedField } from '@shared/ui'
import { bidFormSchema, createBidFormSchema, type BidFormValues } from '../model/schema'

interface BidFormProps {
  onSubmit: (values: BidFormValues) => void
  min?: number | null
  max?: number | null
  step?: number | null
  defaultPrice?: number
  disabled?: boolean
  disabledReason?: string
  submitting?: boolean
}

function formatBoundsCaption(min?: number | null, max?: number | null, step?: number | null) {
  const parts: string[] = []

  if (step) parts.push(`Шаг ставки: ${step} ₽`)
  if (min != null && max != null) parts.push(`Диапазон: ${min}–${max} ₽`)
  else if (min != null) parts.push(`Минимум: ${min} ₽`)
  else if (max != null) parts.push(`Максимум: ${max} ₽`)

  return parts.join(' · ')
}

export function BidForm({
  onSubmit,
  min = null,
  max = null,
  step = null,
  defaultPrice = 0,
  disabled = false,
  disabledReason,
  submitting = false,
}: BidFormProps) {
  const [pendingValues, setPendingValues] = useState<BidFormValues | null>(null)
  const hasBounds = min != null || max != null || step != null
  const resolver = useMemo(
    () => zodResolver(hasBounds ? createBidFormSchema({ min, max, step }) : bidFormSchema),
    [hasBounds, min, max, step],
  )
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<BidFormValues>({
    resolver,
    mode: 'onChange',
    defaultValues: { price: defaultPrice },
  })

  if (disabled) {
    return <RestrictedField reason={disabledReason ?? 'Ставки недоступны'} />
  }

  const boundsCaption = formatBoundsCaption(min, max, step)

  return (
    <>
      <Stack
        component="form"
        spacing={1}
        onSubmit={handleSubmit((values) => setPendingValues(values))}
        noValidate
      >
        <TextField
          label="Ставка, ₽"
          type="number"
          slotProps={{
            htmlInput: { min: min ?? undefined, max: max ?? undefined, step: step ?? undefined },
          }}
          {...register('price', { valueAsNumber: true })}
          error={Boolean(errors.price)}
          helperText={errors.price?.message ?? boundsCaption}
        />
        <AppButton type="submit" disabled={isSubmitting || submitting || !isValid}>
          Сделать ставку
        </AppButton>
      </Stack>

      <Dialog open={pendingValues != null} onClose={() => setPendingValues(null)}>
        <DialogTitle>Подтвердите ставку</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы собираетесь сделать ставку {pendingValues && formatPrice(pendingValues.price)}.
            Действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingValues(null)}>Отмена</Button>
          <AppButton
            onClick={() => {
              if (pendingValues) onSubmit(pendingValues)
              setPendingValues(null)
            }}
          >
            Подтвердить
          </AppButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
