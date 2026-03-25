import { describe, it, expect } from 'vitest'
import { createPQRSSchema } from '@/lib/schemas/pqrs'

describe('createPQRSSchema', () => {
  const validData = {
    tipo: 'PREGUNTA',
    asunto: 'Test subject',
    descripcion: 'Test description',
    nombreCompleto: 'John Doe',
    email: 'john@example.com',
    telefono: '1234567890',
    torre: 'A',
    numero: 101,
    clienteId: 'client-123',
  }

  it('should validate correct data', () => {
    const result = createPQRSSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.tipo).toBe('PREGUNTA')
    }
  })

  it('should reject invalid tipo', () => {
    const result = createPQRSSchema.safeParse({
      ...validData,
      tipo: 'INVALIDO',
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty asunto', () => {
    const result = createPQRSSchema.safeParse({
      ...validData,
      asunto: '',
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

  it('should coerce numero string to number', () => {
    const result = createPQRSSchema.safeParse({
      ...validData,
      numero: '202',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.numero).toBe(202)
    }
  })

  it('should accept all valid tipos', () => {
    const tipos = ['PREGUNTA', 'QUEJA', 'RECLAMO', 'SUGERENCIA']
    for (const tipo of tipos) {
      const result = createPQRSSchema.safeParse({ ...validData, tipo })
      expect(result.success, `tipo ${tipo} should be valid`).toBe(true)
    }
  })
})
