# Install Spaces (Keyloop greenfield)

**Spaces Driven Development** uses the [`specsmd`](https://specs.md) CLI. Use this in the **Keyloop-spaces** project root (this folder), not inside the reference `Keyloop` app unless you intentionally unify repos.

## 1. Install SpecsMD

```bash
npx specsmd@latest install
```

The installer detects your harness (Cursor, Claude Code, or GitHub Copilot), installs agent definitions and skills, and creates slash commands.

## 2. Verify

```bash
npx specsmd --version
```

## 3. Select flow

During install, choose **AI-DLC** (same lifecycle family as the reference Keyloop `aidlc/` workflow).

Other flows (Ideation, Simple, FIRE) are for smaller or different products — **not** recommended for Keyloop’s full rental journey.

## 4. Orchestrator choice

After install you may have **SpecsMD** commands (e.g. `/specsmd-master-agent`) and/or **Cursor AI-DLC** (`/aidlc`). For this greenfield repo:

- **Canonical:** SpecsMD agents + this folder’s [`specs.md`](specs.md).
- **Reference only:** [`../Keyloop/.cursor/`](../Keyloop/.cursor/) and [`../Keyloop/aidlc/`](../Keyloop/aidlc/) — copy patterns, do not assume they are active in this repo until you install or link them.

## 5. Before first agent

1. Read [`specs.md`](specs.md) and [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md).
2. Confirm local docs at [`docs/`](docs/) (requirements, architecture, guides, UAT). Runnable reference app: [`../Keyloop`](../Keyloop).

## 6. Next step

Continue with [`start-working.md`](start-working.md).
