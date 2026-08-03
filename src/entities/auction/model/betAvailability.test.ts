import { describe, expect, it } from 'vitest'
import { betUnavailableReason } from './betAvailability'
import { auctionStatusSchema } from './enums'

describe('betUnavailableReason', () => {
  it('names the lifecycle phase when trading is not open', () => {
    expect(betUnavailableReason({ status: 'Planning', is_bidder: false })).toBe(
      'Торги ещё не начались',
    )
    expect(betUnavailableReason({ status: 'DeterminateWinner', is_bidder: true })).toBe(
      'Организатор определяет победителя',
    )
    expect(betUnavailableReason({ status: 'InProgress', is_bidder: true })).toBe(
      'Перевозка уже выполняется',
    )
    expect(betUnavailableReason({ status: 'Finished', is_bidder: true })).toBe('Торги закрыты')
  })

  it('blames access only while trading is live and the user is not a bidder', () => {
    expect(betUnavailableReason({ status: 'Auction', is_bidder: false })).toBe(
      'У вас нет доступа к участию в торгах',
    )
    expect(betUnavailableReason({ status: 'Auction', is_bidder: true })).toBe(
      'Ставки временно недоступны',
    )
  })

  it('covers every auction status', () => {
    for (const status of auctionStatusSchema.options) {
      expect(betUnavailableReason({ status, is_bidder: false })).toBeTruthy()
    }
  })
})
