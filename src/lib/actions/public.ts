'use server'

import { prisma } from '@/lib/db'

export async function getCondominiums() {
  const condominiums = await prisma.condominium.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
    },
  })

  return condominiums
}

export async function getOpenAssemblies(condominiumId: string) {
  
  const assemblies = await prisma.assembly.findMany({
    where: {
      condominiumId,
      status: 'ABIERTA',
      deletedAt: null,
    },
    orderBy: {
      date: 'desc',
    },
    select: {
      id: true,
      title: true,
      date: true,
      status: true,
    },
  })

  return assemblies.map((a) => ({
    id: a.id,
    titulo: a.title,
    fecha: a.date,
    estado: a.status,
  }))
}

export async function searchPersonByIdNumber(idNumber: string, condominiumId: string) {
  const person = await prisma.person.findFirst({
    where: {
      idNumber,
      condominiumId,
      deletedAt: null,
    },
    include: {
      personApartments: {
        where: {
          isActive: true,
        },
        include: {
          apartment: {
            select: {
              id: true,
              number: true,
              tower: true,
              condominiumId: true,
            },
          },
        },
      },
    },
  })
  
  if (!person) {
    return null
  }

  const apartments: {
    id: string
    number: string
    tower: string
  }[] = []

    //obtain the active apartments associated with the participating person
      const participantRecords = await prisma.assemblyParticipant.findMany({
        where: {
          personId: person.id,
          assembly: {
            condominiumId,
            status: 'ABIERTA',
            deletedAt: null,
          },
        },
        include: {
          apartment: {
            select: {
              id: true,
              number: true,
              tower: true,
            },
          },
        },
      })

      if (participantRecords.length === 0) {
        return null
      }
      
      // Iterate over the participant records and extract the associated apartments
      participantRecords.forEach((p) => {
        const apartmentParticipant = p.apartment
        apartments.push({
          id: apartmentParticipant.id,
          number: apartmentParticipant.number,
          tower: apartmentParticipant.tower,
        })
      })


  return {
    id: person.id,
    nombre: person.name,
    cedula: person.idNumber,
    apartments: apartments.map((a) => ({
      id: a.id,
      numero: a.number,
      torre: a.tower,
    })),
  }
}

export async function getActiveSurveys(assemblyId: string) {
  const surveys = await prisma.survey.findMany({
    where: {
      assemblyId,
      status: 'ACTIVA',
      deletedAt: null,
    },
    include: {
      options: {
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  })

  return surveys.map((s) => ({
    id: s.id,
    pregunta: s.question,
    tipo: s.type,
    surveyOptions: s.options.map((o) => ({
      id: o.id,
      texto: o.text,
      orden: o.order,
    })),
  }))
}

export async function emitVote(
  assemblyId: string,
  apartmentId: string,
  surveyId: string,
  optionId: string
) {
  // Check if vote already exists for this apartment+survey
  const existingVote = await prisma.vote.findFirst({
    where: {
      apartmentId,
      surveyId,
      deletedAt: null,
    },
  })

  if (existingVote) {
    return { success: false, error: 'Ya votaste en esta encuesta' }
  }

  // Create the vote
  await prisma.vote.create({
    data: {
      apartmentId,
      surveyId,
      optionId,
    },
  })

  return { success: true }
}

export async function getVotesByApartment(assemblyId: string, apartmentId: string) {
  const votes = await prisma.vote.findMany({
    where: {
      apartmentId,
      deletedAt: null,
    },
    select: {
      surveyId: true,
    },
  })

  return votes.map((v) => v.surveyId)
}

export async function getAssembly(assemblyId: string) {
  console.log('Fetching assembly with ID:', assemblyId);
  const assembly = await prisma.assembly.findUnique({
    where: {
      id: assemblyId,
    },
    select: {
      id: true,
      title: true,
      condominiumId: true,
      status: true,
    },
  })

  if (!assembly) return null

  return {
    id: assembly.id,
    titulo: assembly.title,
    clienteId: assembly.condominiumId,
    estado: assembly.status,
  }
}

export async function getSurveyResults(surveyId: string) {
  const options = await prisma.surveyOption.findMany({
    where: {
      surveyId,
    },
    include: {
      _count: {
        select: {
          votes: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  })

  const totalVotes = options.reduce((sum, op) => sum + op._count.votes, 0)

  return {
    resultados: options.map((op) => ({
      id: op.id,
      texto: op.text,
      orden: op.order,
      votes: op._count.votes,
      porcentaje: totalVotes > 0 ? Math.round((op._count.votes / totalVotes) * 100) : 0,
    })),
    totalVotes: totalVotes,
  }
}

// Obtain the percentage of registered participants who have voted in a specific survey
export async function getParticipationData(surveyId: string) {
  
  // Obtain the assemblyId from the survey
  const survey = await prisma.survey.findUnique({
    where: {
      id: surveyId,
    },
    select: {
      assemblyId: true,
    },
  })

  if (!survey) {
    return null
  }

  const [totalParticipants, totalVotes] = await Promise.all([
    prisma.assemblyParticipant.count({
      where: { assemblyId: survey.assemblyId },
    }),
    prisma.vote.count({
      where: { surveyId, deletedAt: null },
    })
  ]);

  // Case: Empty assembly (We avoid division by zero)
  if (totalParticipants === 0) {
    return {
      totalParticipants: 0,
      totalVotes: 0,
      totalPorcentajeParticipacion: 0,
    }
  }
  return {
    totalParticipants: totalParticipants,
    totalVotes: totalVotes,
    totalPorcentajeParticipacion: Math.round((totalVotes / totalParticipants) * 100),
  }
}