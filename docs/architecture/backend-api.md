# Backend API design

Monolith: [`server/Keyloop.Api`](../../Keyloop/server/Keyloop.Api/) (.NET 8). **PostgreSQL** stores the demo catalog and pricing config. **Bookings and payments are not server-persisted.**

## Boundaries

| Server | Client |
|--------|--------|
| Vehicle catalog, insurance tiers, platform fee | Booking session (`keyloop.bookings.v1` in sessionStorage) |
| Stripe Checkout session (amount computed server-side) | Checkout redirects to Stripe; card data never touches the Angular app |

## Endpoints

Base URL (local): `http://localhost:5077`

### `GET /api/vehicles`

Query: `location` (optional) — normalized to catalog cities (Sydney, Melbourne, Brisbane, Perth); Photon-style labels are accepted; unknown location returns `[]`.

Response: JSON array of vehicles (camelCase):

| Field | Type |
|-------|------|
| `id` | string (`v1`–`v9`) |
| `name` | string |
| `imageUrl` | string (client asset path, e.g. `/assets/vehicles/v1.jpg`) |
| `location` | string |
| `dailyPriceUsd` | number |
| `features` | string[] |
| `rules` | string[] |

### `GET /api/vehicles/{id}`

- `200` — single vehicle
- `404` — unknown id

### `GET /api/config`

Response:

| Field | Type |
|-------|------|
| `currency` | `"USD"` |
| `platformFeeUsd` | `5` |
| `insuranceTiers` | `{ code, label, amountUsd }[]` — Basic 500, Standard 1000, Premium 1500 |
| `rentalDayRule` | `"calendarDaysMin1"` |

### `POST /api/payments/checkout-session`

Body (JSON, camelCase):

| Field | Type |
|-------|------|
| `bookingId` | string |
| `vehicleId` | string |
| `insuranceTier` | `"Basic"` \| `"Standard"` \| `"Premium"` |
| `pickupDate` | ISO date `YYYY-MM-DD` |
| `returnDate` | ISO date `YYYY-MM-DD` |

Creates a [Stripe Checkout Session](https://stripe.com/docs/api/checkout/sessions) in **payment** mode. **Amount (USD) is computed on the server** from `vehicles`, `app_config`, and `insurance_tiers` — it must match the client pricing formula.

- **503** — Stripe secret key not configured (see [`docs/guide/stripe-test-setup.md`](../guide/stripe-test-setup.md))
- **400** — invalid vehicle, tier, or dates
- **502** — Stripe API error

Response:

| Field | Type |
|-------|------|
| `checkoutUrl` | string — redirect the browser here |

### `GET /api/payments/session/{sessionId}`

Verifies a Checkout Session after redirect (`session_id` query param). Returns `paid`, `bookingId`, and Stripe payment fields for the client to mark the session booking **Paid**.

## Persistence

| Table | Content |
|-------|---------|
| `vehicles` | 9 seed vehicles; `features` / `rules` as `jsonb` |
| `app_config` | Singleton pricing metadata |
| `insurance_tiers` | Three tiers linked to `app_config` |

Seed source of truth: [`VehicleSeed.cs`](../../Keyloop/server/Keyloop.Api/Data/VehicleSeed.cs). [`CatalogSeeder`](../../Keyloop/server/Keyloop.Api/Data/CatalogSeeder.cs) upserts vehicles on startup.

## CORS

Allowed origin (default): `http://localhost:4200` — [`appsettings.json`](../../Keyloop/server/Keyloop.Api/appsettings.json) `Cors:Origins`.

## Client mapping

- [`client/src/app/core/models/vehicle.model.ts`](../../Keyloop/client/src/app/core/models/vehicle.model.ts)
- [`client/src/app/core/models/app-config.model.ts`](../../Keyloop/client/src/app/core/models/app-config.model.ts)
- [`client/src/app/core/services/payments-api.service.ts`](../../Keyloop/client/src/app/core/services/payments-api.service.ts)

## Operations

Local run and pgAdmin setup: [`docs/guide/backend-development.md`](../guide/backend-development.md).
