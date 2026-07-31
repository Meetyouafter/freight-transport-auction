import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, TextField } from '@mui/material'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
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
  const hasBounds = min != null || max != null || step != null
  const resolver = useMemo(
    () => zodResolver(hasBounds ? createBidFormSchema({ min, max, step }) : bidFormSchema),
    [hasBounds, min, max, step],
  )
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BidFormValues>({
    resolver,
    defaultValues: { price: defaultPrice },
  })

  if (disabled) {
    return <RestrictedField reason={disabledReason ?? 'Ставки недоступны'} />
  }

  const boundsCaption = formatBoundsCaption(min, max, step)

  return (
    <Stack component="form" spacing={1} onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Ставка, ₽"
        type="number"
        {...register('price', { valueAsNumber: true })}
        error={Boolean(errors.price)}
        helperText={errors.price?.message ?? boundsCaption}
      />
      <AppButton type="submit" disabled={isSubmitting || submitting}>
        Сделать ставку
      </AppButton>
    </Stack>
  )
}
