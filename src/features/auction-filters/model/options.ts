import {
  AUCTION_STATUS_IDS,
  AUCTION_STATUS_LABELS,
  TRADING_STATUS_MOBILE_LABELS,
  type AuctionStatus,
  type AuctionTypeFilter,
} from '@entities/auction'

const AUC_TYPE_LABELS: Record<AuctionTypeFilter, string> = {
  Request: 'Запрос цены',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фикс. цена',
}

export const AUC_TYPE_OPTIONS: { value: AuctionTypeFilter; label: string }[] = (
  Object.entries(AUC_TYPE_LABELS) as [AuctionTypeFilter, string][]
).map(([value, label]) => ({ value, label }))

const TRADING_STATUS_FILTER_VALUES = [
  'NotParticipating',
  'Leading',
  'Losing',
  'Winner',
  'Confirmed',
] as const

export const STATUS_OPTIONS = TRADING_STATUS_FILTER_VALUES.map((value) => ({
  value,
  label: TRADING_STATUS_MOBILE_LABELS[value],
}))

export const AUCTION_STATUS_OPTIONS = (
  Object.entries(AUCTION_STATUS_IDS) as [AuctionStatus, number][]
)
  .filter(([status]) => status !== 'Unknown')
  .map(([status, value]) => ({ value, label: AUCTION_STATUS_LABELS[status] }))
  .sort((a, b) => a.value - b.value)
