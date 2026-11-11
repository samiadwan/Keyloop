---
unit: 003-vehicle-booking
intent: 001-keyloop-rental-demo
phase: inception
status: ready
created: 2026-11-10T10:26:00Z
updated: 2026-11-10T10:26:00Z
---

# Unit Brief: Vehicle booking

## Purpose

Turn a vehicle detail page into one new Pending booking in the browser session, without touching older bookings.

## Scope

### In Scope
- Route `/vehicles/:id` with the search query params
- Vehicle detail from `GET /api/vehicles/{id}`
- Date validation: both dates set, return after pickup, pickup not in the past
- Continue booking appends `keyloop.bookings.v1` and opens `/bookings/TRP-00N/payment`
- Sequential ids from the session collection. Ids are never reused
- Missing session booking on later routes shows not-found, with links to trips and landing

### Out of Scope
- Insurance totals
- Stripe
- The trips list layout

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Detail shows name, photo, location, daily price | Must |
| FR-2.2 | Search context stays on the link | Must |
| FR-2.3 | Continue disabled until dates are valid | Must |
| FR-2.4 | Return date after pickup | Must |
| FR-2.5 | Pending record with id, vehicle, location, dates, creation time | Must |
| FR-2.6 | Append only | Must |
| FR-2.7 | Redirect to payment for that id | Must |

## Domain Concepts

### Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| Booking | Session record | bookingId, vehicleId, vehicleName, location, pickupDate, returnDate, createdAt, status |

### Key Operations

| Operation | Description | Inputs | Outputs |
|-----------|-------------|--------|---------|
| Continue booking | Append Pending | vehicle, location, dates | new id, navigate to payment |
| Get by id | Read session | bookingId | booking or not-found |

## Story Summary

Stories are not split. Cover UAT-3, UAT-4, and UAT-5.

## Dependencies

### Depends On

| Unit | Reason |
|------|--------|
| 002-catalog-search | Vehicle payload and query params |

### Depended By

| Unit | Reason |
|------|--------|
| 004-insurance-pricing | Needs an existing Pending booking |
| 006-my-trips | Reads the same collection |

### External Dependencies

None beyond the catalogue API.

## Technical Context

### Suggested Technology

`BookingSessionService` is the only writer. Storage key `keyloop.bookings.v1`. Reference: `../Keyloop` vehicle-detail and booking-session service.

### Integration Points

| Integration | Type | Protocol |
|-------------|------|----------|
| Vehicle detail | HTTP | GET `/api/vehicles/{id}` |
| Session | Browser | sessionStorage |

### Data Storage

| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| bookings | sessionStorage array | one tab | Until the tab session ends |

## Constraints

- Do not create bookings from any control except Continue booking.
- Do not replace the whole array when updating one id.
- Overlapping rentals are allowed.
- No maximum rental length.

## Success Criteria

### Functional
- [x] UAT-3: Continue is disabled when dates are missing
- [x] UAT-4: return on or before pickup shows an error and creates nothing
- [x] UAT-5: two continues yield TRP-001 and TRP-002

### Non-Functional
- [x] A new tab has an empty collection
- [x] Same-tab refresh still returns the booking by id

### Quality
- [x] Session service tests update one id and leave the other intact

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| bolt-003-vehicle-booking-1 | simple | — | Session service and detail Continue booking |

## Notes

Payment route may be a placeholder until unit 004. The redirect target id must already be in session storage.
