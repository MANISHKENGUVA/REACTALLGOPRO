import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const artiquiRoot = path.dirname(
  fileURLToPath(import.meta.resolve('artiqui/package.json')),
);

// The theme name is a build input, so it is resolved against the themes that
// actually ship with the package instead of being appended to a path. Unknown
// values (including separators or parent-directory sequences) fail the build.
const THEME_ROOT = path.resolve(artiquiRoot, 'src/assets/sass/themes');
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
  const apiBaseUrl = process.env.VITE_API_BASE_URL ?? env.VITE_API_BASE_URL ?? '';

  if (mode === 'production' && !apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL must be configured for production builds');
  }

  return {
    plugins: [react()],
    // Explicit definitions preserve mode-file defaults while allowing deployment
    // platforms and container builds to provide public VITE_* values.
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify(
        process.env.VITE_APP_ENV ?? env.VITE_APP_ENV ?? mode,
      ),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(
        process.env.VITE_APP_NAME ?? env.VITE_APP_NAME ?? 'GoPro',
      ),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
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
