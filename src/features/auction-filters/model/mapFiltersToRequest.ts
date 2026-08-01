import type { AuctionListRequest } from '@entities/auction'
import type { AuctionFiltersFormValues } from './schema'

export function mapFiltersToRequest(values: AuctionFiltersFormValues): AuctionListRequest {
  return {
    cargo_num: values.cargo_num || undefined,
    customer: values.customer || undefined,
    auc_type: values.auc_type.length ? values.auc_type : undefined,
    status: values.status.length ? values.status : undefined,
    statuses: values.statuses.length ? values.statuses : undefined,
    body_types: values.body_types.length ? values.body_types : undefined,
    load_city: values.load_city?.name || undefined,
    load_gc_id: values.load_city?.gcId ?? undefined,
    unload_city: values.unload_city?.name || undefined,
    unload_gc_id: values.unload_city?.gcId ?? undefined,
    load_date_from: values.load_date_from || undefined,
    load_date_to: values.load_date_to || undefined,
    current_price_from: values.price_from ? Number(values.price_from) : undefined,
    current_price_to: values.price_to ? Number(values.price_to) : undefined,
    is_favorite: values.is_favorite || undefined,
    is_bidder: values.is_bidder || undefined,
    is_available: values.is_available || undefined,
  }
}
