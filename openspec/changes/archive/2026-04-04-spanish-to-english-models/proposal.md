# Proposal: Spanish-to-English Database Models

## Intent

Standardize all Prisma model and enum names from Spanish to English for better developer experience and code clarity. Currently, Spanish model names (Cliente, Apartamento, Persona, etc.) propagate through the generated Prisma client, TypeScript types, server actions, and page components, making the codebase harder to navigate for English-speaking developers and reducing clarity in technical discussions.

## Scope

### In Scope
- Rename all 11 models in Prisma schema (Cliente → Condominium, Apartamento → Apartment, etc.)
- Rename all 8 enums in Prisma schema (EstadoApartamento → ApartmentStatus, etc.)
- Regenerate Prisma client with new names
- Update all TypeScript imports and type references across the codebase
- Update route parameters (e.g., `[clienteId]` → `[condominiumId]`)
- Create fresh database migrations (data not important)

### Out of Scope
- User-facing UI text in Spanish (handled separately)
- English translation of content, labels, or error messages

## Capabilities

### New Capabilities
None — this is a refactoring change with no new functionality.

### Modified Capabilities
None — no spec-level behavior changes. Pure naming refactor.

## Approach

**Full rename with fresh migrations:**
1. Update `prisma/schema.prisma` with new model/enum names
2. Delete existing migrations folder
3. Run `prisma migrate dev` to create fresh migrations
4. Run `prisma generate` to regenerate client
5. Update all code references across ~50 files (types, actions, schemas, pages, components, tests)
6. Verify tests pass

This approach is safer than in-place renaming because it avoids migration complexity with existing data.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | Modified | Rename 11 models, 8 enums |
| `src/types/index.ts` | Modified | Update type exports |
| `src/lib/actions/*.ts` | Modified | Update 8 action files |
| `src/lib/schemas/*.ts` | Modified | Update 8 schema files |
| `src/lib/cliente-session.ts` | Modified | Rename to `condominium-session.ts` |
| `src/lib/auth.ts` | Modified | Update references |
| `src/libparticipante-session.ts` | Modified | Rename to `participant-session.ts` |
| `src/app/(admin)/**/*.tsx` | Modified | Update route params, imports |
| `src/app/(public)/**/*.tsx` | Modified | Update imports |
| `src/components/**/*` | Modified | Update imports |
| `tests/**/*.test.ts` | Modified | Update test mocks, types |
| `e2e/**/*.e2e.ts` | Modified | Update e2e test references |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Missed references after rename | High | Use IDE "find references" or grep search across all .ts/.tsx files |
| Broken tests after rename | Medium | Run full test suite after completion |
| Runtime errors from cached client | Low | Restart dev server after regenerating Prisma client |
| Route param mismatches breaking navigation | Medium | Verify all dynamic route segments are updated |

## Rollback Plan

1. Revert changes in `prisma/schema.prisma` to Spanish names
2. Delete new migrations, restore previous migrations if applicable
3. Run `prisma migrate deploy` to restore previous state
4. Run `prisma generate`
5. Revert all code changes (git revert or restore from backup)
6. Restart dev server

**Note:** Since this is a fresh migration (data not preserved), rollback restores the schema but loses any new data created during the rename.

## Dependencies

- None — no external dependencies required
- All changes are internal to the codebase

## Success Criteria

- [ ] All 11 models renamed in `prisma/schema.prisma`
- [ ] All 8 enums renamed in `prisma/schema.prisma`
- [ ] `prisma generate` succeeds with new client
- [ ] `prisma migrate dev` creates fresh migrations
- [ ] All TypeScript imports resolve without errors
- [ ] All tests pass (`npm test`)
- [ ] All route navigation works (verify key routes manually)
- [ ] No compilation errors in build (`npm run build`)