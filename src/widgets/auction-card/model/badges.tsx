import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlineOutlined'
import {
  AUCTION_STATUS_LABELS,
  AUCTION_STATUS_VARIANTS,
  AUCTION_TYPE_LABELS,
  AUCTION_TYPE_VARIANTS,
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
    return {
      variant: 'confirmed',
      label: TRADING_STATUS_MOBILE_LABELS.Winner,
      icon: <EmojiEventsIcon sx={{ fontSize: 14 }} />,
    }
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
  const badges: Badge[] = [
    { variant: AUCTION_TYPE_VARIANTS[main.auc_type], label: AUCTION_TYPE_LABELS[main.auc_type] },
  ]

  if (trading.status === 'WaitDeal') {
    badges.push({ variant: 'waiting', label: 'Ожидание сделки' })
  }
  if (hasMyBid) {
    badges.push({
      variant: 'confirmed',
      label: 'Ставка сделана',
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />,
    })
  } else {
    badges.push({
      variant: 'neutral',
      label: 'Моей ставки нет',
      icon: <RemoveCircleOutlineIcon sx={{ fontSize: 14 }} />,
    })
  }

  return badges.slice(0, MAX_SECONDARY_BADGES)
}
