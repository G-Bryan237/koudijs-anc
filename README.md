# Animal Nutrition Cameroon LLC

Bilingual Next.js website and protected administration dashboard for the KOUDIJS distributor in Yaoundé.

## Run locally

Requires Node.js 20.9 or later.

```sh
npm install
node scripts/setup-admin.mjs
npm run dev
```

Website: http://localhost:3000  
Administration: http://localhost:3000/admin

The existing local administrator password is in **data/ADMIN-ACCESS.txt**. The setup script preserves existing configuration. Credentials and .env.local are excluded from Git. The ADMIN_PASSWORD_HASH value is not the password to enter in the login form.

## Included

- French and English, persistent light/dark preferences, responsive layouts and reduced-motion support.
- Homepage, company, three category pages, delivery, contact, quotations, tips/resources, privacy, terms and photo credits.
- Fifteen catalogue entries, including feeding-stage variants, with six packaging images extracted directly from the supplied flyers. Product detail pages identify these representative flyer images.
- Search, category filters, an animal/stage finder and a products dropdown before About.
- Automatic Google map of the Odza area, with a separate link to open Google Maps.
- Three practical guides and three short supplementary notes.
- Admin login with password visibility control, product previews/editing, visibility controls, enquiries, orders, contacts and CSV exports.
- SQLite locally and a remote libSQL-compatible database on Vercel.
- Custom favicon, restrained transitions and no builder badge, invented reviews, customer counters or prices.

Orders begin as enquiries. Confirm a request to move it into Orders. WhatsApp links open an external conversation; they do not create a website enquiry or synchronize messages into the dashboard. Email notifications and online payments are not connected.

## Hosting and persistence

Follow **[VERCEL-SETUP.md](VERCEL-SETUP.md)** for Vercel environment variables, database setup and sign-in troubleshooting. Vercel does not automatically receive your ignored .env.local file. Redeploy after changing its environment variables.

Locally, lib/database.ts creates **data/anc.sqlite** (or DATA_DIRECTORY/anc.sqlite). Existing data/store.json is imported on first initialization and preserved as a legacy backup. SQLite becomes authoritative. Catalogue additions preserve saved product edits, visibility and enquiries.

On Vercel, set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN for a remote libSQL-compatible database. Local SQLite files cannot provide durable Vercel storage. Schema and seed initialization are automatic. No local customer records are automatically transferred to the remote database.

State mutations use database write transactions to preserve simultaneous submissions. The small catalogue and enquiry set share one JSON state row; use separate indexed tables and pagination as the dataset grows. Back up the authoritative database.

Without a remote database on Vercel, the public catalogue remains readable and the administrator sees a setup notice. Enquiries and product edits return an explicit unavailable response.

## Authentication

Admin credentials remain in server environment variables. Passwords use salted scrypt hashes. HMAC-signed sessions expire after eight hours and use HttpOnly, SameSite=Strict cookies, with Secure in production.

Mutations validate the origin against the configured site or exact deployment host. Email comparison ignores surrounding spaces and letter case. Login and enquiry endpoints use short-lived database rate limits; client addresses are hashed. Vercel forwarding headers are trusted on Vercel. For other hosts, set TRUST_PROXY only behind a proxy that overwrites forwarding headers.

Rotate ADMIN_PASSWORD_HASH to change the password and SESSION_SECRET to invalidate sessions. Never publish credentials or add them to NEXT_PUBLIC_ variables.

## Verification

With a local development server running:

```sh
npm run check:hosting
npm run lint
npm run build
node scripts/verify-origins.mjs
npm run verify
```

Integration verification checks 42 pages/assets, all 15 catalogue entries, normalized email login, protected writes, concurrent enquiry submissions, persistence through a separate SQLite connection, order statuses, product visibility, English/dark rendering, automatic map markup, password control markup and logout.

It refuses a remote database, creates synthetic local enquiries, removes only those records and restores the product it changes. Run on a local development instance without concurrent edits to that test product. TEST_BASE_URL can select another localhost port.

```sh
npm run check:vercel
npm run format
```

check:vercel checks the environment available to that command; it does not inspect a remote Vercel project automatically.

## Publication

These changes have not been deployed by the coding agent. Indexing remains disabled. Indexing controls are not access control; protect private previews through the hosting provider.

Before launch:

1. Connect the business custom domain and verify HTTPS.
2. Configure Vercel credentials and the remote database, redeploy, and verify hosted sign-in plus enquiry persistence.
3. Confirm company details, delivery arrangements, product references and technical sheets. Precise feeding doses, guaranteed outcomes, unverified pack sizes and prices are not published.
4. Have the company review the privacy and terms pages for its actual operations.
5. Verify the favicon and absence of a builder badge on the domain.
6. Enable indexing and add canonical URLs and a sitemap only after launch approval.

## Content and images

Company facts come from the supplied briefs and flyers. ANC is described as a distributor without claiming exclusive status. The website uses an ANC monogram and a typographic KOUDIJS reference.

The six product packaging assets are direct crops of the supplied flyers, not generated replacements. Their detail is limited by the original flyer resolution. The extraction script is scripts/extract-flyer-products.mjs; its optional argument is the directory containing the two original flyer filenames.

Sector photographs are hosted locally and credited at /credits:

- Aquaculture: [Aleksandr Galichkin](https://unsplash.com/photos/v8k_Q4ZjdpY).
- Poultry: [Jenny Hill](https://unsplash.com/photos/OnKIsDLCeZ8).
- Pigs: [Zoe Richardson](https://unsplash.com/photos/vMjrs3C50d8).
- [Unsplash license](https://unsplash.com/license).

Sector photographs illustrate farming activities and are not presented as ANC premises, staff or customers.
