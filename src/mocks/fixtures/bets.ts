import type { BetItem } from '@entities/bet'
import { auctionFixtures } from './auctions'

/** Auction UUID -> bets placed in that auction, mutated by the `setBet` handler. */
export const betsByAuction = new Map<string, BetItem[]>([
  [
    '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    [
      {
        id: 41,
        created_at: '2026-06-02T06:05:00',
        auction_id: 1240,
        subscriber_id: 13,
        contact_name: 'Иванов Иван',
        contact_phone: '+79001234567',
        price_with_vat: 58000,
        price_no_vat: 47540.98,
        organization_id: 14,
        organization_inn: '9616244307',
        organization_name: 'ООО Перевозчик',
        transporter_comment: null,
        is_rejected: false,
        is_counter: false,
        place: 1,
        is_win: false,
        run_number: 0,
        cancel_reason: '',
        price_info: {
          price_with_vat: 58000,
          price_no_vat: 47540.98,
          payment_type: 'Безналичная с НДС',
          vat_rate: '20',
        },
      },
      {
        id: 39,
        created_at: '2026-06-01T14:20:00',
        auction_id: 1240,
        subscriber_id: 22,
        contact_name: 'Петров Пётр',
        contact_phone: '+79007654321',
        price_with_vat: 62000,
        price_no_vat: 50819.67,
        organization_id: 21,
        organization_inn: '7719402047',
        organization_name: 'ООО Транс-Логистик',
        transporter_comment: null,
        is_rejected: true,
        is_counter: false,
        place: null,
        is_win: false,
        run_number: 0,
        cancel_reason: 'Отменена перевозчиком',
        price_info: {
          price_with_vat: 62000,
          price_no_vat: 50819.67,
          payment_type: 'Безналичная с НДС',
          vat_rate: '20',
        },
      },
    ],
  ],
  [
    'a1b2c3d4-1234-4a1b-9c3d-1234567890ab',
    [
      {
        id: 40,
        created_at: '2026-04-11T06:10:00',
        auction_id: 1250,
        subscriber_id: 13,
        contact_name: 'Иванов Иван',
        contact_phone: '+79001234567',
        price_with_vat: 45000,
        price_no_vat: 36885.25,
        organization_id: 14,
        organization_inn: '9616244307',
        organization_name: 'ООО Перевозчик',
        transporter_comment: null,
        is_rejected: false,
        is_counter: false,
        place: 1,
        is_win: true,
        run_number: 0,
        cancel_reason: '',
        price_info: {
          price_with_vat: 45000,
          price_no_vat: 36885.25,
          payment_type: 'Безналичная с НДС',
          vat_rate: '20',
        },
      },
    ],
  ],
])

let nextBetId = 100

const ME = {
  subscriber_id: 13,
  contact_name: 'Иванов Иван',
  contact_phone: '+79001234567',
  organization_id: 14,
  organization_inn: '9616244307',
  organization_name: 'ООО Перевозчик',
} as const

const RIVALS = [
  {
    subscriber_id: 22,
    contact_name: 'Петров Пётр',
    contact_phone: '+79007654321',
    organization_id: 21,
    organization_inn: '7719402047',
    organization_name: 'ООО Транс-Логистик',
  },
  {
    subscriber_id: 31,
    contact_name: 'Сидорова Анна',
    contact_phone: '+79005550101',
    organization_id: 33,
    organization_inn: '5024113301',
    organization_name: 'ООО Авто-Курс',
  },
] as const

type Bidder = (typeof RIVALS)[number] | typeof ME

function makeBet(
  auctionId: number,
  bidder: Bidder,
  price: number,
  createdAt: string,
  extra: Partial<BetItem> = {},
): BetItem {
  const priceNoVat = Math.round((price / 1.22) * 100) / 100

  return {
    id: nextBetId++,
    created_at: createdAt,
    auction_id: auctionId,
    ...bidder,
    price_with_vat: price,
    price_no_vat: priceNoVat,
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    place: null,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
    price_info: {
      price_with_vat: price,
      price_no_vat: priceNoVat,
      payment_type: 'Безналичная с НДС',
      vat_rate: '20',
    },
    ...extra,
  }
}

/**
 * Every auction we take part in gets a history: our own bet, a rival's bet on the other side of it
 * and — for part of them — a cancelled one, so the bets section can be checked in all its states
 * (leading, losing, won, cancelled bid, and history hidden by the organiser).
 */
function seedGeneratedBets() {
  for (const { listItem, show } of auctionFixtures) {
    const uuid = show.main.order_uid

    if (betsByAuction.has(uuid) || !listItem.trading.is_bidder) continue

    const auctionId = show.main.id
    const myPrice = listItem.trading.your?.last_bet ?? show.trading.price.current
    const current = show.trading.price.current

    if (myPrice == null || current == null) continue

    const step = show.trading.price.step ?? 1000
    const goingUp = show.main.auc_type === 'Up'
    const rivalPrice = goingUp
      ? Math.max(current, myPrice) + step
      : Math.min(current, myPrice) - step
    const leading = show.trading.status_mobile === 'Leading' || show.trading.your.win
    const date = show.trading.start_time

    const bets: BetItem[] = [
      makeBet(auctionId, ME, myPrice, date, {
        place: leading ? 1 : 2,
        is_win: show.trading.your.win,
      }),
      makeBet(auctionId, RIVALS[auctionId % RIVALS.length], rivalPrice, date, {
        place: leading ? 2 : 1,
      }),
    ]

    if (auctionId % 3 === 0) {
      bets.push(
        makeBet(auctionId, RIVALS[(auctionId + 1) % RIVALS.length], rivalPrice, date, {
          is_rejected: true,
          cancel_reason: 'Отменена перевозчиком',
        }),
      )
    }

    /** Counter bids only exist where the organiser allowed them and the winner is being chosen. */
    if (show.trading.allow_counter_bets && show.trading.status === 'DeterminateWinner') {
      bets.unshift(
        makeBet(auctionId, ME, goingUp ? myPrice + step : myPrice - step, date, {
          is_counter: true,
          run_number: 1,
        }),
      )
    }

    betsByAuction.set(uuid, bets)
  }
}

seedGeneratedBets()

export function getBets(auctionUuid: string, includeCancelled: boolean) {
  const bets = betsByAuction.get(auctionUuid) ?? []

  return includeCancelled ? bets : bets.filter((bet) => !bet.is_rejected)
}

export function addBet(auctionUuid: string, auctionId: number, price: number): BetItem {
  const priceNoVat = Math.round((price / 1.22) * 100) / 100
  const bet: BetItem = {
    id: nextBetId++,
    created_at: new Date().toISOString(),
    auction_id: auctionId,
    subscriber_id: 13,
    contact_name: 'Иванов Иван',
    contact_phone: '+79001234567',
    price_with_vat: price,
    price_no_vat: priceNoVat,
    organization_id: 14,
    organization_inn: '9616244307',
    organization_name: 'ООО Перевозчик',
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

  const bets = betsByAuction.get(auctionUuid) ?? []
  betsByAuction.set(auctionUuid, [bet, ...bets])

  return bet
}
