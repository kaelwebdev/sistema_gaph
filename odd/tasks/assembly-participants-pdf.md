# Feature: Assembly participants PDF export

## Objective

Give the administrator a button in the assembly detail view (`/assemblies/[id]`) that downloads a PDF listing every participant of that assembly.

## Problem

The participants tab lists attendees on screen only. The administrator needs a portable, printable record of attendance per assembly (name, ID number, tower, apartment, participant type).

## Why

Attendance records are used outside the app (meeting minutes, building files). A PDF is the expected deliverable and removes manual copy/paste.

## Scope

In scope:

- PDF generation on the server with `pdf-lib` (no headless browser, no client bundle cost).
- A `GET` route handler that authenticates the request, scopes it to the session condominium, and returns `application/pdf` as an attachment.
- A download button in the participants section header of the assembly detail view.
- Unit tests for the PDF builder (valid document, pagination, empty list, text sanitization).

Out of scope:

- PDF for survey results.
- Emailing or storing generated PDFs.
- Changes to the participant data model.

## Constraints

- Next.js 16 route handlers: dynamic `params` is a `Promise`.
- UI copy stays in Spanish, consistent with the existing admin panel.
- No changes to unrelated files. `.atl/skill-registry.md` is dirty before this feature and must not be committed.
- `pdf-lib@1.17.1` is already installed.

## Decisions

- Server-side generation with `pdf-lib` instead of client-side `jsPDF` or `window.print()`: smaller client bundle, real downloadable file, deterministic output, and no browser dependency.
- Authorization: any authenticated session may download, matching the current admin layout, with a hard tenant check (`assembly.condominiumId` must equal `session.user.condominiumId` when the session has one).

## Tasks

- [x] **T1** — Add failing tests for the PDF builder and register `tests/lib/*.test.ts` in `vitest.config.ts`. Evidence: RED was `Failed to resolve import "@/lib/pdf/participants-pdf"`.
- [x] **T2** — Implement `src/lib/pdf/participants-pdf.ts` (A4 layout, header, table, pagination, footer, WinAnsi-safe text). Evidence: 9/9 tests green.
- [x] **T3** — Implement `src/app/api/assemblies/[id]/participants/pdf/route.ts` (auth, tenant check, 404 handling, download headers). Evidence: file committed; manual runtime check pending.
- [x] **T4** — Add the "Descargar PDF" button to `participants-section.tsx`. Evidence: anchor styled with `buttonVariants`, committed.
- [x] **T5** — Run focused tests and lint on touched files; record evidence. Evidence: `npx vitest run tests/lib` -> 1 file, 9 tests passed; `npx eslint ...` -> exit 0; `npx tsc --noEmit` -> 21 pre-existing errors, none in feature files.

## Acceptance criteria

1. Opening `/assemblies/<id>` shows a "Descargar PDF" button in the participants tab.
2. Clicking it downloads a valid PDF named `participantes-<assembly-slug>-<yyyy-mm-dd>.pdf`.
3. The PDF lists every participant with name, ID number, tower, apartment, and type, plus assembly title, date, status, condominium name, and total count.
4. Long participant lists paginate; every page shows the table header and a `Página X de Y` footer.
5. Spanish accents render correctly; unsupported characters are replaced instead of throwing.
6. Unauthenticated requests return 401; assemblies from another condominium return 403; missing assemblies return 404.
7. `npx vitest run tests/lib` passes.

## Checks

- `npx vitest run tests/lib`
- `npx eslint src/lib/pdf/participants-pdf.ts "src/app/api/assemblies/[id]/participants/pdf/route.ts" "src/app/(admin)/assemblies/[id]/participants-section.tsx" tests/lib/participants-pdf.test.ts vitest.config.ts`

## Route and delegation log

- T1-T4: delegated to one bounded writer (`gentle-ai-worker`); trigger: 2+ non-trivial files (writer rule) plus preparation evidence already mapped by the parent.
- T5: parent verification.

## Delivery

- Forecast: ~300 authored changed lines (library ~180, route ~55, component ~12, tests ~60, config ~2). Under the ~400-line work-unit heuristic.
- Strategy: `ask-on-risk` (default). Work-unit commits on `feat/assembly-participants-pdf`; no push or PR without user decision.

## Progress

- Dependency installed: `pdf-lib@1.17.1` (package.json + package-lock.json).
- Commit `c931758` — builder, tests, vitest registration, dependency.
- Commit `3dcdd6d` — authenticated download route handler.
- Commit `14c6ea7` — "Descargar PDF" button in the participants section.
- Parent adjustment after writer return: filename date now uses local date components (instead of `toISOString()`) so it matches the date rendered in the PDF.
- Pending manual check: exercise the route in a real Next 16 runtime (401/403/404 and download headers) and visually inspect one generated PDF.

