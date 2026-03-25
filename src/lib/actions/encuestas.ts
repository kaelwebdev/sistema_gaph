'use server'

import { prisma } from '@/lib/db'
import { createEncuestaSchema, createOpcionSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function createEncuesta(data: {
  pregunta: string
  orden?: number
  estado?: 'ACTIVA' | 'CERRADA'
  tipo?: 'BINARIA' | 'MULTIPLE'
  asambleaId: string
}) {
  const validated = createEncuestaSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const encuesta = await prisma.encuesta.create({
      data: {
        pregunta: validated.data.pregunta,
        orden: validated.data.orden,
        estado: validated.data.estado,
        tipo: validated.data.tipo,
        asamblea: { connect: { id: data.asambleaId } },
      },
    })
    revalidatePath(`/asambleas/${data.asambleaId}/encuestas`)
    return { success: true, data: encuesta }
  } catch {
    return { error: 'Error al crear la encuesta' }
  }
}

export async function updateEncuesta(id: string, data: Partial<{
  pregunta: string
  orden: number
  estado: 'ACTIVA' | 'CERRADA'
  tipo: 'BINARIA' | 'MULTIPLE'
}>, asambleaId?: string) {
  try {
    const encuesta = await prisma.encuesta.update({
      where: { id },
      data,
    })
    if (asambleaId) {
      revalidatePath(`/asambleas/${asambleaId}/encuestas`)
    }
    return { success: true, data: encuesta }
  } catch {
    return { error: 'Error al actualizar la encuesta' }
  }
}

export async function deleteEncuesta(id: string, asambleaId: string) {
  try {
    await prisma.encuesta.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath(`/asambleas/${asambleaId}/encuestas`)
    return { success: true }
  } catch {
    return { error: 'Error al eliminar la encuesta' }
  }
}

export async function createOpcion(data: {
  texto: string
  orden?: number
  encuestaId: string
}) {
  const validated = createOpcionSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const opcion = await prisma.opcion.create({
      data: {
        texto: validated.data.texto,
        orden: validated.data.orden,
        encuesta: { connect: { id: data.encuestaId } },
      },
    })
    revalidatePath(`/asambleas`)
    return { success: true, data: opcion }
  } catch {
    return { error: 'Error al crear la opción' }
  }
}

export async function deleteOpcion(id: string) {
  try {
    await prisma.opcion.delete({ where: { id } })
    revalidatePath(`/asambleas`)
    return { success: true }
  } catch {
    return { error: 'Error al eliminar la opción' }
  }
}

export async function getEncuestasPorAsamblea(asambleaId: string) {
  try {
    const encuestas = await prisma.encuesta.findMany({
      where: {
        asambleaId: asambleaId,
        deletedAt: null,
      },
      include: {
        opciones: {
          orderBy: { orden: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
    return encuestas
  } catch {
    return []
  }
}
