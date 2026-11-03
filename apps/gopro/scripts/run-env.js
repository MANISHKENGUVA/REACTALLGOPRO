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

const args = process.argv.slice(2);
const command = args[0];
const workspace = args[1] ?? 'gopro';

if (!command) {
  console.error('Usage: run-env.js <command> [<workspace>]');
  process.exit(2);
}

// `npm run test` with no workspace argument runs tests across workspaces.
if (command === 'test' && args.length === 1) {
  execSync('turbo run test', { stdio: 'inherit' });
  process.exit(0);
}

// Map root command names to the script name executed inside the workspace.
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

const target = SCRIPT_MAP[command] ?? command;

try {
  const npmExecPath = process.env.npm_execpath;
  if (!npmExecPath) {
    throw new Error('Run this command through npm so the workspace can be selected.');
  }
  execFileSync(process.execPath, [npmExecPath, 'run', target, '--workspace', workspace], {
    stdio: 'inherit',
  });
} catch (err) {
  process.exit(err.status ?? 1);
}
