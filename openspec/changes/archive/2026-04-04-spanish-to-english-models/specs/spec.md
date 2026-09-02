# Delta Specification: Spanish-to-English Database Models

## Overview

This specification defines the requirements for renaming all Prisma models, enums, and fields from Spanish to English. This is a refactoring change with no new functionality—all existing behavior must be preserved while updating nomenclature.

## ADDED Requirements

### Requirement: Prisma Schema Defines English Model Names

The Prisma schema MUST define all 11 models with English names and preserve table names via `@@map` to maintain backward compatibility with existing migrations.

| Model (Spanish) | Model (English) | Table Name |
|-----------------|-----------------|------------|
| Cliente | Condominium | Cliente |
| Apartamento | Apartment | Apartamento |
| Persona | Person | Persona |
| PersonaApartamento | PersonApartment | PersonaApartamento |
| Asamblea | Assembly | Asamblea |
| ParticipantAsamble | AssemblyParticipant | ParticipantAsamblea |
| Encuesta | Survey | Encuesta |
| Opcion | SurveyOption | Opcion |
| Voto | Vote | Voto |
| Comunicado | Announcement | Comunicado |
| PQRS | PQRSRequest | PQRS |

#### Scenario: Schema defines Condominium model

- GIVEN Prisma schema file at `prisma/schema.prisma`
- WHEN schema is parsed by Prisma
- THEN model `Condominium` MUST exist with `@@map("Cliente")` to preserve table name
- AND field `apartments` MUST map to relation `Apartment[]`

#### Scenario: Schema defines all 11 models with English names

- GIVEN Prisma schema file at `prisma/schema.prisma`
- WHEN schema is parsed by Prisma
- THEN all 11 models MUST have English names as specified in table above

### Requirement: Prisma Schema Defines English Enum Names

The Prisma schema MUST define all 8 enums with English names and preserve database values via `@map`.

| Enum (Spanish) | Enum (English) | Values |
|----------------|---------------|--------|
| EstadoApartamento | ApartmentStatus | PROPIO, ARRIENDO, VACIO |
| RolPersona | PersonRole | PROPIETARIO, APODERADO, RESIDENTE |
| EstadoAsamble | AssemblyStatus | ABIERTA, CERRADA |
| TipoParticipant | ParticipantType | PROPIETARIO, APODERADO |
| EstadoEncuesta | SurveyStatus | ACTIVA, CERRADA |
| TipoEncuesta | SurveyType | BINARIA, MULTIPLE |
| TipoPQRS | PQRSType | PREGUNTA, QUEJA, RECLAMO, SUGERENCIA |
| EstadoPQRS | PQRSStatus | PENDIENTE, RESUELTO, RECHAZADO, SIN_LEER |

#### Scenario: Schema defines ApartmentStatus enum

- GIVEN Prisma schema file at `prisma/schema.prisma`
- WHEN schema is parsed by Prisma
- THEN enum `ApartmentStatus` MUST exist with values PROPIO, ARRIENDO, VACIO
- AND each value MUST have `@map` to preserve database string

### Requirement: Field Names Renamed to English

All field names within models MUST be renamed from Spanish to English while preserving database column names via `@map`.

#### Scenario: Apartment fields renamed

- GIVEN model `Apartment` in schema
- WHEN schema is parsed by Prisma
- THEN field `numero` MUST be renamed to `number` with `@map("numero")`
- AND field `torre` MUST be renamed to `tower` with `@map("torre")`
- AND field `nivel` MUST be renamed to `level`
- AND field `estado` MUST reference `ApartmentStatus` enum
- AND field `observaciones` MUST be renamed to `observations` with `@map("observaciones")`

#### Scenario: All models have English field names

- GIVEN Prisma schema file at `prisma/schema.prisma`
- WHEN schema is parsed by Prisma
- THEN all field names in all models MUST be in English
- AND all database column names MUST be preserved via `@map`

### Requirement: Prisma Client Regenerates Successfully

The Prisma client MUST generate without errors after schema updates.

#### Scenario: Prisma generate succeeds

