#!/usr/bin/env node
/**
 * run-env.js — Root-level command dispatcher for environment-scoped commands.
 *
 * Enables the required syntax from the repository root:
 *
 *   npm run development gopro
 *   npm run qa gopro
 *   npm run test gopro
 *   npm run production gopro
 *   npm run build:development gopro
 *   npm run build:qa gopro
 *   npm run build:test gopro
 *   npm run build:production gopro
 *
 * The optional second positional argument selects the workspace (defaults to `gopro`).
 * It forwards to the matching script inside that workspace package.json:
 *
 *   development -> development        (vite --mode development)
 *   qa          -> qa                 (vite --mode qa)
 *   test        -> dev:test           (vite --mode test; `test` is reserved for node tests)
 *   production  -> production         (vite --mode production)
 *   build:*     -> build:*            (vite build --mode *)
 *
 * Usage:
 *   npm run <command> [<workspace>]
 */

import { execFileSync, execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import dotenv from 'dotenv';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const REPO_ROOT = path.resolve(APP_ROOT, '..', '..');

const COMMAND_MODES = {
  development: 'development',
  qa: 'qa',
  test: 'test',
  production: 'production',
  'build:development': 'development',
  'build:qa': 'qa',
  'build:test': 'test',
  'build:production': 'production',
};

const SCRIPT_MAP = {
  development: 'development',
  qa: 'qa',
  test: 'dev:test',
  production: 'production',
  'build:development': 'build:development',
  'build:qa': 'build:qa',
  'build:test': 'build:test',
  'build:production': 'build:production',
};

const VERCEL_TARGETS = {
  development: { mode: 'development', script: 'build:development' },
  preview: { mode: 'qa', script: 'build:qa' },
  production: { mode: 'production', script: 'build:production' },
};

export function resolveCommand(command, environment = process.env) {
  if (command === 'build:vercel') {
    const target = VERCEL_TARGETS[environment.VERCEL_ENV];
    if (!target) {
      throw new Error(
        'build:vercel requires VERCEL_ENV to be development, preview, or production.',
      );
    }
    return target;
  }

  const mode = COMMAND_MODES[command];
  return mode ? { mode, script: SCRIPT_MAP[command] } : null;
}

export function loadEnvironment(mode, {
  appRoot = APP_ROOT,
  repoRoot = REPO_ROOT,
  environment = process.env,
  allowPlatformOnly = false,
} = {}) {
  const envFile = path.resolve(appRoot, 'environments', mode, '.env');
  const vercelEnvironment = ['development', 'preview', 'production'].includes(
    environment.VERCEL_ENV,
  )
    ? environment.VERCEL_ENV
    : null;
  const platformEnvironmentFile = vercelEnvironment
    ? path.resolve(repoRoot, '.vercel', `.env.${vercelEnvironment}.local`)
    : null;

  if (platformEnvironmentFile && existsSync(platformEnvironmentFile)) {
    const platformValues = dotenv.parse(readFileSync(platformEnvironmentFile));
    for (const [key, value] of Object.entries(platformValues)) {
      if (!Object.hasOwn(environment, key)) {
        environment[key] = value;
      }
    }
  }

  if (existsSync(envFile)) {
    const fileValues = dotenv.parse(readFileSync(envFile));
    for (const [key, value] of Object.entries(fileValues)) {
      if (!Object.hasOwn(environment, key)) {
        environment[key] = value;
      }
    }
  } else if (
    !allowPlatformOnly ||
    mode !== 'qa' ||
    !environment.VITE_API_BASE_URL
  ) {
    if (allowPlatformOnly && mode === 'qa') {
      throw new Error(
        'VITE_API_BASE_URL is required for Vercel Preview builds. Configure it in Vercel Preview environment variables.',
      );
    }
    throw new Error(`Required environment file not found: ${envFile}`);
  }

  if (Object.hasOwn(environment, 'VITE_APP_ENV')) {
    if (environment.VITE_APP_ENV !== mode) {
      throw new Error('VITE_APP_ENV must match the selected environment.');
    }
  } else {
    environment.VITE_APP_ENV = mode;
  }

  return envFile;
}

export function main(args = process.argv.slice(2), environment = process.env) {
  const [requestedCommand, requestedWorkspace = 'gopro'] = args;
  if (!requestedCommand) {
    console.error('Usage: run-env.js <command> [<workspace>]');
    return 2;
  }

  // `npm run test` with no workspace argument runs tests across workspaces.
  if (requestedCommand === 'test' && args.length === 1) {
    try {
      execSync('turbo run test', { cwd: REPO_ROOT, stdio: 'inherit' });
      return 0;
    } catch (error) {
      return error.status ?? 1;
    }
  }

  try {
    const plan = resolveCommand(requestedCommand, environment);
    if (plan) {
      loadEnvironment(plan.mode, {
        environment,
        allowPlatformOnly:
          requestedCommand === 'build:vercel' &&
          environment.VERCEL_ENV === 'preview',
      });
    }

    const npmExecPath = environment.npm_execpath;
    if (!npmExecPath) {
      throw new Error('Run this command through npm so the workspace can be selected.');
    }
    const target = plan?.script ?? requestedCommand;
    execFileSync(
      process.execPath,
      [npmExecPath, 'run', target, '--workspace', requestedWorkspace],
      { cwd: REPO_ROOT, env: environment, stdio: 'inherit' },
    );
    return 0;
  } catch (error) {
    if (typeof error.status === 'number') {
      return error.status;
    }
    console.error(error.message);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = main();
}
