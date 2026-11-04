import test from 'node:test';
import assert from 'node:assert/strict';

// These are deployment/browser checks rather than provider-verification tests.
// Keep the CAPTCHA script URL explicit so the frontend never calls verification
// endpoints directly or embeds a secret key.
test('CAPTCHA gate loads the explicit-render reCAPTCHA v2 client', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('./CaptchaGate.jsx', import.meta.url), 'utf8');
  assert.match(source, /https:\/\/www\.google\.com\/recaptcha\/api\.js\?render=explicit/);
  assert.match(source, /SCRIPT_TIMEOUT_MS\s*=\s*12000/);
  assert.match(source, /script\?\.remove\(\)/);
});
