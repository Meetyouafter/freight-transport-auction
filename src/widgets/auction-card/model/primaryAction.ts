import type { AuctionListItem } from '@entities/auction'

export interface PrimaryAction {
  label: string
  target: 'bid' | 'details'
  disabled: boolean
}

/** Primary card CTA per ТЗ: "Сделать ставку" / "Изменить ставку" / "Смотреть ставки" or disabled. */
export function getPrimaryAction(auction: AuctionListItem): PrimaryAction {
  const { trading } = auction
  const hasMyBid = Boolean(trading.your?.bet)

  if (trading.can_set_bet) {
    return {
      label: hasMyBid ? 'Изменить ставку' : 'Сделать ставку',
      target: 'bid',
      disabled: false,
    }
  }
  if (trading.is_bidder) {
    return { label: 'Смотреть ставки', target: 'details', disabled: false }
  }

  return { label: 'Ставки закрыты', target: 'details', disabled: true }
}
