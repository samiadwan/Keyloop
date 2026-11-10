# Keyloop backend — development guide

ASP.NET Core 8 monolith at [`server/Keyloop.Api`](../../Keyloop/server/Keyloop.Api/). Read-only **vehicle catalog** and **app config** in **PostgreSQL**. Bookings stay in the Angular client (`sessionStorage`).

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- **PostgreSQL** (local install)
- **pgAdmin 4** (optional UI to create databases and inspect tables)
- Angular client on port **4200** for end-to-end smoke

## No PostgreSQL password (local default)

Development ships with **`Database:UseInMemory": true`** in [`appsettings.Development.json`](../../Keyloop/server/Keyloop.Api/appsettings.Development.json). The API seeds the same 9 vehicles and config **in memory** — no password and no pgAdmin required to run the demo.

To use your **`keyloop`** database in pgAdmin instead, set **`UseInMemory": false`** and either:

- add **`;Password=...`** if your server uses SCRAM auth, or
- configure **trust** for local connections in `pg_hba.conf` (IPv4 `127.0.0.1/32` → `trust`), reload PostgreSQL, then keep a connection string **without** `Password`.

## PostgreSQL setup (pgAdmin)

1. Connect to your local server (`localhost`, port **5432**).
2. Create database **`keyloop`** (empty).
3. Create database **`keyloop_test`** for integration tests.
4. Note the username/password your server uses.

### Connection string

Set **`Password=YOUR_PASSWORD`** in [`appsettings.Development.json`](../../Keyloop/server/Keyloop.Api/appsettings.Development.json) to match your PostgreSQL login, or prefer **user secrets**:

```powershell
cd server\Keyloop.Api
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Port=5432;Database=keyloop;Username=YOUR_USER;Password=YOUR_PASSWORD"
```

Tests target database **`keyloop_test`** using the same credentials as Development (factory reads `appsettings.Development.json` and swaps the database name). Override entirely with environment variable **`KEYLOOP_TEST_CONNECTION`** if needed.

## Run the API

```powershell
cd server\Keyloop.Api
dotnet run --launch-profile http
```

| URL | Purpose |
|-----|---------|
| http://localhost:5077 | API base (matches `client/src/environments/environment.ts`) |
| http://localhost:5077/swagger | OpenAPI UI (Development) |

On first run (Development), the app **applies EF migrations** and **seeds** catalog data when tables are empty (`Database:ApplyMigrations`).

In pgAdmin: expand **Servers → (your server) → Databases → keyloop → Schemas → public → Tables**, then **right-click Tables → Refresh**. Expect `vehicles`, `app_config`, `insurance_tiers`, `__EFMigrationsHistory` and **9** vehicle rows.

If Tables is empty but the API works, pgAdmin may be connected to a **different** PostgreSQL instance (port/host) than the API. Compare with **GET** http://localhost:5077/api/health/database (Development only) — it lists `databaseName`, `publicTables`, and applied migrations.

Migrations live in [`server/Keyloop.Api/Data/Migrations/`](../../Keyloop/server/Keyloop.Api/Data/Migrations/) (`InitialCatalog`). Apply manually with:

```powershell
cd server\Keyloop.Api
dotnet ef database update
```

## Migrations

From `server/Keyloop.Api`:

```powershell
dotnet ef migrations add YourMigrationName -o Data/Migrations
dotnet ef database update
```

Requires `dotnet-ef` tool: `dotnet tool install --global dotnet-ef`

Seed values are defined in [`Data/VehicleSeed.cs`](../../Keyloop/server/Keyloop.Api/Data/VehicleSeed.cs). [`CatalogLocations.cs`](../../Keyloop/server/Keyloop.Api/Data/CatalogLocations.cs) lists the four pickup cities (same as the Angular autocomplete). [`CatalogSeeder.cs`](../../Keyloop/server/Keyloop.Api/Data/CatalogSeeder.cs) upserts all nine vehicles on startup so `location` stays aligned with seed; migration `SyncCatalogVehicleLocations` normalizes existing rows in PostgreSQL.

## Tests

Create **`keyloop_test`** before running tests.

```powershell
cd server
dotnet test Keyloop.Api.Tests/Keyloop.Api.Tests.csproj
```

## Frontend integration

| Client service | Endpoint |
|----------------|----------|
| `VehicleCatalogService` | `GET /api/vehicles`, `GET /api/vehicles/{id}` |
| `AppConfigService` | `GET /api/config` |
| `PaymentsApiService` | `POST /api/payments/checkout-session`, `GET /api/payments/session/{id}` |

Start client: `cd client && npm start` → http://localhost:4200

The landing **pickup location** field uses the free [Photon](https://photon.komoot.io/) geocoder from the browser for autocomplete. If Photon is unreachable, type a catalog city name (Sydney, Melbourne, Brisbane, Perth) or pick from the dropdown on focus.

Vehicle **detail** pages show an OpenStreetMap (Leaflet) map for the vehicle’s catalog pickup city (`Vehicle.location`); no Google Maps API key is required.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ConnectionStrings:Default is missing` | Set connection string (Development or user secrets) |
| Could not connect to PostgreSQL | Start PostgreSQL service; verify host/port/database name |
| Build: file locked by Keyloop.Api | Stop the running API process, rebuild |
| Landing: “API running on port 5077?” | Start API; check CORS `http://localhost:4200` in `appsettings.json` |
| Wrong vehicle count after manual edits | Truncate catalog tables in dev only, restart API to re-seed empty tables |

## Security (demo)

- Do not store or log payment card data on the server.
- Do not commit real database passwords; use user secrets locally.
- Stripe: set **`Stripe:SecretKey`** via user secrets only — see [`stripe-test-setup.md`](stripe-test-setup.md).

See also [`docs/architecture/backend-api.md`](../architecture/backend-api.md).
