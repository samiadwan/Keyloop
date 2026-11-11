---
id: 004-insurance-pricing
bolt_type: simple-construction-bolt
intent: 001-keyloop-rental-demo
unit: 004-insurance-pricing
status: in-progress
current_stage: test
started: 2026-11-10T12:52:00Z
---

# Bolt: Insurance pricing

## Plan

Expose pricing config, compute the USD total on the server and in the client, and save the selected tier on the Pending booking.

## Implement

`GET /api/config` returns USD, a $5 fee, and tiers 500, 1000, and 1500. The payment page recalculates the breakdown when the tier changes and updates that booking id only. Pay with Stripe does not start a checkout session.

## Test

UAT-6, UAT-7, and the $100 vehicle for 3 days at Standard equaling 1305.
