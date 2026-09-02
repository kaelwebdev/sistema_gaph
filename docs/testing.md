## Testing

El proyecto cuenta con una suite completa de testing:

### Tests Unitarios (Vitest)

```bash
npm test
```

| Carpeta | Descripción |
|---------|-------------|
| `tests/schemas/` | Validación de Zod schemas |
| `tests/actions/` | Server Actions mockeadas |

### Tests E2E (Playwright)

```bash
npm run test:e2e
```

Los tests E2E cubren:
- Login y autenticación
- Navegación entre páginas
- Formulario público de PQRSRequest