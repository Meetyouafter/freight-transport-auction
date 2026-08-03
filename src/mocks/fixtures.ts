import type {
  AuctionListItem,
  AuctionShowResponse,
  AuctionStatus,
  AuctionType,
} from '@entities/auction'
import type { BetItem } from '@entities/bet'

/**
 * The base auction and its bet history, built field-by-field from the `example` values in
 * `openapi.auctions.v0.json` — no invented business data. A few values are shared on purpose
 * because the spec itself reuses them verbatim across schemas (auction id `1236` / `order_uid`
 * between `AuctionListItemMain`/`AuctionShowMain`, the organizer between
 * `AuctionListItemOrganizer`/`AuctionShowOrganizer`, and the bidder identity between `BetItem`
 * and `AdmittedOrganization`). Everywhere else each schema's own example is taken as-is, even
 * where that reads as mildly inconsistent (e.g. `trading.your.bet: false` despite a bet existing
 * for this auction below) — the spec's per-field examples were not written as one coherent
 * narrative, and reconciling them further would mean inventing data the contract doesn't give.
 *
 * Two deliberate deviations: `can_set_bet`'s example is `false` and `hide_bets_history`'s is
 * `true`, but this app is MSW-first — the whole point of the mock is to drive the UI without a
 * backend — so bidding stays open and the bet history stays visible here.
 */

const AUCTION_ID = 1236
const ORDER_UID = '3a05d045-0e67-4f85-b20a-de81d18bba7a'

const baseListItem: AuctionListItem = {
  main: {
    id: AUCTION_ID,
    cargo_num: '00000001059',
    cargo_date: '2026-05-04T14:49:09',
    auc_type: 'Down',
    order_uid: ORDER_UID,
    created_at: '2026-05-25T11:48:20',
    priority_sort: 0,
    is_assembly: false,
    price_per_km: 199,
  },
  organizer: {
    subscriber_id: 98,
    organization_id: 340,
    organization_name: 'ЛИМ',
    organization_inn: '7703769184',
    organization_kpp: '770301001',
    is_hide_organization: false,
  },
  route: {
    load: {
      city: 'Пермь',
      address: 'Транспортная 9',
      date: '2026-05-26T09:00:00',
      city_gc_id: 59,
      points_count: 1,
    },
    unload: {
      city: 'Москва',
      address: '',
      date: '2026-05-26T18:00:00',
      city_gc_id: 100,
      points_count: 1,
    },
  },
  cargo: {
    name: 'Мороженое',
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
    start_time: '2026-05-26T09:00:00',
    stop_time: '2026-05-26T09:00:00',
    bid_measurement_type: 'PerRoute',
    can_set_bet: true,
    allow_counter_bets: true,
    hide_points_address_and_contacts: true,
    direction: null,
    comment: null,
    is_bidder: false,
    is_available: false,
    is_accredited: false,
    is_favorite: false,
    is_last_bet_with_vat: null,
    red_bet_with_vat: false,
    red_bet_no_vat: false,
    price: { start: 30000, current: 30000, current_no_vat: 30000 },
    your: { bet: false, last_bet: 30000 },
  },
  payment: {
    form: 'Безналичная с НДС',
    currency_code: '643',
    consignor: null,
    consignee: null,
  },
}

