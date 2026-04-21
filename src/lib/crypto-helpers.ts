import { env } from '@/env';
import { EnvVariable } from '@/lib/zod';
import { decrypt, encrypt, isEncrypted } from './encryption';

export interface DecryptResult {
  variables: EnvVariable[];
  failedKeys: string[];
}

/**
 * Encrypts all variable values in an array.
 * Skips values that are already encrypted to prevent double-encryption.
 */
export function encryptVariables(variables: EnvVariable[]): EnvVariable[] {
  return variables.map((variable) => ({
    ...variable,
    value: isEncrypted(variable.value)
      ? variable.value
      : encrypt(variable.value, env.ENCRYPTION_SECRET),
  }));
}

/**
 * Safely encrypts variables, handling edge cases.
 * Prevents double-encryption by checking if values are already encrypted.
 */
export function safeEncryptVariables(
  variables: EnvVariable[] | undefined
): EnvVariable[] {
  if (!variables || !Array.isArray(variables)) {
    return [];
  }

  try {
    return encryptVariables(variables);
  } catch (error) {
    console.error('Error encrypting variables:', error);
    throw new Error('Failed to encrypt environment variables', {
      cause: error,
    });
  }
}

/**
 * Safely decrypts variables with per-variable error isolation.
 *
 * On failure, the encrypted value is preserved as-is (safe because
 * encryptVariables guards against double-encryption). The key is
 * collected in failedKeys so the API can warn the client.
 */
export function safeDecryptVariables(
  variables: EnvVariable[] | undefined
): DecryptResult {
  if (!variables || !Array.isArray(variables)) {
    return { variables: [], failedKeys: [] };
  }

  const failedKeys: string[] = [];

  const decrypted = variables.map((variable) => {
    try {
      return {
        ...variable,
        value: decrypt(variable.value, env.ENCRYPTION_SECRET),
      };
    } catch (error) {
      console.error(
        `Failed to decrypt variable "${variable.key}":`,
        error
      );
      failedKeys.push(variable.key);
      // Preserve the encrypted value as-is — the double-encryption
      // guard in encryptVariables prevents corruption on re-save.
      return variable;
    }
  });

  return { variables: decrypted, failedKeys };
}
