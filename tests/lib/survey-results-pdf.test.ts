import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import {
  buildSurveyResultsPdf,
  computeQuorum,
  computeSurveyStats,
  type SurveyResultsPdfInput,
} from '@/lib/pdf/survey-results-pdf'

function makeInput(overrides: Partial<SurveyResultsPdfInput> = {}): SurveyResultsPdfInput {
  return {
    assembly: {
      title: 'Asamblea Ordinaria 2026',
      date: new Date('2026-03-15T14:30:00.000Z'),
      status: 'ABIERTA',
      condominiumName: 'Conjunto Residencial GAPH',
    },
    participantsCount: 12,
    surveys: [
      {
        question: '¿Aprueba el presupuesto presentado?',
        type: 'BINARIA',
        status: 'ACTIVA',
        options: [
          { text: 'Sí', votes: 8 },
          { text: 'No', votes: 4 },
        ],
      },
    ],
    ...overrides,
  }
}

function makeSurvey(index: number): SurveyResultsPdfInput['surveys'][number] {
  return {
    question: `¿Aprueba la propuesta ${index}?`,
    type: 'MULTIPLE',
    status: 'CERRADA',
    options: [
      { text: 'Opción A', votes: index },
      { text: 'Opción B', votes: index + 1 },
      { text: 'Opción C', votes: index + 2 },
      { text: 'Opción D', votes: index + 3 },
    ],
  }
}

function isPdfHeader(bytes: Uint8Array): string {
  return Buffer.from(bytes.subarray(0, 5)).toString('latin1')
}

describe('computeSurveyStats', () => {
  it('computes total votes and per-option percentages', () => {
    const stats = computeSurveyStats([
      { text: 'Sí', votes: 2 },
      { text: 'No', votes: 1 },
    ])

    expect(stats.totalVotes).toBe(3)
    expect(stats.results).toHaveLength(2)
    expect(stats.results[0].percentage).toBeCloseTo((2 / 3) * 100)
    expect(stats.results[1].percentage).toBeCloseTo((1 / 3) * 100)
  })

  it('returns zero totals for an empty option list', () => {
    expect(computeSurveyStats([])).toEqual({ totalVotes: 0, results: [] })
  })

  it('returns zero percentages when every option has no votes', () => {
    const stats = computeSurveyStats([
      { text: 'A', votes: 0 },
      { text: 'B', votes: 0 },
    ])

    expect(stats.totalVotes).toBe(0)
    expect(stats.results.map((result) => result.percentage)).toEqual([0, 0])
  })
})

describe('computeQuorum', () => {
  it('returns zero when there are no participants', () => {
    expect(computeQuorum(3, 0)).toBe(0)
  })

  it('rounds the participation percentage', () => {
    expect(computeQuorum(1, 4)).toBe(25)
    expect(computeQuorum(2, 3)).toBe(67)
  })
})

describe('buildSurveyResultsPdf', () => {
  it('generates a valid PDF', async () => {
    const bytes = await buildSurveyResultsPdf(makeInput())

    expect(isPdfHeader(bytes)).toBe('%PDF-')
    await expect(PDFDocument.load(bytes)).resolves.toBeInstanceOf(PDFDocument)
  })

  it('paginates when there are many surveys and options', async () => {
    const surveys = Array.from({ length: 30 }, (_, index) => makeSurvey(index))
    const bytes = await buildSurveyResultsPdf(makeInput({ surveys }))
    const pdfDoc = await PDFDocument.load(bytes)

    expect(pdfDoc.getPageCount()).toBeGreaterThan(1)
  })

  it('produces a valid single-page PDF when there are no surveys', async () => {
    const bytes = await buildSurveyResultsPdf(makeInput({ surveys: [] }))

    expect(isPdfHeader(bytes)).toBe('%PDF-')
    const pdfDoc = await PDFDocument.load(bytes)
    expect(pdfDoc.getPageCount()).toBe(1)
  })

  it('handles an emoji and a very long word in the question', async () => {
    const bytes = await buildSurveyResultsPdf(
      makeInput({
        surveys: [
          {
            question: `¿Aprueba 😀 ${'x'.repeat(300)} fin?`,
            type: 'BINARIA',
            status: 'ACTIVA',
            options: [
              { text: 'Sí', votes: 1 },
              { text: 'No', votes: 0 },
            ],
          },
        ],
      })
    )

    expect(isPdfHeader(bytes)).toBe('%PDF-')
    await expect(PDFDocument.load(bytes)).resolves.toBeInstanceOf(PDFDocument)
  })

  it('handles long option text without throwing', async () => {
    const bytes = await buildSurveyResultsPdf(
      makeInput({
        surveys: [
          {
            question: '¿Aprueba el texto largo?',
            type: 'MULTIPLE',
            status: 'CERRADA',
            options: [
              { text: 'A'.repeat(400), votes: 3 },
              { text: 'B'.repeat(400), votes: 1 },
            ],
          },
        ],
      })
    )

    expect(isPdfHeader(bytes)).toBe('%PDF-')
    await expect(PDFDocument.load(bytes)).resolves.toBeInstanceOf(PDFDocument)
  })
})
