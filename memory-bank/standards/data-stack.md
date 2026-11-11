# Data Stack

## Overview

The server persists the demo catalogue and pricing config. Bookings are not server-persisted. They live in `sessionStorage` under `keyloop.bookings.v1` for the current browser tab.

## Database

PostgreSQL for the catalogue and config. Local development may run the same seed in memory when `Database:UseInMemory` is true.

Tables:

| Table | Content |
|-------|---------|
| `vehicles` | 9 seed vehicles (`v1`–`v9`); `features` and `rules` as jsonb |
| `app_config` | Singleton: currency USD, platform fee 5, rental day rule `calendarDaysMin1` |
| `insurance_tiers` | Basic 500, Standard 1000, Premium 1500 USD, linked to `app_config` |

Cities: Sydney, Melbourne, Brisbane, Perth. Unknown `location` filters return an empty list.

Bookings, card data, and Stripe secrets are not stored in PostgreSQL.

## ORM / Database Client

Entity Framework Core on .NET 8, with migrations for the PostgreSQL path and a startup seeder that upserts the nine vehicles.

EF Core fits the monolith and the existing contract in `docs/architecture/backend-api.md`. The client does not talk to the database.

## Decision Relationships

`GET /api/config` and `GET /api/vehicles` read this store. `POST /api/payments/checkout-session` recomputes the amount from vehicles, app config, and insurance tiers. The client pricing UI mirrors that formula and is not authoritative.
