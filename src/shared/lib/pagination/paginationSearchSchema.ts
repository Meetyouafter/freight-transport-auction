import { z } from 'zod'

export const paginationSearchSchema = z.object({
  page: z.number().int().positive().optional().catch(undefined),
  per_page: z.number().int().positive().optional().catch(undefined),
})
export type PaginationSearch = z.infer<typeof paginationSearchSchema>
