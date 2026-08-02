import { describe, expect, it } from 'vitest'
import { problemDetailSchema, validationProblemSchema } from '@shared/api/problemDetail'
import { notFoundResponse, problemResponse, validationProblemResponse } from './problemResponses'

describe('problemResponses', () => {
  it('serves ProblemDetail as application/problem+json', async () => {
    const response = notFoundResponse('Аукцион не найден')

    expect(response.status).toBe(404)
    expect(response.headers.get('Content-Type')).toBe('application/problem+json')

    const body = problemDetailSchema.parse(await response.json())

    expect(body.code).toBe('resource_not_found')
    expect(body.trace_id).toEqual(expect.any(String))
  })

  it('serves ValidationProblem with per-field errors', async () => {
    const response = validationProblemResponse([
      {
        field: 'price',
        message: 'Ставка должна быть выше текущей цены 58000 ₽',
        code: 'out_of_bounds',
      },
    ])

    expect(response.status).toBe(422)
    expect(response.headers.get('Content-Type')).toBe('application/problem+json')

    const body = validationProblemSchema.parse(await response.json())

    expect(body.errors).toHaveLength(1)
    expect(body.errors[0].field).toBe('price')
  })

  it('keeps a custom problem code and status', async () => {
    const response = problemResponse(422, {
      code: 'bet_not_allowed',
      title: 'Ставка невозможна',
      message: 'Аукцион не принимает ставки',
    })

    expect(response.status).toBe(422)
    expect(problemDetailSchema.parse(await response.json()).code).toBe('bet_not_allowed')
  })
})
