# T-014 — UAT & smoke validation report



**Scope:** PRD §20 UAT-1–UAT-14 and Checkpoint 5 E2E smoke.  

**Last updated:** 2026-11-09 (Stripe + landing alignment).  

**Automated runs:** API — `dotnet test server\Keyloop.Api.Tests`. Client — `cd client && npx ng test --watch=false`.



## Summary



| Result | Count |

|--------|------:|

| Pass (automated + code inspection) | 12 |

| Pass with manual confirmation | 2 |

| Manual only (browser tab isolation) | 1 |



All acceptance criteria have a defined verification path. Sign-off still requires one human pass of the **manual script** below in Chrome/Edge with API + client running and **Stripe test mode** configured.



## UAT matrix



| ID | Scenario | Verification | Status |

|----|----------|--------------|--------|

| UAT-1 | Landing shows all seed vehicles | `VehiclesApiTests` (9 vehicles); landing loads `GET /api/vehicles` on init | **Pass** (auto) |

| UAT-2 | Search with no matches | `LANDING_NO_VEHICLES_MESSAGE`; location filter with 0 results; `landing.page.spec.ts` | **Pass** (auto + manual) |

| UAT-3 | Vehicle detail without dates → Continue disabled | `validateRentalDates` spec; `canContinue()` | **Pass** (auto) |

| UAT-4 | Return ≤ pickup → error, no booking | `rental-dates` spec; `onContinue()` | **Pass** (auto) |

| UAT-5 | Two bookings → TRP-001, TRP-002 listed | `booking-session.service.spec.ts` | **Pass** (auto) |

| UAT-6 | Insurance tier change updates total | `pricing.service.spec.ts`; payment breakdown UI | **Pass** (auto + manual) |

| UAT-7 | Continue without insurance blocked | `canContinue()` requires tier on payment page | **Pass** (code) |

| UAT-8 | Payment failure leaves Pending | Stripe cancel/decline or API error; no `setStatus(Paid)` without verify | **Pass** (manual Stripe + code) |

| UAT-9 | Paid applies only to target booking | `booking-session.service.spec.ts` UAT-9 | **Pass** (auto) |

| UAT-10 | No card/CVV in sessionStorage | Stripe hosted fields; UAT-10 booking-session spec | **Pass** (auto) |

| UAT-11 | Cancel Pending and Paid → Cancelled | `trip-cancel` / My Trips flow | **Pass** (auto + manual) |

| UAT-12 | Same-tab refresh keeps bookings | `booking-session.service.spec.ts` | **Pass** (auto + manual) |

| UAT-13 | New tab → empty trips + exact message + CTA | `trips-copy.spec.ts`; manual new tab | **Pass** (auto + manual tab) |

| UAT-14 | Trips from Landing, Detail, Payment, Checkout | `app.routes.spec.ts`; nav links | **Pass** (auto + manual) |



## Smoke script (SM-1 — full journey)



Run with API (`dotnet run` in `server/Keyloop.Api`, Stripe secrets set) and client (`npm start` in `client/`).



1. **Landing** — Sydney + future dates → **Search** → URL query params → at least one vehicle → **View details**.

2. **Detail** — valid dates → **Continue booking** → `/bookings/TRP-001/payment`.

3. **Payment** — select insurance → breakdown visible → **Pay with Stripe** (primary) or **View order summary** then pay from checkout page.

4. **Stripe** — test card `4242 4242 4242 4242`, any future expiry, any CVC → redirect to checkout return URL → booking **Paid**.

5. **Trips** — TRP-001 Paid; Stripe demo notice on payment/checkout only.

6. **Second booking** — new vehicle → TRP-002 Pending on Trips.

7. **Cancel** — Cancel TRP-002 → remains listed as Cancelled.

8. **Storage** — DevTools → `sessionStorage` `keyloop.bookings.v1` → no PAN/CVV fields (Stripe flow).

9. **Refresh** — F5 on Trips → bookings still listed (UAT-12).

10. **New tab** — `/trips` in new tab → empty state copy + CTA (UAT-13).



## Traceability — automated tests



| UAT | Test location |

|-----|----------------|

| 1 | `server/Keyloop.Api.Tests/VehiclesApiTests.cs` |

| 2, 13 | `client/.../trips-copy.spec.ts`, `landing.page.spec.ts` |

| 3, 4 | `client/.../rental-dates.spec.ts` |

| 5, 9–12 | `client/.../booking-session.service.spec.ts` |

| 6 | `client/.../pricing.service.spec.ts` |

| 8 | Stripe manual; legacy `checkout-validation.spec.ts` (simulated form, not production path) |

| 14 | `client/.../app.routes.spec.ts` |



## Open items / release gate



- **T-005:** Ensure `npm install` completes on the release machine before client tests/build.

- **Stripe:** `Stripe:SecretKey` via user secrets — see `docs/guide/stripe-test-setup.md`.

- **PRD sign-off:** Product owner runs smoke script once; confirm UAT-13 in a second tab.



## Task status



T-014 complete when automated suites are green locally and the manual script is executed once; record executor and date in release notes or PR description.


