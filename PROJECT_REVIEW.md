# Zorli Project Review & Knowledge Base

## 📋 Project Overview
Zorli is a modern web utility platform offering browser-based tools for images, PDFs, development, text, calculations, and more. Built with React, TypeScript, Vite, and Tailwind CSS.

**Tech Stack:**
- Framework: React 19.0.1
- Language: TypeScript 5.9.3
- Build Tool: Vite 8.3.0
- Styling: Tailwind CSS 4.3.3
- Icons: Lucide React
- Animations: CSS keyframes (GPU compositor, `prefers-reduced-motion` aware)
- State Management: React hooks (useState, useEffect)
- Testing: Jest 30 + ts-jest + Testing Library (jsdom), `npm test -- --runInBand`; routing tests `await` lazy chunks via `findByRole`/`waitFor`.

## 🚀 Deployment (Cloudflare Pages via GitHub Actions)
- Hosting: Cloudflare Pages project **`zorli`**, production branch **`main`**, output dir **`dist/`** (see `wrangler.toml`; `pages_build_output_dir = "dist"`). Public SPA contract: `public/_redirects` (`/* /index.html 200`) for deep links + refresh, `public/_headers` for caching/security, `public/robots.txt` + `public/sitemap.xml` assume default host `https://zorli.pages.dev` (update both if a custom domain is attached).
- Workflows (both run on `ubuntu-latest`, Node 24):
  - `.github/workflows/ci.yml` — `npm install --no-audit --no-fund` → `npm run lint` (`tsc --noEmit`) → `npm test` → `npm run build`. Uses `npm install` (not `npm ci`) because the committed lockfile records Windows-resolved platform-specific optional deps (Vite rolldown + Tailwind oxide native bindings), which `npm ci` rejects on Linux.
  - `.github/workflows/deploy.yml` — `npm install` → `npm run build` → `npx wrangler@4 pages project create zorli --production-branch=main` (best-effort; expected to report "already exists" after first run) → `npx wrangler@4 pages deploy dist --project-name=zorli --branch=main`. Wrangler runs directly (not via `wrangler-action`) so the real error text lands in the job summary plus a `::error title=Cloudflare Pages deploy failed::` annotation (the action only reported "Action failed / npx failed with exit code 1", hiding the cause).
- Secrets (GitHub repo → Settings → Secrets and variables → Actions; **never in code/logs/git**):
  - `CLOUDFLARE_API_TOKEN` — custom token with exactly `Account | Cloudflare Pages | Edit` + `Account | Account Settings | Read`, scoped to the single account.
  - `CLOUDFLARE_ACCOUNT_ID` — the account id.
- Status: both secrets are now configured in GitHub. Next deploy runs automatically on push to `main` (or manually via Actions → "Deploy to Cloudflare Pages" → Run workflow); expected live URL `https://zorli.pages.dev`. Any token value previously pasted in chat must be treated as exposed and revoked/rotated in Cloudflare (My Profile → API Tokens → Delete).
- Note: deployability depends only on build-green + valid secrets, not on UI choices — every perf change below keeps the same static `dist/` contract, so it only shrinks the upload, never breaks Pages.


