## Project structure

```
src/
├── app/
│   ├── (admin)/         # Rutas del panel de administración (protegidas)
│   │   ├── dashboard/   # Dashboard principal
│   │   ├── personas/    # Gestión de personas (CRUD)
│   │   │   └── [id]/    # Editar persona
│   │   ├── apartamentos/ # Gestión de apartamentos (CRUD)
│   │   │   └── [id]/    # Editar apartamento
│   │   ├── asambleas/   # Gestión de asambleas y encuestas
│   │   │   └── [id]/
│   │   │       └── resultados/ # Página de resultados
│   │   ├── comunicados/ # Gestión de comunicados
│   │   └── pqrs/        # Lista y gestión de PQRS
│   ├── (public)/        # Rutas públicas
│   │   ├── page.tsx    # Landing page con selector de unidad
│   │   ├── unidad/     # Portal por unidad residencial
│   │   ├── votar/     # Sistema de votación público
│   │   │   └── [asambaId]/ # Votación por asamblea
│   │   └── contacto/   # Formulario público de PQRS
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