import { HttpResponse } from 'msw'
import type { ProblemDetail, ValidationError } from '@shared/api/problemDetail'

/**
 * The spec serves every error as `application/problem+json`, so the mocks do too — otherwise the
 * `Content-Type` contract can never be checked against the real backend.
 */
const PROBLEM_JSON_HEADERS = { 'Content-Type': 'application/problem+json' }

function traceId() {
  return crypto.randomUUID()
}

export function problemResponse(status: number, problem: Omit<ProblemDetail, 'trace_id'>) {
  return HttpResponse.json(
    { ...problem, trace_id: traceId() },
    { status, headers: PROBLEM_JSON_HEADERS },
  )
}

export function notFoundResponse(message: string) {
  return problemResponse(404, { code: 'resource_not_found', title: 'Не найдено', message })
}

export function validationProblemResponse(errors: ValidationError[]) {
  return HttpResponse.json(
    {
      code: 'validation_failed',
      title: 'Ошибка валидации',
      message: 'Запрос содержит некорректные поля.',
      trace_id: traceId(),
      errors,
    },
    { status: 422, headers: PROBLEM_JSON_HEADERS },
  )
}
