import { z } from 'zod'

export const problemDetailSchema = z.object({
  code: z.string(),
  title: z.string(),
  message: z.string(),
  trace_id: z.string().nullable().optional(),
})

export type ProblemDetail = z.infer<typeof problemDetailSchema>

export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string().nullable().optional(),
})

export type ValidationError = z.infer<typeof validationErrorSchema>

export const validationProblemSchema = z.object({
  code: z.string(),
  title: z.string(),
  message: z.string(),
  trace_id: z.string().nullable().optional(),
  errors: z.array(validationErrorSchema),
})

export type ValidationProblem = z.infer<typeof validationProblemSchema>
