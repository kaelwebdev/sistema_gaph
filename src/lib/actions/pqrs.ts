'use server'

import { prisma } from '@/lib/db'
import { createPQRSSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function submitPQRS(data: {
  tipo: 'PREGUNTA' | 'QUEJA' | 'RECLAMO' | 'SUGERENCIA'
  descripcion: string
  email?: string
  apartamentoId: string
}) {
  const validated = createPQRSSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const pqrs = await prisma.pQRS.create({
      data: {
        tipo: validated.data.tipo,
        descripcion: validated.data.descripcion,
        email: validated.data.email,
        apartamento: { connect: { id: data.apartamentoId } },
      },
    })
    return { success: true, data: pqrs }
  } catch {
    return { error: 'Error al enviar la solicitud' }
  }
}

export async function getPQRS(clienteId: string) {
  return prisma.pQRS.findMany({
    where: { deletedAt: null },
    include: {
      apartamento: true,
    },
    orderBy: { fecha: 'desc' },
  })
}

export async function getPQRSById(id: string) {
  return prisma.pQRS.findUnique({
    where: { id },
    include: { apartamento: true },
  })
}