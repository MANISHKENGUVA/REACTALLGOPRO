# REACTALLGOPRO

Turborepo monorepo containing the GoPro Loan application and the Artiqui shared UI component library.

- `apps/gopro` – GoPro Loan application (Vite + React 19 + React Router 7)
- `packages/artiqui` – Artiqui shared UI component library (design tokens, SCSS themes, reusable React components)

The application consumes the library through npm workspaces; no `npm link` is required.

---

## 📂 Folder Structure

```
REACTALLGOPRO/
├── apps/
│   └── gopro/              # GoPro Loan application
│       ├── environments/   # per-environment configuration (production public config is versioned)
│       │   ├── development/.env        (+ .env.example)
│       │   ├── qa/.env                 (+ .env.example)
│       │   ├── test/.env               (+ .env.example)
│       │   └── production/.env         (+ .env.example)
│       ├── scripts/
│       │   └── run-env.js              # root command dispatcher (environment modes)
│       ├── src/
│       │   ├── components/   # app-specific UI primitives (wrap Artiqui components)
│       │   ├── pages/        # loan-flow pages + home/playground
│       │   ├── workflow/     # loan workflow engine, gates, session handling
│       │   ├── utils/, validation/, context/, layouts/, assets/
│       │   ├── App.jsx, main.jsx, router.jsx
│       ├── public/
│       ├── scripts/
│       ├── index.html
│       ├── vite.config.js
│       ├── eslint.config.js
│       └── package.json
│       └── ...
├── packages/
│   └── artiqui/            # Artiqui shared UI library
│       ├── src/
│       │   ├── compo/        # AU* reusable components (AUBUTTON, AUINPUT, ...)
│       │   ├── routerEngine.js   # package entry (exports all AU* components)
│       │   ├── assets/sass/    # design tokens, component styles, themes theme1–theme15
│       │   └── App.jsx, main.jsx
│       ├── index.html
│       ├── vite.config.js    # Vite library build (es + umd)
│       ├── eslint.config.js
│       └── package.json
├── package.json            # root npm workspaces + turbo
├── package-lock.json       # reproducible npm workspace install
├── turbo.json              # Turborepo task pipelines
└── README.md
```

---

## 🔧 Workspace commands (run from repository root)

| Command | Effect |
|---------|--------|
| `npm ci` | Install all workspaces reproducibly and link Artiqui into GoPro |
| `npm run dev` | Start the Artiqui dev site and GoPro dev server in parallel (`turbo run dev --parallel`) |
| `npm run build` | Build Artiqui first, then GoPro for production (`turbo run build`) |
| `npm run lint` | Lint all workspace projects |
| `npm test` | Run all workspace tests |
| `npm run <task> --workspace=gopro` | Run a task only in the GoPro app |
| `npm run <task> --workspace=artiqui` | Run a task only in the Artiqui package |

### Environment-scoped commands

Run these from the repository root. Each loads the matching
`apps/gopro/environments/<env>/.env` and sets `import.meta.env.VITE_APP_ENV`
accordingly.

| Command | Effect |
|---------|--------|
| `npm run development gopro` | Start GoPro dev server in **development** mode |
| `npm run qa gopro` | Start GoPro dev server in **qa** mode |
| `npm run test gopro` | Start GoPro dev server in **test** mode |
| `npm run production gopro` | Start GoPro dev server in **production** mode |
| `npm run build:development gopro` | Build GoPro for **development** |
| `npm run build:qa gopro` | Build GoPro for **qa** |
| `npm run build:test gopro` | Build GoPro for **test** |
| `npm run build:production gopro` | Build GoPro for **production** |

The `gopro` argument selects the workspace. Equivalent `--workspace` forms are also
supported:

```bash
npm run development --workspace=gopro
```

> Note: `npm run test` with no workspace argument continues to run the test
> scripts via Turbo. The test-environment dev server is reached via
> `npm run test gopro`.

GoPro dev server: `http://localhost:5173/` (theme controlled by `VITE_APP_THEME` in
`apps/gopro/.env`, default `theme1`).

---
## 🏗️ Architecture

- **`packages/artiqui`** owns reusable UI components (`AUBUTTON`, `AUINPUT`, `AUSELECT`, …), design tokens (`src/assets/sass/_variables.scss`), SCSS component styles and the 15 bundled themes. It declares `react`/`react-dom` as peer dependencies and exposes a proper `exports` map (`"." → dist/router-engine.es.js`, plus `./dist/*` and `./src/*` subpaths).
- **`apps/gopro`** owns all loan-application business logic: pages, routing, authentication, API integrations, validation, workflow engine, gates and session handling. It imports shared components from `artiqui` (e.g. `import { AUBUTTON } from 'artiqui/dist/router-engine.es.js'`) and wraps them in app-specific primitives under `src/components/ui`.
- No application-specific business logic lives in `packages/artiqui`; no component duplication between the two projects.

---

## 🚀 Production Build & Deployment

```bash
# From the repository root
npm ci
npm run build:production gopro
```

Production output for the GoPro app is written to `apps/gopro/dist/`. Deploy the contents of that folder to any static host (Vercel, Netlify, etc.).
The production API URL is read from
`apps/gopro/environments/production/.env`. This file contains public browser
configuration only; Vite embeds every `VITE_*` value into the bundle.

---

## 🎨 Theme Switching

Themes live in `packages/artiqui/src/assets/sass/themes/theme1–theme15`. To change the development theme, edit `apps/gopro/environments/development/.env`:

```env
VITE_APP_THEME=theme2
```

Then restart the dev server or re-run the selected environment build command.

---

## 📋 Validation

After `npm ci`:

- `npm run build` – builds `packages/artiqui`, then `apps/gopro`
- `npm run test` – discovers Node tests in the GoPro workspace (no test files are currently present)
- `npm run dev --workspace=gopro` – dev server serves `http://localhost:5173/`

### Environment validation

Run each environment command and confirm `import.meta.env.VITE_APP_ENV` reflects the
selected environment (check the running page or the built bundle):

```bash
npm run development gopro   # VITE_APP_ENV=development, VITE_API_BASE_URL=http://localhost:3000
npm run qa gopro            # VITE_APP_ENV=qa, uses the QA environment configuration
npm run test gopro          # VITE_APP_ENV=test
npm run production gopro    # VITE_APP_ENV=production, requires a valid production API URL
```

Build each environment and confirm the API URL is baked into the correct bundle:

```bash
npm run build:development gopro
npm run build:qa gopro
npm run build:test gopro
npm run build:production gopro
```

See [docs/DEVOPS.md](./docs/DEVOPS.md) for CI, Vercel, Docker, and backend environment configuration.

---

## 📧 Support & Contact

For any queries or support, please contact:  
**vijaykenguva@gmail.com**

---