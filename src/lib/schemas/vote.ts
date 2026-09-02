import { z } from 'zod'

export const voteSchema = z.object({
  surveyId: z.string().min(1),
  optionId: z.string().min(1),
})