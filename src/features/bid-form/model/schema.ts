import { z } from 'zod'

export const bidFormSchema = z.object({
  price: z.number().positive('Ставка должна быть больше 0'),
})

export type BidFormValues = z.infer<typeof bidFormSchema>

interface BidBounds {
  min: number | null
  max: number | null
  step: number | null
}

/** Builds a validation schema against the auction's own min/max/step trading bounds. */
export function createBidFormSchema({ min, max, step }: BidBounds) {
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
}
