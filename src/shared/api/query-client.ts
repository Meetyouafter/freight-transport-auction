import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './http'

const MAX_RETRIES = 2

/** 4xx is a verdict, not a hiccup: retrying a 404/422 only delays the error state. */
function retryOnlyTransient(failureCount: number, error: unknown) {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false
  }

  return failureCount < MAX_RETRIES
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: retryOnlyTransient,
    },
  },
})
