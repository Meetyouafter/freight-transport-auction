import { describe, expect, it } from 'vitest'
import { paginationSearchSchema } from './paginationSearchSchema'

describe('paginationSearchSchema', () => {
  it('parses valid page and per_page', () => {
    const result = paginationSearchSchema.parse({ page: 2, per_page: 25 })

    expect(result).toEqual({ page: 2, per_page: 25 })
  })

  it('allows both fields to be omitted', () => {
    expect(paginationSearchSchema.parse({})).toEqual({})
  })

  it('drops a non-positive page via .catch(undefined) instead of throwing', () => {
    expect(paginationSearchSchema.parse({ page: 0 })).toEqual({ page: undefined })
    expect(paginationSearchSchema.parse({ page: -1 })).toEqual({ page: undefined })
  })

  it('drops a non-integer per_page via .catch(undefined) instead of throwing', () => {
    expect(paginationSearchSchema.parse({ per_page: 10.5 })).toEqual({ per_page: undefined })
  })

  it('drops a wrong-typed value via .catch(undefined) instead of throwing', () => {
    expect(paginationSearchSchema.parse({ page: 'two' })).toEqual({ page: undefined })
  })
})
