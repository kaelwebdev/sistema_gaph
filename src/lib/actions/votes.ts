'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function emitVote(data: {
  apartmentId: string
  surveyId: string
  optionId: string
}) {
  try {
    const existingVote = await prisma.vote.findUnique({
      where: {
        apartmentId_surveyId: {
          apartmentId: data.apartmentId,
          surveyId: data.surveyId,
        },
      },
    })

    if (existingVote && !existingVote.deletedAt) {
      return { error: 'Este apartment ya ha votado en esta encuesta' }
    }

    if (existingVote && existingVote.deletedAt) {
      const vote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: {
          optionId: data.optionId,
          deletedAt: null,
        },
      })
      revalidatePath('/assemblies')
      return { success: true, data: vote }
    }

    const vote = await prisma.vote.create({
      data: {
        apartmentId: data.apartmentId,
        surveyId: data.surveyId,
        optionId: data.optionId,
      },
    })
    revalidatePath('/assemblies')
    return { success: true, data: vote }
  } catch {
    return { error: 'Error al emitir el vote' }
  }
}

export async function getSurveyResults(surveyId: string) {
  const survey = await prisma.survey.findUnique({
    where: { id: surveyId },
    include: {
      options: {
        include: {
          votes: {
            where: { deletedAt: null },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!survey) return null

  const totalVotes = survey.options.reduce(
    (acc, option) => acc + option.votes.length,
    0
  )

  const results = survey.options.map((option) => ({
    id: option.id,
    text: option.text,
    votes: option.votes.length,
    percentage: totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0,
  }))

  return {
    ...survey,
    results,
    totalVotes,
  }
}

export async function getActiveSurveys(assemblyId: string) {
  return prisma.survey.findMany({
    where: {
      assemblyId,
      status: 'ACTIVA',
      deletedAt: null,
    },
    include: {
      options: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}