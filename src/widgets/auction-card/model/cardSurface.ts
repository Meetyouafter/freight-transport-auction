import type { ListItemTradingStatusMobile } from '@entities/auction'
import { statusTokens, surfaceTokens, type StatusTokenKey } from '@shared/theme/tokens'

export interface CardSurface {
  bg: string
  border: string
  borderHover: string
}

const NEUTRAL_SURFACE: CardSurface = {
  bg: 'background.paper',
  border: surfaceTokens.cardBorder,
  borderHover: surfaceTokens.cardBorderHover,
}

/** Tinted fill plus a matching outline, so the state reads from across the list, not up close. */
const tinted = (variant: StatusTokenKey): CardSurface => ({
  bg: statusTokens[variant].tint,
  border: statusTokens[variant].bg,
  borderHover: statusTokens[variant].text,
})

/**
 * The card surface answers one question at a glance: how do my own bids stand?
 * Green — I am ahead but trading is live, blue — the order is closed in my favour, red — I am
 * being outbid, plain paper — I am out of it. The colours are the same ones the trading-status
 * badge uses, so the fill and the badge always tell the same story.
 *
 * The auction's own lifecycle (`Stopped`, `Canceled`, …) stays with the primary badge on purpose:
 * the fill never has to encode two independent axes at once.
 */
const CARD_SURFACES: Record<ListItemTradingStatusMobile, CardSurface> = {
  Leading: tinted('rising'),
  Winner: tinted('confirmed'),
  Confirmed: tinted('confirmed'),
  Losing: tinted('rejected'),
  NotParticipating: NEUTRAL_SURFACE,
  Unknown: NEUTRAL_SURFACE,
}

export function getCardSurface(status: ListItemTradingStatusMobile): CardSurface {
  return CARD_SURFACES[status]
}
