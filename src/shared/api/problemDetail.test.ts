import { describe, expect, it } from 'vitest'
import { problemDetailSchema, validationProblemSchema } from './problemDetail'

describe('problemDetailSchema', () => {
  it('parses a minimal problem detail without trace_id', () => {
    const result = problemDetailSchema.parse({
      code: 'not_found',
      title: 'Not found',
      message: 'Auction not found',
    })

    expect(result).toEqual({
      code: 'not_found',
      title: 'Not found',
      message: 'Auction not found',
    })
  })

  it('rejects a payload missing required fields', () => {
    expect(() => problemDetailSchema.parse({ code: 'x' })).toThrow()
  })
})

describe('validationProblemSchema', () => {
  it('parses field-level validation errors', () => {
    const result = validationProblemSchema.parse({
      code: 'validation_error',
      title: 'Validation failed',
      message: 'Some fields are invalid',
      errors: [{ field: 'price', message: 'Ставка должна быть больше 0', code: 'min' }],
    })

    expect(result.errors).toEqual([
      { field: 'price', message: 'Ставка должна быть больше 0', code: 'min' },
    ])
  })

  it('rejects a payload where errors is not an array', () => {
    expect(() =>
      validationProblemSchema.parse({
        code: 'validation_error',
        title: 'Validation failed',
        message: 'Some fields are invalid',
        errors: { field: 'price' },
      }),
    ).toThrow()
  })
})
