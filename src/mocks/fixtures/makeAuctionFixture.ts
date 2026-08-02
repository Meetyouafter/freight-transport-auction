import type {
  AuctionListItem,
  AuctionShowResponse,
  AuctionStatus,
  AuctionType,
  ListItemTradingStatusMobile,
} from '@entities/auction'
import { CITIES } from '@entities/city'

export interface AuctionFixture {
  listItem: AuctionListItem
  show: AuctionShowResponse
}

/**
 * What an auction looks like in the mocked dataset. Only the fields that make a record distinct
 * are required; everything else (route, dates, cargo, organizer) is derived from `id` so the
 * seed list stays readable while still spreading values across every filter.
 */
export interface AuctionSeed {
  id: number
  aucType: AuctionType
  status: AuctionStatus
  statusMobile: ListItemTradingStatusMobile
  current: number
  step?: number | null
  organization?: string
  loadCity?: string
  unloadCity?: string
  loadDate?: string
  bodyType?: string
  cargoName?: string
  canSetBet?: boolean
  isBidder?: boolean
  isFavorite?: boolean
  isAvailable?: boolean
  myBet?: number | null
  hideBetsHistory?: boolean
  hideAddress?: boolean
  hideCargoPrice?: boolean
}

const ORGANIZATIONS = [
  { name: 'ЛИМ', inn: '7703769184' },
  { name: 'ТрансЛайн', inn: '7719402047' },
  { name: 'ГрузТранс', inn: '6027001122' },
  { name: 'СеверЛогистик', inn: '7801234567' },
  { name: 'ЮгАвто', inn: '2310112233' },
  { name: 'ВолгаТрейд', inn: '6311009988' },
] as const

/** Body types match the three options of the "Тип кузова" filter. */
const CARGOES = [
  { name: 'Бытовая техника', bodyType: 'фургон', weight: 12, volume: 40 },
  { name: 'Стройматериалы', bodyType: 'бортовой', weight: 20, volume: 60 },
  { name: 'Продукты питания', bodyType: 'фургон', weight: 14, volume: 45 },
  { name: 'Металлопрокат', bodyType: 'бортовой', weight: 24, volume: 30 },
  { name: 'Мебель', bodyType: 'тентованный', weight: 6, volume: 48 },
  { name: 'Оборудование', bodyType: 'тентованный', weight: 10, volume: 32 },
  { name: 'Зерно', bodyType: 'бортовой', weight: 25, volume: 50 },
  { name: 'Текстиль', bodyType: 'тентованный', weight: 9, volume: 62 },
] as const

const PARTICIPATING_STATUSES: ListItemTradingStatusMobile[] = [
  'Leading',
  'Losing',
  'Winner',
  'Confirmed',
]

const noVat = (price: number) => Math.round((price / 1.22) * 100) / 100

const findCity = (name: string) => CITIES.find((city) => city.name === name) ?? CITIES[0]

/** Loading dates spread over June–August 2026 so the date-range filter has something to cut. */
function derivedDates(id: number) {
  const load = new Date(Date.UTC(2026, 5, 1 + (id % 60)))
  const unload = new Date(load.getTime() + 36 * 3600 * 1000)
  const created = new Date(load.getTime() - 5 * 24 * 3600 * 1000)
  const iso = (date: Date, time: string) => `${date.toISOString().slice(0, 10)}T${time}`

  return {
    loadDate: iso(load, '08:00:00'),
    unloadDate: iso(unload, '18:00:00'),
    createdAt: iso(created, '10:00:00'),
  }
}

/** Bid bounds that match the auction direction: `Up` may only grow, `Down` may only shrink. */
function priceBounds(aucType: AuctionType, current: number, step: number | null) {
  if (!step) {
    return { min: null, max: null }
  }
  if (aucType === 'Up') {
    return { min: current + step, max: current + step * 10 }
  }
  if (aucType === 'Down') {
    return { min: Math.max(step, current - step * 10), max: current - step }
  }

  return { min: current - step * 5, max: current + step * 5 }
}

/**
 * `available` in the contract is the price the carrier may actually offer next — one step in the
 * auction's own direction, clamped to the allowed range. Closed trading has nothing available.
 */
function availablePrice(
  aucType: AuctionType,
  current: number,
  step: number | null,
  bounds: { min: number | null; max: number | null },
  canSetBet: boolean,
) {
  if (!canSetBet || !step) {
    return null
  }

  const next = aucType === 'Up' ? current + step : aucType === 'Down' ? current - step : current
  const withMin = bounds.min != null ? Math.max(next, bounds.min) : next

  return bounds.max != null ? Math.min(withMin, bounds.max) : withMin
}

