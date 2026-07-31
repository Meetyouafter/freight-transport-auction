import { z } from 'zod'

export const bidFormSchema = z.object({
  price: z.number().positive('Ставка должна быть больше 0'),
})

export type BidFormValues = z.infer<typeof bidFormSchema>
