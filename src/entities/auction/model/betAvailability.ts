import type { AuctionStatus } from './enums'

/**
 * Why the bid form is closed when `can_set_bet` is false. Every {@link AuctionStatus} is mapped
 * explicitly: the lifecycle phase is the reason in all cases but `Auction`, where trading is live
 * and the block really is about the user's own access.
 */
export function betUnavailableReason(trading: {
  status: AuctionStatus
  is_bidder: boolean
}): string {
  switch (trading.status) {
    case 'Planning':
      return 'Торги ещё не начались'
    case 'Auction':
      return trading.is_bidder
        ? 'Ставки временно недоступны'
        : 'У вас нет доступа к участию в торгах'
    case 'DeterminateWinner':
      return 'Организатор определяет победителя'
    case 'WaitDeal':
      return 'Торги завершены, ожидается сделка'
    case 'InProgress':
      return 'Перевозка уже выполняется'
    case 'Finished':
      return 'Торги закрыты'
    case 'Stopped':
      return 'Аукцион остановлен'
    case 'Canceled':
      return 'Аукцион отменён'
    case 'Unknown':
      return 'Ставки недоступны'
  }
}
