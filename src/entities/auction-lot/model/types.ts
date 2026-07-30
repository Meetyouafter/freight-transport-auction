import { z } from 'zod'

export const auctionLotSchema = z.object({
  id: z.string(),
  title: z.string(),
  origin: z.string(),
  destination: z.string(),
  currentBid: z.number().nonnegative(),
  currency: z.literal('USD'),
})

export type AuctionLot = z.infer<typeof auctionLotSchema>

export const auctionLotListSchema = z.array(auctionLotSchema)
