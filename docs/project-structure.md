## Project structure

```
src/
├── app/
│   ├── (admin)/         # Rutas del panel de administración (protegidas)
│   │   ├── dashboard/   # Dashboard principal
│   │   ├── persons/    # Gestión de personas (CRUD)
│   │   │   └── [id]/    # Editar person
│   │   ├── apartments/ # Gestión de apartments (CRUD)
│   │   │   └── [id]/    # Editar apartment
│   │   ├── assemblies/   # Gestión de assemblies y encuestas
│   │   │   └── [id]/
│   │   │       └── resultados/ # Página de resultados
│   │   ├── announcements/ # Gestión de announcements
│   │   └── pqrsRequest/        # Lista y gestión de PQRSRequest
│   ├── (public)/        # Rutas públicas
│   │   ├── page.tsx    # Landing page con selector de unidad
│   │   ├── unidad/     # Portal por unidad residencial
│   │   ├── votar/     # Sistema de votación público
│   │   │   └── [assemblieId]/ # Votación por assemblie
│   │   └── contacto/   # Formulario público de PQRSRequest
│   ├── login/          # Página de login
│   ├── api/            # API routes (auth, etc.)
│   └── page.tsx        # Redirect raíz
├── components/
│   └── ui/             # Componentes shadcn/ui
├── lib/
│   ├── actions/        # Server Actions de Next.js
│   ├── schemas/        # Validación Zod
│   └── db.ts           # Cliente Prisma
└── generated/
    └── prisma/         # Cliente Prisma generado
```