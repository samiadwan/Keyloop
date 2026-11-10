# T-013 — Basic accessibility checklist (NFR-08)



Target: form labels, keyboard use, visible focus, landmarks — aligned with WCAG 2.1 AA intent for this demo.



## Implemented



| Area | Detail |

|------|--------|

| Skip link | App shell → `#main-content` on every feature page |

| Landmarks | `<header>` + `<nav aria-label="Primary">` + single `<main id="main-content">` per route; global `<footer aria-label="Site footer">` |

| Page titles | Route `title` in `app.routes.ts` |

| Forms | Visible labels on search/insurance; Stripe hosted card entry (no PAN fields in app) |

| Errors / status | `role="alert"` on errors; `role="status"` / `aria-live` on landing results count |

| Insurance | `fieldset` + `legend` (sr-only) + `aria-labelledby` |

| FAQ | Native `<details>` / `<summary>` on landing |

| Focus | Global `:focus-visible` outline in `client/src/styles.scss` |

| Motion | `prefers-reduced-motion` respected globally |

| Links | Descriptive `aria-label` where link text alone is ambiguous |

| Images | Vehicle `alt` = vehicle name; decorative hero `alt=""` |



## Manual smoke (before release)



1. Tab from page load: skip link on focus, then nav, search, vehicle cards, FAQ, footer links.

2. Complete booking using keyboard: Search → details → Continue → insurance → **Pay with Stripe** (leaves app; tab through Stripe test page).

3. Run Lighthouse or axe on landing, payment, checkout, trips.

4. Zoom 200% — layout remains usable (wrap / single column).



## Out of scope (demo)



- Full WCAG audit sign-off, screen-reader QA on all AT combinations, automated axe in CI.


