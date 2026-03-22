import { z } from 'zod'

export const voteSchema = z.object({
  encuestaId: z.string().min(1),
  opcionId: z.string().min(1),
})