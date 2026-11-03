# REACTALLGOPRO

Turborepo monorepo containing the GoPro Loan application and the Artiqui shared UI component library.

- `apps/gopro` – GoPro Loan application (Vite + React 19 + React Router 7)
- `packages/artiqui` – Artiqui shared UI component library (design tokens, SCSS themes, reusable React components)

The application consumes the library through a pnpm workspace reference (`artiqui: workspace:*`); no `npm link` is required.

---

## 📂 Folder Structure

```
REACTALLGOPRO/
├── apps/
│   └── gopro/              # GoPro Loan application
│       ├── environments/   # per-environment configuration (real .env files are gitignored)
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
│       │   └── tests/        # 114 unit tests (node --test)
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
├── package.json            # root (pnpm workspaces + turbo)
├── pnpm-workspace.yaml     # workspace globs + allowBuilds
├── turbo.json              # Turborepo task pipelines
└── README.md
```

---

## 🔧 Workspace commands (run from repository root)

| Command | Effect |
|---------|--------|
| `pnpm install` | Install all workspace dependencies; symlinks `packages/artiqui` into `apps/gopro/node_modules/artiqui` |
| `pnpm run dev` | Start the Artiqui dev site and the GoPro dev server in parallel (`turbo run dev --parallel`) |
| `pnpm run build` | Build Artiqui first, then GoPro for production (`turbo run build`) |
| `pnpm run lint` | Lint all workspace projects |
| `pnpm run test` | Run all workspace tests |
| `pnpm --filter gopro run <task>` | Run a task only in the GoPro app                                          |
| `pnpm --filter artiqui run <task>` | Run a task only in the Artiqui package                                  |

### Environment-scoped commands

Run these from the repository root. Each loads the matching
`apps/gopro/environments/<env>/.env` and sets `import.meta.env.VITE_APP_ENV`
accordingly.

| Command (npm) | Command (pnpm) | Effect |
|---------------|----------------|--------|
| `npm run development gopro` | `pnpm run development gopro` | Start GoPro dev server in **development** mode |
| `npm run qa gopro` | `pnpm run qa gopro` | Start GoPro dev server in **qa** mode |
| `npm run test gopro` | `pnpm run test gopro` | Start GoPro dev server in **test** mode |
| `npm run production gopro` | `pnpm run production gopro` | Start GoPro dev server in **production** mode |
| `npm run build:development gopro` | `pnpm run build:development gopro` | Build GoPro for **development** |
| `npm run build:qa gopro` | `pnpm run build:qa gopro` | Build GoPro for **qa** |
| `npm run build:test gopro` | `pnpm run build:test gopro` | Build GoPro for **test** |
| `npm run build:production gopro` | `pnpm run build:production gopro` | Build GoPro for **production** |

The `gopro` argument selects the workspace. Equivalent `--workspace` forms are also
supported:

```bash
npm run development --workspace=gopro
pnpm run development --workspace=gopro
pnpm --filter gopro run development
```

> Note: `npm run test` with no workspace argument (and `pnpm run test`) continues to
> run the full unit-test suite via turbo. The test-**environment** dev server is
> reached via `npm run test gopro`.

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
pnpm install
pnpm run build
```

Production output for the GoPro app is written to `apps/gopro/dist/`. Deploy the contents of that folder to any static host (Vercel, Netlify, etc.).

---

## 🎨 Theme Switching

Themes live in `packages/artiqui/src/assets/sass/themes/theme1–theme15`. To change the theme, edit `apps/gopro/.env`:

```env
VITE_APP_THEME=theme2
```

Then restart the dev server or re-run `pnpm run build`.

---

## 📋 Validation

After `pnpm install`:

- `pnpm run build` – builds `packages/artiqui`, then `apps/gopro` (artiqui resolves through the workspace symlink)
- `pnpm run test` – 114 tests pass, 0 failures
- `pnpm --filter gopro dev` – dev server serves `http://localhost:5173/`

### Environment validation

Run each environment command and confirm `import.meta.env.VITE_APP_ENV` reflects the
selected environment (check the running page or the built bundle):

```bash
pnpm run development gopro   # VITE_APP_ENV=development, VITE_API_BASE_URL=http://localhost:3000
pnpm run qa gopro            # VITE_APP_ENV=qa, VITE_API_BASE_URL=https://qa-api.gopro.example
pnpm run test gopro          # VITE_APP_ENV=test
pnpm run production gopro    # VITE_APP_ENV=production, VITE_API_BASE_URL=https://api.gopro.example
```

Build each environment and confirm the API URL is baked into the correct bundle:

```bash
pnpm run build:development gopro
pnpm run build:qa gopro
pnpm run build:test gopro
pnpm run build:production gopro
```

> Lint note: `pnpm run lint` reports 3 pre-existing errors on this branch (unused vars in `packages/artiqui/src/ComponentDocsPage.jsx` and `apps/gopro/src/workflow/components/MobileOtpGate.jsx`; `__dirname` in `packages/artiqui/vite.config.js`). They exist in files untouched by this refactor and are outside its scope.

---

## 📧 Support & Contact

For any queries or support, please contact:  
**vijaykenguva@gmail.com**

---