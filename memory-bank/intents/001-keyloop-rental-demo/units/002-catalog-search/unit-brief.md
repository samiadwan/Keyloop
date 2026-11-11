---
unit: 002-catalog-search
intent: 001-keyloop-rental-demo
phase: inception
status: ready
created: 2026-11-10T10:26:00Z
updated: 2026-11-10T10:26:00Z
---

# Unit Brief: Catalog search

## Purpose

Let a renter see the nine seed vehicles, filter them by city, and keep location and dates in the URL.

## Scope

### In Scope
- `GET /api/vehicles` and `GET /api/vehicles/{id}`
- PostgreSQL or in-memory seed of vehicles `v1`–`v9` in Sydney, Melbourne, Brisbane, and Perth
- Landing search, results grid, loading state, no-results message
- URL query params restored on init and written on Search
- Photon-assisted location text normalised to catalogue cities
- Date fields validate presence and order for the form. They do not filter results

### Out of Scope
- Creating a booking
- Availability by date
- Insurance and payment

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | All seed vehicles on first load | Must |
| FR-1.2 | Card shows photo, name, location, daily price | Must |
| FR-1.3 | Search by location and dates | Must |
| FR-1.4 | Location filter only | Must |
| FR-1.5 | No-results message | Must |
| FR-1.6 | Card opens detail | Must |
| FR-1.7 | URL sync and refresh | Must |

## Domain Concepts

### Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| Vehicle | Seed catalogue row | id, name, imageUrl, location, dailyPriceUsd, features, rules |

### Key Operations

| Operation | Description | Inputs | Outputs |
|-----------|-------------|--------|---------|
| List vehicles | Optional city filter | location query | JSON array or `[]` |
| Get vehicle | By id | id | 200 or 404 |
| Search | Write journey query | location, pickupDate, returnDate | URL on `/` |

## Story Summary

Stories are not split. Cover UAT-1 and UAT-2.

## Dependencies

### Depends On

| Unit | Reason |
|------|--------|
| 001-platform-shell | Shared chrome. A minimal outlet is enough to start |

### Depended By

| Unit | Reason |
|------|--------|
| 003-vehicle-booking | Detail links must carry the query params |

### External Dependencies

| System | Purpose | Risk |
|--------|---------|------|
| PostgreSQL | Persistent seed | Low. In-memory seed is the local default |
| Photon | Autocomplete labels | Low. Unknown labels become an empty result |

## Technical Context

### Suggested Technology

Angular feature `features/landing`. API controller plus `VehicleSeed` and `CatalogSeeder`. Reference paths under `../Keyloop/client` landing and `../Keyloop/server/Keyloop.Api`.

### Integration Points

| Integration | Type | Protocol |
|-------------|------|----------|
| Catalogue | HTTP | GET JSON camelCase |

### Data Storage

| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| vehicles | PostgreSQL jsonb features/rules | 9 rows | Demo seed, upsert on startup |

## Constraints

- Unknown location returns `[]`, not every vehicle.
- Image URLs are client asset paths such as `/assets/vehicles/v1.jpg`.
- Do not filter the grid by rental dates.

## Success Criteria

### Functional
- [ ] UAT-1: landing shows all 9 vehicles
- [ ] UAT-2: a location with no rows shows the no-results message
- [ ] Search then refresh keeps `location`, `pickupDate`, and `returnDate`

### Non-Functional
- [ ] A loading state is visible while the list request is in flight

### Quality
- [ ] API test covers 9 vehicles and an unknown location
- [ ] Client test covers URL update on Search

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| bolt-002-catalog-search-1 | simple | — | API seed and list/get endpoints |
| bolt-002-catalog-search-2 | simple | — | Landing search and URL sync |

## Notes

This is the first build unit in start-working.md §5.
