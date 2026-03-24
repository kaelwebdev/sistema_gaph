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

  const apartamentos: {
    id: string
    numero: string
    torre: string
  }[] = []

    //obtain the active apartments associated with the participating person
      const registros_participante = await prisma.participanteAsamblea.findMany({
        where: {
          personaId: persona.id,
          asamblea: {
            clienteId,
            estado: 'ABIERTA',
            deletedAt: null,
          },
        },
        include: {
          apartamento: {
            select: {
              id: true,
              numero: true,
              torre: true,
            },
          },
        },
      })

      if (registros_participante.length === 0) {
        return null
      }
      
      // Iterate over the participant records and extract the associated apartments
      registros_participante.forEach((p) => {
        const apartamentoParticipante = p.apartamento
        apartamentos.push({
          id: apartamentoParticipante.id,
          numero: apartamentoParticipante.numero,
          torre: apartamentoParticipante.torre,
        })
      })


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

// Obtain the percentage of registered participants who have voted in a specific survey
export async function getParticipationData(encuestaId: string) {
  
  // Obtain the assemblyId from the survey
  const encuesta = await prisma.encuesta.findUnique({
    where: {
      id: encuestaId,
    },
    select: {
      asambleaId: true,
    },
  })

  if (!encuesta) {
    return null
  }

  const [totalParticipantes, totalVotos] = await Promise.all([
    prisma.participanteAsamblea.count({
      where: { asambleaId: encuesta.asambleaId },
    }),
    prisma.voto.count({
      where: { encuestaId, deletedAt: null },
    })
  ]);

  // Case: Empty assembly (We avoid division by zero)
  if (totalParticipantes === 0) {
    return {
      totalParticipantes: 0,
      totalVotos: 0,
      totalPorcentajeParticipacion: 0,
    }
  }
  const result = {
    totalParticipantes,
    totalVotos,
    totalPorcentajeParticipacion: Math.round((totalVotos / totalParticipantes) * 100),
  }
  return result
}

