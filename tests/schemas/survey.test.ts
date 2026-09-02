import { describe, it, expect } from 'vitest'
import { createSurveySchema, createSurveyOptionSchema } from '@/lib/schemas/survey'

describe('createSurveySchema', () => {
  const validData = {
    question: '¿Está de acuerdo?',
    order: 1,
    status: 'ACTIVA',
    type: 'MULTIPLE',
    assemblyId: 'asam-123',
  }

  it('should validate correct data', () => {
    const result = createSurveySchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject empty question', () => {
    const result = createSurveySchema.safeParse({
      ...validData,
      question: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid status', () => {
    const result = createSurveySchema.safeParse({
      ...validData,
      status: 'INVALIDO',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid type', () => {
    const result = createSurveySchema.safeParse({
      ...validData,
      type: 'INVALIDO',
    })
    expect(result.success).toBe(false)
  })

  it('should coerce string order to number', () => {
    const result = createSurveySchema.safeParse({
      ...validData,
      order: '5',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.order).toBe(5)
    }
  })

  it('should default order to 0', () => {
    const result = createSurveySchema.safeParse({
      question: 'Test?',
      assemblyId: 'asam-123',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.order).toBe(0)
    }
  })

  it('should default status to ACTIVA', () => {
    const result = createSurveySchema.safeParse({
      question: 'Test?',
      assemblyId: 'asam-123',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('ACTIVA')
    }
  })

  it('should default type to MULTIPLE', () => {
    const result = createSurveySchema.safeParse({
      question: 'Test?',
      assemblyId: 'asam-123',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.type).toBe('MULTIPLE')
    }
  })
})

describe('createSurveyOptionSchema', () => {
  it('should validate correct data', () => {
    const result = createSurveyOptionSchema.safeParse({ text: 'Option A' })
    expect(result.success).toBe(true)
  })

  it('should reject empty text', () => {
    const result = createSurveyOptionSchema.safeParse({ text: '' })
    expect(result.success).toBe(false)
  })

  it('should default order to 0', () => {
    const result = createSurveyOptionSchema.safeParse({ text: 'Test' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.order).toBe(0)
    }
  })

  it('should coerce string order to number', () => {
    const result = createSurveyOptionSchema.safeParse({ text: 'Test', order: '3' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.order).toBe(3)
    }
  })
})