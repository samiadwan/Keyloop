---
unit: 006-my-trips
intent: 001-keyloop-rental-demo
phase: inception
status: ready
created: 2026-11-10T10:26:00Z
updated: 2026-11-10T10:26:00Z
---

# Unit Brief: My Trips

## Purpose

Show every booking in the current tab, let the renter cancel Pending or Paid trips, and resume payment for a Pending trip.

## Scope

### In Scope
- Route `/trips`
- List every session booking with vehicle name, location, dates, status, id, and creation date
- Visual order: trip info, status, id, creation date
- Status badges for Pending, Paid, and Cancelled that are not colour-only
- Empty state text exactly `You haven't booked any trips yet` and a button to landing
- Cancel Pending or Paid. Record stays as Cancelled. Other rows stay unchanged
- Confirmation dialog before cancel (FR-6.1, Should)
- Complete payment on Pending rows (OQ-13, Must), opening that booking's payment route
- Same-tab refresh keeps the list. A new tab shows the empty state

### Out of Scope
- Server-side booking history
- Refunds
- Sorting or filtering the list (Could, not in this unit)

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-5.2 | Trips opens My Booked Trips | Must |
| FR-5.3 | Every session booking is listed | Must |
| FR-5.4 | Pending, Paid, Cancelled | Must |
| FR-5.5 | Required entry fields | Must |
| FR-5.6 | Visual hierarchy | Must |
| FR-5.7 | Sequential ids already issued | Must |
| FR-5.8 | New bookings appear beside old ones | Must |
| FR-5.9 | Same-tab refresh | Must |
| FR-5.10 | New tab starts empty | Must |
| FR-5.11 | Exact empty copy and landing button | Must |
| FR-5.12 | Cancel Pending or Paid | Must |
| FR-5.13 | Status becomes Cancelled | Must |
| FR-5.14 | Cancelled rows remain | Must |
| FR-5.15 | Other bookings unchanged | Must |
| FR-6.1 | Confirm before cancel | Should |
| OQ-13 | Resume payment from a Pending trip | Must |

## Domain Concepts

### Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| Trip row | One session booking | vehicleName, location, dates, status, bookingId, createdAt |

### Key Operations

| Operation | Description | Inputs | Outputs |
|-----------|-------------|--------|---------|
| List | Read the session array | none | rows or empty state |
| Cancel | Terminal status | bookingId, confirm | that row Cancelled |
| Resume pay | Pending only | bookingId | `/bookings/{id}/payment` |

## Story Summary

Stories are not split. Cover UAT-11, UAT-12, and UAT-13.

## Dependencies

### Depends On

| Unit | Reason |
|------|--------|
| 003-vehicle-booking | Session collection and ids |
| 001-platform-shell | Navigation into `/trips` |
| 005-stripe-payment | Paid rows and a real payment route to resume |

### Depended By

None.

### External Dependencies

None.

## Technical Context

### Suggested Technology

`features/my-trips`. Reuse `BookingSessionService.getById` and a cancel method that replaces one element by id. Reference: `../Keyloop` my-trips and `trips-copy` specs.

### Integration Points

| Integration | Type | Protocol |
|-------------|------|----------|
| Session | Browser | sessionStorage |
| Payment | Router | booking id param |

### Data Storage

| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| Trip list | same session array | all rows in the tab | Tab session |

## Constraints

- Empty copy is exact, including `haven't`.
- Cancelled rows have no further actions.
- Cancelling a Paid booking does not call Stripe for a refund.
- Do not invent rows that are not in session storage.

## Success Criteria

### Functional
- [ ] UAT-11: Pending and Paid both become Cancelled and stay listed
- [ ] UAT-12: refresh on `/trips` keeps the rows
- [ ] UAT-13: a new tab shows the exact empty message and a landing button
- [ ] Pending row can open payment. Paid and Cancelled rows cannot

### Non-Functional
- [ ] Status text is present, not only a coloured badge

### Quality
- [ ] A copy spec asserts the empty string
- [ ] A session spec cancels one id and leaves the other unchanged

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| bolt-006-my-trips-1 | simple | — | List, empty state, cancel, resume pay |

## Notes

UAT-13 needs a manual second tab even when the empty-copy unit test passes.