const baseShow: AuctionShowResponse = {
  main: {
    id: AUCTION_ID,
    cargo_num: '00000001059',
    cargo_date: '2026-05-04T14:49:09',
    order_uid: ORDER_UID,
    auc_type: 'Down',
    created_at: '2026-05-25T11:48:20',
  },
  organizer: {
    subscriber_id: 98,
    subscriber_code: '12345',
    infobase_code: 'RU_Cargo_01',
    organization_name: 'ЛИМ',
    organization_inn: '7703769184',
    organization_kpp: '770301001',
    organization_id: 340,
  },
  contacts: [
    {
      name: 'Иванов Иван Иванович',
      phone: '+79001234567',
      work_phone: null,
      uid: '550e8400-e29b-41d4-a716-446655440000',
      email: 'ivanov@example.com',
    },
  ],
  cargo: {
    price: '0',
    currency: 643,
    is_international: false,
    distance: 1500,
    truck_count: 1,
    body_type: 'тентованный',
    temp_from: null,
    temp_to: null,
    conics: null,
    belts: null,
    adr: null,
    coupling: null,
    air_pass: null,
    low_loader: null,
    additional_load: null,
    containered: false,
    container_type: null,
    container_size: null,
    loading_types: { side: false, top: false, rear: false, full: false },
    docs: { tir: false, cmr: false, t1: false, med: false },
    car: null,
  },
  trading: {
    status: 'Auction',
    status_mobile: 'NotParticipating',
    start_time: '2026-05-25T16:03:00',
    stop_time: '2026-05-25T16:18:00',
    bid_measurement_type: 'PerRoute',
    can_set_bet: true,
    allow_counter_bets: true,
    hide_bets_history: false,
    hide_places: true,
    no_view_cargo_price: false,
    hide_points_address_and_contacts: true,
    is_bidder: false,
    is_favorite: false,
    is_last_bet_with_vat: null,
    red_bet_with_vat: false,
    red_bet_no_vat: false,
    send_deal_before_load: false,
    chat_id: null,
    price: {
      start: 30000,
      start_no_vat: 25000,
      current: 30000,
      current_no_vat: 24590.16,
      available: 29000,
      available_no_vat: 24166,
      min: 20000,
      min_no_vat: 16666.67,
      max: 30000,
      max_no_vat: 25000,
      step: 500,
      step_no_vat: 416.67,
      price_per_km: 16.39,
    },
    your: { bet: false, last_bet: null, last_bet_with_vat: null, win: false },
    settings: {
      prolong_after_bet: 10,
      winner_confirm: 1,
      winner_counter_mode: null,
      transmission_time_in: 24,
      coefficient: 10,
    },
  },
  payment: {
    condition: 'По оригиналам накладных (ТН, ТТН, CMR)',
    condition_predefined: 'ПоОригиналамНаладных',
    form: 'Безналичная с НДС',
    delay: 30,
    delay_type: 'CalendarDays',
    currency_code: '643',
    prepay: '0',
  },
  assembly: { num: null, date: null },
  routes: [
    {
      row_num: 1,
      op_type: 'Loading',
      start_date: '2026-05-26T09:00:00',
      end_date: '2026-05-26T18:00:00',
      comment: null,
      contractor: '',
      contractor_inn: '',
      location: {
        city_name: 'Пермь',
        city_full_name: 'Пермь, Россия',
        city_gc_id: 59,
        loading_address: 'Транспортная 9',
        lon: 56.238,
        lat: 58.01,
      },
      cargo: {
        name: 'Мороженое',
        package_name: '',
        weight: '1.000',
        volume: '1.000',
        length: '0',
        width: '0',
        height: '0',
        oversized: false,
        package_amount: null,
      },
      contact: { name: '', phone: '' },
    },
  ],
  admitted_organizations: [
    {
      id: 14,
      inn: '9616244307',
      is_main: true,
      name: 'ООО Перевозчик',
      full_name: 'Общество с ограниченной ответственностью Перевозчик',
      site: null,
      subscriber_id: 13,
      subscriber_code: '54321',
      subscriber_role: null,
      infobase_code: 'RU_Cargo_01',
      infobase_address: null,
      nalog_key: null,
      hide_me: false,
      current_vat_rate: '20',
    },
  ],
  hide_bets_history: false,
}

/** The bidder identity `BetItem`/`AdmittedOrganization` share in the spec's own examples. */
const BIDDER = {
  subscriber_id: 13,
  contact_name: 'Иванов Иван',
  contact_phone: '+79001234567',
  organization_id: 14,
  organization_inn: '9616244307',
  organization_name: 'ООО Перевозчик',
} as const

interface AuctionRecord {
  listItem: AuctionListItem
  show: AuctionShowResponse
  bets: BetItem[]
}

const baseRecord: AuctionRecord = {
  listItem: baseListItem,
  show: baseShow,
  bets: [
    {
      id: 42,
      created_at: '2026-05-25T16:05:00',
      auction_id: AUCTION_ID,
      ...BIDDER,
      price_with_vat: 30000,
      price_no_vat: 24590.16,
      transporter_comment: null,
      is_rejected: false,
      is_counter: false,
      place: 1,
      is_win: false,
      run_number: 0,
      cancel_reason: '',
      price_info: {
        price_with_vat: 30000,
        price_no_vat: 24590.16,
        payment_type: 'Безналичная с НДС',
        vat_rate: '20',
      },
    },
  ],
}

/** A finished record where I actually took part — a settled outcome, not an empty spectator row. */
interface Outcome {
  statusMobile: 'Winner' | 'Losing'
  myBet: number
  win: boolean
}

/**
 * 19 more records covering every `AuctionStatus` and every `AuctionType` (bid direction) —
 * everything but `main.id`/`order_uid`/`cargo_num`/`trading.status`/`main.auc_type` is cloned from
 * the base auction above, so these stay grounded in the same contract-example data rather than
 * inventing 19 fresh scenarios. The base auction is `Auction`/`Down`; two of these are `Auction`
 * too (`Up` and `Request`), so bidding stays open on all three directions that matter for
 * `BidForm`'s direction validation, not just one. Of the three `Finished` records, two carry an
 * `outcome` — one won, one lost — so "Мои ставки" has settled deals to show, not just open ones.
 */
const CLONE_SEEDS: { status: AuctionStatus; aucType: AuctionType; outcome?: Outcome }[] = [
  { status: 'Planning', aucType: 'Request' },
  { status: 'Planning', aucType: 'FixPrice' },
  { status: 'Auction', aucType: 'Up' },
  { status: 'Auction', aucType: 'Request' },
  { status: 'DeterminateWinner', aucType: 'Down' },
  { status: 'DeterminateWinner', aucType: 'Up' },
  { status: 'WaitDeal', aucType: 'Request' },
  { status: 'WaitDeal', aucType: 'FixPrice' },
  { status: 'InProgress', aucType: 'Up' },
  { status: 'InProgress', aucType: 'Down' },
  {
    status: 'Finished',
    aucType: 'Request',
    outcome: { statusMobile: 'Winner', myBet: 84000, win: true },
  },
  {
    status: 'Finished',
    aucType: 'Up',
    outcome: { statusMobile: 'Losing', myBet: 65000, win: false },
  },
  { status: 'Finished', aucType: 'Down' },
  { status: 'Stopped', aucType: 'FixPrice' },
  { status: 'Stopped', aucType: 'Unknown' },
  { status: 'Canceled', aucType: 'Request' },
  { status: 'Canceled', aucType: 'Up' },
  { status: 'Unknown', aucType: 'Down' },
  { status: 'Unknown', aucType: 'FixPrice' },
]

