import { z } from 'zod'

/** `AuctionType` component schema — used by `AuctionListItemMain.auc_type` and `AuctionShowMain.auc_type`. */
export const auctionTypeSchema = z.enum(['Request', 'Up', 'Down', 'FixPrice', 'Unknown'])
export type AuctionType = z.infer<typeof auctionTypeSchema>

/** `AuctionListRequest.auc_type` inline enum — a filter, has no `Unknown` option. */
export const auctionTypeFilterSchema = z.enum(['Request', 'Up', 'Down', 'FixPrice'])
export type AuctionTypeFilter = z.infer<typeof auctionTypeFilterSchema>

/** `AuctionStatus` component schema — the auction's own lifecycle status. */
export const auctionStatusSchema = z.enum([
  'Planning',
  'Auction',
  'DeterminateWinner',
  'WaitDeal',
  'InProgress',
  'Finished',
  'Stopped',
  'Canceled',
  'Unknown',
])
export type AuctionStatus = z.infer<typeof auctionStatusSchema>

/**
 * `TradingStatus` component schema — the current user's trading status.
 * Used by `AuctionShowTrading.status_mobile` and the `AuctionListRequest.status` filter.
 * Distinct from {@link listItemTradingStatusMobileSchema}, which has fewer values.
 */
export const tradingStatusSchema = z.enum([
  'NotParticipating',
  'Leading',
  'Losing',
  'OnPending',
  'Confirmed',
  'ChoosingWinner',
  'Winner',
  'Accepted',
  'Unknown',
])
export type TradingStatus = z.infer<typeof tradingStatusSchema>

/** `AuctionListItemTrading.status_mobile` inline enum — narrower than {@link tradingStatusSchema}. */
export const listItemTradingStatusMobileSchema = z.enum([
  'NotParticipating',
  'Leading',
  'Losing',
  'Winner',
  'Confirmed',
  'Unknown',
])
export type ListItemTradingStatusMobile = z.infer<typeof listItemTradingStatusMobileSchema>

/** `BidMeasurementType` component schema. */
export const bidMeasurementTypeSchema = z.enum(['PerRoute', 'PerKm', 'Unknown'])
export type BidMeasurementType = z.infer<typeof bidMeasurementTypeSchema>

/** `PaymentDelayType` component schema. */
export const paymentDelayTypeSchema = z.enum(['CalendarDays', 'WorkDays', 'Unknown'])
export type PaymentDelayType = z.infer<typeof paymentDelayTypeSchema>

/** `OperationType` component schema — route point kind. */
export const operationTypeSchema = z.enum(['Loading', 'Unloading', 'Unknown'])
export type OperationType = z.infer<typeof operationTypeSchema>
