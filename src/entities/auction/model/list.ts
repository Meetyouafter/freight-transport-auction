import { z } from 'zod'
import { docsSchema, loadingTypesSchema } from './cargo'
import {
  auctionStatusSchema,
  auctionTypeFilterSchema,
  auctionTypeSchema,
  bidMeasurementTypeSchema,
  listItemTradingStatusMobileSchema,
  tradingStatusSchema,
} from './enums'

/** `AuctionListItemMain` — main data block of a list item. */
export const auctionListItemMainSchema = z.object({
  id: z.number().int(),
  cargo_num: z.string(),
  cargo_date: z.string(),
  auc_type: auctionTypeSchema,
  order_uid: z.string().uuid(),
  created_at: z.string(),
  priority_sort: z.number().int(),
  is_assembly: z.boolean(),
  price_per_km: z.number().nullable(),
})

/** `AuctionListItemOrganizer`. */
export const auctionListItemOrganizerSchema = z.object({
  subscriber_id: z.number().int(),
  organization_id: z.number().int(),
  organization_name: z.string(),
  organization_inn: z.string(),
  organization_kpp: z.string(),
  is_hide_organization: z.boolean(),
})

/** `AuctionListItemRoutePoint` — one endpoint (load/unload) of the combined route. */
export const auctionListItemRoutePointSchema = z.object({
  city: z.string(),
  address: z.string(),
  date: z.string(),
  city_gc_id: z.number().int(),
  points_count: z.number().int(),
})

/** `AuctionListItemRoute`. */
export const auctionListItemRouteSchema = z.object({
  load: auctionListItemRoutePointSchema,
  unload: auctionListItemRoutePointSchema,
})

/** `AuctionListItemCargoCar` — vehicle requirements; parent `car` is null when unset. */
export const auctionListItemCargoCarSchema = z.object({
  type: z.string(),
  weight: z.number(),
  volume: z.number(),
  width: z.number(),
  length: z.number(),
  height: z.number(),
})

/** `AuctionListItemCargo`. */
export const auctionListItemCargoSchema = z.object({
  name: z.string(),
  weight: z.number(),
  volume: z.number(),
  body_type: z.string(),
  truck_count: z.number().int(),
  is_cargo: z.boolean(),
  is_international: z.boolean().nullable(),
  containered: z.boolean().nullable(),
  incoterms: z.string().nullable(),
  conics: z.number().int().nullable(),
  belts: z.number().int().nullable(),
  adr: z.number().int().nullable(),
  coupling: z.boolean().nullable(),
  air_pass: z.boolean().nullable(),
  low_loader: z.boolean().nullable(),
  additional_load: z.boolean().nullable(),
  temp_from: z.number().int().nullable(),
  temp_to: z.number().int().nullable(),
  loading_types: loadingTypesSchema,
  docs: docsSchema,
  car: auctionListItemCargoCarSchema.nullable(),
})

/** `AuctionListItemPayment`. */
export const auctionListItemPaymentSchema = z.object({
  form: z.string(),
  currency_code: z.string(),
  consignor: z.string().nullable(),
  consignee: z.string().nullable(),
})

/** `AuctionListItemTradingPrice`. */
export const auctionListItemTradingPriceSchema = z.object({
  start: z.number(),
  current: z.number(),
  current_no_vat: z.number(),
  step: z.number().nullable().optional(),
})

/** `AuctionListItemTradingYour`. */
export const auctionListItemTradingYourSchema = z.object({
  bet: z.boolean(),
  last_bet: z.number().nullable(),
})

