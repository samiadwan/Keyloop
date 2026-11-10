# Keyloop — Spaces master spec

**Version:** greenfield scaffold (Spaces)  
**Reference implementation:** [`../Keyloop`](../Keyloop) (PRD v0.2 as-built)

## Product summary

Anonymous **car rental booking demo** (Australia). Browse API-backed catalogue, search by **city** (dates validate booking window), create **Pending** bookings in **sessionStorage**, select insurance, pay via **Stripe Checkout (test)**, manage trips (**Pending / Paid / Cancelled**).

Not production: no accounts, no live payments, no availability engine.

## Authority chain

| Document | Path |
|----------|------|
| BRD v1.0 | [`docs/requirements/brd.md`](docs/requirements/brd.md) |
| BRD as-built delta | [`docs/requirements/brd-v1.1-delta.md`](docs/requirements/brd-v1.1-delta.md) |
| PRD v0.2 | [`docs/requirements/PRD-Keyloop-Car-Rental-Booking.md`](docs/requirements/PRD-Keyloop-Car-Rental-Booking.md) |
| PRD delta | [`docs/requirements/prd-v0.2-delta.md`](docs/requirements/prd-v0.2-delta.md) |
| OQ resolutions | [`docs/requirements/oq-resolution-log.md`](docs/requirements/oq-resolution-log.md) |

## In scope (Must)

- FR-1 through FR-5 per PRD §8 (see v0.2 deltas for Stripe + FR-1.7 URL sync)
- Stripe test checkout (FR-4.x); no in-app card fields
- Trips nav on landing, detail, payment, checkout (FR-5.1)
- Empty trips message exact: `You haven't booked any trips yet` (FR-5.11)

## Out of scope

- Login, real payments, server-persisted bookings, date-based inventory filter (OQ-08: location only)

## Stack

- **Client:** Angular 21 standalone, Tailwind, port 4200
- **Server:** .NET 8, PostgreSQL catalogue, Stripe session API, port 5077

## Agent briefs (this repo)

- [`specs/00-product-brief.md`](specs/00-product-brief.md)
- [`specs/01-architecture.md`](specs/01-architecture.md)
- [`specs/02-journey-rules.md`](specs/02-journey-rules.md)

## Workflow

1. [`install-spaces.md`](install-spaces.md)
2. [`start-working.md`](start-working.md)
3. Inception units `001`–`006`
4. Construction → Operations

## Local docs index

[`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) — local requirements + Keyloop guides/architecture/UAT.
