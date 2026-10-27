import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { buildParticipantsPdf } from '@/lib/pdf/participants-pdf'

function slugifyTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')
}

function buildFilename(title: string, assemblyId: string, date: Date): string {
  const slug = slugifyTitle(title) || slugifyTitle(assemblyId) || 'asamblea'
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `participantes-${slug}-${year}-${month}-${day}.pdf`
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  const assembly = await prisma.assembly.findUnique({
    where: { id },
    include: {
      condominium: { select: { name: true } },
      participants: { include: { person: true, apartment: true } },
    },
  })

  if (!assembly || assembly.deletedAt) {
    return NextResponse.json({ error: 'Asamblea no encontrada' }, { status: 404 })
  }

  if (session.user.condominiumId && assembly.condominiumId !== session.user.condominiumId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

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

  const filename = buildFilename(assembly.title, assembly.id, assembly.date)

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
