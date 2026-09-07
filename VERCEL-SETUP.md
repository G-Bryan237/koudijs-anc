# Vercel setup and login

The local password is unchanged. The value after `ADMIN_PASSWORD_HASH=` is a salted hash, not the password to type into the login form. Use the password in `data/ADMIN-ACCESS.txt`.

The repository does not include `.env.local`, and Vercel does not copy it automatically. A database alone cannot replace missing authentication environment variables.

## Configure the Vercel project

In **Project Settings → Environment Variables**, add these variables for the intended Production and Preview environments:

| Name                | Value                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------- |
| ADMIN_EMAIL         | The same admin email as .env.local                                                        |
| ADMIN_PASSWORD_HASH | The entire salt:hash value from .env.local, without quotes                                |
| SESSION_SECRET      | The entire session secret from .env.local, without quotes                                 |
| TURSO_DATABASE_URL  | Your remote libSQL database URL                                                           |
| TURSO_AUTH_TOKEN    | A database token with read/write access                                                   |
| SITE_URL            | Optional: your exact custom HTTPS origin; omit while only using the Vercel deployment URL |

Create a **libSQL-compatible database** in Turso and use its URL and token. The installed driver is `@libsql/client`. Do not use a local `file:` URL or Vercel's temporary filesystem. Do not put any secrets in `NEXT_PUBLIC_` variables, source code or Git.

**Redeploy after changing environment variables.** Changes do not modify a deployment that is already running.

A Vercel deployment's exact host is allowed for sign-in. The code also recognizes Vercel's deployment, branch and production host variables. It never permits every `*.vercel.app` host. A trailing slash on SITE_URL is normalized.

## Check the configuration

```sh
npm run check:hosting
npm run check:vercel
```

The first checks local login settings and, if available, checks them against the private credentials file. The second additionally checks whether the remote database variables are supplied. Neither prints secret values. To verify Vercel settings, run with the environment downloaded from the relevant Vercel environment, or compare the values in Vercel's settings.

## What is now persistent

Locally, the app uses `data/anc.sqlite`. Existing `data/store.json` records are imported on first initialization; that JSON file is preserved as a legacy backup. After migration, SQLite is authoritative. New catalogue entries are merged without overwriting saved product names, descriptions, visibility or enquiries.

On Vercel, requests, catalogue edits and short-lived rate-limit counters use the remote database. A write transaction protects simultaneous enquiry submissions. The small catalogue and enquiry set are stored in a single JSON state row; this is suitable for a small operation. Move to separate indexed product/enquiry tables and pagination as the dataset grows.

The database schema and initial catalogue are initialized automatically. No local customer records or admin plaintext password file are imported into a Vercel deployment. Existing local enquiries require a deliberate migration if they need to be transferred.

Without remote database settings, public catalogue pages still render and an authenticated administrator sees a setup notice. Enquiry submissions and catalogue edits fail explicitly; the app never claims an unsaved request succeeded.

If credentials are missing or malformed, the login page says setup is required. Wrong credentials return 401, domain mismatch 403, excess attempts 429, and unavailable authentication/storage 503.

## Verification performed locally

`npm run verify` checks the updated catalogue, product assets, normalized email login, cross-origin rejection, simultaneous enquiry writes, persistence through another SQLite connection, order status changes, product hiding, English/dark rendering, automatic map markup and the password visibility control.

The verification script refuses a remote database and cleans up its own synthetic enquiries. It does not send WhatsApp messages, emails or create real customer orders.

## Remaining hosting step

No Turso URL/token or Vercel account access has been supplied in this workspace. The code is ready for those settings, but the live connection and hosted login must be verified after configuring and redeploying.

References: [Vercel and SQLite](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel), [Turso libSQL TypeScript reference](https://docs.turso.tech/sdk/ts/reference).
