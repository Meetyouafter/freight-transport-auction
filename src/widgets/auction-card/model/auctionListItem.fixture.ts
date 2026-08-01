import type { AuctionListItem } from '@entities/auction'

/** Minimal valid `AuctionListItem` builder for unit tests — fills only what the tested mappers read. */
export function makeAuctionListItem(
  overrides: {
    main?: Partial<AuctionListItem['main']>
    trading?: Partial<AuctionListItem['trading']>
  } = {},
): AuctionListItem {
  return {
    main: {
      id: 1,
      cargo_num: '00000000001',
      cargo_date: '2026-01-01T00:00:00',
      auc_type: 'Up',
      order_uid: '00000000-0000-0000-0000-000000000000',
      created_at: '2026-01-01T00:00:00',
      priority_sort: 0,
      is_assembly: false,
      price_per_km: null,
      ...overrides.main,
    },
    organizer: {
      subscriber_id: 1,
      organization_id: 1,
      organization_name: 'Test Org',
      organization_inn: '0000000000',
      organization_kpp: '000000000',
      is_hide_organization: false,
    },
    route: {
      load: {
        city: 'Пермь',
        address: 'Транспортная 9',
        date: '2026-01-01T00:00:00',
        city_gc_id: 59,
        points_count: 1,
      },
      unload: {
        city: 'Москва',
        address: 'Складская 1',
        date: '2026-01-02T00:00:00',
        city_gc_id: 100,
        points_count: 1,
      },
    },
    cargo: {
      name: 'Груз',
      weight: 1,
      volume: 1,
      body_type: 'тентованный',
      truck_count: 1,
      is_cargo: true,
      is_international: null,
      containered: null,
      incoterms: null,
      conics: null,
      belts: null,
      adr: null,
      coupling: null,
      air_pass: null,
      low_loader: null,
      additional_load: null,
      temp_from: null,
      temp_to: null,
      loading_types: { side: false, top: false, rear: false, full: false },
      docs: { tir: false, cmr: false, t1: false, med: false },
      car: null,
    },
    trading: {
      status: 'Auction',
      status_mobile: 'NotParticipating',
      start_time: '2026-01-01T00:00:00',
      stop_time: '2026-01-01T00:20:00',
      bid_measurement_type: 'PerRoute',
      can_set_bet: true,
      allow_counter_bets: true,
      hide_points_address_and_contacts: false,
      direction: null,
      comment: null,
      is_bidder: false,
      is_available: true,
      is_accredited: true,
      is_favorite: false,
      is_last_bet_with_vat: null,
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      price: null,
      your: null,
      ...overrides.trading,
    },
    payment: {
      form: 'Безналичная с НДС',
      currency_code: '643',
      consignor: null,
      consignee: null,
    },
  }
}
