# Coding Standards

## Overview

Match the reference Keyloop layout when scaffolding this repo. Keep HTTP contracts, journey rules, and the UAT list stable. Do not copy the sibling `../Keyloop` tree in as the runtime root.

## Code Formatting

**Tool**: Prettier for the Angular client. `dotnet format` for the API.
**Key Settings**:
- Client indent: 2 spaces
- EditorConfig / `dotnet format` defaults for C#
- JSON and HTTP bodies: camelCase

**Enforcement**: Format before a unit is called done. No repo-wide hook is required until one is added.

## Linting

**Tool**: Angular ESLint on the client. Nullable reference types and the compiler on the server.
**Base Config**: Angular recommended, once the workspace exists.
**Strictness**: balanced

**Key Rules**:
- No `any` for API models — keep vehicle and config models aligned with `docs/architecture/backend-api.md`
- Booking updates go through one session service, keyed by booking id
- Do not add in-app card inputs

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Angular files | kebab-case | `booking-session.service.ts` |
| Angular classes | PascalCase | `BookingSessionService` |
| C# types | PascalCase | `PaymentsController` |
| API JSON | camelCase | `dailyPriceUsd`, `checkoutUrl` |
| Session key | literal | `keyloop.bookings.v1` |
| Booking ids | `TRP-` + 3 digits | `TRP-001` |
| Vehicle ids | `v` + number | `v1`–`v9` |

**File Naming**:
- Components: `*.page.ts` for route pages, `*.component.ts` for shared chrome
- Utilities: `*.ts` under `core/utils`
- Tests: `*.spec.ts` beside client source; `*Tests.cs` in the API test project

## File Organization

**Pattern**: feature folders on the client, layer folders on the server.

**Structure**:
```text
client/src/app/
  features/          landing, vehicle-detail, payment-details, checkout, my-trips
  core/services/     HTTP and booking session
  core/utils/        journey-context, rental-dates, location-catalog
  core/components/   footer, FAQ, shared chrome
  app.routes.ts
server/Keyloop.Api/
  Controllers/
  Data/              migrations and seeder
  Domain/
  Models/
  Pricing/           ChargeCalculator
```

**Conventions**:

- Tests: client specs next to the unit under test; API tests in `server/Keyloop.Api.Tests`
- Types: `client/src/app/core/models`
- Index files: do not add barrel files unless a feature already uses them

## Testing Strategy

**Framework**: Vitest via the Angular test runner on the client. xUnit on the API.
**Coverage Target**: Each Must FR for a unit maps to an automated test or an explicit manual UAT row. UAT-1–14 in the PRD are the release list.

**Test Types**:

| Type | Tool | When to Use |
|------|------|-------------|
| API | `dotnet test` | Catalogue, config, charge math, payment error status codes |
| Client unit | `npx ng test --watch=false` | Dates, session updates, pricing display, route links, empty-state copy |
| Manual smoke | SM-1 | Stripe redirect and a second browser tab |

**Conventions**:

- Test naming: include the UAT id in the test name when the test exists to satisfy that scenario
- Test structure: arrange the session or HTTP call, act, assert one booking or one status
- Mock strategy: mock Stripe and HTTP at the boundary; do not mock the charge formula in the test that locks the formula

## Error Handling

**Pattern**: Throw or return a failed result at the boundary. Do not invent a booking when the id is missing from session storage.

**Custom Errors**: API returns status codes from the contract. 400 invalid vehicle, tier, or dates. 404 unknown vehicle. 502 Stripe API error. 503 Stripe secret missing.

**API Errors**: JSON problem or a short message the client can show. A failed or cancelled Checkout leaves the booking Pending.

## Logging

**Tool**: ASP.NET Core logging on the server. Browser console only for development diagnostics on the client.
**Format**: structured server logs.

**Levels**:

| Level | Usage |
|-------|-------|
| Information | Startup, seed counts, checkout session created (ids only) |
| Warning | Stripe not configured, unknown location filter |
| Error | Stripe API failure without card data |

**Rules**:

- Always log: vehicle id, booking id, and HTTP status for payment failures
- Never log: PAN, CVV, expiry, `sk_test_` or `sk_live_` values, or full Stripe secrets
