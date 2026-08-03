import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import {
  AUCTION_STATUS_LABELS,
  type AuctionShowTrading,
  type AuctionStatus,
  type AuctionType,
  type TradingStatus,
} from '@entities/auction'
import { formatPrice } from '@shared/lib/format/formatPrice'
import { auctionStatusTokens, statusTokens, type BadgePalette } from '@shared/theme/tokens'

interface StatusLabel {
  palette: BadgePalette
  label: string
}

/** Бейдж статуса сделки — шапка страницы, `AuctionShowTrading.status`. */
export function dealStatusBadge(status: AuctionStatus): StatusLabel {
  return { palette: auctionStatusTokens[status], label: AUCTION_STATUS_LABELS[status] }
}

const PARTICIPATION_LABELS: Partial<Record<TradingStatus, StatusLabel>> = {
  Leading: { palette: statusTokens.rising, label: 'Лидирую' },
  Losing: { palette: statusTokens.rejected, label: 'Перебили' },
  OnPending: { palette: statusTokens.waiting, label: 'На рассмотрении' },
  ChoosingWinner: { palette: statusTokens.waiting, label: 'Выбор победителя' },
  Winner: { palette: statusTokens.confirmed, label: 'Выиграл' },
  Confirmed: { palette: statusTokens.confirmed, label: 'Подтверждено' },
  Accepted: { palette: statusTokens.confirmed, label: 'Принято' },
}

/** Бейдж статуса своего участия — только если пользователь участвует в торгах. */
export function participationBadge(statusMobile: TradingStatus): StatusLabel | null {
  return PARTICIPATION_LABELS[statusMobile] ?? null
}

interface DirectionBadge extends StatusLabel {
  icon: React.ReactNode
}

/** Постоянный индикатор направления торгов рядом с ценой — п.F спецификации. */
export function auctionDirectionBadge(
  aucType: AuctionType,
  status: AuctionStatus,
): DirectionBadge | null {
  if (status !== 'Auction') return null

  if (aucType === 'Up') {
    return {
      palette: statusTokens.rising,
      label: 'На повышение',
      icon: <ArrowUpwardIcon sx={{ fontSize: 14 }} />,
    }
  }
  if (aucType === 'Down') {
    return {
      palette: statusTokens.neutral,
      label: 'На понижение',
      icon: <ArrowDownwardIcon sx={{ fontSize: 14 }} />,
    }
  }

  return null
}

interface MyBetStatus extends StatusLabel {
  hint?: string
}

/** Компактный блок «состояние своей ставки» в sidebar — п.8 спецификации. */
export function myBetStatus(trading: AuctionShowTrading): MyBetStatus {
  const { your, status_mobile } = trading

  if (!your.bet) {
    return { palette: statusTokens.neutral, label: 'Вы не участвуете' }
  }

  const amount = your.last_bet_with_vat ?? your.last_bet

  if (your.win) {
    return { palette: statusTokens.confirmed, label: 'Вы выиграли' }
  }
  if (status_mobile === 'Losing') {
    return {
      palette: statusTokens.waiting,
      label:
        amount != null ? `Ваша ставка: ${formatPrice(amount)} — перебита` : 'Ваша ставка перебита',
      hint: 'Текущая цена ниже вашей — обновите ставку',
    }
  }
  if (status_mobile === 'Leading') {
    return {
      palette: statusTokens.rising,
      label:
        amount != null ? `Ваша ставка: ${formatPrice(amount)} — лидирует` : 'Ваша ставка лидирует',
    }
  }
  if (trading.status === 'Finished') {
    return { palette: statusTokens.rejected, label: 'Вы проиграли' }
  }

  return {
    palette: statusTokens.neutral,
    label: amount != null ? `Ваша ставка: ${formatPrice(amount)}` : 'Ставка размещена',
  }
}
