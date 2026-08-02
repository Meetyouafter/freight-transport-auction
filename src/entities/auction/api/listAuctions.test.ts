import { QueryClient, QueryObserver } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { auctionsListQueryOptions } from './listAuctions'

const emptyPage = {
  data: [],
  meta: { current_page: 1, from: 0, last_page: 1, per_page: 10, to: 0, total: 0 },
}

function stubFetch() {
  const fetchMock = vi.fn(
    () =>
      new Promise<Response>((resolve) => setTimeout(() => resolve(Response.json(emptyPage)), 10)),
  )

  vi.stubGlobal('fetch', fetchMock)

  return fetchMock
}

/** Mount → unmount → mount, the way `React.StrictMode` does it in development. */
function simulateStrictModeMount(client: QueryClient) {
  const options = auctionsListQueryOptions({ page: 1, per_page: 10 })
  const unsubscribe = new QueryObserver(client, options).subscribe(() => {})
  unsubscribe()
  new QueryObserver(client, options).subscribe(() => {})
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('auctionsListQueryOptions', () => {
  it('requests the list once when the observer is remounted mid-flight', async () => {
    const fetchMock = stubFetch()

    simulateStrictModeMount(new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } }))
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled())
    await new Promise((resolve) => setTimeout(resolve, 30))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('keys the query under "auctions" so a placed bid invalidates every list', () => {
    expect(auctionsListQueryOptions({ is_bidder: true }).queryKey[0]).toBe('auctions')
  })
})
