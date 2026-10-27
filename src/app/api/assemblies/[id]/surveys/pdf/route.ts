import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { buildPdfFilename } from '@/lib/pdf/common'
import { guardPdfRequest } from '@/lib/pdf/route-guard'
import { buildSurveyResultsPdf } from '@/lib/pdf/survey-results-pdf'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const guard = await guardPdfRequest(() =>
    prisma.assembly.findUnique({
      where: { id },
      include: {
        condominium: { select: { name: true } },
        surveys: {
          where: { deletedAt: null },
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
          include: {
            options: {
              orderBy: { order: 'asc' },
              include: { votes: { where: { deletedAt: null }, select: { id: true } } },
            },
          },
        },
        _count: { select: { participants: true } },
      },
    })
  )

  if (!guard.ok) return guard.response

  const assembly = guard.assembly

  const pdfBytes = await buildSurveyResultsPdf({
    assembly: {
      title: assembly.title,
      date: assembly.date,
      status: assembly.status,
      condominiumName: assembly.condominium?.name ?? null,
    },
    participantsCount: assembly._count.participants,
    surveys: assembly.surveys.map((survey) => ({
      question: survey.question,
      type: survey.type,
      status: survey.status,
      options: survey.options.map((option) => ({
        text: option.text,
        votes: option.votes.length,
      })),
    })),
  })

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${buildPdfFilename('resultados-encuestas', assembly.title, assembly.id, assembly.date)}"`,
      'Cache-Control': 'no-store',
    },
  })
}