function seedUuid(index: number) {
  return `de000000-0000-4000-8000-${String(index).padStart(12, '0')}`
}

function cloneRecord(
  index: number,
  status: AuctionStatus,
  aucType: AuctionType,
  outcome?: Outcome,
): AuctionRecord {
  const listItem: AuctionListItem = structuredClone(baseListItem)
  const show: AuctionShowResponse = structuredClone(baseShow)
  const id = AUCTION_ID + index
  const orderUid = seedUuid(index)
  const cargoNum = String(Number(baseListItem.main.cargo_num) + index).padStart(11, '0')
  const canSetBet = status === 'Auction'
  const isBidder = outcome != null

  listItem.main.id = id
  listItem.main.order_uid = orderUid
  listItem.main.cargo_num = cargoNum
  listItem.main.auc_type = aucType
  listItem.trading.status = status
  listItem.trading.can_set_bet = canSetBet
  listItem.trading.is_bidder = isBidder
  listItem.trading.status_mobile = outcome?.statusMobile ?? 'NotParticipating'
  listItem.trading.your = outcome
    ? { bet: true, last_bet: outcome.myBet }
    : { bet: false, last_bet: null }

  show.main.id = id
  show.main.order_uid = orderUid
  show.main.cargo_num = cargoNum
  show.main.auc_type = aucType
  show.trading.status = status
  show.trading.can_set_bet = canSetBet
  show.trading.is_bidder = isBidder
  show.trading.status_mobile = outcome?.statusMobile ?? 'NotParticipating'
  show.trading.your = outcome
    ? { bet: true, last_bet: outcome.myBet, last_bet_with_vat: outcome.myBet, win: outcome.win }
    : { bet: false, last_bet: null, last_bet_with_vat: null, win: false }

  const bets: BetItem[] = outcome
    ? [
        {
          id: 100 + index,
          created_at: show.main.created_at,
          auction_id: id,
          ...BIDDER,
          price_with_vat: outcome.myBet,
          price_no_vat: Math.round((outcome.myBet / 1.22) * 100) / 100,
          transporter_comment: null,
          is_rejected: false,
          is_counter: false,
          place: outcome.win ? 1 : 2,
          is_win: outcome.win,
          run_number: 0,
          cancel_reason: '',
          price_info: {
            price_with_vat: outcome.myBet,
            price_no_vat: Math.round((outcome.myBet / 1.22) * 100) / 100,
            payment_type: 'Безналичная с НДС',
            vat_rate: '20',
          },
        },
      ]
    : []

  return { listItem, show, bets }
}

const generatedRecords: AuctionRecord[] = CLONE_SEEDS.map((seed, i) =>
  cloneRecord(i + 1, seed.status, seed.aucType, seed.outcome),
)

const auctions: AuctionRecord[] = [baseRecord, ...generatedRecords]

/** The one auction with an existing bid and open bidding — what the handler tests exercise. */
export const BASE_AUCTION_UUID = ORDER_UID
export const AUCTION_COUNT = auctions.length

export function listAuctionItems() {
  return auctions.map((auction) => auction.listItem)
}

export function findAuction(auctionUuid: string) {
  return auctions.find((auction) => auction.listItem.main.order_uid === auctionUuid) ?? null
}

let nextBetId = 43

/** Mutates the record in place — `setBet` moves the shared mock state, same as a real backend. */
export function placeBet(auction: AuctionRecord, price: number): BetItem {
  const priceNoVat = Math.round((price / 1.22) * 100) / 100
  const bet: BetItem = {
    id: nextBetId++,
    created_at: new Date().toISOString(),
    auction_id: auction.show.main.id,
    ...BIDDER,
    price_with_vat: price,
    price_no_vat: priceNoVat,
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    place: 1,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
    price_info: {
      price_with_vat: price,
      price_no_vat: priceNoVat,
      payment_type: 'Безналичная с НДС',
      vat_rate: '20',
    },
  }

  auction.bets.unshift(bet)

  auction.listItem.trading.price = { start: 30000, current: price, current_no_vat: priceNoVat }
  auction.listItem.trading.your = { bet: true, last_bet: price }
  auction.listItem.trading.status_mobile = 'Leading'

  auction.show.trading.price.current = price
  auction.show.trading.price.current_no_vat = priceNoVat
  auction.show.trading.your = { bet: true, last_bet: price, last_bet_with_vat: price, win: false }
  auction.show.trading.status_mobile = 'Leading'

  return bet
}
