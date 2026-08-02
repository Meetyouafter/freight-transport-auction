import { ApiError } from '@shared/api/http'

export function auctionErrorState(error: unknown) {
  if (error instanceof ApiError && error.status === 404) {
    return {
      title: 'Аукцион не найден',
      description: 'Возможно, заявка снята с торгов или ссылка устарела.',
    }
  }

  return {
    title: 'Не удалось загрузить аукцион',
    description: 'Попробуйте обновить страницу — мы уже занимаемся проблемой.',
  }
}
