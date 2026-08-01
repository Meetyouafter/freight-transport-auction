import { HttpResponse } from 'msw'

export function unauthorizedResponse() {
  return HttpResponse.json(
    { code: 'unauthorized', title: 'Не авторизован', message: 'Требуется авторизация' },
    { status: 401 },
  )
}

export function serviceUnavailableResponse() {
  return HttpResponse.json(
    {
      code: 'service_unavailable',
      title: 'Сервис недоступен',
      message: 'Мок: сервис временно недоступен',
    },
    { status: 503 },
  )
}
