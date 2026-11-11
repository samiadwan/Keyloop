---
intent: 001-keyloop-rental-demo
created: 2026-11-10T10:26:00Z
completed: null
status: in-progress
---

# Inception Log: 001-keyloop-rental-demo

## Overview

**Intent**: Anonymous car-rental demonstrator for Australia: catalogue search, session bookings, insurance, Stripe Checkout test mode, and My Trips.
**Type**: green-field
**Created**: 2026-11-10T10:26:00Z

## Artifacts Created

| Artifact | Status | File |
|----------|--------|------|
| Requirements | done | requirements.md |
| System Context | done | system-context.md |
| Units | done | units.md and units/*/unit-brief.md |
| Stories | not started | start-working.md routes Construction by unit |
| Bolt Plan | not started | created when Construction starts a unit |

## Summary

| Metric | Count |
|--------|-------|
| Functional Requirements | 44 PRD rows (FR-1.1 through FR-6.4, including withdrawn FR-6.3) |
| Non-Functional Requirements | 9 (NFR-01 through NFR-09) |
| Units | 6 |
| Stories | 0 |
| Bolts Planned | 0 |

## Units Breakdown

| Unit | Stories | Bolts | Priority |
|------|---------|-------|----------|
| 001-platform-shell | 0 | 0 | Must, parallel early |
| 002-catalog-search | 0 | 0 | Must, build first |
| 003-vehicle-booking | 0 | 0 | Must |
| 004-insurance-pricing | 0 | 0 | Must |
| 005-stripe-payment | 0 | 0 | Must |
| 006-my-trips | 0 | 0 | Must |

Build order from start-working.md §5: `002` → `003` → `004` → `005` → `006`, with `001` in parallel early.

## Decision Log

| Date | Decision | Rationale | Approved |
|------|----------|-----------|----------|
| 2026-11-10 | One intent, `001-keyloop-rental-demo` | start-working.md §4 | start-working.md |
| 2026-11-10 | Six units and the build order in §5 | Maps to PRD epics | start-working.md |
| 2026-11-10 | Catalogue is 9 vehicles, not 8 | PRD §16, PRD delta, and backend-api override the OQ log row that says 8 | PRD v0.2 |
| 2026-11-10 | USD, platform fee $5, insurance 500/1000/1500 flat per booking | Closed OQ-01, OQ-02. The PRD §10 example that uses a $50 fee is stale | PRD delta |
| 2026-11-10 | No in-app card fields; OQ-07 does not apply | FR-4.2 and the BRD delta replace the simulated card form | PRD v0.2 |
| 2026-11-10 | FR-6.3 stays withdrawn | v0.2 removes the site-wide session banner. FAQ copy may mention tab loss | PRD v0.2 |
| 2026-11-10 | FR-6.2 stays Should and is in the Stripe unit | PRD priority is Should. start-working.md §5 still requires the Stripe unit to show the test-mode notice | PRD + start-working.md |
| 2026-11-10 | Resume payment from My Trips is Must | OQ log marks OQ-13 Must. PRD §16 only recommended it | oq-resolution-log.md |
| 2026-11-10 | No application code in this pass | start-working.md §3 kickoff | start-working.md |

## Scope Changes

| Date | Change | Reason | Impact |
|------|--------|--------|--------|
| 2026-11-10 | None beyond the recorded resolutions | Conflicts inside the doc pack were closed in favour of PRD v0.2 plus the OQ log where the log is later and still applicable | Construction uses requirements.md, not raw BRD §7.4 |

## Ready for Construction

**Checklist**:
- [x] All requirements documented
- [x] System context defined
- [x] Units decomposed
- [ ] Stories created for all units
- [ ] Bolts planned
- [ ] Human review complete

start-working.md §6 allows Construction to start from a unit folder without a prior bolt file. Stories and bolts can be written at the start of that unit.

## Next Steps

1. Review this intent.
2. Run Construction for `002-catalog-search`, with `001-platform-shell` in parallel if the shell is needed for the first page.
