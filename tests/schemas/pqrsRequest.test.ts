import { describe, it, expect } from 'vitest'
import { createPQRSSchema } from '@/lib/schemas/pqrsRequest'

describe('createPQRSSchema', () => {
  const validData = {
    type: 'PREGUNTA',
    subject: 'Test subject',
    description: 'Test description',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    tower: 'A',
    number: 101,
    condominiumId: 'client-123',
  }

  it('should validate correct data', () => {
    const result = createPQRSSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.type).toBe('PREGUNTA')
    }
  })

  it('should reject invalid type', () => {
    const result = createPQRSSchema.safeParse({
      ...validData,
      type: 'INVALIDO',
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty subject', () => {
    const result = createPQRSSchema.safeParse({
      ...validData,
      subject: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid email', () => {
    const result = createPQRSSchema.safeParse({
      ...validData,
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('should coerce number string to number', () => {
    const result = createPQRSSchema.safeParse({
      ...validData,
      number: '202',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.number).toBe(202)
    }
  })

  it('should accept all valid types', () => {
    const types = ['PREGUNTA', 'QUEJA', 'RECLAMO', 'SUGERENCIA']
    for (const type of types) {
      const result = createPQRSSchema.safeParse({ ...validData, type })
      expect(result.success, `type ${type} should be valid`).toBe(true)
    }
  })
})