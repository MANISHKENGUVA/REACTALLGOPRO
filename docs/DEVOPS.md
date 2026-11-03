# DevOps and deployment

## Repository layout and build

This repository is an npm/Turborepo workspace. `apps/gopro` is the Vite/React
application and consumes `packages/artiqui` through the local npm workspace.
Keep the Vercel project root at the repository root so npm can resolve and build
both workspaces. The production web image contains only the
GoPro build output; the separate `NODE-NEON-API` service and Neon database are
not part of this repository or image.

The root `package-lock.json` is committed and CI installs with `npm ci`. Do not
ignore or regenerate it without reviewing the resulting workspace dependency
changes.

## GitHub Actions

`.github/workflows/ci.yml` runs for pull requests and pushes to `main`. It uses
Node.js 24 and npm, then checks the lockfile with `npm ci`, the production
dependency audit, both workspace linters, Node test discovery, and the
production Turbo build. The build job uses the
non-routable `https://api.example.invalid` value only to validate compilation;
it is not a deployable API address. A separate Gitleaks job scans commit history
without PR comments or uploaded artifacts.

There is no TypeScript project or type-check script in the current workspace.
There are currently no test files in the checkout. The GoPro test command uses
Node's test discovery and reports zero tests until tests are added. The workflow
does not treat that as test coverage.

Dependabot checks npm workspace dependencies and GitHub Actions weekly.
Repository administrators should protect `main` and require both
`Validate workspace` and `Scan for committed secrets` before merging. For an
organization-owned repository, Gitleaks may also require the
`GITLEAKS_LICENSE` Actions secret.

## Vercel

No existing `.vercel` project linkage was present, so this repository uses
Vercel's Git integration rather than storing deployment credentials in GitHub.
Import the GitHub repository into Vercel and configure:

- **Root Directory:** repository root (`.`), not `apps/gopro`.
- **Production Branch:** `main`.
- **Framework:** Vite.
- **Install Command:** `npm ci`.
- **Build Command:** `npm run build`.
- **Output Directory:** `apps/gopro/dist`.

These settings and the SPA rewrite are also recorded in `vercel.json`. Vercel's
Git integration creates Preview deployments for pull requests and Production
deployments from `main`. Protect `main` and require both CI checks before merge.
Vercel's native integration may build a deployment while the post-merge CI run
is still running; if policy requires gating promotion on that post-merge run,
configure Vercel deployment checks or switch to a CLI deployment gated on CI.
Native Git integration does not use a GitHub Actions Vercel token.

Set `VITE_API_BASE_URL` in the Vercel **Production** and **Preview**
environments. It must be the public HTTPS base URL for the separately hosted
Node/Express API. Set `VITE_APP_THEME` there if a non-default theme is needed;
the default is `theme1`. These `VITE_*` values are compiled into browser code,
so they must never contain credentials or other secrets. The Vite config uses
platform-provided variables first and falls back to
`apps/gopro/environments/<mode>/.env` for local builds. `turbo.json` passes the
frontend's configured `VITE_*` API endpoints into workspace builds and includes
them in the build cache key.

The API must allow credentialed CORS requests from the deployed GoPro origin
and any preview origins in use. Do not use `Access-Control-Allow-Origin: *`
with credentials. Backend CORS policy remains the responsibility of the
separate API project.

## Docker

The multi-stage `Dockerfile` builds the existing GoPro production bundle with
Node.js 24.18.0 and npm, then serves only `apps/gopro/dist` from a
version-pinned, unprivileged Nginx image on port 8080. `nginx.conf` provides
SPA route fallback, security headers, cached build assets, and 404 responses
for missing static files. `.dockerignore` excludes Git metadata, dependencies,
build output, and all `.env*` files.

Build and run locally from the repository root (replace the sample URL with
the public API base URL for your environment):

```sh
docker build --build-arg VITE_API_BASE_URL=https://api.example.com --build-arg VITE_APP_THEME=theme1 -t gopro-web .
docker run --rm -p 8080:8080 gopro-web
```

Open `http://localhost:8080/`. Nested React Router routes should return the SPA
entry point on direct navigation; requests for missing asset files return 404.
The browser container must be able to reach the separately hosted API URL.
The API must allow the Docker host's browser origin (for local testing,
typically `http://localhost:8080`) in its credentialed CORS policy.

## Troubleshooting

- A production Vite build fails if `VITE_API_BASE_URL` is unset. Configure it
  in the Vercel environment, pass it as a Docker build argument, or set it in
  the local production environment file.
- A successful frontend build does not mean the backend is available. Verify
  the configured API URL, backend health, and backend logs separately.
- If a nested route works after in-app navigation but not on refresh, confirm
  the Vercel SPA rewrite is present or that the Docker image uses `nginx.conf`.
- Docker build/run checks must be run on a host with Docker Engine installed.
