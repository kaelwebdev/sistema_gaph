'use server'

import { prisma } from '@/lib/db'

export async function getClientes() {
  const clientes = await prisma.cliente.findMany({
    orderBy: {
      nombre: 'asc',
    },
    select: {
      id: true,
      nombre: true,
    },
  })

  return clientes
}

export async function getAsambleasAbiertas(clienteId: string) {
  const asambleas = await prisma.asamblea.findMany({
    where: {
      clienteId,
      estado: 'ABIERTA',
      deletedAt: null,
    },
    orderBy: {
      fecha: 'desc',
    },
    select: {
      id: true,
      titulo: true,
      fecha: true,
      estado: true,
    },
  })

  return asambleas
}

export async function buscarPersonaPorCedula(cedula: string, clienteId: string) {
  const persona = await prisma.persona.findFirst({
    where: {
      cedula,
      clienteId,
      deletedAt: null,
    },
    include: {
      personasApartamentos: {
        where: {
          estadoActivo: true,
        },
        include: {
          apartamento: {
            select: {
              id: true,
              numero: true,
              torre: true,
              clienteId: true,
            },
          },
        },
      },
    },
  })

  if (!persona) {
    return null
  }

  // Filter apartments that belong to the same clienteId
  const apartamentos = persona.personasApartamentos
    .filter((pa) => pa.apartamento.clienteId === clienteId)
    .map((pa) => ({
      id: pa.apartamento.id,
      numero: pa.apartamento.numero,
      torre: pa.apartamento.torre,
    }))

  return {
    id: persona.id,
    nombre: persona.nombre,
    cedula: persona.cedula,
    apartamentos,
  }
}

export async function getEncuestasActivas(asambleaId: string) {
  const encuestas = await prisma.encuesta.findMany({
    where: {
      asambleaId,
      estado: 'ACTIVA',
      deletedAt: null,
    },
    include: {
      opciones: {
        orderBy: {
          orden: 'asc',
        },
      },
    },
    orderBy: {
      orden: 'asc',
    },
  })

  return encuestas
}

export async function emitVote(
  asambleaId: string,
  apartamentoId: string,
  encuestaId: string,
  opcionId: string
) {
  // Check if vote already exists for this apartment+survey
  const existingVote = await prisma.voto.findFirst({
    where: {
      apartamentoId,
      encuestaId,
      deletedAt: null,
    },
  })

  if (existingVote) {
    return { success: false, error: 'Ya votaste en esta encuesta' }
  }

  // Create the vote
  await prisma.voto.create({
    data: {
      apartamentoId,
      encuestaId,
      opcionId,
    },
  })

  return { success: true }
}

export async function getVotosByApartamento(asambleaId: string, apartamentoId: string) {
  const votos = await prisma.voto.findMany({
    where: {
      apartamentoId,
      deletedAt: null,
    },
    select: {
      encuestaId: true,
    },
  })

  return votos.map((v) => v.encuestaId)
}

export async function getAsamblea(asambleaId: string) {
  const asamblea = await prisma.asamblea.findUnique({
    where: {
      id: asambleaId,
    },
    select: {
      id: true,
      titulo: true,
      clienteId: true,
      estado: true,
    },
  })

  return asamblea
}

export async function getResultadosEncuesta(encuestaId: string) {
  const opciones = await prisma.opcion.findMany({
    where: {
      encuestaId,
    },
    include: {
      _count: {
        select: {
          votos: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
    orderBy: {
      orden: 'asc',
    },
  })

  const totalVotos = opciones.reduce((sum, op) => sum + op._count.votos, 0)

  return opciones.map((op) => ({
    id: op.id,
    texto: op.texto,
    orden: op.orden,
    votos: op._count.votos,
    porcentaje: totalVotos > 0 ? Math.round((op._count.votos / totalVotos) * 100) : 0,
  }))
}
