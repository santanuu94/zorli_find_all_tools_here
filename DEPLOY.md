Deploying to Cloudflare Pages

This repository contains a Vite-built static site (build output: ./dist).
A GitHub Actions workflow builds the project and deploys it to Cloudflare Pages
on every push to main (or manually via "Run workflow").

Files that matter:
- .github/workflows/deploy.yml  — the deploy pipeline (cloudflare/wrangler-action@v3)
- .github/workflows/ci.yml      — runs lint, test and build on every push/PR
- wrangler.toml                 — Cloudflare Pages project config (name = "zorli")
- public/_redirects             — SPA fallback (/* -> /index.html 200)
- public/_headers               — security + caching headers
- public/robots.txt             — crawl rules
- public/sitemap.xml            — sitemap (uses the zorli.pages.dev host)

Required GitHub repository secrets
(Settings -> Secrets and variables -> Actions -> "New repository secret"):

| Secret                  | Value                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| CLOUDFLARE_API_TOKEN    | API token with the "Cloudflare Pages — Edit" permission           |
| CLOUDFLARE_ACCOUNT_ID   | Your Cloudflare account id (dashboard right sidebar)              |

The Pages project name is passed to the workflow as `--project-name=zorli`
The workflow creates it first with
`wrangler pages project create zorli --production-branch=main`, because
`wrangler pages deploy` cannot create a missing project in a non-interactive
CI context (it exits 1 with "project not found"). The create step is
idempotent, so you can also create the project by hand from the dashboard.
To use a different project
name, change it in .github/workflows/deploy.yml and wrangler.toml.

How it works:
- Push to main (or run the workflow manually).
- The workflow runs `npm install`, then `npm run build`.
- `wrangler pages deploy dist --project-name=zorli --branch=main` uploads ./dist.

Notes and troubleshooting:
- Ensure the account id and API token belong to the Cloudflare account that owns
  the Pages project.
- If the Pages project expects a different output directory, update
  pages_build_output_dir in wrangler.toml and the `dist` argument in the workflow.
- Prefer a scoped API token (Pages: Edit) over a Global API key.
- Custom domain: add it in the Cloudflare dashboard, then update the host in
  public/sitemap.xml and the Sitemap line in public/robots.txt.

Local build & test:
- Install deps: `npm ci`
- Type-check:   `npm run lint`
- Tests:        `npm test`
- Build:        `npm run build`   (output in ./dist)
- Preview:      `npm run preview`

Alternative: direct GitHub-to-Pages integration (no Actions). Link the repo in
Cloudflare Pages and set build command `npm run build`, output directory `dist`.

