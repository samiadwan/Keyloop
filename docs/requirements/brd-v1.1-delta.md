# BRD v1.1 delta (as-built alignment)

**Baseline:** [`brd.md`](brd.md) — BRD-KEYLOOP-2026-10-30 **v1.0** (copy in this folder).  
**As-built product:** documented in [`PRD-Keyloop-Car-Rental-Booking.md`](PRD-Keyloop-Car-Rental-Booking.md) **v0.2** and [`prd-v0.2-delta.md`](prd-v0.2-delta.md).  
**Date:** 9 November 2026.

This addendum records business-level changes approved for the demonstrator **without** reissuing the full BRD. For implementation detail, use the PRD.

---

## 1. What stays the same (BRD v1.0 still valid)

- Anonymous renter, no accounts.
- Session-scoped booking collection (`My Trips`); not a system of record.
- Booking lifecycle: **Pending → Paid → Cancelled**; cancel keeps history.
- Insurance tiers and transparent charge breakdown before payment.
- Unique sequential booking IDs per session (TRP-001…).
- No PAN/CVV in browser storage (NFR-03 intent).
- In-scope journey: discover → book → insure → pay → manage trips.

---

## 2. Material changes (v1.0 → as-built)

### 2.1 Payment (BR §1.2, §4.1 item 7, §5.1 steps 10–13, FR-4.x)

| BRD v1.0 | As-built (v1.1 intent) |
|----------|-------------------------|
| Simulated **in-app** card checkout | **Stripe Checkout (test mode)** — hosted payment page; app does not collect card fields |
| “Payment simulation” / no real gateway | **Test payment processor** in scope for demo; **live/production** charges remain out of scope (BRD §4.2) |
| Form validation = Paid | **Verified Stripe session** → Paid; cancel/fail → stays Pending |

**Business wording:** *Demonstrate payment completion using a industry-standard test checkout, not a fake HTML card form.*

### 2.2 Vehicle catalogue (BR §4.1, §10.2, NFR-02)

| BRD v1.0 | As-built |
|----------|----------|
| Predefined seed collection in the client | **Nine vehicles** in **PostgreSQL**, served by **read-only API** |
| NFR-02: no remote catalogue service | Catalogue loaded from API at runtime (still demo data, not a live marketplace) |

**Business wording:** *Seed catalogue is centrally maintained and delivered via API; bookings remain client-session only.*

### 2.3 Search (BR §4.1 item 3, §5.1 step 3)

| BRD v1.0 | As-built |
|----------|----------|
| Location **and** rental-date filtering of results | **Location** filters catalogue; **dates** validate the rental window and carry through booking (no availability engine — OQ-08) |
| — | Successful **Search** persists `location` / dates in the **URL** for refresh and share |

### 2.4 Demo communication (FR-6.x in PRD)

| BRD v1.0 | As-built |
|----------|----------|
| (Implied) demo payment messaging | Stripe **test mode** notice on **payment and checkout** pages only |
| Session tab loss notice (PRD FR-6.3) | **Not** shown site-wide; optional **FAQ** copy on landing |

### 2.5 Landing experience (not in BRD v1.0)

- **FAQ** (`#faq`) and **site footer** on all pages (explore: search, trips, FAQ) — marketing/demo chrome, not new booking capabilities.

---

## 3. BRD §4.2 Out of scope — clarification

Keep **live payment processing**, saved cards, receipts, and production PCI scope **out of scope**.

**Clarification:** Stripe **test mode** for the demonstrator is **in scope** as a third-party hosted checkout; it does not constitute “real payment gateway integration” for production purposes in BRD §4.2.

---

## 4. Requirements mapping (high level)

| BRD area | PRD / implementation |
|----------|----------------------|
| FR-4 (checkout) | PRD FR-4.x Stripe; `PaymentsController` |
| FR-1 (search) | PRD FR-1.7 URL sync; location API filter |
| Catalogue | `GET /api/vehicles`, `VehicleSeed` + seeder |
| UAT-8/9 | Stripe cancel/success, not card form validation |

---

## 5. When to revise full BRD v1.1

Revise [`brd.md`](brd.md) in place if:

- Legal/compliance requires a single numbered BRD for sign-off, or
- Stakeholders mandate one document instead of baseline + delta.

Until then, treat **BRD v1.0 + this addendum + PRD v0.2** as the complete business picture.

---

## 6. Traceability

- Engineering tasks: [`../implementation/task-breakdown.md`](../implementation/task-breakdown.md)
- UAT: [`../implementation/uat-validation-report.md`](../implementation/uat-validation-report.md)
- Ops: [`../guide/stripe-test-setup.md`](../guide/stripe-test-setup.md), [`../guide/backend-development.md`](../guide/backend-development.md)
