---
unit: 004-insurance-pricing
intent: 001-keyloop-rental-demo
phase: inception
status: ready
created: 2026-11-10T10:26:00Z
updated: 2026-11-10T10:26:00Z
---

# Unit Brief: Insurance pricing

## Purpose

Show one insurance tier and a charge breakdown whose total matches the server formula, and save that choice on the Pending booking.

## Scope

### In Scope
- `GET /api/config`
- Payment details route `/bookings/:bookingId/payment`
- Tiers Basic 500, Standard 1000, Premium 1500 USD
- Breakdown: daily price, calendar days (minimum 1), base, insurance, $5 platform fee, total
- Instant recalculation in the UI
- Persist tier and totals on the booking when the renter selects a tier
- Block pay or continue until one tier is selected
- Server `ChargeCalculator` used later by Stripe. This unit introduces it

### Out of Scope
- Creating the Stripe session
- Card capture

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Payment page shows vehicle and rental info | Must |
| FR-3.2 | Exactly one tier before continue | Must |
| FR-3.3 | Three USD tiers, flat per booking | Must |
| FR-3.4 | Full breakdown | Must |
| FR-3.5 | Base = daily price × days | Must |
| FR-3.6 | Tier change updates the total immediately | Must |
| FR-3.7 | Platform fee is one $5 line | Must |
| FR-3.8 | Primary Pay with Stripe control is present. The Stripe call itself is unit 005 | Must |

## Domain Concepts

### Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| App config | Pricing metadata | currency, platformFeeUsd, insuranceTiers, rentalDayRule |
| Quote | Computed charges | days, base, insurance, fee, total |

### Key Operations

| Operation | Description | Inputs | Outputs |
|-----------|-------------|--------|---------|
| Load config | Read tiers and fee | none | config JSON |
| Quote | Apply the formula | daily price, dates, tier | total |
| Save tier | Update one booking | bookingId, tier, totals | same array, one row changed |

## Story Summary

Stories are not split. Cover UAT-6 and UAT-7.

## Dependencies

### Depends On

| Unit | Reason |
|------|--------|
| 003-vehicle-booking | Pending booking and payment route |

### Depended By

| Unit | Reason |
|------|--------|
| 005-stripe-payment | Session create uses the same tier, dates, and server total |

### External Dependencies

| System | Purpose | Risk |
|--------|---------|------|
| PostgreSQL or in-memory config | Tiers and fee | Low |

## Technical Context

### Suggested Technology

`features/payment-details`, `pricing` service on the client, `Pricing/ChargeCalculator.cs` on the server. The client formula must match the server. The server amount is authoritative at pay time.

Formula: rental days = calendar difference, minimum 1. Base = daily price × days. Total = base + tier amount + 5.

### Integration Points

| Integration | Type | Protocol |
|-------------|------|----------|
| Config | HTTP | GET `/api/config` |

### Data Storage

| Data | Type | Volume | Retention |
|------|------|--------|-----------|
| Selected tier and totals | fields on the session booking | one row | With the tab session |

## Constraints

- Currency is USD. Do not leave it as TBC.
- Do not use the stale PRD example that adds a $50 fee.
- Insurance is not per day.
- Unknown `bookingId` does not create a booking.

## Success Criteria

### Functional
- [x] UAT-6: changing tier changes the total immediately
- [x] UAT-7: continue or pay is blocked with no tier
- [x] A $100 daily vehicle for 3 days at Standard is 300 + 1000 + 5 = 1305

### Non-Functional
- [x] Recalculation does not wait on a payment API

### Quality
- [x] Calculator tests lock days, fee, and the three tiers
- [x] Session test shows the tier saved on that booking id only

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| bolt-004-insurance-pricing-1 | simple | — | Config API, calculator, payment breakdown UI |

## Notes

The Pay with Stripe button can be visible and disabled until unit 005 wires the redirect. The tier must already be stored.
