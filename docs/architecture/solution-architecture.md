# Solution architecture (summary)



- **Client:** Angular 21 standalone SPA — booking session in `sessionStorage`, pricing UI, **Stripe Checkout** redirect (test mode); landing search with URL query sync; site footer + FAQ on home.

- **Server:** .NET 8 Web API monolith — catalogue + config in **PostgreSQL** (EF Core); **Stripe** Checkout Session create/verify (amounts server-side).

- **Persistence:** Catalog/config in DB; bookings in `sessionStorage` only; **no card data in the Angular app** (hosted Stripe page).



See Checkpoint 4 chat artifact for full diagrams and ADRs. Implementation paths:



- `client/src/app/core/services/booking-session.service.ts`

- `client/src/app/core/services/payments-api.service.ts`

- `server/Keyloop.Api/Controllers/`

- `docs/architecture/backend-api.md` — HTTP contract

- `docs/guide/backend-development.md` — run, pgAdmin, migrations, tests

- `docs/guide/stripe-test-setup.md` — payment configuration


