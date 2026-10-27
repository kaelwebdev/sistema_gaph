import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from 'pdf-lib'

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

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 48
const BOTTOM_LIMIT = 70
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

const SMART_PUNCTUATION: ReadonlyArray<readonly [RegExp, string]> = [
  [/[\u2018\u2019]/g, "'"],
  [/[\u201C\u201D]/g, '"'],
  [/[\u2013\u2014]/g, '-'],
  [/\u2026/g, '...'],
  [/\u00A0/g, ' '],
]

const WINANSI_UNSUPPORTED = new Set([0x81, 0x8d, 0x8f, 0x90, 0x9d])

function isWinAnsiSupported(codePoint: number): boolean {
  // Control characters have no WinAnsi glyph: pdf-lib throws when encoding them.
  if (codePoint < 0x20 || codePoint === 0x7f) return false

  return codePoint <= 0xff && !WINANSI_UNSUPPORTED.has(codePoint)
}

/**
 * Fits arbitrary user text into the WinAnsi encoding used by the standard
 * PDF fonts: smart punctuation is normalized, and anything else the encoding
 * cannot represent becomes a question mark.
 */
export function sanitizePdfText(value: string): string {
  let normalized = value

  for (const [pattern, replacement] of SMART_PUNCTUATION) {
    normalized = normalized.replace(pattern, replacement)
  }

  let sanitized = ''

  for (const character of normalized) {
    const codePoint = character.codePointAt(0) ?? 0
    sanitized += isWinAnsiSupported(codePoint) ? character : '?'
  }

  return sanitized
}

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

function fitText(text: string, font: PDFFont, size: number, maxWidth: number): string {
  const sanitized = sanitizePdfText(text)

  if (font.widthOfTextAtSize(sanitized, size) <= maxWidth) {
    return sanitized
  }

  const ellipsis = '...'
  let truncated = sanitized

  while (
    truncated.length > 0 &&
    font.widthOfTextAtSize(truncated + ellipsis, size) > maxWidth
  ) {
    truncated = truncated.slice(0, -1)
  }

  return truncated + ellipsis
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
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
    color: rgb(0.93, 0.94, 0.95),
  })

  let x = MARGIN

  for (const column of COLUMNS) {
    page.drawText(sanitizePdfText(column.label), {
      x: x + CELL_PADDING,
      y: top - HEADER_ROW_HEIGHT + 6,
      size: 9,
      font: boldFont,
      color: rgb(0.15, 0.17, 0.2),
    })
    x += column.width
  }

  page.drawLine({
    start: { x: MARGIN, y: top - HEADER_ROW_HEIGHT },
    end: { x: MARGIN + TABLE_WIDTH, y: top - HEADER_ROW_HEIGHT },
    thickness: 0.5,
    color: rgb(0.8, 0.82, 0.85),
  })

  return top - HEADER_ROW_HEIGHT
}

function drawFooter(page: PDFPage, regularFont: PDFFont, pageNumber: number, totalPages: number): void {
  const footerSize = 8
  const footerColor = rgb(0.45, 0.48, 0.52)
  const leftText = sanitizePdfText(`Generado el ${formatDate(new Date())}`)
  const rightText = sanitizePdfText(`Página ${pageNumber} de ${totalPages}`)

  page.drawText(leftText, {
    x: MARGIN,
    y: 32,
    size: footerSize,
    font: regularFont,
    color: footerColor,
  })

  page.drawText(rightText, {
    x: PAGE_WIDTH - MARGIN - regularFont.widthOfTextAtSize(rightText, footerSize),
    y: 32,
    size: footerSize,
    font: regularFont,
    color: footerColor,
  })
}

export async function buildParticipantsPdf(input: ParticipantsPdfInput): Promise<Uint8Array> {
  const { assembly, participants } = input
  const pdfDoc = await PDFDocument.create()
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const sortedParticipants = [...participants].sort(compareParticipants)

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - MARGIN

  if (assembly.condominiumName) {
    page.drawText(sanitizePdfText(assembly.condominiumName), {
      x: MARGIN,
      y: y - 11,
      size: 11,
      font: regularFont,
      color: rgb(0.42, 0.45, 0.5),
    })
    y -= 18
  }

  page.drawText(fitText(assembly.title, boldFont, 18, TABLE_WIDTH), {
    x: MARGIN,
    y: y - 18,
    size: 18,
    font: boldFont,
  })
  y -= 26

  const dateLine = `${formatDate(assembly.date)} · ${STATUS_LABELS[assembly.status] ?? assembly.status}`
  page.drawText(fitText(dateLine, regularFont, 10, TABLE_WIDTH), {
    x: MARGIN,
    y: y - 10,
    size: 10,
    font: regularFont,
  })
  y -= 16

  page.drawText(sanitizePdfText(`Total de participantes: ${sortedParticipants.length}`), {
    x: MARGIN,
    y: y - 10,
    size: 10,
    font: regularFont,
  })
  y -= 22

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
        y = PAGE_HEIGHT - MARGIN

        page.drawText(fitText(assembly.title, boldFont, 11, TABLE_WIDTH), {
          x: MARGIN,
          y: y - 11,
          size: 11,
          font: boldFont,
        })
        y -= 24

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
