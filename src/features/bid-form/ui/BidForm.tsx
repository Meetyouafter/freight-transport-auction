import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { bidFormSchema, type BidFormValues } from '../model/schema'

interface BidFormProps {
  onSubmit: (values: BidFormValues) => void
}

export function BidForm({ onSubmit }: BidFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BidFormValues>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: { price: 0 },
  })

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Ставка, ₽"
        type="number"
        {...register('price', { valueAsNumber: true })}
        error={Boolean(errors.price)}
        helperText={errors.price?.message}
      />
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        Сделать ставку
      </Button>
    </Stack>
  )
}
