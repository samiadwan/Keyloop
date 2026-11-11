---
id: 005-stripe-payment
bolt_type: simple-construction-bolt
intent: 001-keyloop-rental-demo
unit: 005-stripe-payment
status: in-progress
current_stage: test
started: 2026-11-10T13:00:00Z
---

# Bolt: Stripe payment

## Plan

Create a Stripe Checkout session from the server-computed total, then mark one booking Paid only after the API verifies the session.

## Implement

`POST /api/payments/checkout-session` and `GET /api/payments/session/{sessionId}`. The payment and checkout pages show the test-mode notice and redirect to Stripe. A missing secret returns 503. Cancel or a failed verify leaves the booking Pending.

## Test

UAT-8, UAT-9, and UAT-10, plus 400 responses for a bad tier or dates without calling Stripe.
