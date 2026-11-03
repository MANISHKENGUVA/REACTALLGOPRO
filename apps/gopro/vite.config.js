import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const artiquiRoot = path.dirname(
  fileURLToPath(import.meta.resolve('artiqui/package.json')),
);

const THEME_ROOT = path.resolve(artiquiRoot, 'src/assets/sass/themes');
const installedThemes = fs.existsSync(THEME_ROOT)
  ? fs.readdirSync(THEME_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
  : [];
const SUPPORTED_MODES = ['development', 'qa', 'test', 'production'];

export function validateApiBaseUrl(value, mode) {
  const apiBaseUrl = typeof value === 'string' ? value.trim() : '';
  if (!apiBaseUrl) {
    if (mode !== 'development') {
      throw new Error(`VITE_API_BASE_URL must be configured for ${mode} builds`);
    }
    return '';
  }

  let url;
  try {
    url = new URL(apiBaseUrl);
  } catch {
    throw new Error('VITE_API_BASE_URL must be an absolute HTTP or HTTPS URL.');
  }

  if (
    !['http:', 'https:'].includes(url.protocol) ||
    !url.hostname ||
    url.username ||
    url.password
  ) {
    throw new Error('VITE_API_BASE_URL must be an absolute HTTP or HTTPS URL without credentials.');
  }

  if (
    url.hostname === 'example.invalid' ||
    url.hostname.endsWith('.example.invalid') ||
    url.hostname.endsWith('.invalid') ||
    url.hostname.endsWith('.example')
  ) {
    throw new Error('VITE_API_BASE_URL must not use a placeholder domain.');
  }

  if (mode === 'production' && url.protocol !== 'https:') {
    throw new Error('VITE_API_BASE_URL must use HTTPS for production builds.');
  }

  return apiBaseUrl;
}

export default defineConfig(({ mode }) => {
  if (!SUPPORTED_MODES.includes(mode)) {
    throw new Error(
      `Unsupported Vite mode "${mode}". Supported modes: ${SUPPORTED_MODES.join(', ')}`,
    );
  }

  const envDir = path.resolve(rootDir, 'environments', mode);
  const env = loadEnv(mode, envDir, '');
  const appEnvironment = process.env.VITE_APP_ENV ?? env.VITE_APP_ENV ?? mode;
  if (appEnvironment !== mode) {
    throw new Error('VITE_APP_ENV must match the selected Vite mode.');
  }
  const themeName = String(
    process.env.VITE_APP_THEME ?? env.VITE_APP_THEME ?? 'theme1',
  ).trim();
  if (!/^theme[0-9]{1,3}$/.test(themeName) || !installedThemes.includes(themeName)) {
    throw new Error(
      `VITE_APP_THEME must name an installed theme (${installedThemes.join(', ') || 'none found'}).`,
    );
  }
  const apiBaseUrl = validateApiBaseUrl(
    process.env.VITE_API_BASE_URL ?? env.VITE_API_BASE_URL ?? '',
    mode,
  );

  return {
    plugins: [react()],
    envDir,
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify(appEnvironment),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(
        process.env.VITE_APP_NAME ?? env.VITE_APP_NAME ?? 'GoPro',
      ),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
      'import.meta.env.VITE_APP_THEME': JSON.stringify(themeName),
      'import.meta.env.VITE_MODE': JSON.stringify(mode),
    },
    resolve: {
      alias: {
        '@theme': path.join(THEME_ROOT, themeName),
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
