# DevOps and deployment

## Repository layout and build

This repository is an npm/Turborepo workspace. `apps/gopro` is the Vite/React
application and consumes `packages/artiqui` through the local npm workspace.
Keep the Vercel project root at the repository root so npm can resolve and
build both workspaces. The production web image contains only the GoPro build
output; the separate `NODE-NEON-API` service and Neon database are not part of
this repository or image.

The root `package-lock.json` is committed and CI installs with `npm ci`. Do not
ignore or regenerate it without reviewing workspace dependency changes.

## Environment selection and precedence

Root commands such as `npm run build:production gopro` select the matching
`apps/gopro/environments/<mode>/.env` file before launching the workspace Vite
script. The loader resolves paths from its own location, not the caller's
working directory. Non-empty process environment values take precedence over
file values; an empty `VITE_API_BASE_URL` is treated as unset so the selected
environment file can supply it. `VITE_APP_ENV` must match the selected Vite
mode; a mismatch fails the build. The GoPro Vite config reads only its selected
mode directory, so an application-root or repository-root `.env` cannot
override that configuration.

The production `.env` is intentionally versioned because it contains only
public frontend settings. Vite embeds `VITE_*` values into browser assets; do
not place credentials, tokens, passwords, private keys, or other secrets in
any Vite environment file.

## GitHub Actions

`.github/workflows/ci.yml` runs for pull requests and pushes to
`feature/UINONONBREAKER`. It installs with `npm ci` and validates a GoPro
production build using `npm run build:production gopro`. The production API
URL comes from the selected production environment file, not workflow YAML.

The deploy job pulls Vercel Preview settings, builds with
`vercel build --environment=preview`, and deploys the prebuilt output as a
preview. The loader reads Vercel's pulled `.vercel/.env.preview.local` when the
Preview API variable is not present in the process environment. Keep that
generated file untracked; it may contain private values.
The deployment uses GitHub Actions secrets for `VERCEL_TOKEN`,
`VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`. The CI production build is validation
only; it does not upload its local environment file or artifacts to Vercel.

## Vercel

Keep the Vercel project root at the repository root and use:

- **Install Command:** `npm ci`
- **Build Command:** `npm run build:vercel`
- **Output Directory:** `apps/gopro/dist`

These settings and the SPA rewrite are recorded in `vercel.json`. The build
dispatcher maps Vercel `VERCEL_ENV=preview` to GoPro's QA mode and
`VERCEL_ENV=production` to its production mode. Missing or unknown platform
targets fail instead of defaulting to production.

Set `VITE_API_BASE_URL` in Vercel's **Preview** environment to the QA API URL
and in **Production** to the production API URL. Vercel-injected process
variables take precedence over the selected environment file. If the QA
`.env` file is absent from a checkout, Preview builds require Vercel to inject
`VITE_API_BASE_URL`; they never fall back to production configuration. Set
`VITE_APP_THEME` in Vercel only when overriding the mode file's theme. Since
`VITE_*` values are compiled into browser code, they must never contain
credentials or secrets. Production API URLs must be absolute HTTPS URLs
without embedded credentials and cannot use placeholder domains.

The GitHub Actions deployment is preview-only. Production deployments use
Vercel's separate Production environment and target. Vercel deployment
configuration is separate from the GitHub Actions validation build.

The API must allow credentialed CORS requests from the deployed GoPro origin
and preview origins in use. Do not use `Access-Control-Allow-Origin: *` with
credentials. Backend CORS policy remains the responsibility of the separate
API project.

## Docker

The multi-stage `Dockerfile` builds the existing GoPro production bundle with
Node.js and npm, then serves only `apps/gopro/dist` from an unprivileged Nginx
image on port 8080. `.dockerignore` excludes Git metadata, dependencies, build
output, and all `.env*` files. Docker builds therefore require the public API
URL as a build argument:

```sh
docker build --build-arg VITE_API_BASE_URL=https://api.example.com --build-arg VITE_APP_THEME=theme1 -t gopro-web .
docker run --rm -p 8080:8080 gopro-web
```

Open `http://localhost:8080/`. Nested React Router routes should return the SPA
entry point on direct navigation; requests for missing asset files return 404.
The browser container must be able to reach the separately hosted API URL, and
the API must allow the Docker host's browser origin in its credentialed CORS
policy.

## Troubleshooting

- Production builds fail when `VITE_API_BASE_URL` is missing, invalid, not
  HTTPS, contains credentials, or uses a placeholder domain.
- A successful frontend build does not mean the backend is available. Verify
  the configured API URL, backend health, and backend logs separately.
- If a nested route works after in-app navigation but not on refresh, confirm
  the Vercel SPA rewrite is present or that the Docker image uses `nginx.conf`.
