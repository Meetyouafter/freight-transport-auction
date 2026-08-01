import type { BetItem } from '@entities/bet'
import { MOCK_VAT_DIVISOR } from '../utils/mockFlags'

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

let nextBetId = 42

export function getBets(auctionUuid: string, includeCancelled: boolean) {
  const bets = betsByAuction.get(auctionUuid) ?? []

  return includeCancelled ? bets : bets.filter((bet) => !bet.is_rejected)
}

export function addBet(auctionUuid: string, auctionId: number, price: number): BetItem {
  const bet: BetItem = {
    id: nextBetId++,
    created_at: new Date().toISOString(),
    auction_id: auctionId,
    subscriber_id: 13,
    contact_name: 'Иванов Иван',
    contact_phone: '+79001234567',
    price_with_vat: price,
    price_no_vat: Math.round((price / MOCK_VAT_DIVISOR) * 100) / 100,
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
      price_no_vat: Math.round((price / MOCK_VAT_DIVISOR) * 100) / 100,
      payment_type: 'Безналичная с НДС',
      vat_rate: '20',
    },
  }

  const bets = betsByAuction.get(auctionUuid) ?? []
  betsByAuction.set(auctionUuid, [bet, ...bets])

  return bet
}
