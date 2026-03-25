import { describe, it, expect } from 'vitest'
import { createEncuestaSchema, createOpcionSchema } from '@/lib/schemas/encuesta'

describe('createEncuestaSchema', () => {
  const validData = {
    pregunta: '¿Está de acuerdo?',
    orden: 1,
    estado: 'ACTIVA',
    tipo: 'MULTIPLE',
    asambleaId: 'asamblea-123',
  }

  it('should validate correct data', () => {
    const result = createEncuestaSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject empty pregunta', () => {
    const result = createEncuestaSchema.safeParse({
      ...validData,
      pregunta: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid estado', () => {
    const result = createEncuestaSchema.safeParse({
      ...validData,
      estado: 'INVALIDO',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid tipo', () => {
    const result = createEncuestaSchema.safeParse({
      ...validData,
      tipo: 'INVALIDO',
    })
    expect(result.success).toBe(false)
  })

  it('should coerce string orden to number', () => {
    const result = createEncuestaSchema.safeParse({
      ...validData,
      orden: '5',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.orden).toBe(5)
    }
  })

  it('should default orden to 0', () => {
    const result = createEncuestaSchema.safeParse({
      pregunta: 'Test?',
      asambleaId: 'asamble-123',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.orden).toBe(0)
    }
  })

  it('should default estado to ACTIVA', () => {
    const result = createEncuestaSchema.safeParse({
      pregunta: 'Test?',
      asambleaId: 'asamble-123',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.estado).toBe('ACTIVA')
    }
  })

  it('should default tipo to MULTIPLE', () => {
    const result = createEncuestaSchema.safeParse({
      pregunta: 'Test?',
      asambleaId: 'asamble-123',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.tipo).toBe('MULTIPLE')
    }
  })
})

describe('createOpcionSchema', () => {
  it('should validate correct data', () => {
    const result = createOpcionSchema.safeParse({ texto: 'Option A' })
    expect(result.success).toBe(true)
  })

  it('should reject empty texto', () => {
    const result = createOpcionSchema.safeParse({ texto: '' })
    expect(result.success).toBe(false)
  })

  it('should default orden to 0', () => {
    const result = createOpcionSchema.safeParse({ texto: 'Test' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.orden).toBe(0)
    }
  })

  it('should coerce string orden to number', () => {
    const result = createOpcionSchema.safeParse({ texto: 'Test', orden: '3' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.orden).toBe(3)
    }
  })
})