## 🗂️ Directory Structure
```
zorli/
├── src/
│   ├── App.tsx              # Main application router
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles & Tailwind imports
│   ├── test-env.d.ts        # TypeScript test environment
│   │
│   ├── assets/              # Static assets (images, etc.)
│   │
│   ├── components/          # Reusable UI components
│   │   ├── brand/           # Brand components (logo, sparkles)
│   │   ├── footer/          # Footer component
│   │   ├── hero/            # Hero section components
│   │   ├── navigation/      # Navbar & mobile bottom bar
│   │   ├── pages/           # Page components (routing views)
│   │   ├── sections/        # Section components (Hero, CTA, etc.)
│   │   ├── tools/           # Tool-specific components (cards, search, modal)
│   │   └── ui/              # Generic UI primitives (Button, Card, Container, etc.)
│   │
│   ├── data/                # Static data definitions
│   │   ├── categories.ts    # Tool categories definition
│   │   └── tools.ts         # Tools registry & exports
│   │
│   ├── features/            # Feature-specific tool implementations
│   │   └── tools/           # Organized by tool type (image, pdf, developer, etc.)
│   │       ├── [tool-type]/
│   │       │   ├── [specific-tool]/
│   │       │   │   ├── [ToolName].tsx
│   │       │   │   ├── index.ts
│   │       │   │   ├── metadata.ts
│   │       │   │   └── types.ts
│   │       │   ├── registry.ts
│   │       │   ├── index.ts
│   │       │   └── types.ts
│   │       └── index.ts     # Combined exports
│   │
│   └── types/               # TypeScript type definitions
│       └── index.ts         # Tool, ToolCategory, RoutePath types
│
├── public/                  # Static assets served as-is
├── templates/               # Tool template for generating new tools
├── docs/                    # Documentation
├── dist/                    # Production build output (generated)
├── node_modules/            # Dependencies (generated)
│
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── bun.lock                 # Bun lockfile (unused, using npm)
├── package-lock.json        # NPM lockfile
├── README.md                # Project README
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── PROJECT_REVIEW.md        # This file - project knowledge base
```

## 🔧 Key Configurations

### package.json
```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit",
    "test": "jest"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^8.3.0",
    "express": "^4.21.2",
    "dotenv": "^17.2.3",
    "motion": "^12.23.24"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.21.0",
    "typescript": "^5.9.3",
    "@types/express": "^4.17.21",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "types": ["vite/client"],
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./"]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('.', import.meta.url).pathname,
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
```

## 🐞 Issues Found & Fixes Applied

### 1. TypeScript Version Mismatch
- **Issue**: Template had `"typescript": "^7.0.2"` which doesn't exist
- **Fix**: Changed to `"typescript": "^5.9.3"` in package.json
- **Files Modified**: package.json

### 2. Vite __dirname Deprecation Warning
- **Issue**: Using `__dirname` in vite.config.ts which is deprecated
- **Fix**: Replaced with `new URL('.', import.meta.url).pathname`
- **Files Modified**: vite.config.ts

### 3. Unused @ts-expect-error Directive
- **Issue**: Unused TS directive in IconHelper.tsx causing TS error
- **Fix**: Removed the unused `@ts-expect-error` comment
- **Files Modified**: src/components/ui/IconHelper.tsx

### 4. Dependency Conflicts
- **Issue**: esbuild version conflict between root project and Vite
- **Fix**: Used `--legacy-peer-deps` flag during npm install
- **Command**: `npm install --legacy-peer-deps --no-audit --no-fund`

## ✅ Build & Development Status

### Build Status: ✅ PASSING
- Command: `npm run build`
- Output: Successfully builds with minor chunk size warnings (optimization opportunity)
- Last Build: ~700ms, 1.09MB JS bundle

### Type Checking: ✅ PASSING
- Command: `npx tsc --noEmit`
- Output: No TypeScript errors

### Development Server: ⚠️ NOT TESTED
- Command: `npm run dev`
- Note: Requires environment variables from .env.example

### Testing: ✅ PASSING
- Command: `npm test` (jest)
- Status: All 3 test suites pass (3 tests)
- Files with tests:
  - src/features/tools/image/image-compressor/tests/
  - templates/tool/tests/

## 🧩 Component Architecture

### Routing (App.tsx)
- Single file router using useState for currentPath
- Handles routes: home, tools, categories, static pages, tool pages, not found
- Implements theme persistence (dark/light) via localStorage
- Keyboard shortcut: Cmd/Ctrl+K for search modal
- Scroll to top on navigation

