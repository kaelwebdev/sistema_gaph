import { rgb, type PDFFont, type PDFPage } from 'pdf-lib'

export const PAGE_WIDTH = 595.28
export const PAGE_HEIGHT = 841.89
export const MARGIN = 48
export const BOTTOM_LIMIT = 70

export const TEXT_COLOR = rgb(0.15, 0.17, 0.2)
export const MUTED_COLOR = rgb(0.45, 0.48, 0.52)
export const BORDER_COLOR = rgb(0.8, 0.82, 0.85)
export const HEADER_FILL = rgb(0.93, 0.94, 0.95)

export interface PdfFonts {
  regular: PDFFont
  bold: PDFFont
}

export interface DocumentHeaderContent {
  condominiumName?: string | null
  title: string
  subtitle: string
  meta?: string
}

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

function contentWidth(): number {
  return PAGE_WIDTH - MARGIN * 2
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

export function fitText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string {
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

function splitWord(
  word: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  const parts: string[] = []
  let rest = word

  while (rest.length > 0) {
    let end = rest.length

    while (end > 1 && font.widthOfTextAtSize(rest.slice(0, end), size) > maxWidth) {
      end -= 1
    }

    parts.push(rest.slice(0, end))
    rest = rest.slice(end)
  }

  return parts
}

/**
 * Sanitizes then wraps text on spaces. A single word wider than `maxWidth` is
 * hard-split so no returned line is wider than the available width.
 */
export function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  const sanitized = sanitizePdfText(text)
  const words = sanitized.split(/\s+/).filter((word) => word.length > 0)

  if (words.length === 0) {
    return []
  }

  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word

    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate
      continue
    }

    if (current) {
      lines.push(current)
      current = ''
    }

    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word
      continue
    }

    const parts = splitWord(word, font, size, maxWidth)

    for (let index = 0; index < parts.length - 1; index += 1) {
      lines.push(parts[index])
    }

    current = parts[parts.length - 1]
  }

  if (current) {
    lines.push(current)
  }

  return lines
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function drawDocumentHeader(
  page: PDFPage,
  y: number,
  fonts: PdfFonts,
  content: DocumentHeaderContent
): number {
  let cursor = y

  if (content.condominiumName) {
    page.drawText(sanitizePdfText(content.condominiumName), {
      x: MARGIN,
      y: cursor - 11,
      size: 11,
      font: fonts.regular,
      color: MUTED_COLOR,
    })
    cursor -= 18
  }

  page.drawText(fitText(content.title, fonts.bold, 18, contentWidth()), {
    x: MARGIN,
    y: cursor - 18,
    size: 18,
    font: fonts.bold,
    color: TEXT_COLOR,
  })
  cursor -= 26

  page.drawText(fitText(content.subtitle, fonts.regular, 10, contentWidth()), {
    x: MARGIN,
    y: cursor - 10,
    size: 10,
    font: fonts.regular,
    color: TEXT_COLOR,
  })
  cursor -= 16

  if (content.meta !== undefined) {
    page.drawText(sanitizePdfText(content.meta), {
      x: MARGIN,
      y: cursor - 10,
      size: 10,
      font: fonts.regular,
      color: TEXT_COLOR,
    })
    cursor -= 22
  }

  return cursor
}

export function drawContinuationHeader(
  page: PDFPage,
  fonts: PdfFonts,
  title: string
): number {
  let y = PAGE_HEIGHT - MARGIN

  page.drawText(fitText(title, fonts.bold, 11, contentWidth()), {
    x: MARGIN,
    y: y - 11,
    size: 11,
    font: fonts.bold,
    color: TEXT_COLOR,
  })
  y -= 24

  return y
}

export function drawFooter(
  page: PDFPage,
  font: PDFFont,
  pageNumber: number,
  totalPages: number
): void {
  const footerSize = 8
  const leftText = sanitizePdfText(`Generado el ${formatDateTime(new Date())}`)
  const rightText = sanitizePdfText(`Página ${pageNumber} de ${totalPages}`)

  page.drawText(leftText, {
    x: MARGIN,
    y: 32,
    size: footerSize,
    font,
    color: MUTED_COLOR,
  })

  page.drawText(rightText, {
    x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(rightText, footerSize),
    y: 32,
    size: footerSize,
    font,
    color: MUTED_COLOR,
  })
}

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

export function buildPdfFilename(
  prefix: string,
  title: string,
  assemblyId: string,
  date: Date
): string {
  const slug = slugifyTitle(title) || slugifyTitle(assemblyId) || 'asamblea'
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${prefix}-${slug}-${year}-${month}-${day}.pdf`
}
