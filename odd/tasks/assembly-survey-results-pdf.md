# Feature: Assembly survey-results PDF export

## Objective

Give the administrator a button in the assembly detail "Encuestas" tab that downloads a PDF with the results of every survey of that assembly.

## Problem

Survey results are only visible live in `/assemblies/[id]/resultados`. The administrator needs a frozen, portable record (votes, percentages, quorum) for minutes and building files.

## Why

Same reason as the participants PDF: meeting evidence must leave the app. Reusing the PDF infrastructure keeps output consistent.

## Scope

In scope:

- Extract shared PDF primitives (page constants, WinAnsi sanitization, text fitting/wrapping, header/footer, filename builder) into `src/lib/pdf/common.ts` and refactor the participants builder/route onto them.
- Extract the route guard (session, tenant, deleted assembly) into `src/lib/pdf/route-guard.ts` and reuse it in both PDF routes.
- New builder `src/lib/pdf/survey-results-pdf.ts`.
- New route `GET /api/assemblies/[id]/surveys/pdf`.
- "Descargar PDF" button in the surveys section header (`survey-section.tsx`).
- Tests for the survey builder plus the participants suite staying green.

Out of scope:

- Real-time updates inside the PDF.
- Participant-level vote detail (votes are aggregated per option).
- Changes to survey/vote schemas.

## Constraints

- UI copy stays Spanish, consistent with the admin panel.
- `params` is a `Promise` in Next.js 16 route handlers.
- Do not touch `.atl/`, `package.json`, `package-lock.json`, or `odd/`.
- Participants PDF behavior must not regress: `tests/lib/participants-pdf.test.ts` must stay green.

## Decisions

- Aggregate in the route (Prisma) and keep the builder pure; percentages and quorum are computed by exported pure helpers so they are unit-testable.
- Quorum semantics match `getParticipationData`: `totalVotes / assembly participants count`, rounded, 0 when there are no participants.
- Share the existing pdf-lib primitives instead of duplicating layout code.

## Tasks

- [x] **T1** — Create `src/lib/pdf/common.ts` and refactor `participants-pdf.ts` + participants route to use it; participants tests stay green.
- [x] **T2** — Create `src/lib/pdf/route-guard.ts` and reuse it in both routes.
- [x] **T3** — Write failing tests for `survey-results-pdf` (valid PDF, pagination, empty list, stats, quorum, unencodable text).
- [x] **T4** — Implement `src/lib/pdf/survey-results-pdf.ts` until green.
- [x] **T5** — Implement `src/app/api/assemblies/[id]/surveys/pdf/route.ts`.
- [x] **T6** — Add the "Descargar PDF" button to `survey-section.tsx`.
- [x] **T7** — Run focused tests, lint, and typecheck filtering; record evidence.

## Acceptance criteria

1. The Encuestas tab shows a "Descargar PDF" button next to "Nueva Survey".
2. Clicking it downloads `resultados-encuestas-<slug>-<yyyy-mm-dd>.pdf`.
3. The PDF shows, for each survey: question, type, status, every option with votes and percentage, total votes, and quorum (`X de Y participantes (Z%)`).
4. Surveys are ordered by `order`, then `createdAt`; options by `order`.
5. Long lists paginate with the assembly title repeated on continuation pages and `Página X de Y` on every page.
6. Empty assembly shows `Esta asamblea no tiene encuestas registradas.`; a survey without votes shows `Sin votos registrados.`
7. Same auth contract as participants: 401 unauthenticated, 403 other condominium, 404 missing/deleted assembly.
8. `npx vitest run tests/lib` passes (participants + survey results).

## Checks

- `npx vitest run tests/lib`
- `npx eslint src/lib/pdf "src/app/api/assemblies/[id]/surveys/pdf/route.ts" "src/app/api/assemblies/[id]/participants/pdf/route.ts" "src/app/(admin)/assemblies/[id]/survey-section.tsx" tests/lib/participants-pdf.test.ts tests/lib/survey-results-pdf.test.ts`
- `npx tsc --noEmit`, filtered to feature files (pre-existing errors are out of scope).

## Route and delegation log

- T1-T6: one bounded writer (`gentle-ai-worker`); trigger: 2+ non-trivial files. Evidence mapping done by the parent before delegation.
- T7: parent verification.

## Delivery

- Forecast: ~500 authored changed lines (common ~150, survey builder ~230, route ~70, guard ~35, refactors ~-40, component ~12, tests ~120). Above the ~400 per-task heuristic; the shared-primitives refactor is what removes duplication, so no size-only rework.
- Strategy: `ask-on-risk` (default). PR slicing will be decided with the user only if they ask for a PR.
- Work-unit commits on `feat/assembly-pdf-exports` (renamed from `feat/assembly-participants-pdf`; not pushed).

## Progress

- Branch renamed to `feat/assembly-pdf-exports` to cover both PDF exports.
- Commit `9922784` — shared PDF primitives (`common.ts`) and callback-based route guard; participants builder/route refactored; participants tests stayed green.
- Commit `caf1724` — survey-results builder, route handler, and 10 tests.
- Commit `37cc6df` — "Descargar PDF" button in the surveys section.
- Parent adjustments after writer return: guard changed to a callback so no DB query runs before authentication (single `auth()` call in both routes); singular/plural fix in the PDF (`1 voto` / `N votos`).
- Verification: `npx vitest run tests/lib` -> 2 files, 19 tests passed; ESLint -> exit 0; `npx tsc --noEmit` -> 21 pre-existing errors, none in feature files.
- Content-stream spot check of a generated PDF confirmed header, per-survey type/status, per-option votes and percentages, quorum, zero-vote message, and footer.
- Pending manual check: visualize one real PDF and exercise 401/403/404 on `/api/assemblies/[id]/surveys/pdf`.

