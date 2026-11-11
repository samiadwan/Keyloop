---
unit: 001-platform-shell
intent: 001-keyloop-rental-demo
phase: inception
status: ready
created: 2026-11-10T10:26:00Z
updated: 2026-11-10T10:26:00Z
---

# Unit Brief: Platform shell

## Purpose

Provide the app chrome every journey page shares: router outlet, Trips navigation, site footer, landing FAQ, and baseline keyboard access.

## Scope

### In Scope
- Standalone Angular shell and route titles
- Skip link to `#main-content`, header, primary nav, one main landmark, footer
- Footer links: search, trips, FAQ anchor
- Landing FAQ using native `details` and `summary` at `#faq`
- Visible focus and reduced-motion respect
- FR-5.1 link placement hooks for landing, detail, payment, and checkout

### Out of Scope
- Catalogue data, booking creation, pricing, Stripe, and the trips list
- A site-wide session-loss banner (FR-6.3 is withdrawn)

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Trips nav on Landing, Detail, Payment, Checkout | Must |
| FR-6.4 | Landing FAQ and site footer with explore links | Should |
| NFR-01 | Clear navigation | Must |
| NFR-08 | Labels, keyboard, visible focus | Must |

## Domain Concepts

### Key Entities

| Entity | Description | Attributes |
|--------|-------------|------------|
| App shell | Root component | outlet, footer |
| Faq item | Landing disclosure | question, answer |

### Key Operations

| Operation | Description | Inputs | Outputs |
|-----------|-------------|--------|---------|
| Navigate to trips | From any journey page | current route | `/trips` |
| Open FAQ | Landing only | hash `#faq` | expanded answers |

## Story Summary

| Metric | Count |
|--------|-------|
| Total Stories | 0 |
| Must Have | 0 |
| Should Have | 0 |
| Could Have | 0 |

Stories are not split. Construction uses this brief and UAT-14 for the nav links.

## Dependencies

### Depends On

None.

### Depended By

| Unit | Reason |
|------|--------|
| 002-catalog-search | Footer, FAQ, and Trips on landing |
| 003-vehicle-booking | Trips on detail |
| 005-stripe-payment | Trips on payment and checkout |
| 006-my-trips | Trips route target |

### External Dependencies

None.

## Technical Context

### Suggested Technology

Angular 21 standalone. Shared `kl-*` styles in `styles.scss`. Reference: `../Keyloop/client/src/app/app.ts` and the site footer. Do not import that project as the build root.

### Integration Points

| Integration | Type | Protocol |
|-------------|------|----------|
| Feature routes | Router | Angular routes |

### Data Storage

None.

## Constraints

- Footer is on all routes.
- FAQ is on landing, not a separate page.
- Status and actions must not rely on colour alone.

## Success Criteria

### Functional
- [ ] UAT-14: Trips opens from landing, detail, payment, and checkout once those pages exist
- [ ] Landing exposes `#faq`
- [ ] Footer explore links reach search, trips, and FAQ

### Non-Functional
- [ ] Skip link moves focus to `#main-content`
- [ ] Focus ring is visible

### Quality
- [ ] Route titles are set
- [ ] No card fields are introduced in the shell

## Bolt Suggestions

| Bolt | Type | Stories | Objective |
|------|------|---------|-----------|
| bolt-001-platform-shell-1 | simple | — | Shell, footer, FAQ, skip link, routes stub |

## Notes

Build this in parallel with catalogue search. Later units add their own Trips links if the shell does not project them.
