import { env } from '@/env';
import { EnvVariable } from '@/lib/zod';
import { decrypt, encrypt } from './encryption';

/**
 * Encrypts all variable values in an array
 */
export function encryptVariables(variables: EnvVariable[]): EnvVariable[] {
  return variables.map((variable) => ({
    ...variable,
    value: encrypt(variable.value, env.ENCRYPTION_SECRET),
  }));
}

/**
 * Decrypts all variable values in an array
 */
export function decryptVariables(variables: EnvVariable[]): EnvVariable[] {
  return variables.map((variable) => ({
    ...variable,
    value: decrypt(variable.value, env.ENCRYPTION_SECRET),
  }));
}

/**
 * Safely encrypts variables, handling edge cases
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
 * Safely decrypts variables, handling edge cases
 */
export function safeDecryptVariables(
  variables: EnvVariable[] | undefined
): EnvVariable[] {
  if (!variables || !Array.isArray(variables)) {
    return [];
  }

  try {
    return decryptVariables(variables);
  } catch (error) {
    console.error('Error decrypting variables:', error);
    // Return as-is on decryption error for backward compatibility
    // In production, you might want to handle this differently
    return variables;
  }
}
