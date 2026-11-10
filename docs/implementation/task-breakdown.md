# Checkpoint 5 — Implementation task breakdown



| ID | Status | Objective |

|----|--------|-----------|

| T-001 | Done | AI-DLC trust/doctor; docs + `project.md` |

| T-002 | Done | Scaffold `server/Keyloop.Api` (.NET 8) |

| T-003 | Done | `GET /api/config` |

| T-004 | Done | `GET /api/vehicles` + AU seed + tests |

| T-015 | Done | PostgreSQL catalog + EF migrations + dev/API docs |

| T-005 | Done | Angular 21 `client/` — pin `vitest@4.0.8`, `client/.npmrc` |

| T-006 | Done | HttpClient, environment, CORS |

| T-007 | Done | Landing + search query context (init + **Search** updates URL; `queryParamMap` reload) |

| T-008 | Done | Vehicle detail + Continue booking → payment |

| E2E-ctx | Done | Journey rules, `journey-context`, payment/checkout/trips wiring |

| T-009 | Done | Insurance + charge breakdown UI; persist tier/totals on booking |

| T-010 | Superseded | ~~Simulated card checkout~~ → see **T-019** (Stripe); `checkout-validation` kept for legacy unit tests only |

| T-011 | Done | My Trips FR-5.5–5.15: hierarchy, vehicle name, cancel copy, refresh |

| T-012 | Done | FR-6.2 `app-demo-notices` (**Stripe test**) on payment + checkout only; FR-6.3 session tab notice **removed** from UI (2026-11-09) |

| T-013 | Done | Skip link, landmarks, focus, labels — see `a11y-checklist.md` |

| T-014 | Done | UAT-1–14 matrix + smoke script — `uat-validation-report.md` |

| T-019 | Done | Stripe Checkout (test): API session + verify; payment + checkout redirect; `docs/guide/stripe-test-setup.md` |

| T-020 | Done | Landing UX: results chrome, loading state, FAQ (`landing-faq`), site footer, Photon/Leaflet (see `backend-development.md`) |



## E2E context smoke



1. Start API + client (Stripe user-secrets configured).

2. Landing: Sydney + dates → **Search** → URL has query params → **View details**.

3. Continue booking → `/bookings/TRP-001/payment`.

4. Insurance → **Pay with Stripe** → test card on Stripe → return → **Paid** on Trips.

5. Refresh payment URL — booking still resolves from sessionStorage.


