import { z } from 'zod'
import { auctionTypeFilterSchema, tradingStatusSchema } from '@entities/auction'
import { CITIES } from '@entities/city'
import { paginationSearchSchema } from '@shared/lib/pagination/paginationSearchSchema'
import { defaultAuctionFiltersFormValues, type AuctionFiltersFormValues } from './schema'

export const auctionFiltersSearchSchema = z
  .object({
    cargo_num: z.string().optional().catch(undefined),
    customer: z.string().optional().catch(undefined),
    auc_type: z.array(auctionTypeFilterSchema).optional().catch(undefined),
    status: z.array(tradingStatusSchema).optional().catch(undefined),
    statuses: z.array(z.number().int()).optional().catch(undefined),
    body_types: z.array(z.string()).optional().catch(undefined),
    load_gc_id: z.number().int().optional().catch(undefined),
    unload_gc_id: z.number().int().optional().catch(undefined),
    load_date_from: z.string().optional().catch(undefined),
    load_date_to: z.string().optional().catch(undefined),
    price_from: z.string().optional().catch(undefined),
    price_to: z.string().optional().catch(undefined),
    is_favorite: z.boolean().optional().catch(undefined),
    is_bidder: z.boolean().optional().catch(undefined),
    is_available: z.boolean().optional().catch(undefined),
  })
  .extend(paginationSearchSchema.shape)
  .catch({})

export type AuctionFiltersSearch = z.infer<typeof auctionFiltersSearchSchema>

export function filtersToSearch(values: AuctionFiltersFormValues): AuctionFiltersSearch {
  return {
    cargo_num: values.cargo_num || undefined,
    customer: values.customer || undefined,
    auc_type: values.auc_type.length ? values.auc_type : undefined,
    status: values.status.length ? values.status : undefined,
    statuses: values.statuses.length ? values.statuses : undefined,
    body_types: values.body_types.length ? values.body_types : undefined,
    load_gc_id: values.load_city?.gcId,
    unload_gc_id: values.unload_city?.gcId,
    load_date_from: values.load_date_from || undefined,
    load_date_to: values.load_date_to || undefined,
    price_from: values.price_from || undefined,
    price_to: values.price_to || undefined,
    is_favorite: values.is_favorite || undefined,
    is_bidder: values.is_bidder || undefined,
    is_available: values.is_available || undefined,
  }
}

export function searchToFilters(search: AuctionFiltersSearch): AuctionFiltersFormValues {
  return {
    ...defaultAuctionFiltersFormValues,
    cargo_num: search.cargo_num ?? defaultAuctionFiltersFormValues.cargo_num,
    customer: search.customer ?? defaultAuctionFiltersFormValues.customer,
    auc_type: search.auc_type ?? defaultAuctionFiltersFormValues.auc_type,
    status: search.status ?? defaultAuctionFiltersFormValues.status,
    statuses: search.statuses ?? defaultAuctionFiltersFormValues.statuses,
    body_types: search.body_types ?? defaultAuctionFiltersFormValues.body_types,
    load_city: CITIES.find((city) => city.gcId === search.load_gc_id) ?? null,
    unload_city: CITIES.find((city) => city.gcId === search.unload_gc_id) ?? null,
    load_date_from: search.load_date_from ?? defaultAuctionFiltersFormValues.load_date_from,
    load_date_to: search.load_date_to ?? defaultAuctionFiltersFormValues.load_date_to,
    price_from: search.price_from ?? defaultAuctionFiltersFormValues.price_from,
    price_to: search.price_to ?? defaultAuctionFiltersFormValues.price_to,
    is_favorite: search.is_favorite ?? defaultAuctionFiltersFormValues.is_favorite,
    is_bidder: search.is_bidder ?? defaultAuctionFiltersFormValues.is_bidder,
    is_available: search.is_available ?? defaultAuctionFiltersFormValues.is_available,
  }
}
