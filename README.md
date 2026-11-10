# Keyloop (Spaces greenfield)

Fresh project scaffold for **SpecsMD / Spaces** + **AI-DLC**, using the **Keyloop** product definition from the reference implementation at [`../Keyloop`](../Keyloop).

## Start here

1. Read [`install-spaces.md`](install-spaces.md) — install the SpecsMD CLI and choose the **AI-DLC** flow.
2. Read [`start-working.md`](start-working.md) — folder layout, agents, Keyloop units, prompts.
3. Read [`specs.md`](specs.md) — product spine for agents (links to BRD/PRD/docs).
4. Requirements source of truth: [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md).

## Layout

```text
Keyloop-spaces/
├── install-spaces.md
├── start-working.md
├── specs.md
├── specs/              # Short agent-facing slices
├── docs/               # Pointers + local deltas
├── client/             # Angular 21 — build in Construction phase
├── server/             # .NET 8 API — build in Construction phase
└── README.md
```

## Reference app (optional)

The sibling [`Keyloop`](../Keyloop) repo is the **as-built demonstrator** (Angular + API + Stripe test + UAT). Use it as a pattern library when running `/specsmd-construction-agent`; do not treat it as the runtime root of this folder unless you merge repos later.

## Run targets (when implemented)

- API: `http://localhost:5077`
- Client: `http://localhost:4200`

See reference app [`../Keyloop/README.md`](../Keyloop/README.md). Local docs: [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) (includes [`docs/guide/stripe-test-setup.md`](docs/guide/stripe-test-setup.md)).
