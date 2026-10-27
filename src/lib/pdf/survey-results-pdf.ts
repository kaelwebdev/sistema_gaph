import { PDFDocument, StandardFonts, rgb, type PDFPage } from 'pdf-lib'
import {
  BORDER_COLOR,
  BOTTOM_LIMIT,
  HEADER_FILL,
  MARGIN,
  MUTED_COLOR,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  TEXT_COLOR,
  drawContinuationHeader,
  drawDocumentHeader,
  drawFooter,
  fitText,
  formatDateTime,
  sanitizePdfText,
  wrapText,
  type PdfFonts,
} from './common'

export interface SurveyResultsPdfInput {
  assembly: {
    title: string
    date: Date
    status: 'ABIERTA' | 'CERRADA'
    condominiumName?: string | null
  }
  participantsCount: number
  surveys: Array<{
    question: string
    type: 'BINARIA' | 'MULTIPLE'
    status: 'ACTIVA' | 'CERRADA'
    options: Array<{ text: string; votes: number }>
  }>
}

const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const OPTION_ROW_HEIGHT = 26
const BAR_HEIGHT = 6
const BAR_COLOR = rgb(0.25, 0.45, 0.75)
const SURVEY_BREAK_RESERVE = 90

const STATUS_LABELS: Record<'ABIERTA' | 'CERRADA', string> = {
  ABIERTA: 'Abierta',
  CERRADA: 'Cerrada',
}

const TYPE_LABELS: Record<'BINARIA' | 'MULTIPLE', string> = {
  BINARIA: 'Binaria',
  MULTIPLE: 'Múltiple',
}

const SURVEY_STATUS_LABELS: Record<'ACTIVA' | 'CERRADA', string> = {
  ACTIVA: 'Activa',
  CERRADA: 'Cerrada',
}

export function computeSurveyStats(options: Array<{ text: string; votes: number }>): {
  totalVotes: number
  results: Array<{ text: string; votes: number; percentage: number }>
} {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0)

  return {
    totalVotes,
    results: options.map((option) => ({
      text: option.text,
      votes: option.votes,
      percentage: totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0,
    })),
  }
}

export function computeQuorum(totalVotes: number, participantsCount: number): number {
  if (participantsCount === 0) {
    return 0
  }

  return Math.round((totalVotes / participantsCount) * 100)
}

function votesLabel(count: number): string {
  return `${count} ${count === 1 ? 'voto' : 'votos'}`
}

function drawQuestion(
  page: PDFPage,
  fonts: PdfFonts,
  y: number,
  question: string
): number {
  const lines = wrapText(question, fonts.bold, 11, CONTENT_WIDTH)

  if (lines.length === 0) {
    return y - 14
  }

  let cursor = y

  for (const line of lines) {
    page.drawText(line, {
      x: MARGIN,
      y: cursor - 11,
      size: 11,
      font: fonts.bold,
      color: TEXT_COLOR,
    })
    cursor -= 14
  }

  return cursor
}

function drawOptionBar(
  page: PDFPage,
  y: number,
  percentage: number
): void {
  page.drawRectangle({
    x: MARGIN,
    y: y - 18,
    width: CONTENT_WIDTH,
    height: BAR_HEIGHT,
    color: HEADER_FILL,
  })

  const barWidth = (CONTENT_WIDTH * percentage) / 100

  if (barWidth > 0) {
    page.drawRectangle({
      x: MARGIN,
      y: y - 18,
      width: barWidth,
      height: BAR_HEIGHT,
      color: BAR_COLOR,
    })
  }
}

export async function buildSurveyResultsPdf(
  input: SurveyResultsPdfInput
): Promise<Uint8Array> {
  const { assembly, participantsCount, surveys } = input
  const pdfDoc = await PDFDocument.create()
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fonts: PdfFonts = { regular: regularFont, bold: boldFont }

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])

  let y = drawDocumentHeader(page, PAGE_HEIGHT - MARGIN, fonts, {
    condominiumName: assembly.condominiumName,
    title: assembly.title,
    subtitle: `${formatDateTime(assembly.date)} · ${STATUS_LABELS[assembly.status] ?? assembly.status}`,
    meta: `Total de encuestas: ${surveys.length}`,
  })

  if (surveys.length === 0) {
    page.drawText(sanitizePdfText('Esta asamblea no tiene encuestas registradas.'), {
      x: MARGIN,
      y: y - 14,
      size: 9,
      font: regularFont,
      color: MUTED_COLOR,
    })
  } else {
    surveys.forEach((survey) => {
      if (y < BOTTOM_LIMIT + SURVEY_BREAK_RESERVE) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
        y = drawContinuationHeader(page, fonts, assembly.title)
      }

      y = drawQuestion(page, fonts, y, survey.question)

      page.drawText(
        sanitizePdfText(
          `Tipo: ${TYPE_LABELS[survey.type] ?? survey.type}  ·  Estado: ${SURVEY_STATUS_LABELS[survey.status] ?? survey.status}`
        ),
        {
          x: MARGIN,
          y: y - 9,
          size: 9,
          font: regularFont,
          color: MUTED_COLOR,
        }
      )
      y -= 14

      const { totalVotes, results } = computeSurveyStats(survey.options)

      if (results.length === 0) {
        page.drawText(sanitizePdfText('Sin opciones registradas.'), {
          x: MARGIN,
          y: y - 9,
          size: 9,
          font: regularFont,
          color: MUTED_COLOR,
        })
        y -= 14
      } else {
        for (const result of results) {
          if (y < BOTTOM_LIMIT + SURVEY_BREAK_RESERVE) {
            page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
            y = drawContinuationHeader(page, fonts, assembly.title)
            y = drawQuestion(page, fonts, y, survey.question)
          }

          const rightText = sanitizePdfText(
            `${votesLabel(result.votes)} (${result.percentage.toFixed(1)}%)`
          )

          page.drawText(fitText(result.text, regularFont, 10, CONTENT_WIDTH - 150), {
            x: MARGIN,
            y: y - 10,
            size: 10,
            font: regularFont,
            color: TEXT_COLOR,
          })

          page.drawText(rightText, {
            x: MARGIN + CONTENT_WIDTH - regularFont.widthOfTextAtSize(rightText, 10),
            y: y - 10,
            size: 10,
            font: regularFont,
            color: TEXT_COLOR,
          })

          drawOptionBar(page, y, result.percentage)
          y -= OPTION_ROW_HEIGHT
        }

        if (totalVotes === 0) {
          page.drawText(sanitizePdfText('Sin votos registrados.'), {
            x: MARGIN,
            y: y - 9,
            size: 9,
            font: regularFont,
            color: MUTED_COLOR,
          })
          y -= 14
        }
      }

      const quorum = computeQuorum(totalVotes, participantsCount)
      const participation =
        participantsCount === 0
          ? 'Participación: sin participantes registrados'
          : `Participación: ${totalVotes} de ${participantsCount} participantes (${quorum}%)`

      page.drawText(sanitizePdfText(`Total: ${votesLabel(totalVotes)}  ·  ${participation}`), {
        x: MARGIN,
        y: y - 9,
        size: 9,
        font: regularFont,
        color: TEXT_COLOR,
      })
      y -= 14

      page.drawLine({
        start: { x: MARGIN, y },
        end: { x: MARGIN + CONTENT_WIDTH, y },
        thickness: 0.5,
        color: BORDER_COLOR,
      })
      y -= 18
    })
  }

  const pages = pdfDoc.getPages()
  pages.forEach((currentPage, index) => {
    drawFooter(currentPage, regularFont, index + 1, pages.length)
  })

  return pdfDoc.save()
}
