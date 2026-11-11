---
id: 002-catalog-search
bolt_type: simple-construction-bolt
intent: 001-keyloop-rental-demo
unit: 002-catalog-search
status: in-progress
current_stage: test
started: 2026-11-10T10:34:00Z
---

# Bolt: Catalog search

## Plan

Build `GET /api/vehicles` and `GET /api/vehicles/{id}` with the nine-vehicle seed, then a landing page that filters by city and writes `location`, `pickupDate`, and `returnDate` to the URL.

## Implement

API catalogue, in-memory seed by default, landing search, and a read-only vehicle detail route so result links resolve.

## Test

API tests cover nine vehicles, Sydney, a Photon-style label, an unknown city, and a missing id.
