# Tech Stack

## Overview

Keyloop is a browser demo: an Angular 21 SPA talks to an ASP.NET Core 8 API. Catalogue and pricing config live in PostgreSQL. Bookings stay in the browser session. Payment is Stripe Checkout in test mode.

## Languages

- Client: TypeScript
- Server: C#

TypeScript matches Angular 21 standalone components. C# on .NET 8 matches the API, EF Core, and Stripe.NET server calls. Amounts are computed on the server so the client cannot be the source of the charge.

## Framework

- Client: Angular 21 standalone SPA, served on port 4200
- Server: ASP.NET Core 8 Web API monolith (`server/Keyloop.Api`), HTTP on port 5077

Routes: `/`, `/vehicles/:id`, `/bookings/:bookingId/payment`, `/bookings/:bookingId/checkout`, `/trips`.

## Authentication

None. The renter is anonymous. There are no accounts, tokens, or saved cards.

The Stripe secret key stays in API user secrets (`Stripe:SecretKey`). The Angular app never receives it.

## Infrastructure & Deployment

Local demo only.

- API: `http://localhost:5077`
- Client: `http://localhost:4200`
- CORS origin: `http://localhost:4200`
- Development may use EF Core in-memory (`Database:UseInMemory: true`) or PostgreSQL database `keyloop`
- Tests may use database `keyloop_test`
- No production hosting, live Stripe, or CI target is in scope for this intent

## Package Manager

- Client: npm
- Server: NuGet (`dotnet`)

## Decision Relationships

Angular calls the API with camelCase JSON. PostgreSQL holds vehicles, app config, and insurance tiers. Stripe Checkout is created and verified only by the API. Photon geocoding is a client-side location assist and is not a system of record.
