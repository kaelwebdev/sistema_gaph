'use server'

import { prisma } from '@/lib/db'
import { createPQRSSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function submitPQRS(data: {
  tipo: 'PREGUNTA' | 'QUEJA' | 'RECLAMO' | 'SUGERENCIA'
  asunto: string
  descripcion: string
  nombreCompleto: string
  email: string
  telefono: string
  torre: string
  numero: number
  clienteId: string
}) {
  const validated = createPQRSSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    // Find apartamento by torre, numero and clienteId
    const apartamento = await prisma.apartamento.findFirst({
      where: {
        torre: validated.data.torre,
        numero: validated.data.numero.toString(),
        clienteId: validated.data.clienteId,
      },
    })

    const pqrs = await prisma.pQRS.create({
      data: {
        tipo: validated.data.tipo,
        asunto: validated.data.asunto,
        descripcion: validated.data.descripcion,
        nombreCompleto: validated.data.nombreCompleto,
        email: validated.data.email,
        telefono: validated.data.telefono,
        torre: validated.data.torre,
        numero: validated.data.numero,
        estado: 'SIN_LEER',
        clienteId: validated.data.clienteId,
        apartamentoId: apartamento?.id || undefined,
      },
    })
    revalidatePath('/pqrs')
    return { success: true, data: pqrs }
  } catch (e) {
    console.error('Error creating PQRS:', e)
    return { error: 'Error al enviar la solicitud' }
  }
}

export async function getPQRS(clienteId: string) {
  return prisma.pQRS.findMany({
    where: { 
      deletedAt: null,
      clienteId,
    },
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

export async function updatePQRSEstado(id: string, estado: 'PENDIENTE' | 'RESUELTO' | 'RECHAZADO' | 'SIN_LEER') {
  try {
    const pqrs = await prisma.pQRS.update({
      where: { id },
      data: { estado },
    })
    return { success: true, data: pqrs }
  } catch {
    return { error: 'Error al actualizar el estado' }
  }
}

export async function deletePQRS(id: string) {
  try {
    await prisma.pQRS.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return { success: true }
  } catch {
    return { error: 'Error al eliminar el PQRS' }
  }
}