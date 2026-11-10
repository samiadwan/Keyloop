# Start working (Keyloop + Spaces)

Follow this after [`install-spaces.md`](install-spaces.md). Product truth comes from **Keyloop BRD/PRD and docs** (see [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md)).

---

## 1. Initial folder structure

This repo already contains the skeleton:

```text
Keyloop-spaces/
├── client/                 # Angular 21 SPA (empty until Construction)
├── server/                 # ASP.NET Core 8 API (empty until Construction)
├── docs/                   # Requirement links + local notes
├── specs/                  # Agent-facing briefs
├── specs.md                # Master spec index
├── install-spaces.md
├── start-working.md
└── README.md
```

> You may add `memory-bank/` or `aidlc/` when SpecsMD/AI-DLC creates them during Inception.

---

## 2. Agents (Cursor + SpecsMD)

| Agent | Role |
|-------|------|
| **master-agent** | Orchestrates AI-DLC; init standards; routes to specialists |
| **inception-agent** | Intents, units, requirements, system context |
| **construction-agent** | Design + implement + test per unit (bolts) |
| **operations-agent** | Build, deploy, verify, monitor (demo smoke for Keyloop) |

Docs: [master](https://specs.md/agents/master-agent), [inception](https://specs.md/agents/inception-agent), [construction](https://specs.md/agents/construction-agent), [operations](https://specs.md/agents/operations-agent).

---

## 3. Master agent (Inception kickoff)

```text
/specsmd-master-agent
```

**Prompt:**

```text
Read specs.md, specs/00-product-brief.md, and docs/REQUIREMENTS.md.
Also read local requirements at docs/requirements/PRD-Keyloop-Car-Rental-Booking.md (v0.2),
docs/requirements/prd-v0.2-delta.md, and docs/requirements/brd-v1.1-delta.md.

Product: Keyloop car rental demonstrator — anonymous renter, session bookings,
PostgreSQL catalogue API, Stripe Checkout (test mode), Angular 21 + .NET 8.

Do not implement code yet. Propose Inception intents and units (see start-working.md §5).
Guide me through Inception only.
```

**Done when:** Intent folder exists and unit list is agreed.

---

## 4. Inception agent

```text
/specsmd-inception-agent intent-create
```

**Intent name suggestion:** `001-keyloop-rental-demo`

Expected artifacts (names may follow your harness):

```text
memory-bank/   # or aidlc/spaces/default/intents/...
├── intents/
│   └── 001-keyloop-rental-demo/
│       ├── requirements.md      # FR slices from PRD §8
│       ├── system-context.md    # From specs/01-architecture.md + backend-api
│       ├── units.md
│       └── units/
│           ├── 001-platform-shell
│           ├── 002-catalog-search
│           ├── 003-vehicle-booking
│           ├── 004-insurance-pricing
│           ├── 005-stripe-payment
│           └── 006-my-trips
```

---

## 5. Keyloop units (map to PRD)

| Unit | PRD epic | Must satisfy | Reference implementation |
|------|-----------|--------------|------------------------|
| `002-catalog-search` | Vehicle discovery | FR-1.x, FR-1.7 URL sync, OQ-08 | `../Keyloop/client/.../landing` |
| `003-vehicle-booking` | Booking creation | FR-2.x | `vehicle-detail` |
| `004-insurance-pricing` | Insurance + totals | FR-3.x | `payment-details` |
| `005-stripe-payment` | Stripe pay | FR-4.x, FR-6.2 | `payments-api`, Stripe guide |
| `006-my-trips` | My Trips | FR-5.x, FR-5.11 exact copy | `my-trips` |
| `001-platform-shell` | Nav, footer, FAQ, a11y | FR-5.1, FR-6.4, NFR-08 | `app.ts`, `site-footer` |

**Build order (recommended):** `002` → `003` → `004` → `005` → `006`, with `001` in parallel early.

**Compliance per unit:**

- API contract: [`docs/architecture/backend-api.md`](docs/architecture/backend-api.md)
- Journey rules: [`specs/02-journey-rules.md`](specs/02-journey-rules.md)
- UAT: [`docs/implementation/uat-validation-report.md`](docs/implementation/uat-validation-report.md)

---

## 6. Construction agent

```text
/specsmd-construction-agent --unit="002-catalog-search"
```

For each unit:

1. Domain / technical design aligned with PRD and reference docs.
2. Implement under `client/` and `server/` in **this** repo.
3. Tests: map to UAT IDs in uat-validation-report; `dotnet test` + `npx ng test --watch=false` when scaffold exists.

Use [`../Keyloop`](../Keyloop) as a **read-only pattern library** — trace each change to an FR.

---

## 7. Operations agent

```text
/specsmd-operations-agent build-deploy-verify-monitor
```

**Keyloop demo checklist:**

1. API on port **5077**, client on **4200** ([`../Keyloop/README.md`](../Keyloop/README.md)).
2. Stripe: [`docs/guide/stripe-test-setup.md`](docs/guide/stripe-test-setup.md).
3. Execute full smoke: [`docs/implementation/uat-validation-report.md`](docs/implementation/uat-validation-report.md) § SM-1.
4. Record executor + date for sign-off (PRD §20).

---

## 8. Definition of done (greenfield)

- [ ] All six units implemented in `client/` + `server/`
- [ ] PRD v0.2 Must FRs covered (deltas for anything intentionally omitted)
- [ ] UAT-1–14 have automated or manual evidence
- [ ] No PAN/CVV in client storage (UAT-10)
- [ ] `specs.md` and unit `requirements.md` updated if scope shifted
