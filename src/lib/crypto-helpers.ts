import { PBKDF2_ITERATIONS, SALT_LENGTH } from '@/config/app-data';
import { EnvVariable } from '@/schema';
import { env } from '@/schema/env';
import Cryptr from 'cryptr';

export interface DecryptResult {
  variables: EnvVariable[];
  failedKeys: string[];
}

const cryptr = new Cryptr(env.ENCRYPTION_SECRET, {
  pbkdf2Iterations: PBKDF2_ITERATIONS,
  saltLength: SALT_LENGTH,
});

export function safeEncryptVariables(
  variables: EnvVariable[] | undefined
): EnvVariable[] {
  if (!variables?.length) return [];
  return variables.map((v) => ({
    ...v,
    value: v.value ? cryptr.encrypt(v.value) : v.value,
  }));
}

export function safeDecryptVariables(
  variables: EnvVariable[] | undefined
): DecryptResult {
  if (!variables?.length) return { variables: [], failedKeys: [] };

  const failedKeys: string[] = [];
  const decrypted = variables.map((v) => {
    try {
      return { ...v, value: v.value ? cryptr.decrypt(v.value) : v.value };
    } catch {
      failedKeys.push(v.key);
      return v;
    }
  });

  return { variables: decrypted, failedKeys };
}
