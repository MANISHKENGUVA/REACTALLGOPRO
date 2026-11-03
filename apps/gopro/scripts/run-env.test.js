import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadEnvironment, resolveCommand } from './run-env.js';
import { validateApiBaseUrl } from '../vite.config.js';

function createEnvironmentRoot(t, files = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'gopro-env-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));

  for (const [mode, contents] of Object.entries(files)) {
    const directory = path.join(root, 'environments', mode);
    mkdirSync(directory, { recursive: true });
    writeFileSync(path.join(directory, '.env'), contents);
  }
  return root;
}

test('root commands select their explicit environment and Vite script', () => {
  for (const [command, mode] of [
    ['build:development', 'development'],
    ['build:qa', 'qa'],
    ['build:test', 'test'],
    ['build:production', 'production'],
  ]) {
    assert.deepEqual(resolveCommand(command), { mode, script: command });
  }
});

test('Vercel preview and production select QA and production configurations', () => {
  assert.deepEqual(resolveCommand('build:vercel', { VERCEL_ENV: 'preview' }), {
    mode: 'qa',
    script: 'build:qa',
  });
  assert.deepEqual(resolveCommand('build:vercel', { VERCEL_ENV: 'production' }), {
    mode: 'production',
    script: 'build:production',
  });
  assert.throws(() => resolveCommand('build:vercel', {}), /VERCEL_ENV/);
});

test('selected environment files load and process variables take precedence', (t) => {
  const root = createEnvironmentRoot(t, {
    development: 'VITE_APP_ENV=development\nVITE_API_BASE_URL=http://localhost:3000\nVITE_APP_THEME=theme1\n',
    qa: 'VITE_APP_ENV=qa\nVITE_API_BASE_URL=https://qa.example.test\n',
    test: 'VITE_APP_ENV=test\nVITE_API_BASE_URL=http://localhost:3000\n',
    production: 'VITE_APP_ENV=production\nVITE_API_BASE_URL=https://api.example.test\n',
  });
  const expectedApiUrls = {
    development: 'http://localhost:3000',
    qa: 'https://qa.example.test',
    test: 'http://localhost:3000',
    production: 'https://api.example.test',
  };

  for (const mode of Object.keys(expectedApiUrls)) {
    const environment = mode === 'development' ? { VITE_APP_THEME: 'theme2' } : {};
    loadEnvironment(mode, { appRoot: root, environment });
    assert.equal(environment.VITE_APP_ENV, mode);
    assert.equal(environment.VITE_API_BASE_URL, expectedApiUrls[mode]);
    if (mode === 'development') assert.equal(environment.VITE_APP_THEME, 'theme2');
  }
});

test('production uses its own file and does not fall back when it is missing', (t) => {
  const appRoot = createEnvironmentRoot(t, {
    production: 'VITE_APP_ENV=production\nVITE_API_BASE_URL=https://api.production.test\n',
  });
  const environment = {};
  const envFile = loadEnvironment('production', { appRoot, environment });
  assert.equal(envFile, path.join(appRoot, 'environments', 'production', '.env'));
  assert.equal(environment.VITE_API_BASE_URL, 'https://api.production.test');

  const devOnlyRoot = createEnvironmentRoot(t, {
    development: 'VITE_APP_ENV=development\n',
  });
  assert.throws(
    () => loadEnvironment('production', { appRoot: devOnlyRoot, environment: {} }),
    /Required environment file not found/,
  );
});

test('preview may use injected Vercel config when its QA file is absent', (t) => {
  const appRoot = createEnvironmentRoot(t);
  const environment = { VITE_API_BASE_URL: 'https://qa-api.example.test' };
  loadEnvironment('qa', { appRoot, environment, allowPlatformOnly: true });
  assert.equal(environment.VITE_APP_ENV, 'qa');
});

test('VITE_APP_ENV cannot conflict with the selected environment', (t) => {
  const appRoot = createEnvironmentRoot(t, {
    production: 'VITE_APP_ENV=production\n',
  });
  assert.throws(
    () => loadEnvironment('production', {
      appRoot,
      environment: { VITE_APP_ENV: 'development' },
    }),
    /VITE_APP_ENV must match/,
  );
});

test('production API URL validation rejects missing, invalid, placeholder, and HTTP URLs', () => {
  assert.throws(
    () => validateApiBaseUrl('', 'production'),
    /must be configured for production builds/,
  );
  assert.throws(
    () => validateApiBaseUrl('', 'qa'),
    /must be configured for qa builds/,
  );
  assert.throws(
    () => validateApiBaseUrl('/relative/path', 'production'),
    /absolute HTTP or HTTPS URL/,
  );
  assert.throws(
    () => validateApiBaseUrl('https://example.invalid', 'production'),
    /placeholder domain/,
  );
  assert.throws(
    () => validateApiBaseUrl('http://api.example.com', 'production'),
    /must use HTTPS/,
  );
  assert.equal(
    validateApiBaseUrl('https://api.production.test', 'production'),
    'https://api.production.test',
  );
});

test('development permits its intended local HTTP API', () => {
  assert.equal(
    validateApiBaseUrl('http://localhost:3000', 'development'),
    'http://localhost:3000',
  );
});
