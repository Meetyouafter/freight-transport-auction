import { z } from 'zod'

/** `LoadingTypes` — shared by the list item and the show-page cargo blocks. */
export const loadingTypesSchema = z.object({
  side: z.boolean(),
  top: z.boolean(),
  rear: z.boolean(),
  full: z.boolean(),
})

/** `Docs` — shared by the list item and the show-page cargo blocks. */
export const docsSchema = z.object({
  tir: z.boolean(),
  cmr: z.boolean(),
  t1: z.boolean(),
  med: z.boolean(),
})
