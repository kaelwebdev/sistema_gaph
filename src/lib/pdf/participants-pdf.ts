import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from 'pdf-lib'
import {
  BORDER_COLOR,
  BOTTOM_LIMIT,
  HEADER_FILL,
  MARGIN,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  TEXT_COLOR,
  drawContinuationHeader,
  drawDocumentHeader,
  drawFooter,
  fitText,
  formatDateTime,
  sanitizePdfText,
} from './common'

export { sanitizePdfText }

export interface ParticipantsPdfAssembly {
  title: string
  date: Date
  status: 'ABIERTA' | 'CERRADA'
  condominiumName?: string | null
}

export interface ParticipantsPdfParticipant {
  person: { name: string; idNumber: string }
  apartment: { tower: string; number: string }
  type: 'PROPIETARIO' | 'APODERADO'
}

export interface ParticipantsPdfInput {
  assembly: ParticipantsPdfAssembly
  participants: ParticipantsPdfParticipant[]
}

const ROW_HEIGHT = 20
const HEADER_ROW_HEIGHT = 20
const CELL_PADDING = 4

const STATUS_LABELS: Record<ParticipantsPdfInput['assembly']['status'], string> = {
  ABIERTA: 'Abierta',
  CERRADA: 'Cerrada',
}

const TYPE_LABELS: Record<ParticipantsPdfParticipant['type'], string> = {
  PROPIETARIO: 'Propietario',
  APODERADO: 'Apoderado',
}

interface TableColumn {
  label: string
  width: number
  getValue: (participant: ParticipantsPdfParticipant, index: number) => string
}

const COLUMNS: TableColumn[] = [
  {
    label: 'N°',
    width: 30,
    getValue: (_participant, index) => String(index + 1),
  },
  {
    label: 'Nombre',
    width: 150,
    getValue: (participant) => participant.person.name,
  },
  {
    label: 'Cédula',
    width: 95,
    getValue: (participant) => participant.person.idNumber,
  },
  {
    label: 'Torre',
    width: 55,
    getValue: (participant) => participant.apartment.tower,
  },
  {
    label: 'Apto',
    width: 65,
    getValue: (participant) => participant.apartment.number,
  },
  {
    label: 'Tipo',
    width: 100,
    getValue: (participant) => TYPE_LABELS[participant.type] ?? participant.type,
  },
]

const TABLE_WIDTH = COLUMNS.reduce((total, column) => total + column.width, 0)

function compareStrings(a: string, b: string): number {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

function compareApartmentNumbers(a: string, b: string): number {
  const numberA = Number(a)
  const numberB = Number(b)

  if (a.trim() !== '' && b.trim() !== '' && !Number.isNaN(numberA) && !Number.isNaN(numberB)) {
    return numberA - numberB
  }

  return compareStrings(a, b)
}

function compareParticipants(
  a: ParticipantsPdfParticipant,
  b: ParticipantsPdfParticipant
): number {
  return (
    compareStrings(a.apartment.tower, b.apartment.tower) ||
    compareApartmentNumbers(a.apartment.number, b.apartment.number) ||
    compareStrings(a.person.name, b.person.name)
  )
}

function drawTableHeader(
  page: PDFPage,
  top: number,
  boldFont: PDFFont
): number {
  page.drawRectangle({
    x: MARGIN,
    y: top - HEADER_ROW_HEIGHT,
    width: TABLE_WIDTH,
    height: HEADER_ROW_HEIGHT,
    color: HEADER_FILL,
  })

  let x = MARGIN

  for (const column of COLUMNS) {
    page.drawText(sanitizePdfText(column.label), {
      x: x + CELL_PADDING,
      y: top - HEADER_ROW_HEIGHT + 6,
      size: 9,
      font: boldFont,
      color: TEXT_COLOR,
    })
    x += column.width
  }

  page.drawLine({
    start: { x: MARGIN, y: top - HEADER_ROW_HEIGHT },
    end: { x: MARGIN + TABLE_WIDTH, y: top - HEADER_ROW_HEIGHT },
    thickness: 0.5,
    color: BORDER_COLOR,
  })

  return top - HEADER_ROW_HEIGHT
}

export async function buildParticipantsPdf(input: ParticipantsPdfInput): Promise<Uint8Array> {
  const { assembly, participants } = input
  const pdfDoc = await PDFDocument.create()
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fonts = { regular: regularFont, bold: boldFont }

  const sortedParticipants = [...participants].sort(compareParticipants)

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])

  let y = drawDocumentHeader(page, PAGE_HEIGHT - MARGIN, fonts, {
    condominiumName: assembly.condominiumName,
    title: assembly.title,
    subtitle: `${formatDateTime(assembly.date)} · ${STATUS_LABELS[assembly.status] ?? assembly.status}`,
    meta: `Total de participantes: ${sortedParticipants.length}`,
  })

  y = drawTableHeader(page, y, boldFont)

  if (sortedParticipants.length === 0) {
    page.drawText(sanitizePdfText('No hay participantes registrados'), {
      x: MARGIN + CELL_PADDING,
      y: y - 14,
      size: 9,
      font: regularFont,
      color: rgb(0.35, 0.38, 0.42),
    })
  } else {
    sortedParticipants.forEach((participant, index) => {
      if (y - ROW_HEIGHT < BOTTOM_LIMIT) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
        y = drawContinuationHeader(page, fonts, assembly.title)

        y = drawTableHeader(page, y, boldFont)
      }

      let x = MARGIN

      for (const column of COLUMNS) {
        const cellText = fitText(
          column.getValue(participant, index),
          regularFont,
          9,
          column.width - CELL_PADDING * 2
        )

        page.drawText(cellText, {
          x: x + CELL_PADDING,
          y: y - 14,
          size: 9,
          font: regularFont,
        })

        x += column.width
      }

      page.drawLine({
        start: { x: MARGIN, y: y - ROW_HEIGHT },
        end: { x: MARGIN + TABLE_WIDTH, y: y - ROW_HEIGHT },
        thickness: 0.5,
        color: rgb(0.88, 0.89, 0.91),
      })

      y -= ROW_HEIGHT
    })
  }

  const pages = pdfDoc.getPages()
  pages.forEach((currentPage, index) => {
    drawFooter(currentPage, regularFont, index + 1, pages.length)
  })

  return pdfDoc.save()
}
