---
unit: 005-stripe-payment
intent: 001-keyloop-rental-demo
phase: inception
status: ready
created: 2026-11-10T10:26:00Z
updated: 2026-11-10T10:26:00Z
---

# Unit Brief: Stripe payment

## Purpose

Take a Pending booking to Paid only after Stripe Checkout test mode succeeds and the API verifies the session.

## Scope

### In Scope
- `POST /api/payments/checkout-session` with booking id, vehicle id, tier, pickup date, return date
- Server-computed amount from vehicles, config, and tiers
- `GET /api/payments/session/{sessionId}`
- Redirect to `checkoutUrl`
- Checkout route `/bookings/:bookingId/checkout` with summary and return handling `stripe=success` and `session_id`
- Cancel or failure leaves Pending and shows a message
- Success updates only that booking to Paid
- FR-6.2 test-mode notice on payment and checkout
- 400, 502, and 503 responses from the API contract
- User secrets for `Stripe:SecretKey` and `Stripe:ClientUrl`

### Out of Scope
- In-app PAN, expiry, or CVV fields
- Live Stripe charges
- Storing Stripe payments in PostgreSQL
- OQ-07 card validation

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Checkout summary can start Stripe | Must |
| FR-4.2 | No in-app card fields | Must |
| FR-4.3 | Create checkout session | Must |
| FR-4.4 | Verify before Paid | Must |
| FR-4.5 | No card data in storage or logs | Must |
| FR-4.6 | Only the target booking becomes Paid | Must |
| FR-4.7 | No card data retained | Must |
| FR-4.8 | Cancel or error stays Pending | Must |
| FR-4.9 | Test mode and server amount | Must |
| FR-6.2 | Test-mode notice on payment and checkout | Should |

## Domain Concepts

### Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| Checkout session | Stripe test session | checkoutUrl, sessionId, amount |
| Payment result | Verify payload | paid, bookingId |

### Key Operations

| Operation | Description | Inputs | Outputs |
|-----------|-------------|--------|---------|
| Create session | Server prices and calls Stripe | booking, vehicle, tier, dates | checkoutUrl |
| Verify | After redirect | sessionId | paid flag |
| Mark paid | Session update | bookingId | that row only, status Paid |

## Story Summary

Stories are not split. Cover UAT-8, UAT-9, and UAT-10. UAT-8 and the live redirect are manual when a test key is present.

## Dependencies

### Depends On

| Unit | Reason |
|------|--------|
| 004-insurance-pricing | Tier, dates, and the charge formula |

### Depended By

| Unit | Reason |
|------|--------|
| 006-my-trips | Shows Paid and resumes pay |

### External Dependencies

| System | Purpose | Risk |
|--------|---------|------|
| Stripe test API | Hosted checkout | High if the secret is missing. Return 503 and a clear page message |

## Technical Context

### Suggested Technology

`PaymentsController` and `payments-api.service.ts`. Reference: `docs/guide/stripe-test-setup.md` and `../Keyloop` payments API. Success URL pattern: `/bookings/TRP-xxx/checkout?stripe=success&session_id=...`.

### Integration Points

| Integration | Type | Protocol |
|-------------|------|----------|
| Stripe | HTTP from the API | Checkout Session API, payment mode |
| Client | HTTP | POST create, GET verify |

### Data Storage

| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| Paid status | session booking field | one row | Tab session |
| Stripe secret | user secrets | one key | Machine only |

## Constraints

- Never commit `sk_test_` or `sk_live_` keys.
- Never log the secret or card data.
- Do not set Paid if verify does not say paid.
- Amount on the Stripe session must match the calculator.

## Success Criteria

### Functional
- [x] UAT-9: paying TRP-002 marks only TRP-002 Paid
- [x] UAT-8: cancel or decline leaves Pending and shows a message
- [x] Missing secret returns 503 and the checkout page explains that Stripe is not configured

### Non-Functional
- [x] UAT-10: sessionStorage has no PAN or CVV fields

### Quality
- [x] API tests cover 400 for a bad tier or dates without calling live Stripe
- [x] Client does not contain card number inputs

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| bolt-005-stripe-payment-1 | simple | — | API create and verify, client redirect, test-mode notice |

## Notes

Manual SM-1 uses test card `4242 4242 4242 4242`, any future expiry, and any CVC. That card number must not be stored by the app.