/** `AuctionListItemTrading`. */
export const auctionListItemTradingSchema = z.object({
  status: auctionStatusSchema,
  status_mobile: listItemTradingStatusMobileSchema,
  start_time: z.string(),
  stop_time: z.string(),
  bid_measurement_type: bidMeasurementTypeSchema.nullable(),
  can_set_bet: z.boolean(),
  allow_counter_bets: z.boolean(),
  hide_points_address_and_contacts: z.boolean(),
  direction: z.string().nullable(),
  comment: z.string().nullable(),
  is_bidder: z.boolean(),
  is_available: z.boolean(),
  is_accredited: z.boolean(),
  is_favorite: z.boolean(),
  is_last_bet_with_vat: z.boolean().nullable(),
  red_bet_with_vat: z.boolean(),
  red_bet_no_vat: z.boolean(),
  price: auctionListItemTradingPriceSchema.nullable(),
  your: auctionListItemTradingYourSchema.nullable(),
})

/** `AuctionListItem` — main data object of the auctions list. */
export const auctionListItemSchema = z.object({
  main: auctionListItemMainSchema,
  organizer: auctionListItemOrganizerSchema,
  route: auctionListItemRouteSchema,
  cargo: auctionListItemCargoSchema,
  trading: auctionListItemTradingSchema,
  payment: auctionListItemPaymentSchema,
})
export type AuctionListItem = z.infer<typeof auctionListItemSchema>

/** `AuctionListMeta` — upstream pagination metadata. */
export const auctionListMetaSchema = z.object({
  current_page: z.number().int(),
  from: z.number().int(),
  last_page: z.number().int(),
  per_page: z.number().int(),
  to: z.number().int(),
  total: z.number().int(),
})
export type AuctionListMeta = z.infer<typeof auctionListMetaSchema>

/** `AuctionListResponseBase`. */
export const auctionListResponseSchema = z.object({
  data: z.array(auctionListItemSchema),
  meta: auctionListMetaSchema,
})
export type AuctionListResponse = z.infer<typeof auctionListResponseSchema>

/** `AuctionListRequest` — filters and pagination for `POST /auctions/list`. */
export const auctionListRequestSchema = z.object({
  page: z.number().int().optional(),
  per_page: z.number().int().optional(),
  is_oldest: z.boolean().nullable().optional(),
  sort: z
    .record(z.string(), z.enum(['asc', 'desc']))
    .nullable()
    .optional(),
  status: z.array(tradingStatusSchema).optional(),
  mobile_statuses: z.array(z.number().int()).optional(),
  statuses: z.array(z.number().int()).optional(),
  cargo_num: z.string().optional(),
  weight_from: z.number().optional(),
  weight_to: z.number().optional(),
  volume_from: z.number().optional(),
  volume_to: z.number().optional(),
  body_types: z.array(z.string()).optional(),
  form_type: z.string().nullable().optional(),
  is_international_shipment: z.boolean().optional(),
  load_city: z.string().optional(),
  load_gc_id: z.number().int().optional(),
  load_range: z.number().int().optional(),
  unload_city: z.string().optional(),
  unload_gc_id: z.number().int().optional(),
  unload_range: z.number().int().optional(),
  load_date_from: z.string().optional(),
  load_date_to: z.string().optional(),
  unload_date_from: z.string().optional(),
  unload_date_to: z.string().optional(),
  create_date_from: z.string().optional(),
  create_date_to: z.string().optional(),
  start_time_from: z.string().optional(),
  start_time_to: z.string().optional(),
  stop_time_from: z.string().optional(),
  stop_time_to: z.string().optional(),
  is_available: z.boolean().optional(),
  is_favorite: z.boolean().optional(),
  is_bidder: z.boolean().optional(),
  customer: z.string().optional(),
  customer_ids: z.array(z.number().int()).optional(),
  contractor: z.string().nullable().optional(),
  auction_ids: z.array(z.number().int()).optional(),
  replace_external_pads: z.boolean().nullable().optional(),
  current_price_from: z.number().nullable().optional(),
  current_price_to: z.number().nullable().optional(),
  price_per_km_from: z.number().nullable().optional(),
  price_per_km_to: z.number().nullable().optional(),
  auc_type: z.array(auctionTypeFilterSchema).optional(),
})
export type AuctionListRequest = z.infer<typeof auctionListRequestSchema>
