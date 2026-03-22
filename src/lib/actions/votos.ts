'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function emitVote(data: {
  apartamentoId: string
  encuestaId: string
  opcionId: string
}) {
  try {
    const existingVote = await prisma.voto.findUnique({
      where: {
        apartamentoId_encuestaId: {
          apartamentoId: data.apartamentoId,
          encuestaId: data.encuestaId,
        },
      },
    })

    if (existingVote && !existingVote.deletedAt) {
      return { error: 'Este apartamento ya ha votado en esta encuesta' }
    }

    if (existingVote && existingVote.deletedAt) {
      const voto = await prisma.voto.update({
        where: { id: existingVote.id },
        data: {
          opcionId: data.opcionId,
          deletedAt: null,
        },
      })
      revalidatePath('/asambleas')
      return { success: true, data: voto }
    }

    const voto = await prisma.voto.create({
      data: {
        apartamentoId: data.apartamentoId,
        encuestaId: data.encuestaId,
        opcionId: data.opcionId,
      },
    })
    revalidatePath('/asambleas')
    return { success: true, data: voto }
  } catch {
    return { error: 'Error al emitir el voto' }
  }
}

export async function getEncuestaResultados(encuestaId: string) {
  const encuesta = await prisma.encuesta.findUnique({
    where: { id: encuestaId },
    include: {
      opciones: {
        include: {
          votos: {
            where: { deletedAt: null },
          },
        },
        orderBy: { orden: 'asc' },
      },
    },
  })

  if (!encuesta) return null

  const totalVotos = encuesta.opciones.reduce(
    (acc, opcion) => acc + opcion.votos.length,
    0
  )

  const resultados = encuesta.opciones.map((opcion) => ({
    id: opcion.id,
    texto: opcion.texto,
    votos: opcion.votos.length,
    porcentaje: totalVotos > 0 ? (opcion.votos.length / totalVotos) * 100 : 0,
  }))

  return {
    ...encuesta,
    resultados,
    totalVotos,
  }
}

export async function getEncuestasActivas(asambleaId: string) {
  return prisma.encuesta.findMany({
    where: {
      asambleaId,
      estado: 'ACTIVA',
      deletedAt: null,
    },
    include: {
      opciones: {
        orderBy: { orden: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}