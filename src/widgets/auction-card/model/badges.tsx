import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlineOutlined'
import {
  AUCTION_STATUS_LABELS,
  AUCTION_TYPE_LABELS,
  AUCTION_TYPE_VARIANTS,
  TRADING_STATUS_MOBILE_LABELS,
  type AuctionListItem,
  type ListItemTradingStatusMobile,
} from '@entities/auction'
import {
  auctionStatusTokens,
  statusTokens,
  type BadgePalette,
  type StatusTokenKey,
} from '@shared/theme/tokens'
import { MAX_SECONDARY_BADGES } from './constants'

export interface Badge {
  palette: BadgePalette
  label: string
  icon?: React.ReactNode
}

const TRADING_STATUS_VARIANTS: Record<ListItemTradingStatusMobile, StatusTokenKey> = {
  NotParticipating: 'neutral',
  Leading: 'rising',
  Losing: 'rejected',
  Winner: 'confirmed',
  Confirmed: 'confirmed',
  Unknown: 'neutral',
}

/** The auction's own lifecycle status — always shown, so the card never hides where trading is. */
export function getPrimaryBadge(auction: AuctionListItem): Badge {
  const { status } = auction.trading

  return {
    palette: auctionStatusTokens[status],
    label: AUCTION_STATUS_LABELS[status],
  }
}

/**
 * ТЗ asks for the auction type, the user's trading status and the "do I have a bid" flag to be
 * readable at the same time, so these are separate badges instead of one changing badge.
 */
export function getSecondaryBadges(auction: AuctionListItem, hasMyBid: boolean): Badge[] {
  const { main, trading } = auction
  const badges: Badge[] = [
    {
      palette: statusTokens[AUCTION_TYPE_VARIANTS[main.auc_type]],
      label: AUCTION_TYPE_LABELS[main.auc_type],
    },
    tradingStatusBadge(trading.status_mobile),
    hasMyBid
      ? {
          palette: statusTokens.confirmed,
          label: 'Ставка сделана',
          icon: <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />,
        }
      : {
          palette: statusTokens.neutral,
          label: 'Моей ставки нет',
          icon: <RemoveCircleOutlineIcon sx={{ fontSize: 14 }} />,
        },
  ]

  return badges.slice(0, MAX_SECONDARY_BADGES)
}

function tradingStatusBadge(status: ListItemTradingStatusMobile): Badge {
  return {
    palette: statusTokens[TRADING_STATUS_VARIANTS[status]],
    label: TRADING_STATUS_MOBILE_LABELS[status],
    icon: status === 'Winner' ? <EmojiEventsIcon sx={{ fontSize: 14 }} /> : undefined,
  }
}