### Key Components
- **ToolCard**: Reusable tool preview card with hover effects
- **ToolSearch**: Search/filter component for tools
- **ToolPageShell**: Wrapper for individual tool pages
- **ToolWorkspace**: Phased implementation placeholder for tools
- **UI Primitives**: Button, Card, Container, Badge, Breadcrumbs, IconHelper
- **Layout**: Navbar, Footer, MobileBottomBar, SearchModal

### Data Flow
1. Static data in src/data/categories.ts and src/data/tools.ts
2. Exported via src/data/tools/index.ts and src/features/tools/index.ts
3. Consumed by components via imports like `import { TOOLS } from '../../data/tools'`
4. Individual tools loaded lazily via `getToolModuleBySlug`

## 📦 Tool System

### Tool Types (ToolCategorySlug)
- image, images, pdf, developer, text, calculator, calculators, social, converter, downloader, seo, privacy, productivity, more

### Tool Interface (src/types/index.ts)
```typescript
export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategorySlug;
  iconName: string;
  iconBg: string;
  iconColor: string;
  status: 'available' | 'coming-soon';
  featured?: boolean;
  popular?: boolean;
  filterType?: ToolFilterType;
  tags?: string[];
  features?: string[];
  howItWorks?: { step: number; title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}
```

### Tool Loading Mechanism
- Individual tools in src/features/tools/[type]/[tool-name]/
- Each tool exports Component, metadata, and types
- Registry system collects all tools into TOOLS array
- getToolBySlug() and getToolsByCategory() for lookup

## 📝 Templates System
Location: src/templates/
Purpose: Boilerplate for generating new tools
Contains:
- ToolComponent.tsx (base component)
- config.ts (configuration)
- hooks/useTool.ts (tool-specific hooks)
- lib/engine.ts (processing logic)
- types.ts (tool-specific types)
- utils/tool-utils.ts (utility functions)
- README.md (documentation)
- tests/ (unit tests - needs jest setup)

## 🧪 Testing Status
- **Framework**: Jest (configured in package.json)
- **Issue**: Tests ReferenceError: describe is not defined
- **Root Cause**: Missing jest setup/jsdom environment
- **Files with Tests**:
  - src/features/tools/image/image-compressor/tests/compressor.test.ts
  - src/features/tools/image/image-compressor/tests/validation.test.ts
  - templates/tool/tests/tool.test.ts
- **Fix Needed**: Add jest.config.js or configure in package.json

## 🚀 Development Commands
```bash
# Install dependencies (with legacy peer deps to resolve conflicts)
npm install --legacy-peer-deps --no-audit --no-fund

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clean build artifacts
npm run clean

# Type checking
npm run lint

# Run tests (currently broken - needs setup)
npm test
```

## 🔍 Known Improvements/TODOs

### Performance
- [ ] Code-splitting for large chunks (>500kB warning)
- [ ] Lazy load heavy tool components
- [ ] Optimize image assets

### Testing
- [ ] Fix Jest setup for existing tests
- [ ] Add more unit/tool tests
- [ ] Add e2e testing (Cypress/Playwright)

### Tool Completion
- [ ] Implement actual tool logic in ToolWorkspace components
- [ ] Add more tools to each category
- [ ] Complete metadata for all tools

### DX Improvements
- [ ] Add prettier/formatting configuration
- [ ] Add commit linting
- [ ] Add GitHub Actions CI/CD
- [ ] Add storybook for UI components

### Documentation
- [ ] Expand README with usage instructions
- [ ] Add API documentation for tool developers
- [ ] Add contributing guidelines

## 📜 Maintenance Rules

### When Making Changes:
1. **Update this file** - Any significant change to project structure, dependencies, or configuration must be documented here
2. **Note the fix** - When resolving issues, document what was wrong and how it was fixed
3. **Version awareness** - Keep track of dependency versions in package.json section
4. **Before major tasks** - Break down into subtasks and document approach here

