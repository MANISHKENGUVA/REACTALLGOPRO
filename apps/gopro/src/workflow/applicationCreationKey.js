const STORAGE_KEY = 'gopro.workflow.applicationCreation.idempotencyKey';
const KEY_PATTERN = /^[A-Za-z0-9._~-]{16,128}$/;

function createRandomKey(cryptoApi) {
  if (typeof cryptoApi?.randomUUID === 'function') return cryptoApi.randomUUID();
  if (typeof cryptoApi?.getRandomValues !== 'function') {
    throw new Error('A secure random generator is unavailable. Reload the page and try again.');
  }
  const bytes = cryptoApi.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function browserSessionStorage() {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    throw new Error('Secure retry storage is unavailable. Enable browser session storage and try again.');
  }
  return window.sessionStorage;
}

export function createApplicationCreationKeyStore(
  storage = { getItem: (key) => browserSessionStorage().getItem(key), setItem: (key, value) => browserSessionStorage().setItem(key, value), removeItem: (key) => browserSessionStorage().removeItem(key) },
  cryptoApi = globalThis.crypto,
) {
  return {
    getOrCreate() {
      let existing;
      try {
        existing = storage.getItem(STORAGE_KEY);
      } catch {
        throw new Error('Secure retry storage is unavailable. Enable browser session storage and try again.');
      }
      if (KEY_PATTERN.test(existing || '')) return existing;

      const key = createRandomKey(cryptoApi);
      if (!KEY_PATTERN.test(key)) {
        throw new Error('A valid secure request key could not be generated. Reload the page and try again.');
      }
      try {
        storage.setItem(STORAGE_KEY, key);
        if (storage.getItem(STORAGE_KEY) !== key) {
          throw new Error('The request key was not persisted.');
        }
      } catch {
        throw new Error('Secure retry storage is unavailable. Enable browser session storage and try again.');
      }
      return key;
    },

    clear() {
      try {
        storage.removeItem(STORAGE_KEY);
      } catch {
        throw new Error('The pending application request could not be cleared. Reload the page before trying again.');
      }
    },
  };
}

export const applicationCreationKeyStore = createApplicationCreationKeyStore();
