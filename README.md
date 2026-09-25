

# Zorli — Simple Tools for a Smarter You

Free, fast and easy-to-use online tools for everyday problems. No sign-up. No hassle. Just results.

Zorli is a modern, browser-based utility platform built with **React 19**, **TypeScript**, **Vite 8**, and **Tailwind CSS 4**. Tools are organized by family (image, PDF, developer, text, calculator, converter, social, SEO, productivity, privacy, and more) and run **100% in the client's browser** — no backend, no API keys, and no network requests at runtime.

## 📦 Project Status (read this first)

Zorli is being built incrementally and **no tool is live yet**. The architecture,
routing, registry, search, and design system are production-ready, but tool
engines are still being implemented.

- **Active family:** image.
- **Active (shipped) tools:** none yet. `src/features/tools/registry.ts`
  exposes an empty active registry, so nothing in the UI can claim to be
  available.
- **Catalogued as `coming-soon`:** Image Compressor. Its UI exists, but
  `lib/compressor.ts` has no real engine, so it is deliberately not registered,
  not loaded, and not presented as working.
- **Registered families not yet wired into the shipping registry:** calculator,
  developer, text, pdf, social (source exists, nothing is exposed).

Rules that keep this honest:

1. A tool is `available` **only** if it is listed in the active registry *and*
   has a real implementation.
2. Unfinished tools are catalogued as `coming-soon` and must have **no** dynamic
   loader, so no orphan chunk is bundled.
3. Never hardcode tool or category counts — derive them from the registry
   (`src/data/categories.ts`).


## ✨ Tech Stack

| Layer        | Technology                        |
| ------------ | --------------------------------- |
| Framework    | React 19                          |
| Language     | TypeScript                        |
| Build tool   | Vite 8                            |
| Styling      | Tailwind CSS 4                    |
| Icons        | Lucide React                      |
| Animation    | Motion (Framer)                   |
| Testing      | Jest + ts-jest + Testing Library  |
| Deployment   | Cloudflare Pages                  |

## ✨ Getting Started

**Prerequisites:** [Node.js](https://nodejs.org) ≥ 22 and npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

## ✨ Available Scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Start the dev server on port 3000            |
| `npm run build`    | Production build to `dist/`                  |
| `npm run preview`  | Preview the production build locally         |
| `npm run lint`     | Type-check the codebase (`tsc --noEmit`)     |
| `npm test`         | Run the Jest test suite                      |
| `npm run clean`    | Remove the build output                      |

## ✨ Project Structure

```
zorli/
├── src/
│   ├── App.tsx              # Main application router (client-side)
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles & Tailwind imports
│   ├── components/          # Reusable UI, layout and page components
│   ├── data/                # Categories & tool registry
│   ├── features/tools/      # Feature-based tool implementations
│   └── types/               # Shared types
├── public/                  # Static assets (_redirects, _headers, brand, tool-assets)
├── templates/tool/          # Scaffold for adding new tools
├── docs/                    # Architecture & contribution docs
├── .github/workflows/       # CI + Cloudflare Pages deploy pipelines
└── wrangler.toml            # Cloudflare Pages project config
```

## ✨ Adding a New Tool

See [docs/adding-a-tool.md](docs/adding-a-tool.md) and the scaffold in
[`templates/tool/`](templates/tool/README.md).

## ✨ Environment Variables

**None required.** Zorli is a fully client-side application. If you ever need
one, create a `.env.local` file (already gitignored) — a committed example is
kept in [`.env.example`](.env.example).

## 🚀 Deployment — Cloudflare Pages

The repository is pre-configured for Cloudflare Pages:

- [`public/_redirects`](public/_redirects) — SPA fallback (`/* /index.html 200`)
  so client-side routes like `/categories/images` or
  `/tools/image/image-compressor` work on refresh and direct links.
- [`public/_headers`](public/_headers) — security and caching headers.
- [`public/robots.txt`](public/robots.txt) and
  [`public/sitemap.xml`](public/sitemap.xml) — crawl rules and sitemap
  (update the host if you attach a custom domain).
- `.github/workflows/ci.yml` — runs `lint`, `test`, and `build` on every push/PR.
- `.github/workflows/deploy.yml` — auto-deploys `main` to Cloudflare Pages.

### Option A — Cloudflare Dashboard (simplest)

1. Push this repository to GitHub.
2. In the Cloudflare dashboard go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select your repository and set:
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**. Every push to `main` redeploys automatically.

### Option B — GitHub Actions (fully automated)

Add two repository secrets (Settings → Secrets and variables → Actions):

| Secret                    | Value                                                        |
| ------------------------- | ------------------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`    | API token with `Cloudflare Pages — Edit` permission          |
| `CLOUDFLARE_ACCOUNT_ID`   | Your Cloudflare Account ID (dashboard right sidebar)         |

Then push to `main` — the `deploy.yml` workflow builds and publishes the site
(project name `zorli`, created on first deploy).

### Option C — Wrangler CLI

```bash
npx wrangler login
npm run build
npx wrangler pages deploy dist --project-name=zorli
```
