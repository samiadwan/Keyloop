---
id: 003-vehicle-booking
bolt_type: simple-construction-bolt
intent: 001-keyloop-rental-demo
unit: 003-vehicle-booking
status: in-progress
current_stage: test
started: 2026-11-10T11:14:00Z
---

# Bolt: Vehicle booking

## Plan

Add `keyloop.bookings.v1` and create one Pending booking from Continue booking on the vehicle page.

## Implement

Session service appends by id. The detail page validates dates. Payment shows the stored booking or a not-found state.

## Test

UAT-3, UAT-4, and UAT-5, plus an update that leaves the other booking unchanged.
