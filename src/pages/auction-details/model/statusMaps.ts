import {
  AUCTION_STATUS_LABELS,
  AUCTION_STATUS_VARIANTS,
  type AuctionShowTrading,
  type AuctionStatus,
  type TradingStatus,
} from '@entities/auction'
import { formatPrice } from '@shared/lib/format/formatPrice'
import type { StatusTokenKey } from '@shared/theme/tokens'

interface StatusLabel {
  variant: StatusTokenKey
  label: string
}

/** Бейдж статуса сделки — шапка страницы, `AuctionShowTrading.status`. */
export function dealStatusBadge(status: AuctionStatus): StatusLabel {
  return { variant: AUCTION_STATUS_VARIANTS[status], label: AUCTION_STATUS_LABELS[status] }
}

const PARTICIPATION_LABELS: Partial<Record<TradingStatus, StatusLabel>> = {
  Leading: { variant: 'rising', label: 'Лидирую' },
  Losing: { variant: 'rejected', label: 'Перебили' },
  OnPending: { variant: 'waiting', label: 'На рассмотрении' },
  ChoosingWinner: { variant: 'waiting', label: 'Выбор победителя' },
  Winner: { variant: 'confirmed', label: 'Выиграл' },
  Confirmed: { variant: 'confirmed', label: 'Подтверждено' },
  Accepted: { variant: 'confirmed', label: 'Принято' },
}

/** Бейдж статуса своего участия — только если пользователь участвует в торгах. */
export function participationBadge(statusMobile: TradingStatus): StatusLabel | null {
  return PARTICIPATION_LABELS[statusMobile] ?? null
}

interface MyBetStatus extends StatusLabel {
  hint?: string
}

/** Компактный блок «состояние своей ставки» в sidebar — п.8 спецификации. */
export function myBetStatus(trading: AuctionShowTrading): MyBetStatus {
  const { your, status_mobile } = trading

  if (!your.bet) {
    return { variant: 'neutral', label: 'Вы не участвуете' }
  }

  const amount = your.last_bet_with_vat ?? your.last_bet

  if (your.win) {
    return { variant: 'confirmed', label: 'Вы выиграли' }
  }
  if (status_mobile === 'Losing') {
    return {
      variant: 'waiting',
      label:
        amount != null ? `Ваша ставка: ${formatPrice(amount)} — перебита` : 'Ваша ставка перебита',
      hint: 'Текущая цена ниже вашей — обновите ставку',
    }
  }
  if (status_mobile === 'Leading') {
    return {
      variant: 'confirmed',
      label:
        amount != null ? `Ваша ставка: ${formatPrice(amount)} — лидирует` : 'Ваша ставка лидирует',
    }
  }
  if (trading.status === 'Finished') {
    return { variant: 'rejected', label: 'Вы проиграли' }
  }

  return {
    variant: 'neutral',
    label: amount != null ? `Ваша ставка: ${formatPrice(amount)}` : 'Ставка размещена',
  }
}
