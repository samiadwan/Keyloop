# Stripe Checkout (test mode)

Keyloop uses [Stripe Checkout](https://stripe.com/docs/payments/checkout) for the payment step: the **secret key** stays on the API, the **Angular app never collects card numbers**, and the user is redirected to Stripe’s hosted page.

## Prerequisites

1. A [Stripe](https://stripe.com) account.
2. Turn **Test mode** on in the Dashboard.
3. **Rotate** any secret key that was ever pasted into chat, tickets, or a public repo. Use **Developers → API keys** to create a new `sk_test_...` and revoke the old one.

## Configure the API (local)

From the API project folder:

```powershell
cd server\Keyloop.Api
dotnet user-secrets set "Stripe:SecretKey" "sk_test_YOUR_KEY"
dotnet user-secrets set "Stripe:ClientUrl" "http://localhost:4200"
```

User secrets are tied to the project’s `UserSecretsId` in [`Keyloop.Api.csproj`](../../Keyloop/server/Keyloop.Api/Keyloop.Api.csproj). **Run these commands from `server/Keyloop.Api`** (or pass `--project` to that folder) so the keys attach to the right app.

`Stripe:ClientUrl` must match where the Angular app runs (Stripe success/cancel redirects). The default for local dev is also in [`appsettings.Development.json`](../../Keyloop/server/Keyloop.Api/appsettings.Development.json) under `Stripe:ClientUrl`.

Confirm the secret is stored:

```powershell
dotnet user-secrets list
```

You should see `Stripe:SecretKey`. Then **restart** the API (`Ctrl+C` and `dotnet run` again) — configuration is read at startup.

If the secret key is **missing or empty**, `POST /api/payments/checkout-session` returns **503** and the checkout page shows: *Stripe is not configured…*

## Verify

1. Run API and client (`http://localhost:5077`, `http://localhost:4200`).
2. Complete a booking to **Payment** → select insurance → **Pay with Stripe** (primary path), or open **View order summary** on `/bookings/TRP-xxx/checkout` and use **Pay with card (Stripe test)**.
3. On Stripe’s page, use a [test card](https://stripe.com/docs/testing#cards) such as `4242 4242 4242 4242`, any future expiry, any CVC.
4. After success you return to `/bookings/TRP-xxx/checkout?stripe=success&session_id=...`; the app verifies the session and marks the booking **Paid** in **My Trips**.

## Security

- Never commit `sk_test_` or `sk_live_` keys.
- Do not log request bodies containing payment metadata in production without review.

See also [`backend-api.md`](../architecture/backend-api.md) payment endpoints.
