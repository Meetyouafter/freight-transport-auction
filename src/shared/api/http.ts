import { problemDetailSchema, validationProblemSchema, type ValidationError } from './problemDetail'

export const API_BASE_URL = '/api/v1'

export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly errors?: ValidationError[]

  constructor(status: number, message: string, code?: string, errors?: ValidationError[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.errors = errors
  }
}

async function toApiError(response: Response) {
  const body: unknown = await response.json().catch(() => null)
  const validation = validationProblemSchema.safeParse(body)

  if (validation.success) {
    return new ApiError(
      response.status,
      validation.data.message,
      validation.data.code,
      validation.data.errors,
    )
  }

  const problem = problemDetailSchema.safeParse(body)

  if (problem.success) {
    return new ApiError(response.status, problem.data.message, problem.data.code)
  }

  return new ApiError(response.status, response.statusText)
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit,
  parse: (data: unknown) => T,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  if (!response.ok) {
    throw await toApiError(response)
  }

  const data: unknown = response.status === 204 ? null : await response.json()

  return parse(data)
}