### File Update Format:
```
### [DATE] - [DESCRIPTION]
- **Issue**: What problem was encountered
- **Fix**: How it was resolved
- **Files**: List of files modified
- **Commands**: Any relevant commands run
```

### Initial State Recorded: 
- TypeScript: 5.9.3 (updated from invalid 7.0.2)
- Vite config: Fixed __dirname usage
- Build: Passing with minor warnings
- Lint: Passing
- Tests: Broken (Jest setup needed)

### 2026-09-23 - Created project knowledge base
- **Issue**: Need centralized documentation for project structure, dependencies, and known issues
- **Fix**: Created PROJECT_REVIEW.md with comprehensive project overview
- **Files**: PROJECT_REVIEW.md
- **Commands**: None (file creation)

### 2026-09-25 - Foundation hardening phase
- **Issue**: Jest environment was incomplete; tests failed with `describe is not defined`
- **Fix**: Configured Jest with jsdom, ts-jest TypeScript support, `@/` module alias resolution, and `@testing-library/jest-dom` setup. `npm test` now passes.
- **Files**: jest.config.cjs, jest.setup.cjs, package.json, package-lock.json
- **Commands**: `npm test`, `npm run lint`, `npm run build`

### 2026-09-25 - Image-first production foundation
- **Issue**: All image tool modules were statically imported, causing every tool implementation to be bundled into the initial 1MB+ JavaScript payload. Unfinished/coming-soon tools were exposed as active searchable tools.
- **Fix**: Removed static tool exports from `src/features/tools/image/index.ts`, rebuilt the image registry around lazy dynamic import loaders, limited the active tool registry to implemented production-ready tools, and updated `src/data/tools/image.ts` to consume the active registry instead of raw tool modules.
- **Files**: src/features/tools/image/index.ts, src/features/tools/image/registry.ts, src/features/tools/registry.ts, src/data/tools/image.ts
- **Commands**: `npm test`, `npm run lint`, `npm run build`

### 2026-09-25 - Pre-deployment production consistency pass

- **Issue**: The shipped registry contradicted itself. `image-compressor` was the only registered tool and was exposed as `available`, but its engine (`lib/compressor.ts`) returned the *original, uncompressed* file while reporting a fabricated reduction percentage, and `CompressionResult.tsx` hardcoded a `-55%` saving next to a green success check. On top of that: the registry generated placeholder metadata with `slug.replace(/-/g,' ')` and `description: "Image tool: <slug>"`; `TOOL_MODULE_LOADERS` kept 11 loaders for tools that do not exist, emitting 11 orphan chunks; `categories.ts` hardcoded `toolsCount: 12`; the UI published "100+ Tools", "1M+ Happy Users" and "99.9% Uptime"; `ToolCard` hid the "Coming soon" badge whenever `popular` was true; deep links and refreshes always rendered the home page because `currentPath` was initialised to `'/'` and never read `window.location`; the privacy page claimed WebAssembly/Canvas processing that does not exist; `IconHelper` used `import * as Icons from 'lucide-react'` (whole icon library in the entry chunk); `DEPLOY.md` documented a deleted workflow and the old `CF_*` secrets; `docs/adding-a-tool.md` promised automatic registration; `robots.txt`/`sitemap.xml` were missing.
- **Fix (registry)**:
  - `src/features/tools/image/registry.ts` — `IMAGE_TOOL_LOADERS` and `IMAGE_TOOL_MODULES` are now empty; `ACTIVE_IMAGE_TOOL_SLUGS` is empty (nothing is production-ready); new `COMING_SOON_IMAGE_TOOLS` lists the Image Compressor for the roadmap only, imported from its `config.ts` (never its component). Comments document the three-step wiring for the next tool.
  - `src/features/tools/registry.ts` — removed all 11 dynamic loaders for non-existent tools and deleted the slug-derived placeholder metadata. `TOOLS` is now built from real metadata, and each entry's `status` is *derived* from `ACTIVE_TOOL_SLUGS`, so registry, metadata and UI badge cannot disagree. Added `isToolActive()`.
  - `src/features/tools/image/image-compressor/lib/compressor.ts` — the fake implementation is gone; `compressImage` now throws an explicit "not implemented" error instead of returning the input file and a `simulatedReduction`.
  - `src/features/tools/image/image-compressor/components/CompressionResult.tsx` — removed the hardcoded `-55%`/`originalSize * 0.45` and the unconditional success icon; it now reads the real `compressedSize`/`reductionPercentage`/`status` fields and shows no saving when none occurred.
  - `src/features/tools/image/image-compressor/{README.md, components/ImageCompressor.tsx}` — document that the module is NOT SHIPPED and define the engine contract for making it live.
