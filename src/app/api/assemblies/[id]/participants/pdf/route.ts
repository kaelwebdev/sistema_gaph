import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { buildPdfFilename } from '@/lib/pdf/common'
import { buildParticipantsPdf } from '@/lib/pdf/participants-pdf'
import { guardPdfRequest } from '@/lib/pdf/route-guard'

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
        participants: { include: { person: true, apartment: true } },
      },
    })
  )

  if (!guard.ok) return guard.response

  const assembly = guard.assembly

  const pdfBytes = await buildParticipantsPdf({
    assembly: {
      title: assembly.title,
      date: assembly.date,
      status: assembly.status,
      condominiumName: assembly.condominium?.name ?? null,
    },
    participants: assembly.participants.map((participant) => ({
      person: {
        name: participant.person.name,
        idNumber: participant.person.idNumber,
      },
      apartment: {
        tower: participant.apartment.tower,
        number: participant.apartment.number,
      },
      type: participant.type,
    })),
  })

  const filename = buildPdfFilename('participantes', assembly.title, assembly.id, assembly.date)

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
