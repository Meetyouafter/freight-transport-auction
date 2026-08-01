import type { AuctionShowTrading } from '@entities/auction'

/** Minimal valid `AuctionShowTrading` builder for unit tests — fills only what `myBetStatus` reads. */
export function makeAuctionShowTrading(
  overrides: Partial<AuctionShowTrading> = {},
): AuctionShowTrading {
  return {
    status: 'Auction',
    status_mobile: 'NotParticipating',
    start_time: '2026-01-01T00:00:00',
    stop_time: '2026-01-01T00:20:00',
    bid_measurement_type: 'PerRoute',
    can_set_bet: true,
    allow_counter_bets: true,
    hide_bets_history: false,
    hide_places: false,
    no_view_cargo_price: false,
    hide_points_address_and_contacts: false,
    is_bidder: false,
    is_favorite: false,
    is_last_bet_with_vat: null,
    red_bet_with_vat: false,
    red_bet_no_vat: false,
    send_deal_before_load: false,
    chat_id: null,
    price: {
      start: null,
      start_no_vat: null,
      current: null,
      current_no_vat: null,
      available: null,
      available_no_vat: null,
      min: null,
      min_no_vat: null,
      max: null,
      max_no_vat: null,
      step: null,
      step_no_vat: null,
      price_per_km: 0,
    },
    your: { bet: false, last_bet: null, last_bet_with_vat: null, win: false },
    settings: {
      prolong_after_bet: null,
      winner_confirm: null,
      winner_counter_mode: null,
      transmission_time_in: null,
      coefficient: null,
    },
    ...overrides,
  }
}
