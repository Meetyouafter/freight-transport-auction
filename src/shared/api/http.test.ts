import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiFetch } from './http'

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('apiFetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('parses a successful response through the given parser', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(200, { id: 1 })))

    const result = await apiFetch(
      '/auctions/1',
      { method: 'GET' },
      (data) => data as { id: number },
    )

    expect(result).toEqual({ id: 1 })
  })

  it('returns null-derived data for a 204 response without reading the body', async () => {
    const response = new Response(null, { status: 204 })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

    const result = await apiFetch('/auctions/1/bets', { method: 'POST' }, (data) => data)

    expect(result).toBeNull()
  })

  it('rejects with an ApiError built from a validation problem body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(422, {
          code: 'validation_error',
          title: 'Validation failed',
          message: 'Ставка должна быть больше 0',
          errors: [{ field: 'price', message: 'Ставка должна быть больше 0' }],
        }),
      ),
    )

    await expect(
      apiFetch('/auctions/1/bets', { method: 'POST' }, (data) => data),
    ).rejects.toMatchObject({
      status: 422,
      message: 'Ставка должна быть больше 0',
      code: 'validation_error',
      errors: [{ field: 'price', message: 'Ставка должна быть больше 0' }],
    })
  })

  it('rejects with an ApiError built from a plain problem-detail body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(404, {
          code: 'not_found',
          title: 'Not found',
          message: 'Auction not found',
        }),
      ),
    )

    await expect(
      apiFetch('/auctions/999', { method: 'GET' }, (data) => data),
    ).rejects.toMatchObject({
      status: 404,
      message: 'Auction not found',
      code: 'not_found',
    })
  })

  it('falls back to statusText when the error body matches neither problem schema', async () => {
    const response = new Response('Internal Server Error', {
      status: 500,
      statusText: 'Server Error',
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

    await expect(apiFetch('/auctions/1', { method: 'GET' }, (data) => data)).rejects.toMatchObject({
      status: 500,
      message: 'Server Error',
    })
  })

  it('rejects with a real ApiError instance', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 400 })))

    await expect(apiFetch('/x', { method: 'GET' }, (data) => data)).rejects.toBeInstanceOf(ApiError)
  })
})
