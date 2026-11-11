---
intent: 001-keyloop-rental-demo
phase: inception
status: units-decomposed
updated: 2026-11-10T10:26:00Z
---

# Keyloop rental demo - Unit Decomposition

## Units Overview

This intent decomposes into 6 units of work. The list matches start-working.md §5.

### Unit 1: 001-platform-shell

**Description**: App shell, Trips navigation, site footer, landing FAQ, and baseline accessibility.

**Stories**: Not split yet. Construction may start from this brief.

**Deliverables**:

- Angular shell with router outlet, skip link, and footer on every route
- FAQ region `#faq` on landing
- Trips link on landing, detail, payment, and checkout

**Dependencies**:

- Depends on: none
- Depended by: every feature page for chrome and FR-5.1

**Estimated Complexity**: M

### Unit 2: 002-catalog-search

**Description**: Landing search, URL sync, and the vehicle catalogue API.

**Stories**: Not split yet.

**Deliverables**:

- `GET /api/vehicles` and `GET /api/vehicles/{id}`
- Seed of 9 vehicles
- Landing grid, location filter, no-results message, loading state
- Query params `location`, `pickupDate`, `returnDate`

**Dependencies**:

- Depends on: 001 for footer and Trips link. The page can be built against a stub shell
- Depended by: 003

**Estimated Complexity**: L

### Unit 3: 003-vehicle-booking

**Description**: Vehicle detail and creation of a Pending booking in session storage.

**Stories**: Not split yet.

**Deliverables**:

- Detail route `/vehicles/:id` keeping search query params
- `BookingSessionService` and `keyloop.bookings.v1`
- Continue booking creates `TRP-00N` and opens payment

**Dependencies**:

- Depends on: 002
- Depended by: 004, 006

**Estimated Complexity**: M

### Unit 4: 004-insurance-pricing

**Description**: Insurance selection and the charge breakdown.

**Stories**: Not split yet.

**Deliverables**:

- `GET /api/config`
- Payment details page with three tiers and a live total
- Server charge calculator using calendar days, minimum 1, and a $5 fee
- Persist tier and totals on the Pending booking

**Dependencies**:

- Depends on: 003
- Depended by: 005

**Estimated Complexity**: M

### Unit 5: 005-stripe-payment

**Description**: Stripe Checkout test mode. The app never collects card fields.

**Stories**: Not split yet.

**Deliverables**:

- `POST /api/payments/checkout-session` and `GET /api/payments/session/{sessionId}`
- Pay with Stripe on payment details
- Checkout summary route and return-url verification
- Test-mode notice on payment and checkout (FR-6.2)

**Dependencies**:

- Depends on: 004
- Depended by: 006 for the Paid status

**Estimated Complexity**: L

### Unit 6: 006-my-trips

**Description**: Session trip list, cancel, empty state, and resume payment.

**Stories**: Not split yet.

**Deliverables**:

- `/trips` listing every session booking
- Exact empty-state copy
- Cancel for Pending and Paid, with optional confirm dialog
- Complete payment from a Pending trip (OQ-13)

**Dependencies**:

- Depends on: 003 for the collection, 005 for Paid, 001 for navigation
- Depended by: none

**Estimated Complexity**: M

## Unit Dependency Graph

```text
[001-platform-shell]
        |
        v
[002-catalog-search] --> [003-vehicle-booking] --> [004-insurance-pricing]
                                                          |
                                                          v
                                                   [005-stripe-payment]
                                                          |
                                                          v
                                                      [006-my-trips]
```

`001` can proceed in parallel with `002`. `006` can list Pending bookings as soon as `003` exists. Paid status and resume-pay need `005`.

## Execution Order

1. `002-catalog-search` first, and `001-platform-shell` early in parallel
2. `003-vehicle-booking`
3. `004-insurance-pricing`
4. `005-stripe-payment`
5. `006-my-trips`

Each unit follows `docs/architecture/backend-api.md`, `specs/02-journey-rules.md`, and the UAT ids named in its brief. Reference code in `../Keyloop` is read-only.
