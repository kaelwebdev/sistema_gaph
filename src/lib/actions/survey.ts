'use server'

import { prisma } from '@/lib/db'
import { createSurveySchema, createSurveyOptionSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function createSurvey(data: {
  question: string
  order?: number
  status?: 'ACTIVA' | 'CERRADA'
  type?: 'BINARIA' | 'MULTIPLE'
  assemblyId: string
}) {
  const validated = createSurveySchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const survey = await prisma.survey.create({
      data: {
        question: validated.data.question,
        order: validated.data.order,
        status: validated.data.status,
        type: validated.data.type,
        assembly: { connect: { id: data.assemblyId } },
      },
    })
    revalidatePath(`/assemblies/${data.assemblyId}/encuestas`)
    return { success: true, data: survey }
  } catch {
    return { error: 'Error al crear la encuesta' }
  }
}

export async function updateSurvey(id: string, data: Partial<{
  question: string
  order: number
  status: 'ACTIVA' | 'CERRADA'
  type: 'BINARIA' | 'MULTIPLE'
}>, assemblyId?: string) {
  try {
    const survey = await prisma.survey.update({
      where: { id },
      data,
    })
    if (assemblyId) {
      revalidatePath(`/assemblies/${assemblyId}/encuestas`)
    }
    return { success: true, data: survey }
  } catch {
    return { error: 'Error al actualizar la encuesta' }
  }
}

export async function deleteSurvey(id: string, assemblyId: string) {
  try {
    await prisma.survey.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath(`/assemblies/${assemblyId}/encuestas`)
    return { success: true }
  } catch {
    return { error: 'Error al eliminar la encuesta' }
  }
}

export async function createSurveyOption(data: {
  text: string
  order?: number
  surveyId: string
}) {
  const validated = createSurveyOptionSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const option = await prisma.surveyOption.create({
      data: {
        text: validated.data.text,
        order: validated.data.order,
        survey: { connect: { id: data.surveyId } },
      },
    })
    revalidatePath(`/assemblies`)
    return { success: true, data: option }
  } catch {
    return { error: 'Error al crear la opción' }
  }
}

export async function deleteSurveyOption(id: string) {
  try {
    await prisma.surveyOption.delete({ where: { id } })
    revalidatePath(`/assemblies`)
    return { success: true }
  } catch {
    return { error: 'Error al eliminar la opción' }
  }
}

export async function getSurveysByAssembly(assemblyId: string) {
  try {
    const surveys = await prisma.survey.findMany({
      where: {
        assemblyId: assemblyId,
        deletedAt: null,
      },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
    return surveys
  } catch {
    return []
  }
}