- **Fix (counts, claims, metadata)**:
  - `src/data/categories.ts` — `toolsCount` is derived via `countCategoryTools()`; added `countAvailableCategoryTools()`; the pro-tip no longer claims the unshipped compressor is "the most popular tool".
  - `src/types/index.ts` — added `availableToolsCount` to `ToolCategory`.
  - `src/components/tools/ToolCard.tsx` — "Coming soon" now always wins over "Popular" (previously `popular: true` suppressed the badge and the card read "Open tool").
  - `src/components/pages/ToolPageShell.tsx` — added a prominent "Coming soon" hero badge, gated "Most Popular" on `available`, replaced the false "Supports batch processing. Files are processed client-side…" copy with honest "not available yet" wording, and reframed the How-it-works/Features headings for coming-soon tools.
  - `src/components/sections/Ecosystem.tsx` — replaced `100+ Tools` / `1M+ Happy Users` / `99.9% Uptime` with verifiable statements (rolling out, 100% in-browser, no cost, made for everyone).
  - `src/components/tools/{SearchModal,ToolSearch}.tsx`, `src/components/hero/Hero.tsx` — suggestion pills are derived from the catalogue (they previously advertised "PDF Merger", "JSON Formatter", "Word Counter"); search placeholders and empty-state copy no longer promise non-existent tools.
  - `src/components/pages/StaticPages.tsx` — the privacy page no longer claims WebAssembly/Canvas processing; it now states the app has no backend and issues no network requests (verified: zero fetch/XHR/sendBeacon calls in `src/`).
  - `src/components/pages/{CategoriesPage,AllToolsPage,CategoryPage}.tsx` — honest count labels ("Coming soon" / "N live") and real empty states; `src/components/ui/EmptyState.tsx` was dark-theme-only and is now theme-correct.
- **Fix (routing & SEO)**:
  - `src/App.tsx` — the router now seeds `currentPath` from `window.location.pathname`, pushes history state on navigation and listens for `popstate`, so deep links, refreshes and back/forward work (they previously always rendered the home page). Added per-route `document.title`.
  - `public/robots.txt`, `public/sitemap.xml` — created; only real routes are listed and the coming-soon tool route is disallowed.
  - `public/_redirects` — corrected the example route in the comment.