- GIVEN updated `prisma/schema.prisma` with English names
- WHEN command `npx prisma generate` is executed
- THEN generation MUST complete without errors
- AND generated client at `src/generated/prisma/` MUST contain all English model names

### Requirement: TypeScript Imports Use English Model Names

All TypeScript files MUST update imports to use new English model names from the generated Prisma client.

#### Scenario: Action files import English models

- GIVEN action file in `src/lib/actions/`
- WHEN file is parsed by TypeScript compiler
- THEN imports MUST reference `Condominium` instead of `Cliente`
- AND imports MUST reference `Apartment` instead of `Apartamento`
- AND all other imports MUST use English model names

#### Scenario: Schema files use English types

- GIVEN Zod schema file in `src/lib/schemas/`
- WHEN file is parsed by TypeScript compiler
- THEN type references MUST use English model names
- AND validation schemas MUST accept English field names

### Requirement: Route Parameters Use English Names

Dynamic route segments MUST be renamed to use English parameter names.

#### Scenario: Condominium routes updated

- GIVEN route file at `src/app/(admin)/cliente/[clienteId]/page.tsx`
- WHEN file is renamed
- THEN new file MUST be at `src/app/(admin)/condominium/[condominiumId]/page.tsx`
- AND all `useParams()` calls MUST reference `condominiumId`

#### Scenario: All route params renamed

- GIVEN all route files in `src/app/(admin)/`
- WHEN files are updated
- THEN all dynamic segments MUST use English names (condominiumId, apartmentId, personId, assemblyId, etc.)

### Requirement: Tests Pass After Renaming

All test files MUST pass after updating model references.

#### Scenario: Unit tests use English models

- GIVEN test file in `tests/**/*.test.ts`
- WHEN test is executed
- THEN mocks MUST use English model names
- AND assertions MUST reference English field names
- AND all tests MUST pass

#### Scenario: E2E tests navigate with English routes

- GIVEN e2e test file in `e2e/**/*.e2e.ts`
- WHEN test navigates to pages
- THEN navigation MUST use English route paths
- AND tests MUST pass

### Requirement: User-Facing Text Remains in Spanish

UI text displayed to users MUST remain in Spanish and is out of scope for this change.

#### Scenario: UI labels unchanged

- GIVEN component rendering user-facing text
- WHEN component is inspected
- THEN labels like "Cliente", "Apartamento", "Persona" MUST remain in Spanish
- AND this change does not affect displayed text

## MODIFIED Requirements

### Requirement: Model Relations Use English Names

(Previously: Relations used Spanish model names)

Model relations in Prisma schema MUST reference English model names.

#### Scenario: Condominium relations

- GIVEN model `Condominium` in schema
- WHEN schema is parsed by Prisma
- THEN relation fields MUST reference `Apartment[]`, `Person[]`, `Assembly[]`, `Announcement[]`, `PQRSRequest[]`

#### Scenario: All relations updated

- GIVEN Prisma schema file at `prisma/schema.prisma`
- WHEN schema is parsed by Prisma
- THEN ALL relation fields across ALL models MUST reference English model names

## REMOVED Requirements

### Requirement: Spanish Model Names No Longer Defined

Spanish model names MUST NOT exist in the Prisma schema.

#### Scenario: No Spanish model names

- GIVEN Prisma schema file at `prisma/schema.prisma`
- WHEN grep is executed for "model Cliente"
- THEN no match MUST be found
- AND no Spanish model names MUST exist in schema

## Success Criteria Summary

| Criterion | Verification |
|-----------|-------------|
| All 11 models renamed | Schema contains Condominium, Apartment, Person, etc. |
| All 8 enums renamed | Schema contains ApartmentStatus, PersonRole, etc. |
| Field names English | Schema has number, tower, level, etc. |
| Prisma generate succeeds | Command exits with code 0 |
| TypeScript compiles | No import errors across codebase |
| Route params updated | Dynamic segments use English names |
| Tests pass | `npm test` exits with code 0 |
| Build succeeds | `npm run build` exits with code 0 |
