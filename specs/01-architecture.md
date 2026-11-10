# Architecture — Keyloop

## Context

```mermaid
flowchart LR
  subgraph client [Angular client]
    UI[Features + sessionStorage]
  end
  subgraph api [.NET API]
    Cat[Catalog + config]
    Pay[Stripe sessions]
  end
  subgraph external [External]
    PG[(PostgreSQL)]
    Stripe[Stripe test]
    Photon[Photon geocode]
  end
  UI -->|HTTP| Cat
  UI -->|HTTP| Pay
  Cat --> PG
  Pay --> Stripe
  UI --> Photon
```

## Boundaries

| Server | Client |
|--------|--------|
| Vehicles, config, insurance tiers, platform fee | Bookings array `keyloop.bookings.v1` |
| Stripe Checkout Session create/verify | Redirect to Stripe; never store PAN/CVV |
| Amount computed server-side | Pricing UI mirrors formula |

## Key endpoints

See [`../docs/architecture/backend-api.md`](../docs/architecture/backend-api.md).

## Reference layout

[`../docs/guide/project-layout.md`](../docs/guide/project-layout.md)  
[`../docs/architecture/solution-architecture.md`](../docs/architecture/solution-architecture.md)

## Local development

[`../docs/guide/backend-development.md`](../docs/guide/backend-development.md)  
[`../docs/guide/stripe-test-setup.md`](../docs/guide/stripe-test-setup.md)
