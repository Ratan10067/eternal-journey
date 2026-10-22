# THE ETERNAL JOURNEY — Kashi × Ayodhya

The public React site is a cinematic, static-first experience. When its API is configured, it loads published Cloudinary photographs and approved guestbook entries from MongoDB; the curated bundled presentation remains available while the API is offline.

## Local development

```bash
npm install
npm run dev
```

Set `VITE_API_URL` to the API base, for example `http://localhost:5001/api`. When it is omitted, the frontend uses that same local default.

```bash
cd server
npm install
cp .env.example .env
# add MongoDB Atlas, Cloudinary, an ADMIN_KEY_HASH, a long SESSION_SECRET, and your frontend origin
npm run generate-admin-key
npm run dev
```

Never commit `server/.env`, Cloudinary credentials, MongoDB connection strings, session secrets, or the shared administrator key.

## Content workflow

1. Create a MongoDB Atlas database user scoped to the app database and allow only the hosting provider’s outbound IPs where possible.
2. Create a Cloudinary server integration; keep its API secret only in `server/.env`.
3. Run `npm run generate-admin-key` from `server`, save the displayed shared key in a password manager, and copy only the displayed `ADMIN_KEY_HASH` into `server/.env`.
4. Sign in at `/admin`, upload originals, and keep photos as drafts until their title, date, city, caption, and accessibility text are ready. Published photos appear through the public photo API.
5. New guestbook submissions are held for moderation; approve reviewed entries through protected moderation tooling.

## MongoDB Atlas and Cloudinary

1. In Atlas, create a free cluster, a database user limited to the application database, and a network rule for the API host. Copy its SRV connection string into `MONGODB_URI`.
2. In Cloudinary, copy the cloud name, API key, and API secret into the three `CLOUDINARY_*` variables. The secret belongs only on the server.
3. Generate the shared key with `npm run generate-admin-key`. Store the first output line in a password manager for both trusted administrators and put only `ADMIN_KEY_HASH` in `.env`.
4. Set a separate long random `SESSION_SECRET`. Bump `ADMIN_SESSION_VERSION` whenever the shared key is rotated; this invalidates existing Memory Studio sessions.
5. Set `CORS_ORIGIN` to the exact production frontend URL (or a comma-separated list) and set `VITE_API_URL` in the frontend deployment.

## First ten photographs

1. Open `/admin` and enter the shared key.
2. Choose up to ten JPEG, PNG, WebP, HEIC, or HEIF photographs (20 MB each), add shared metadata if useful, and keep visibility set to **Save as draft**.
3. Review each preview in the library, then publish only photographs ready for the public memoir. Published records are fetched by the gallery and other public photo-aware views without a redeploy.
4. Confirm documents in Atlas in the `photos` collection and confirm corresponding media in the `eternal-journey/photos` Cloudinary folder. Never remove the local original backup after upload.

## Deployment

Deploy the Vite build and Express API separately or behind one reverse proxy. Use HTTPS, set `NODE_ENV=production`, and make sure the API receives `MONGODB_URI`, `SESSION_SECRET`, `ADMIN_KEY_HASH`, Cloudinary credentials, and the exact frontend origin. Run the two production checks below before deploying.

## Production checks

```bash
npm run build
cd server && npm run build
```

The API restricts CORS to `CORS_ORIGIN`, hashes the shared administrator key with bcrypt, uses short-lived HttpOnly server sessions with CSRF protection, rate-limits sign-in/upload/comment flows, validates image signatures in addition to MIME type, detects SHA-256 duplicate images, and keeps Cloudinary asset IDs separate from public page payloads.
