Deploying to Cloudflare Pages

This repository contains a Vite-built static site (build output: ./dist).
The repository includes a GitHub Actions workflow that builds the project and deploys to Cloudflare Pages when commits are pushed to main or master.

What to set in GitHub:
- Go to the repository Settings -> Secrets and variables -> Actions -> "New repository secret" and add:
  - CF_API_TOKEN: A Cloudflare API token with Pages deployment permissions (or full account if needed)  
  - CF_ACCOUNT_ID: Your Cloudflare account id  
  - CF_PROJECT_NAME: The Cloudflare Pages project name (the Pages site slug)

How it works:
- The workflow (.github/workflows/deploy-pages.yml) runs on push to main/master.
- It runs `npm ci` then `npm run build`.
- The built static files in ./dist are uploaded to Cloudflare Pages using cloudflare/pages-action.

Notes and troubleshooting:
- Ensure the projectName and accountId correspond to the Pages project in the Cloudflare dashboard.
- If the site uses environment variables at build time, add them as repository secrets and use them in the workflow by setting environment variables in the build step.
- If Cloudflare Pages expects a different build directory, update the `directory` value in the workflow.

Local build & test:
- Install deps: `npm ci`
- Build: `npm run build` (output in ./dist)
- Preview (optional): `npm run preview` (depends on project setup)

If you'd prefer direct GitHub-to-Pages integration (no Actions), link the repo in Cloudflare Pages and set build settings there (build command: `npm run build`, build directory: `dist`).
