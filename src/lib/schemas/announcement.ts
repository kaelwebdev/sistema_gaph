import { z } from 'zod'

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  content: z.string().min(1, 'El contenido es requerido'),
})

export const updateAnnouncementSchema = createAnnouncementSchema