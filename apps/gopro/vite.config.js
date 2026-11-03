import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// The theme name is a build input, so it is resolved against the themes that
// actually ship with the package instead of being appended to a path. Unknown
// values (including separators or parent-directory sequences) fail the build.
const THEME_ROOT = path.resolve(rootDir, 'node_modules/artiqui/src/assets/sass/themes');
const installedThemes = fs.existsSync(THEME_ROOT)
  ? fs.readdirSync(THEME_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
  : [];
const themeName = String(process.env.VITE_APP_THEME || 'theme1').trim();

if (!/^theme[0-9]{1,3}$/.test(themeName) || !installedThemes.includes(themeName)) {
  throw new Error(
    `VITE_APP_THEME must name an installed theme (${installedThemes.join(', ') || 'none found'}), received "${themeName}"`,
  );
}

const themePath = path.join(THEME_ROOT, themeName);

// Environments supported by the application. Any other mode fails fast so that
// environment selection is deterministic and no build can silently fall back
// to an unintended configuration.
const SUPPORTED_MODES = ['development', 'qa', 'test', 'production'];

export default defineConfig(({ mode }) => {
  if (!SUPPORTED_MODES.includes(mode)) {
    throw new Error(
      `Unsupported Vite mode "${mode}". Supported modes: ${SUPPORTED_MODES.join(', ')}`,
    );
  }

  // Load environment variables exclusively from environments/<mode>/.env.
  // loadEnv only returns VITE_* prefixed variables and ignores everything else.
  const envDir = path.resolve(rootDir, 'environments', mode);
  const env = loadEnv(mode, envDir, '');

  return {
    plugins: [react()],
    // Inject the selected environment into import.meta.env so application code
    // reads a single, deterministic configuration. Defining these explicitly
    // guarantees values come from environments/<mode>/.env and cannot be
    // overridden by variables leaked from root .env or another environment.
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify(env.VITE_APP_ENV ?? mode),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME ?? 'GoPro'),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        env.VITE_API_BASE_URL ?? '',
      ),
      'import.meta.env.VITE_MODE': JSON.stringify(mode),
    },
    resolve: {
      alias: {
        '@theme': themePath,
        '@': path.resolve(rootDir, './src'),
      },
    },
    build: {
      // Source maps expose the original application source in production
      // deployments. They are intentionally disabled.
      sourcemap: false,
    },
  };
});

