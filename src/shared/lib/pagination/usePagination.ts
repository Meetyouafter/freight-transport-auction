import { useState } from 'react'

interface UsePaginationOptions<T extends number> {
  defaultPerPage: T
}

export function usePagination<T extends number>({ defaultPerPage }: UsePaginationOptions<T>) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState<T>(defaultPerPage)

  const changePerPage = (value: T) => {
    setPerPage(value)
    setPage(1)
  }

  const resetPage = () => setPage(1)

  return { page, perPage, setPage, changePerPage, resetPage }
}
