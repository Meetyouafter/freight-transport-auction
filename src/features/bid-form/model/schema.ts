import { z } from 'zod'

export const bidFormSchema = z.object({
  amount: z.number().positive('Bid must be greater than 0'),
  comment: z.string().max(280, 'Comment is too long').optional(),
})

export type BidFormValues = z.infer<typeof bidFormSchema>
