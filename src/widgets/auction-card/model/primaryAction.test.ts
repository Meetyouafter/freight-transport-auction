import { describe, expect, it } from 'vitest'
import { makeAuctionListItem } from './auctionListItem.fixture'
import { getPrimaryAction } from './primaryAction'

describe('getPrimaryAction', () => {
  it('offers to place a bid when betting is open and the user has no bid yet', () => {
    const auction = makeAuctionListItem({ trading: { can_set_bet: true, your: null } })

    expect(getPrimaryAction(auction)).toEqual({
      label: 'Сделать ставку',
      target: 'bid',
      disabled: false,
    })
  })

  it('offers to change the bid when betting is open and the user already bid', () => {
    const auction = makeAuctionListItem({
      trading: { can_set_bet: true, your: { bet: true, last_bet: 1000 } },
    })

    expect(getPrimaryAction(auction)).toEqual({
      label: 'Изменить ставку',
      target: 'bid',
      disabled: false,
    })
  })

  it('routes to details when betting is closed but the user is a bidder', () => {
    const auction = makeAuctionListItem({ trading: { can_set_bet: false, is_bidder: true } })

    expect(getPrimaryAction(auction)).toEqual({
      label: 'Смотреть ставки',
      target: 'details',
      disabled: false,
    })
  })

  it('disables the action when betting is closed and the user never participated', () => {
    const auction = makeAuctionListItem({ trading: { can_set_bet: false, is_bidder: false } })

    expect(getPrimaryAction(auction)).toEqual({
      label: 'Ставки закрыты',
      target: 'details',
      disabled: true,
    })
  })
})
