import type { AuctionType } from '@entities/auction'

interface DefaultBidPriceInput {
  aucType?: AuctionType
  current?: number | null
  min?: number | null
  max?: number | null
  step?: number | null
}

export function defaultBidPrice({
  aucType,
  current = null,
  min = null,
  max = null,
  step = null,
}: DefaultBidPriceInput): number {
  const suggested = suggestFromDirection(aucType, current, step)
  const withMin = min != null ? Math.max(suggested, min) : suggested

  return max != null ? Math.min(withMin, max) : withMin
}

function suggestFromDirection(
  aucType: AuctionType | undefined,
  current: number | null,
  step: number | null,
) {
  if (current == null) {
    return 0
  }
  if (!step) {
    return current
  }
  if (aucType === 'Up') {
    return current + step
  }
  if (aucType === 'Down') {
    return Math.max(current - step, 0)
  }

  return current
}
