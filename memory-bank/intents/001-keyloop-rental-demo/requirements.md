---
intent: 001-keyloop-rental-demo
phase: inception
status: complete
created: 2026-11-10T10:26:00Z
updated: 2026-11-10T10:26:00Z
---

# Requirements: Keyloop rental demo

## Intent Overview

An anonymous renter can browse an API-backed catalogue, search by city, create Pending bookings in the current browser tab, choose insurance, pay with Stripe Checkout in test mode, and manage those trips. This is a journey demonstrator, not a marketplace.

Source of truth for behaviour: PRD v0.2 (`docs/requirements/PRD-Keyloop-Car-Rental-Booking.md`) plus the resolutions in the decision log. BRD v1.0 §7.4 (simulated card form) is superseded.

## Business Goals

| Goal | Success Metric | Priority |
|------|----------------|----------|
| Show the full rental journey without an account | SM-1 smoke completes: search, book, pay in test mode, see Paid, cancel | Must |
| Keep charges understandable | Insurance change updates the total before pay | Must |
| Keep card data out of the app | UAT-10: no PAN or CVV in sessionStorage, localStorage, or logs | Must |
| Preserve trips for the tab session | UAT-12 same-tab refresh keeps bookings; UAT-13 a new tab is empty | Must |

---

## Functional Requirements

Priority matches PRD §8 unless the decision log says otherwise. Related stories are unassigned until Construction.

### Discovery (unit 002-catalog-search)

| ID | Description | Acceptance criteria | Priority |
|----|-------------|---------------------|----------|
| FR-1.1 | Display seed vehicles on initial load | Landing calls `GET /api/vehicles` and shows all 9 seed vehicles | Must |
| FR-1.2 | Vehicle card content | Each card shows photo, name, location, and daily price | Must |
| FR-1.3 | Search inputs | Renter can enter pickup location, pickup date, and return date | Must |
| FR-1.4 | Results match the location filter | Dates do not filter the catalogue (OQ-08). Location filters to Sydney, Melbourne, Brisbane, or Perth | Must |
| FR-1.5 | Empty results | A no-results message is shown. The page is not blank | Must |
| FR-1.6 | Open detail | Selecting a card opens that vehicle | Must |
| FR-1.7 | URL sync | Search writes `location`, `pickupDate`, and `returnDate` to the URL. Refresh restores them | Must |

### Booking (unit 003-vehicle-booking)

| ID | Description | Acceptance criteria | Priority |
|----|-------------|---------------------|----------|
| FR-2.1 | Detail content | Detail shows name, photo, location, and daily price | Must |
| FR-2.2 | Carry search context | Detail links keep the same query params | Must |
| FR-2.3 | Dates required | Continue booking stays disabled until dates are valid | Must |
| FR-2.4 | Date order | Return date must be after pickup date, or the action stays disabled and an error is shown | Must |
| FR-2.5 | Create Pending | Continue booking appends a Pending record with id, vehicle, location, dates, and creation time | Must |
| FR-2.6 | Do not overwrite | A second booking does not replace the first | Must |
| FR-2.7 | Go to payment | The browser opens Payment Details for that booking id | Must |

Past pickup dates are blocked (OQ-09). There is no maximum rental length (OQ-10). Overlapping bookings are allowed (OQ-11).

### Insurance and charges (unit 004-insurance-pricing)

| ID | Description | Acceptance criteria | Priority |
|----|-------------|---------------------|----------|
| FR-3.1 | Payment page context | Page shows the vehicle and rental info for the route `bookingId` | Must |
| FR-3.2 | One tier required | Continue or pay stays blocked until one tier is selected | Must |
| FR-3.3 | Tiers | Basic 500, Standard 1000, Premium 1500 USD, flat per booking | Must |
| FR-3.4 | Breakdown | Shows daily price, days, base, insurance, platform fee, and total | Must |
| FR-3.5 | Base amount | Daily price × rental days. Days are calendar days, minimum 1 | Must |
| FR-3.6 | Live update | Changing tier updates insurance and total immediately | Must |
| FR-3.7 | Platform fee | One line. Amount is $5 USD | Must |
| FR-3.8 | Pay entry | Primary action is Pay with Stripe. An optional link opens the checkout summary | Must |

