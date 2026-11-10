# PRD v0.2 delta (as-built, 9 Nov 2026)



Supersedes the v0.1 passages listed below. **Authoritative detail:** [`PRD-Keyloop-Car-Rental-Booking.md`](PRD-Keyloop-Car-Rental-Booking.md) § revision 0.2.



## Stack and boundaries



- **Frontend:** Angular **21** standalone SPA (`client/`).

- **Backend:** ASP.NET Core **8** API (`server/Keyloop.Api/`) — PostgreSQL catalogue + config; **Stripe Checkout** (test) via `PaymentsController`.

- **Bookings:** Unchanged — `sessionStorage` `keyloop.bookings.v1`; no booking APIs.

- **Catalog:** `GET /api/vehicles`, `GET /api/vehicles/{id}`, `GET /api/config`; location filter + Photon-assisted autocomplete on client.

- **Payments:** `POST /api/payments/checkout-session`, `GET /api/payments/session/{id}`; secret `Stripe:SecretKey` in user secrets.



## Pricing and catalogue (closed OQs)



- **USD**; platform fee **$5**; insurance **500 / 1000 / 1500**.

- **9 vehicles** in **Sydney, Melbourne, Brisbane, Perth** (see `VehicleSeed.cs`).

- **OQ-08:** dates validate rental range; **location** drives search filter.



## Payment journey (replaces simulated card form)



- **FR-4.x:** No in-app PAN/CVV. **Pay with Stripe** on payment details; optional checkout summary route; return URL verifies session → **Paid**.

- **FR-4.9 / FR-6.2:** Stripe **test mode** messaging on payment and checkout only.



## Landing and chrome (new)



- **FR-1.7:** Search updates URL query params; refresh/back preserve state.

- Results heading, loading state, empty handling.

- **FR-6.4:** FAQ (`#faq`) on landing; **site footer** on all routes (Explore: search, trips, FAQ).



## Demo notices (FR-6.x)



- **FR-6.2:** Kept on payment + checkout (`app-demo-notices`).

- **FR-6.3:** Global “tab session” banner **removed** from UI (optional FAQ copy only).



## UAT adjustments



- **UAT-8:** Stripe cancel/fail → Pending (not invalid card form).

- **UAT-9:** Stripe success on one booking id only.

- **UAT-10:** Still no card data in sessionStorage (Stripe hosted fields).



## Traceability



- Implementation tasks: [`../implementation/task-breakdown.md`](../implementation/task-breakdown.md) (T-019 Stripe, T-020 landing).

- Smoke: [`../implementation/uat-validation-report.md`](../implementation/uat-validation-report.md).

- Ops: [`../guide/stripe-test-setup.md`](../guide/stripe-test-setup.md), [`../guide/backend-development.md`](../guide/backend-development.md).



## v0.1 text intentionally retained



- Booking status lifecycle, My Trips FR-5.x, insurance FR-3.x, cancellation rules, sequential TRP ids, empty-state exact copy.
