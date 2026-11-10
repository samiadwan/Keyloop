# Journey rules — Keyloop

**Non-negotiable** for implementation (align with reference `.cursor/rules/keyloop-journey-context.mdc`).

## Search context (landing ↔ vehicle detail)

- Store **location**, **pickupDate**, **returnDate** in **URL query params**.
- Landing: rehydrate form from query on init; **Search** updates URL (`FR-1.7`).
- Links to `/vehicles/:id` must pass the same query params.

## Booking context (payment, checkout, trips)

- Route param **`bookingId`** (e.g. `/bookings/TRP-001/payment`).
- Resolve booking with `BookingSessionService.getById(bookingId)` from **sessionStorage** (`keyloop.bookings.v1`).
- Missing id in storage → not-found UX; links to Trips and Landing — **do not invent** bookings.
- Create bookings only via **Continue booking** on vehicle detail; append; update by **id** only.

## Payments

- Card data **never** in sessionStorage, localStorage, or logs.
- Stripe Checkout redirect; mark **Paid** only after API session verify.

## Navigation

**Trips** entry on Landing, Vehicle detail, Payment, Checkout.

## Search semantics (OQ-08)

- **Location** filters API catalogue.
- **Dates** validate range (and past pickup where applicable); they do **not** filter vehicle list.
