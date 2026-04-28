import { PBKDF2_ITERATIONS, SALT_LENGTH } from '@/config/app-data';
import { EnvVariable } from '@/schema';
import { env } from '@/schema/env';
import { IEnvironment } from '@/types';
import Cryptr from 'cryptr';

export interface DecryptResult {
  variables: EnvVariable[];
  failedKeys: string[];
}

export interface DecryptEnvironmentsResult {
  environments: IEnvironment[];
  failedKeys: string[];
}

const cryptr = new Cryptr(env.ENCRYPTION_SECRET, {
  pbkdf2Iterations: PBKDF2_ITERATIONS,
  saltLength: SALT_LENGTH,
});

// --- Decrypted-value LRU cache ---
// PBKDF2 (100k iterations) takes ~30-50ms per value. Caching by ciphertext
// makes repeated reads of the same project nearly free.
const MAX_CACHE_ENTRIES = 5000;
const decryptCache = new Map<string, string>();

function cachedDecrypt(ciphertext: string): string {
  const hit = decryptCache.get(ciphertext);
  if (hit !== undefined) {
    // Promote to most-recent on access
    decryptCache.delete(ciphertext);
    decryptCache.set(ciphertext, hit);
    return hit;
  }
  const plain = cryptr.decrypt(ciphertext);
  // Evict oldest entry (Map preserves insertion order, so first is oldest)
  if (decryptCache.size >= MAX_CACHE_ENTRIES) {
    const oldest = decryptCache.keys().next().value;
    if (oldest !== undefined) decryptCache.delete(oldest);
  }
  decryptCache.set(ciphertext, plain);
  return plain;
}

export function safeEncryptVariables(
  variables: EnvVariable[] | undefined
): EnvVariable[] {
  if (!variables?.length) return [];
  return variables.map((v) => {
    if (!v.value) return v;
    const ciphertext = cryptr.encrypt(v.value);
    // Pre-warm the cache so subsequent reads of newly-saved values are instant
    decryptCache.set(ciphertext, v.value);
    return { ...v, value: ciphertext };
  });
}

export function safeDecryptVariables(
  variables: EnvVariable[] | undefined
): DecryptResult {
  if (!variables?.length) return { variables: [], failedKeys: [] };

  const failedKeys: string[] = [];
  const decrypted = variables.map((v) => {
    try {
      return { ...v, value: v.value ? cachedDecrypt(v.value) : v.value };
    } catch {
      failedKeys.push(v.key);
      return v;
    }
  });

  return { variables: decrypted, failedKeys };
}

export function safeEncryptEnvironments(
  environments: IEnvironment[],
): IEnvironment[] {
  return environments.map((e) => ({
    ...e,
    variables: safeEncryptVariables(e.variables),
  }));
}

export function safeDecryptEnvironments(
  environments: IEnvironment[],
): DecryptEnvironmentsResult {
  const allFailedKeys: string[] = [];
  const decrypted = environments.map((e) => {
    const { variables, failedKeys } = safeDecryptVariables(e.variables);
    allFailedKeys.push(...failedKeys);
    return { ...e, variables };
  });
  return { environments: decrypted, failedKeys: allFailedKeys };
}
