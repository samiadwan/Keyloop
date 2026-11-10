# Product brief — Keyloop

## Problem

Renters need a simple, account-free path to find a car, see price and insurance, pay, and track bookings in one session.

## Solution

Keyloop: seed catalogue (9 vehicles, 4 AU cities), session-scoped bookings (`TRP-001…`), Stripe **test** checkout, **My Trips** with cancel.

## Users

**Anonymous renter** — search, book one or more trips, pay, cancel.

## Success (release criteria)

From PRD §3.3 / smoke SM-1:

- All seed vehicles on landing load
- Search + URL sync; location filter
- Booking IDs sequential; insurance updates total
- Stripe success → **Paid** on correct booking only
- UAT-1–14 pass (see reference uat-validation-report)

## Non-goals

Production marketplace, live Stripe, persistent booking DB, registration.

## Pricing (closed)

USD; platform fee $5; insurance Basic/Standard/Premium 500/1000/1500.

## Full requirements

[`../docs/requirements/PRD-Keyloop-Car-Rental-Booking.md`](../docs/requirements/PRD-Keyloop-Car-Rental-Booking.md) + deltas in [`docs/REQUIREMENTS.md`](../docs/REQUIREMENTS.md).