- **Fix (performance)**: `src/components/ui/IconHelper.tsx` no longer does `import * as Icons from 'lucide-react'`. It now maps the 26 icons actually referenced by metadata, which removed the largest contributor to the entry chunk.
- **Fix (deployment & docs)**: `DEPLOY.md` rewritten against the real `.github/workflows/deploy.yml`, `wrangler.toml`, `public/_redirects`, `public/_headers` and the actual secrets `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` (it referenced the deleted `deploy-pages.yml`, `cloudflare/pages-action` and `CF_*` secrets). `README.md` gained a "Project Status" section stating that no tool is live, and its `_redirects` example was corrected. `docs/adding-a-tool.md` steps 8-10 now describe the real three-place registration. `src/data/tools/image.ts` comment corrected to "catalogue" rather than "single source of truth".
- **Fix (tests)**: `jest.config.cjs` now transcribes with `tsconfig.test.json` (new file, extends `tsconfig.json` with `esModuleInterop`). This fixed a latent Jest/ts-jest bug where `import React from 'react'` resolved to `undefined`, crashing any component using `React.Fragment`/`React.FC` under jsdom. Production `tsconfig.json` was not weakened. Added `src/tests/registry-consistency.test.tsx` guarding: active-registry ↔ availability agreement, every active tool has a loadable component, no slug-derived placeholder metadata, derived category counts, no invented search results, and deep-link routing (`/tools`, a coming-soon tool route, and an unknown tool route).
- **Verified**:
  - `npm run lint` (`tsc --noEmit`) — clean, no errors.
  - `npm test` — 4 suites / 11 tests passing (3 pre-existing suites untouched).
  - `npm run build` — clean, and `dist/` now contains exactly one JS chunk plus one CSS chunk.
  - Orphan chunks removed: the build previously emitted 12 tool chunks (`image-compressor`, `image-resizer`, `image-converter`, `image-cropper`, `image-enhancer`, `image-merger`, `image-splitter`, `image-to-pdf`, `heic-to-jpg`, `jpg-to-webp`, `more-image-tools`, `ToolWorkspace`); it now emits **none**.
  - Initial bundle: **1,024.29 kB → 458.35 kB** (gzip **275.90 kB → 135.07 kB**), which also clears the previous ">500 kB chunk" build warning.
  - Bundle grep: `simulatedReduction`, `-55%`, `Lossless & Lossy`, `image-resizer`, `heic-to-jpg`, `jpg-to-webp`, `more-image-tools` and the old `Image tool:` placeholder are all absent; real metadata ("Image Compressor", its real description) and the honest "Coming soon"/"is not available yet" copy are present.
  - `npm run preview` — `/`, `/tools`, `/categories`, `/categories/images`, `/tools/image/image-compressor`, `/tools/unknown-tool`, `/about`, `/privacy` all return 200 via the SPA fallback; `/robots.txt` (503 B) and `/sitemap.xml` (1587 B) are served from `public/`.
  - Template system: `templates/tool/` still exists and does not register itself as a production tool (its `config.ts` is not imported by any registry); its test still runs and passes.
- **Files**: src/features/tools/registry.ts, src/features/tools/image/registry.ts, src/features/tools/image/image-compressor/{lib/compressor.ts, components/CompressionResult.tsx, components/ImageCompressor.tsx, README.md}, src/data/{categories.ts, tools/image.ts}, src/types/index.ts, src/App.tsx, src/components/ui/{IconHelper.tsx, EmptyState.tsx}, src/components/tools/{ToolCard.tsx, SearchModal.tsx, ToolSearch.tsx}, src/components/pages/{ToolPageShell.tsx, AllToolsPage.tsx, CategoryPage.tsx, CategoriesPage.tsx, StaticPages.tsx}, src/components/sections/Ecosystem.tsx, src/components/hero/Hero.tsx, src/tests/registry-consistency.test.tsx, public/{robots.txt, sitemap.xml, _redirects}, jest.config.cjs, tsconfig.test.json, DEPLOY.md, README.md, docs/adding-a-tool.md
- **Remaining warnings**: none from the build. Two intentional documentation-level items: the Image Compressor's marketing copy (`features`, `howItWorks`, `faqs` in its `config.ts`) still describes the intended tool and is now only ever rendered under a visible "Coming soon" badge and a "What's planned for…" heading; and the Image Compressor component plus `useImageCompressor` hook stay in the repo unshipped (dead code by design) until the engine is implemented. `public/sitemap.xml` and `public/robots.txt` assume the default Pages host `zorli.pages.dev` — update both if a custom domain is attached.
- **Commands**: `npm run lint`, `npm test`, `npm run build`, `npm run preview`

