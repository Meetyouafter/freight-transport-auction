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
    defaultValues: { amount: 0, comment: '' },
  })

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Bid amount, USD"
        type="number"
        {...register('amount', { valueAsNumber: true })}
        error={Boolean(errors.amount)}
        helperText={errors.amount?.message}
      />
      <TextField
        label="Comment"
        multiline
        minRows={2}
        {...register('comment')}
        error={Boolean(errors.comment)}
        helperText={errors.comment?.message}
      />
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        Place bid
      </Button>
    </Stack>
  )
}
