# Project layout (maintenance)

> **Keyloop-spaces:** This map describes the **reference app** at [`../../Keyloop`](../../Keyloop). Use it when tracing FRs during construction; wire new code under this repo’s `client/` / `server/` when you scaffold them.

Quick map for where to change behaviour. Full stack summary: [`../../Keyloop/README.md`](../../Keyloop/README.md).

## Repository roots

| Path | Purpose |
|------|---------|
| [`client/`](../../Keyloop/client/) | Angular 21 SPA |
| [`server/`](../../Keyloop/server/) | .NET 8 API + tests |
| [`docs/`](../) | Architecture, guides, UAT, tasks (local copies in Keyloop-spaces) |
| [`aidlc/spaces/default/memory/`](../../Keyloop/aidlc/spaces/default/memory/) | Team decisions (`project.md`) |

## Client (`client/src/app/`)

| Area | Contents |
|------|----------|
| `features/*/` | Route pages: `landing`, `vehicle-detail`, `payment-details`, `checkout`, `my-trips` |
| `core/services/` | HTTP (`vehicle-catalog`, `payments-api`, `app-config`, `booking-session`, …) |
| `core/utils/` | `journey-context.ts`, `rental-dates.ts`, `location-catalog.ts` |
| `core/components/` | Footer, FAQ, logo, autocomplete, map, demo notices |
| `core/constants/` | UAT copy, FAQ content |
| `app.routes.ts` | All routes |
| `app.ts` | Shell: outlet + site footer |
| `styles.scss` | Shared `kl-*` styles |

**Landing:** search URL sync, results grid, [`landing-faq`](../../Keyloop/client/src/app/core/components/landing-faq/), embedded in [`landing.page.html`](../../Keyloop/client/src/app/features/landing/landing.page.html).

## Server (`server/Keyloop.Api/`)

`Controllers/`, `Data/` (migrations, seeder), `Domain/`, `Models/`, `Pricing/ChargeCalculator.cs`.

## Journey rules

Search: query params on `/` and `/vehicles/:id`. Bookings: `:bookingId` + `keyloop.bookings.v1`. See [`.cursor/rules/keyloop-journey-context.mdc`](../../Keyloop/.cursor/rules/keyloop-journey-context.mdc).
