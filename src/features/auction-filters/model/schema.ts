import { z } from 'zod'
import { auctionTypeFilterSchema, tradingStatusSchema } from '@entities/auction'
import { citySchema } from '@entities/city'

export const auctionFiltersFormSchema = z.object({
  cargo_num: z.string(),
  customer: z.string(),
  auc_type: z.array(auctionTypeFilterSchema),
  status: z.array(tradingStatusSchema),
  statuses: z.array(z.number().int()),
  body_types: z.array(z.string()),
  load_city: citySchema.nullable(),
  unload_city: citySchema.nullable(),
  load_date_from: z.string(),
  load_date_to: z.string(),
  price_from: z.string(),
  price_to: z.string(),
  is_favorite: z.boolean(),
  is_bidder: z.boolean(),
  is_available: z.boolean(),
})

export type AuctionFiltersFormValues = z.infer<typeof auctionFiltersFormSchema>

export const defaultAuctionFiltersFormValues: AuctionFiltersFormValues = {
  cargo_num: '',
  customer: '',
  auc_type: [],
  status: [],
  statuses: [],
  body_types: [],
  load_city: null,
  unload_city: null,
  load_date_from: '',
  load_date_to: '',
  price_from: '',
  price_to: '',
  is_favorite: false,
  is_bidder: false,
  is_available: false,
}
