# Sistema GAPH - Gestión de Assemblies para Propiedad Horizontal

Sistema de gestión para unidades residenciales (condominios) para la administración del sistema de votes que se presentan en una assemblie, ademas de tambien poder gestionar announcements y PQRSRequest.

## Características

### Panel de Administración (`/dashboard`)
- **Apartments**: CRUD de apartments con número, torre y nivel
- **Persons**: Gestión de residentes con identificación
- **Assemblies**: 
  - Crear y gestionar assemblies
  - Registrar participants (nombre, cédula, torre, apartment)
  - Crear encuestas (binarias o múltiples)
  - Visualizar Votación en tiempo real
  - **Resultados con gráficos visuales** y botón de actualizar
- **Announcements**: Publicación de anuncios a residentes
- **PQRSRequest**: Gestión de peticiones, quejas, reclamos y sugerencias con cambio de estado

### Portal Público
- **Selección de unidad residencial**: Pantalla de bienvenida para seleccionar la Unidad Residencial (Cliente).
- **Identificación de participant**: Identifiacion mediante cédula, sin necesidad de login.
- **Votación**: Acceso a encuestas activas de la assemblie para votación.
- **PQRSRequest público**: Formulario sin login para enviar solicitudes (tipo, asunto, descripción, nombre, torre, apartment, email, teléfono)

## Tech Stack

- **Framework**: Next.js 16.2.0 (App Router)
- **UI**: React 19.2.4 + Tailwind CSS v4 + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Realtime)
- **ORM**: Prisma ORM (conectado a Supabase PostgreSQL)
- **Autenticación**: NextAuth.js v5 (Auth.js)
- **Realtime**: Supabase Realtime para votes en tiempo real
- **Testing**: Vitest (unit/integration) + Playwright (E2E)

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run dev:turbo` | Iniciar con Turbopack |
| `npm run build` | Construir para producción |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint` | Ejecutar ESLint |
| `npm test` | Ejecutar tests unitarios |
| `npm run test:coverage` | Coverage de tests |
| `npm run test:e2e` | Ejecutar tests E2E |
| `npm run test:e2e:ui` | Tests E2E con UI interactiva |
| `npx prisma studio` | Abrir interfaz de Prisma |

## Documentation

| Topic | Description |
|-------|-------------|
| [Project Structure](docs/project-structure.md) | Detailed explanation of the folder structure |
| [First Steps](docs/first-steps.md) | Installation and setup guide |
| [Required Environment Variables](docs/required-environment-variables.md) | All environment variables needed |
| [Troubleshooting](docs/troubleshooting.md) | Common errors and solutions |
| [Entity-Relationship](docs/entity-relationship.md) | Relationships expressed in sentences |
| [Entity-Relationship Diagram](docs/entity-relationship-diagram.md) | Visual ER diagram (Mermaid) |
| [Entity Description](docs/entity-description.md) | Database tables and attributes |
| [Business Rules](docs/business-rules.md) | Key business constraints |
| [Deployment in Vercel](docs/deployment-in-vercel.md) | Production deployment guide |
| [Testing](docs/testing.md) | Test suite documentation |
| [Ways to Contribute](docs/ways-to-contribute.md) | Contribution guidelines |

## Licencia

Privado - Todos los derechos reservados
