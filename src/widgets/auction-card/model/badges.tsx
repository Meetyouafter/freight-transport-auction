import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import {
  AUCTION_STATUS_LABELS,
  AUCTION_STATUS_VARIANTS,
  TRADING_STATUS_MOBILE_LABELS,
  type AuctionListItem,
} from '@entities/auction'
import type { StatusTokenKey } from '@shared/theme/tokens'
import { MAX_SECONDARY_BADGES } from './constants'

export interface Badge {
  variant: StatusTokenKey
  label: string
  icon?: React.ReactNode
}

export function getPrimaryBadge(auction: AuctionListItem): Badge | null {
  const { trading } = auction

  if (trading.status_mobile === 'Confirmed') {
    return { variant: 'confirmed', label: TRADING_STATUS_MOBILE_LABELS.Confirmed }
  }
  if (trading.status_mobile === 'Winner') {
    return { variant: 'confirmed', label: TRADING_STATUS_MOBILE_LABELS.Winner }
  }
  if (trading.status === 'Canceled' || trading.status === 'Stopped') {
    return {
      variant: AUCTION_STATUS_VARIANTS[trading.status],
      label: AUCTION_STATUS_LABELS[trading.status],
    }
  }
  if (trading.status_mobile === 'Losing') {
    return { variant: 'rejected', label: TRADING_STATUS_MOBILE_LABELS.Losing }
  }

  return null
}

export function getSecondaryBadges(auction: AuctionListItem, hasMyBid: boolean): Badge[] {
  const { main, trading } = auction
  const badges: Badge[] = []

  if (main.auc_type === 'Up' && trading.status === 'Auction') {
    badges.push({
      variant: 'rising',
      label: 'На повышение',
      icon: <ArrowUpwardIcon sx={{ fontSize: 14 }} />,
    })
  }
  if (trading.status === 'WaitDeal') {
    badges.push({ variant: 'waiting', label: 'Ожидание сделки' })
  }
  if (!hasMyBid) {
    badges.push({ variant: 'neutral', label: 'Моей ставки нет' })
  }

  return badges.slice(0, MAX_SECONDARY_BADGES)
}
