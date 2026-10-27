import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import {
  buildParticipantsPdf,
  sanitizePdfText,
  type ParticipantsPdfInput,
  type ParticipantsPdfParticipant,
} from '@/lib/pdf/participants-pdf'

function makeParticipant(index: number): ParticipantsPdfParticipant {
  return {
    person: { name: `Persona ${index}`, idNumber: `1000${index}` },
    apartment: { tower: 'A', number: `${100 + index}` },
    type: index % 2 === 0 ? 'PROPIETARIO' : 'APODERADO',
  }
}

function makeInput(participants: ParticipantsPdfParticipant[]): ParticipantsPdfInput {
  return {
    assembly: {
      title: 'Asamblea Ordinaria 2026',
      date: new Date('2026-03-15T14:30:00.000Z'),
      status: 'ABIERTA',
      condominiumName: 'Conjunto Residencial GAPH',
    },
    participants,
  }
}

function isPdfHeader(bytes: Uint8Array): string {
  return Buffer.from(bytes.subarray(0, 5)).toString('latin1')
}

describe('sanitizePdfText', () => {
  it('preserves Spanish accents', () => {
    expect(sanitizePdfText('José Núñez')).toBe('José Núñez')
  })

  it('replaces characters unsupported by WinAnsi with ?', () => {
    expect(sanitizePdfText('A😀B')).toBe('A?B')
  })

  it('normalizes smart punctuation', () => {
    expect(sanitizePdfText('“Hola” – fin…')).toBe('"Hola" - fin...')
  })

  it('keeps inverted punctuation and umlauts', () => {
    expect(sanitizePdfText('¿Qué tal? ¡Über!')).toBe('¿Qué tal? ¡Über!')
  })

  it('replaces control characters that WinAnsi cannot encode', () => {
    expect(sanitizePdfText('A\nB\tC')).toBe('A?B?C')
  })
})

describe('buildParticipantsPdf', () => {
  it('generates a valid PDF with a standard header', async () => {
    const bytes = await buildParticipantsPdf(makeInput([makeParticipant(1)]))

    expect(isPdfHeader(bytes)).toBe('%PDF-')
    await expect(PDFDocument.load(bytes)).resolves.toBeInstanceOf(PDFDocument)
  })

  it('paginates when the participant list is long', async () => {
    const participants = Array.from({ length: 80 }, (_, index) => makeParticipant(index))
    const bytes = await buildParticipantsPdf(makeInput(participants))
    const pdfDoc = await PDFDocument.load(bytes)

    expect(pdfDoc.getPageCount()).toBeGreaterThan(1)
  })

  it('produces a valid single-page PDF for an empty list', async () => {
    const bytes = await buildParticipantsPdf(makeInput([]))

    expect(isPdfHeader(bytes)).toBe('%PDF-')
    const pdfDoc = await PDFDocument.load(bytes)
    expect(pdfDoc.getPageCount()).toBe(1)
  })

  it('does not mutate the input participant array', async () => {
    const participants = [makeParticipant(2), makeParticipant(1)]
    const originalOrder = participants.map((participant) => participant.person.name)

    await buildParticipantsPdf(makeInput(participants))

    expect(participants.map((participant) => participant.person.name)).toEqual(originalOrder)
  })
})