/**
 * Builds a full list+show fixture pair from a compact seed, so the mocked dataset can cover enough
 * auctions to exercise pagination, filters and every status combination without hand-writing
 * hundreds of lines of DTO per record.
 */
export function makeAuctionFixture(seed: AuctionSeed): AuctionFixture {
  const { id, aucType, status, statusMobile, current } = seed

  const participates = PARTICIPATING_STATUSES.includes(statusMobile)
  const dates = derivedDates(id)
  const cargo = CARGOES[id % CARGOES.length]
  const organizer = ORGANIZATIONS[id % ORGANIZATIONS.length]

  const step = seed.step === undefined ? (aucType === 'FixPrice' ? null : 1000) : seed.step
  const canSetBet = seed.canSetBet ?? status === 'Auction'
  const isBidder = seed.isBidder ?? participates
  const isFavorite = seed.isFavorite ?? false
  const isAvailable = seed.isAvailable ?? (status === 'Auction' || status === 'Planning')
  const myBet = seed.myBet === undefined ? (isBidder ? current : null) : seed.myBet
  const hideBetsHistory = seed.hideBetsHistory ?? false
  const hideAddress = seed.hideAddress ?? false
  const hideCargoPrice = seed.hideCargoPrice ?? false

  const cargoNum = String(id).padStart(11, '0')
  const organization = seed.organization ?? organizer.name
  const inn = seed.organization ? '7700000000' : organizer.inn
  const cargoName = seed.cargoName ?? cargo.name
  const bodyType = seed.bodyType ?? cargo.bodyType
  const { weight, volume } = cargo
  const loadDate = seed.loadDate ?? dates.loadDate
  const unloadDate = seed.loadDate ? `${seed.loadDate.slice(0, 10)}T20:00:00` : dates.unloadDate
  const createdAt = dates.createdAt
  const distance = 300 + (id % 12) * 220

  const load = findCity(seed.loadCity ?? CITIES[id % CITIES.length].name)
  const unload = findCity(seed.unloadCity ?? CITIES[(id + 3) % CITIES.length].name)
  const orderUid = `00000000-0000-4000-8000-${String(id).padStart(12, '0')}`
  const { min, max } = priceBounds(aucType, current, step)
  const available = availablePrice(aucType, current, step, { min, max }, canSetBet)
  /** Counter bids are an organiser setting: enable them on every other record so the UI is reachable. */
  const allowCounterBets = id % 2 === 1
  const pricePerKm = Math.round((current / distance) * 100) / 100
  const subscriberId = 500 + (id % 50)
  const organizationId = 900 + (id % 50)

  const listItem: AuctionListItem = {
    main: {
      id,
      cargo_num: cargoNum,
      cargo_date: createdAt,
      auc_type: aucType,
      order_uid: orderUid,
      created_at: createdAt,
      priority_sort: 0,
      is_assembly: false,
      price_per_km: pricePerKm,
    },
    organizer: {
      subscriber_id: subscriberId,
      organization_id: organizationId,
      organization_name: organization,
      organization_inn: inn,
      organization_kpp: '770301001',
      is_hide_organization: false,
    },
    route: {
      load: {
        city: load.name,
        address: 'Транспортная 9',
        date: loadDate,
        city_gc_id: load.gcId,
        points_count: 1,
      },
      unload: {
        city: unload.name,
        address: 'Складская 1',
        date: unloadDate,
        city_gc_id: unload.gcId,
        points_count: 1,
      },
    },
    cargo: {
      name: cargoName,
      weight,
      volume,
      body_type: bodyType,
      truck_count: 1,
      is_cargo: true,
      is_international: false,
      containered: false,
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
      loading_types: { side: true, top: false, rear: true, full: false },
      docs: { tir: false, cmr: false, t1: false, med: false },
      car: null,
    },
    trading: {
      status,
      status_mobile: statusMobile,
      start_time: loadDate,
      stop_time: unloadDate,
      bid_measurement_type: 'PerRoute',
      can_set_bet: canSetBet,
      allow_counter_bets: allowCounterBets,
      hide_points_address_and_contacts: hideAddress,
      direction: null,
      comment: null,
      is_bidder: isBidder,
      is_available: isAvailable,
      is_accredited: true,
      is_favorite: isFavorite,
      is_last_bet_with_vat: myBet != null ? true : null,
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      price: { start: current, current, current_no_vat: noVat(current), step },
      your: { bet: myBet != null, last_bet: myBet },
    },
    payment: {
      form: 'Безналичная с НДС',
      currency_code: '643',
      consignor: null,
      consignee: null,
    },
  }

  const show: AuctionShowResponse = {
    main: {
      id,
      cargo_num: cargoNum,
      cargo_date: createdAt,
      order_uid: orderUid,
      auc_type: aucType,
      created_at: createdAt,
    },
    organizer: {
      subscriber_id: subscriberId,
      subscriber_code: String(10000 + id),
      infobase_code: 'RU_Cargo_01',
      organization_name: organization,
      organization_inn: inn,
      organization_kpp: '770301001',
      organization_id: organizationId,
    },
    contacts: [
      {
        name: 'Иванов Иван Иванович',
        phone: '+79001234567',
        work_phone: null,
        uid: orderUid,
        email: 'ivanov@example.com',
      },
    ],
    cargo: {
      price: '0',
      currency: 643,
      is_international: false,
      distance,
      truck_count: 1,
      body_type: bodyType,
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
      loading_types: { side: true, top: false, rear: true, full: false },
      docs: { tir: false, cmr: false, t1: false, med: false },
      car: null,
    },
    trading: {
      status,
      status_mobile: statusMobile,
      start_time: loadDate,
      stop_time: unloadDate,
      bid_measurement_type: 'PerRoute',
      can_set_bet: canSetBet,
      allow_counter_bets: allowCounterBets,
      hide_bets_history: hideBetsHistory,
      hide_places: false,
      no_view_cargo_price: hideCargoPrice,
      hide_points_address_and_contacts: hideAddress,
      is_bidder: isBidder,
      is_favorite: isFavorite,
      is_last_bet_with_vat: myBet != null ? true : null,
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      send_deal_before_load: false,
      chat_id: null,
      price: {
        start: current,
        start_no_vat: noVat(current),
        current,
        current_no_vat: noVat(current),
        available,
        available_no_vat: available != null ? noVat(available) : null,
        min,
        min_no_vat: min != null ? noVat(min) : null,
        max,
        max_no_vat: max != null ? noVat(max) : null,
        step,
        step_no_vat: step != null ? noVat(step) : null,
        price_per_km: pricePerKm,
      },
      your: {
        bet: myBet != null,
        last_bet: myBet,
        last_bet_with_vat: myBet,
        win: statusMobile === 'Winner',
      },
      settings: {
        prolong_after_bet: null,
        winner_confirm: 1,
        winner_counter_mode: null,
        transmission_time_in: 12,
        coefficient: null,
      },
    },
    payment: {
      condition: null,
      condition_predefined: null,
      form: 'Безналичная с НДС',
      delay: 5,
      delay_type: 'CalendarDays',
      currency_code: '643',
      prepay: '0',
    },
    assembly: { num: null, date: null },
    routes: [
      {
        row_num: 1,
        op_type: 'Loading',
        start_date: loadDate,
        end_date: loadDate,
        comment: null,
        contractor: '',
        contractor_inn: '',
        location: {
          city_name: load.name,
          city_full_name: `${load.name}, Россия`,
          city_gc_id: load.gcId,
          loading_address: 'Транспортная 9',
          lon: load.lon,
          lat: load.lat,
        },
        cargo: {
          name: cargoName,
          package_name: '',
          weight: weight.toFixed(3),
          volume: volume.toFixed(3),
          length: '0',
          width: '0',
          height: '0',
          oversized: false,
          package_amount: null,
        },
        contact: { name: 'Иванов Иван Иванович', phone: '+79001234567' },
      },
      {
        row_num: 2,
        op_type: 'Unloading',
        start_date: unloadDate,
        end_date: unloadDate,
        comment: null,
        contractor: '',
        contractor_inn: '',
        location: {
          city_name: unload.name,
          city_full_name: `${unload.name}, Россия`,
          city_gc_id: unload.gcId,
          loading_address: 'Складская 1',
          lon: unload.lon,
          lat: unload.lat,
        },
        cargo: {
          name: cargoName,
          package_name: '',
          weight: weight.toFixed(3),
          volume: volume.toFixed(3),
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
        id: organizationId,
        inn,
        is_main: true,
        name: organization,
        full_name: `Общество с ограниченной ответственностью «${organization}»`,
        site: null,
        subscriber_id: subscriberId,
        subscriber_code: String(10000 + id),
        subscriber_role: null,
        infobase_code: 'RU_Cargo_01',
        infobase_address: null,
        nalog_key: null,
        hide_me: false,
        current_vat_rate: '20',
      },
    ],
    hide_bets_history: hideBetsHistory,
  }

  return { listItem, show }
}