Insurance and totals persist on the Pending booking if the renter leaves (OQ-12).

### Stripe (unit 005-stripe-payment)

| ID | Description | Acceptance criteria | Priority |
|----|-------------|---------------------|----------|
| FR-4.1 | Checkout summary | `/bookings/:bookingId/checkout` shows the summary and can start Stripe | Must |
| FR-4.2 | No card fields | The app redirects to Stripe Checkout. It does not collect PAN, expiry, or CVV | Must |
| FR-4.3 | Create session | Client calls `POST /api/payments/checkout-session` with booking id, vehicle id, tier, and dates | Must |
| FR-4.4 | Verify | Client marks Paid only after `GET /api/payments/session/{sessionId}` verifies the session | Must |
| FR-4.5 | No card storage | PAN and CVV are never written to sessionStorage, localStorage, or app logs | Must |
| FR-4.6 | One booking | Success changes only the target booking from Pending to Paid | Must |
| FR-4.7 | Nothing to retain | No card data remains in the app after checkout | Must |
| FR-4.8 | Cancel or fail | The booking stays Pending and a message is shown | Must |
| FR-4.9 | Test mode | Charges are Stripe test mode. The server computes the amount | Must |
| FR-6.2 | Test-mode notice | Payment and checkout pages show a visible Stripe test-mode notice | Should |

OQ-07 card-field validation is withdrawn. It applied to the simulated form that v0.2 removed.

### My Trips (unit 006-my-trips)

| ID | Description | Acceptance criteria | Priority |
|----|-------------|---------------------|----------|
| FR-5.2 | Open trips | Trips navigation opens My Booked Trips | Must |
| FR-5.3 | All session bookings | Every booking in the session collection is listed | Must |
| FR-5.4 | Statuses | Pending, Paid, and Cancelled can all appear | Must |
| FR-5.5 | Entry fields | Vehicle name, pickup location, dates, status, booking id, creation date | Must |
| FR-5.6 | Hierarchy | Trip info, then status, then id, then creation date | Must |
| FR-5.7 | Ids | Sequential per session: TRP-001, TRP-002. Ids are not reused (OQ-14) | Must |
| FR-5.8 | Append | New bookings appear beside existing ones | Must |
| FR-5.9 | Refresh | The collection survives a same-tab refresh | Must |
| FR-5.10 | New tab | A new or reopened tab starts empty | Must |
| FR-5.11 | Empty copy | Exact text `You haven't booked any trips yet` plus a button to landing | Must |
| FR-5.12 | Cancel | Pending and Paid can be cancelled. Cancelled is terminal | Must |
| FR-5.13 | Status | Cancel sets status to Cancelled | Must |
| FR-5.14 | History | Cancelled bookings stay visible | Must |
| FR-5.15 | Isolation | Cancelling one booking does not change another | Must |
| FR-6.1 | Confirm cancel | A confirmation dialog is shown before cancel | Should |
| OQ-13 | Resume pay | A Pending trip can start payment from My Trips | Must |

Cancel of a Paid booking is allowed and does not simulate a refund (OQ-06).

### Shell (unit 001-platform-shell)

| ID | Description | Acceptance criteria | Priority |
|----|-------------|---------------------|----------|
| FR-5.1 | Trips entry points | Trips is available on Landing, Vehicle Detail, Payment Details, and Checkout | Must |
| FR-6.4 | FAQ and footer | Landing has an FAQ at `#faq`. A site footer is on all routes, with links for search, trips, and FAQ | Should |
| FR-6.3 | Session banner | Withdrawn. Do not show a site-wide tab-loss banner. FAQ copy may mention it | Won't |

