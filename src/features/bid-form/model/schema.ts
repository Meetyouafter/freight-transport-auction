import { z } from 'zod'
import type { AuctionType } from '@entities/auction'

export const bidFormSchema = z.object({
  price: z.number().positive('Ставка должна быть больше 0'),
})

export type BidFormValues = z.infer<typeof bidFormSchema>

interface BidBounds {
  min: number | null
  max: number | null
  step: number | null
  current?: number | null
  aucType?: AuctionType
}

export function createBidFormSchema({ min, max, step, current = null, aucType }: BidBounds) {
  return z
    .object({
      price: z.number().positive('Ставка должна быть больше 0'),
    })
    .refine((values) => min == null || values.price >= min, {
      message: min != null ? `Ставка не может быть меньше ${min} ₽` : undefined,
      path: ['price'],
    })
    .refine((values) => max == null || values.price <= max, {
      message: max != null ? `Ставка не может быть больше ${max} ₽` : undefined,
      path: ['price'],
    })
    .refine(
      (values) => {
        if (!step) return true
        const base = min ?? 0
        const steps = (values.price - base) / step

        return Math.abs(steps - Math.round(steps)) < 1e-6
      },
      { message: step ? `Ставка должна быть кратна шагу ${step} ₽` : undefined, path: ['price'] },
    )
    .refine((values) => aucType !== 'Up' || current == null || values.price > current, {
      message: current != null ? `Ставка должна быть выше текущей цены ${current} ₽` : undefined,
      path: ['price'],
    })
    .refine((values) => aucType !== 'Down' || current == null || values.price < current, {
      message: current != null ? `Ставка должна быть ниже текущей цены ${current} ₽` : undefined,
      path: ['price'],
    })
}
