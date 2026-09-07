# Animal Nutrition Cameroon LLC

A bilingual Next.js website and protected administration dashboard for the KOUDIJS distributor in Yaoundé. The website is a local, unpublished preview.

## Run locally

Requires Node.js 20.9 or later.

```sh
npm install
node scripts/setup-admin.mjs
npm run dev
```

Website: http://localhost:3000  
Administration: http://localhost:3000/admin

Local administrator credentials are in **data/ADMIN-ACCESS.txt**. This file and .env.local are excluded from Git. The setup script generates a unique random password and a salted scrypt hash; it preserves existing configuration. Replace these development credentials and the session secret before production. Never send the credentials file to a public repository.

## Included

- French by default, English switching, persistent light/dark preferences.
- Homepage, company, three category pages, seven product pages, delivery, contact, quotations, three practical guides, privacy, terms and photo credits.
- Catalogue filters/search and an interactive activity/animal/stage finder.
- Contextual WhatsApp links, phone/email links and an opt-in Google map of the Odza area.
- Validated quotation requests with a reference number and persistent server storage.
- Authenticated admin overview, bilingual product editing, product visibility, enquiries, order statuses, contacts and CSV exports.
- Orders begin as enquiries. Mark a request as confirmed to move it into the Orders view. No payment is taken online.
- Custom SVG/ICO favicon and Apple touch icon. No builder or AI badge.
- Responsive layouts, keyboard focus states, native modal dialogue, reduced-motion support and optimized local WebP images.
- No invented sales data, customers, reviews, scientific results or product prices.

WhatsApp conversations are external. Clicking a WhatsApp link does not create a website enquiry or synchronise the conversation into the dashboard. Use the quotation form to record a website request. Email notifications and online payments are not connected.

## Data and security

lib/store.ts stores products and enquiries in **data/store.json**, or DATA_DIRECTORY/store.json when configured. Mutations are serialised within the Node process and written using an atomic rename. Product seeds are used only when the store does not exist. Back up the persistent data directory.

This implementation supports **one long-running Node.js process with a persistent writable disk**. Do not deploy it to ephemeral/serverless storage or multiple replicas. For those environments, replace the file store with a shared transactional database and use a shared rate limiter before launch.

Admin credentials stay on the server. Sessions are HMAC-signed, expire after eight hours, and use HttpOnly, SameSite=Strict cookies (Secure in production). Mutations validate the request origin. Login and enquiry endpoints have in-process rate limiting. Forwarding headers are trusted only if TRUST_PROXY=true; enable that only behind a proxy that overwrites them. Otherwise the local process shares a rate-limit bucket.

For credential rotation, generate a new salt and scrypt hash and change ADMIN_PASSWORD_HASH. Rotate SESSION_SECRET to invalidate all existing sessions. The website does not automatically send email.

## Verification

With the local development server running:

```sh
npm run lint
npm run build
npm run verify
```

The integration script checks 28 routes/assets, authentication, session cookie flags, CSRF protection, form validation, persistent enquiries, order updates, product visibility, English/dark rendering and 404 behavior. It creates and removes a synthetic enquiry. Run only against a local development instance without concurrent writes. TEST_BASE_URL can override the local URL.

```sh
npm run format
```

## Launch requirements

The website has **not been deployed**. Crawling is disabled in app/robots.ts, app/layout.tsx and the X-Robots-Tag header in next.config.ts. These are indexing controls, not access control; keep the preview local or behind hosting authentication.

Before publication:

1. Choose and connect the business’s custom domain, configure DNS and verify HTTPS. Set SITE_URL to its exact origin (no trailing slash).
2. Choose a persistent hosting location, configure data backups and rotate development credentials. Confirm the storage/retention and data-handling arrangements.
3. Have the company confirm privacy wording, retention periods, commercial terms, returns/refunds, registration details and the legal obligations applicable to its operation. The included legal pages describe this implementation and are review drafts, not a compliance certification.
4. Confirm product references and supplier technical sheets before publishing precise feeding doses, guaranteed benefits, pack sizes or prices. Unclear flyer tables have intentionally not been transcribed.
5. Confirm the supplied phone numbers, info@anc.cm mailbox, Odza address and delivery arrangements.
6. Verify the favicon and absence of a builder badge on the custom domain.
7. Only after approval, enable indexing, add canonical URLs and a sitemap for that verified domain.

No domain ownership or DNS access was supplied. The admin launch checklist explicitly keeps the domain and final publication pending.

## Content and photography

Business facts come from the supplied briefs and flyers. ANC is described as a distributor, without claiming official or exclusive status. The site uses an ANC monogram and a typographic KOUDIJS reference; replace these with standalone approved brand assets when available.

Real, locally hosted photographs from Unsplash:

- Aquaculture: Aleksandr Galichkin, https://unsplash.com/photos/v8k_Q4ZjdpY (Pa Klok, Thailand).
- Poultry: Jenny Hill, https://unsplash.com/photos/OnKIsDLCeZ8.
- Pigs: Zoe Richardson, https://unsplash.com/photos/vMjrs3C50d8 (Pasture Song Farm, Pennsylvania).
- License: https://unsplash.com/license.

These photographs illustrate sectors; they are not claimed to depict ANC premises, staff or customers. No generated photography or invented branded packaging is used. Public credits are available at /credits.

Legal review reference: Cameroon Law No. 2024/017 of 23 December 2024, published by the Presidency: https://www.prc.cm/en/news/the-acts/laws/7602-law-no-2024-017-of-23-december-2024-to-authorize-the-president-of-the-republic-to-ratify-the-beijing-treaty-on-audio-visual-performances-adopted-in-beijing-china-on-24-june-2019
