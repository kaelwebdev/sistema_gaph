# Design: Spanish-to-English Database Models

## Technical Approach

Full schema rename with fresh migrations. The approach involves updating the Prisma schema with new model/enum names, adding `@@map` directives to preserve table names, deleting old migrations, and regenerating everything. Field names are also renamed to follow consistent English conventions.

### Why Fresh Migrations vs. In-Place Rename

**Choice**: Fresh migrations (delete and recreate)
**Alternatives considered**: In-place rename with `@@map` for tables, gradual rename with dual names
**Rationale**: The production database has no critical data yet. Fresh migrations avoid complex migration logic with existing foreign keys and constraints. The `@@map` approach would require migration scripts anyway.

### Why Include Field Name Renaming

**Choice**: Rename both model names AND field names
**Alternatives considered**: Only rename model/enum names, keep Spanish field names
**Rationale**: Consistency — mixing English models with Spanish fields (numero, torre, observaciones) creates a hybrid that defeats the purpose. The proposal already mentions field mappings in scope.

## Architecture Decisions

### Decision: Table Name Preservation

**Choice**: Add `@@map("spanish_table_name")` to each renamed model
**Alternatives considered**: Let Prisma auto-generate English table names
**Rationale**: Preserves existing database table names if needed for debugging or manual queries. Also allows gradual migration if data existed.

### Decision: File Renaming Strategy

**Choice**: Rename session files (cliente-session.ts → condominium-session.ts) 
**Alternatives considered**: Keep old filenames, only update imports
**Rationale**: File names should match domain concepts. `cliente-session.ts` becomes meaningless when model is renamed to `Condominium`.

### Decision: Route Parameter Naming

**Choice**: Update `[clienteId]` → `[condominiumId]` in routes
**Alternatives considered**: Keep old parameter names for backward compatibility
**Rationale**: URL params should reflect the new domain model. This is a breaking change but aligns with the full rename approach.

## Data Flow

```
prisma/schema.prisma (source of truth)
        │
        ▼
  npx prisma migrate dev (creates migration)
        │
        ▼
  npx prisma generate (creates client)
        │
        ▼
All imports resolve to new names
        │
        ▼
   npm run build (verify)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | Modify | Rename 11 models, 8 enums, fields; add `@@map` |
| `prisma/migrations/` | Delete | All existing migrations |
| `src/generated/prisma/` | Auto-regen | Prisma client re-generated |
| `src/types/index.ts` | Modify | Update type exports and enum types |
| `src/lib/actions/*.ts` | Modify | Update Prisma references (8 files) |
| `src/lib/schemas/*.ts` | Modify | Update Zod schemas if needed |
| `src/lib/cliente-session.ts` | Rename → Delete | Rename to `condominium-session.ts` |
| `src/lib/participante-session.ts` | Rename → Delete | Rename to `participant-session.ts` |
| `src/lib/auth.ts` | Modify | Update references to session functions |
| `src/app/(public)/unidad/[clienteId]/` | Modify | Rename folder to `[condominiumId]` |
| `tests/**/*.test.ts` | Modify | Update mock references (7 files) |

### Model/Enum Mapping (for reference)

```
Cliente → Condominium
Apartamento → Apartment
Persona → Person
PersonaApartamento → PersonApartment
Assemblie → Assembly
ParticipantAsamba → AssemblyParticipant
Encuesta → Survey
Opcion → SurveyOption
Voto → Vote
Comunicado → Announcement
PQRS → PQRSRequest

EstadoApartamento → ApartmentStatus
RolPersona → PersonRole
EstadoAsamble → AssemblyStatus
TipoParticipant → ParticipantType
EstadoEncuesta → SurveyStatus
TipoEncuesta → SurveyType
TipoPQRS → PQRSType
EstadoPQRS → PQRSStatus
```

### Field Mapping

```
numero → number
torre → tower
nivel → level
observaciones → observations
habitantes → inhabitants
nombre → name
cedula → idNumber
telefono → phone
titulo → title
fecha → date
contenido → content
fechaPublicacion → publishedAt
asunto → subject
descripcion → description
nombreCompleto → fullName
pregunta → question
texto → text
estadoActivo → isActive
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Zod schemas validate new fields | Run existing schema tests |
| Integration | Prisma client queries work | TypeScript compilation verifies |
| E2E | Navigation flows work | Verify routes after rename |
| Build | No compilation errors | `npm run build` must pass |

### Verification Steps

1. `npm run build` — verifies all TypeScript compiles
2. `npm test` — runs unit tests (must pass)
3. `npx prisma generate` — confirms client regeneration works
4. Manual: Visit key routes to confirm navigation works

## Migration / Rollout

1. **Pre-migration backup**: Backup database (though data is not critical)
2. **Delete migrations folder**: `rm -rf prisma/migrations`
3. **Update schema**: Apply all model/enum/field renames
4. **Generate migration**: `npx prisma migrate dev --name init`
5. **Apply migration**: Auto-applied by dev command
6. **Regenerate client**: `npx prisma generate`
7. **Update all code references**: Use IDE find-replace across codebase
8. **Verify**: Run build and tests

### Rollback Plan

Since this uses fresh migrations with no data preservation:
1. Revert `prisma/schema.prisma` to Spanish names
2. Run `npx prisma migrate dev --name restore_spanish`
3. Revert code changes via git
4. Restart dev server

## Open Questions

- [ ] Should `EstadoAsamble` map to `AssemblyStatus` (fixing typo) or keep as-is? → **Decision**: Map to `AssemblyStatus`
- [ ] Are there any external API consumers that would break from route param change? → **Assumption**: None, this is internal-only app
- [ ] Should we also rename the database schema (public vs custom)? → **Decision**: Keep as `public` schema, no change needed
