import type { StatusTokenKey } from '@shared/theme/tokens'
import type { AuctionStatus, OperationType, PaymentDelayType, TradingStatus } from './enums'

/** Canonical `AuctionStatus` → display label, shared by pages, widgets and filters. */
export const AUCTION_STATUS_LABELS: Record<AuctionStatus, string> = {
  Planning: 'Планирование',
  Auction: 'Торги идут',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  Unknown: 'Неизвестно',
}

/** Canonical `AuctionStatus` → status-badge color variant. */
export const AUCTION_STATUS_VARIANTS: Record<AuctionStatus, StatusTokenKey> = {
  Planning: 'neutral',
  Auction: 'rising',
  DeterminateWinner: 'waiting',
  WaitDeal: 'waiting',
  InProgress: 'confirmed',
  Finished: 'confirmed',
  Stopped: 'rejected',
  Canceled: 'rejected',
  Unknown: 'neutral',
}

/** Canonical `AuctionStatus` → numeric id, as used by the `statuses` list filter and the API. */
export const AUCTION_STATUS_IDS: Record<AuctionStatus, number> = {
  Unknown: 0,
  Planning: 1,
  Auction: 2,
  DeterminateWinner: 3,
  WaitDeal: 4,
  InProgress: 5,
  Finished: 6,
  Stopped: 7,
  Canceled: 8,
}

/** `TradingStatus` (`status_mobile`) → display label, shared by the list card and the filters. */
export const TRADING_STATUS_MOBILE_LABELS: Record<TradingStatus, string> = {
  NotParticipating: 'Не участвую',
  Leading: 'Лидирую',
  Losing: 'Проигрываю',
  OnPending: 'На рассмотрении',
  Confirmed: 'Подтверждено',
  ChoosingWinner: 'Выбор победителя',
  Winner: 'Победитель',
  Accepted: 'Принято',
  Unknown: 'Неизвестно',
}

export const PAYMENT_DELAY_TYPE_LABELS: Record<PaymentDelayType, string> = {
  CalendarDays: 'календарных дней',
  WorkDays: 'рабочих дней',
  Unknown: 'дней',
}

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  Loading: 'Погрузка',
  Unloading: 'Выгрузка',
  Unknown: 'Точка маршрута',
}