---

## Non-Functional Requirements

### Performance

| Requirement | Metric | Target |
|-------------|--------|--------|
| NFR-02 Catalogue | Feedback while `GET /api/vehicles` is in flight | Loading state on landing, then results or empty |
| NFR-09 Charges | Insurance change | Total updates in the same turn, without a round trip |

### Security

| Requirement | Standard | Notes |
|-------------|----------|-------|
| NFR-03 Card data | No PAN or CVV in the client | Stripe hosted page only |
| Secrets | User secrets | `Stripe:SecretKey` never in source or logs |
| Authentication | None | Anonymous renter is intentional |

### Reliability

| Requirement | Metric | Target |
|-------------|--------|--------|
| NFR-04 Integrity | Booking updates | Keyed by booking id. One update does not rewrite other rows |
| NFR-05 Session | Same-tab refresh | `keyloop.bookings.v1` still lists the bookings |
| NFR-06 Access | Booking writes | Only `BookingSessionService` mutates the collection |

### Usability and compliance

| Requirement | Standard | Notes |
|-------------|----------|-------|
| NFR-01 Navigation | One primary action per page | Status is not conveyed by colour alone |
| NFR-07 Browsers | Current Chrome and Edge desktop | Demo scope |
| NFR-08 Accessibility | Labels, keyboard, visible focus | Skip link, landmarks, form labels. WCAG 2.1 AA is the intent, not a formal audit |

---

## Constraints

### Technical Constraints

**Project-wide standards**: `memory-bank/standards/`.

**Intent-specific constraints**:
- Implement under this repo's `client/` and `server/`. The sibling `../Keyloop` repo is a read-only pattern library.
- Bookings are not a server API.
- Local ports stay 4200 and 5077.
- Missing `bookingId` in session storage shows a not-found state. Do not invent a booking.

### Business Constraints

- No live charges, accounts, receipts, or availability engine.
- Nine vehicles. Content comes from the API seed, not a hard-coded client list.
- Empty-state sentence is exact, including the apostrophe in `haven't`.

---

## Assumptions

| Assumption | Risk if invalid | Mitigation |
|------------|-----------------|------------|
| Renters accept losing trips when the tab session ends | Demo looks like data loss | FAQ copy only. FR-6.3 banner stays withdrawn |
| Insurance amounts are flat per booking and may exceed the rental | Totals look wrong | Show the breakdown lines. Do not prorate by day |
| Stripe test mode is configured on the machine that runs SM-1 | UAT-8 and UAT-9 cannot be completed | API returns 503 and the page says Stripe is not configured |
| Desktop Chrome or Edge is enough | Mobile layout gaps | NFR-07 limits the demo to modern desktop browsers |

---

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| OQ-01 Currency | Business | Closed | USD |
| OQ-02 Platform fee | Business | Closed | $5 flat |
| OQ-03 Day count | Business | Closed | Calendar days, minimum 1 |
| OQ-04 Seed size | Product | Closed | 9 vehicles in four AU cities. Ignore the OQ log row that says 8 |
| OQ-05 Cancel confirm | Product | Closed | FR-6.1 Should |
| OQ-06 Cancel Paid | Product | Closed | Allowed, no refund simulation |
| OQ-07 Card validation | Product | Closed | Withdrawn with the in-app card form |
| OQ-08 Date filter | Product | Closed | Dates validate only. Location filters |
| OQ-09 Past pickup | Product | Closed | Block |
| OQ-10 Max length | Product | Closed | None |
| OQ-11 Overlap | Product | Closed | Allow |
| OQ-12 Persist insurance | Product | Closed | Yes, on the Pending booking |
| OQ-13 Resume pay | Product | Closed | Must, from My Trips |
| OQ-14 Id reuse | Product | Closed | Never reuse an id in the session |

## UAT

UAT-1 through UAT-14 in PRD §17 are the acceptance scenarios. The sibling UAT report is evidence for the reference app, not for this repo.
