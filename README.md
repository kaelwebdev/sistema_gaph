# Sistema GAPH - Gestión de Apartamentos y Asambleas

Sistema de gestión para unidades residenciales con funcionalidades de administración de apartamentos, personas, asambleas, voting digital, comunicados y PQRS.

## Características

### Panel de Administración (`/dashboard`)
- **Apartamentos**: CRUD de apartamentos con número, torre y nivel
- **Personas**: Gestión de residentes con identificación
- **Asambleas**: 
  - Crear y gestionar asambleas
  - Registrar participantes (nombre, cédula, torre, apartamento)
  - Crear encuestas (binarias o múltiples)
  - Votación en tiempo real
  - **Resultados con gráficos visuales** y botón de actualizar
- **Comunicados**: Publicación de anuncios a residentes
- **PQRS**: Gestión de peticiones, quejas, reclamos y sugerencias con cambio de estado

### Portal Público
- **Selección de unidad residencial**: Pantalla de bienvenida para seleccionar la comunidad
- **Identificación de participante**: Login mediante cédula
- **Votación**: Acceso a encuestas activas de la asamblea
- **PQRS público**: Formulario sin login para enviar solicitudes (tipo, asunto, descripción, nombre, torre, apartamento, email, teléfono)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS + shadcn/ui
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js (en desarrollo)
- **Runtime**: Bun

## Estructura del Proyecto

```
src/
├── app/
│   ├── (admin)/          # Rutas del panel de administración
│   │   ├── dashboard/    # Dashboard principal
│   │   ├── personas/     # Gestión de personas
│   │   ├── apartamentos/ # Gestión de apartamentos
│   │   ├── asambleas/   # Gestión de asambleas y encuestas
│   │   │   └── [id]/
│   │   │       └── resultados/ # Página de resultados
│   │   ├── comunicados/ # Gestión de comunicados
│   │   └── pqrs/        # Lista y gestión de PQRS
│   ├── (public)/         # Rutas públicas
│   │   ├── page.tsx     # Landing page con selector de unidad
│   │   ├── unidad/      # Portal por unidad residencial
│   │   ├── votar/      # Sistema de votación público
│   │   └── contacto/   # Formulario público de PQRS
│   └── api/             # API routes (auth, etc.)
├── components/
│   └── ui/              # Componentes shadcn/ui
└── lib/
    ├── actions/         # Server Actions de Next.js
    ├── schemas/         # Validación Zod
    └── db.ts            # Cliente Prisma
```

## Primeros Pasos

### Requisitos Previos
- Node.js 18+ o Bun
- PostgreSQL

### Instalación

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd sistema-gaph
```

2. Instalar dependencias:
```bash
bun install
# o
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con las credenciales de PostgreSQL
```

4. Generar el cliente Prisma:
```bash
npx prisma generate
```

5. Aplicar migraciones:
```bash
npx prisma migrate dev
```

6. Iniciar el servidor de desarrollo:
```bash
bun run dev
```

7. Abrir http://localhost:3000

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Iniciar servidor de desarrollo |
| `bun run build` | Construir para producción |
| `bun run start` | Iniciar servidor de producción |
| `npx prisma studio` | Abrir interfaz de Prisma |

## Modelos de Base de Datos

- **Cliente**: Unidades residenciales
- **Apartamento**: Unidades habitacionales con torre, número, nivel
- **Persona**: Residentes con identificación
- **PersonaApartamento**: Relación muchos a muchos
- **Asambleas**: Juntas de propietarios
- **ParticipanteAsambleas**: Participantes registrados
- **Encuesta**: Sondeosen asamblea
- **Opcion**: Opciones de respuesta
- **Voto**: Votos registrados
- **Comunicado**: Anuncios publicados
- **PQRS**: Peticiones, quejas, reclamos, sugerencias

## Contribuir

1. Crear una rama para la feature (`git checkout -b feature/nueva-funcionalidad`)
2. Hacer commit de los cambios (`git commit -m 'feat: agregar funcionalidad'`)
3. Push a la rama (`git push origin feature/nueva-funcionalidad`)
4. Abrir un Pull Request

## Licencia

Privado - Todos los derechos reservados