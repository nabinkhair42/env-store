/**
 * Utility functions for cryptographic operations
 * Provides helper functions and error handling for encryption/decryption
 */

import { EncryptedData } from './crypto-service';

/**
 * Custom error types for cryptographic operations
 */
export class CryptoError extends Error {
  constructor(
    message: string,
    public readonly operation: string
  ) {
    super(message);
    this.name = 'CryptoError';
  }
}

export class KeyDerivationError extends CryptoError {
  constructor(message: string) {
    super(message, 'key-derivation');
    this.name = 'KeyDerivationError';
  }
}

export class EncryptionError extends CryptoError {
  constructor(message: string) {
    super(message, 'encryption');
    this.name = 'EncryptionError';
  }
}

export class DecryptionError extends CryptoError {
  constructor(message: string) {
    super(message, 'decryption');
    this.name = 'DecryptionError';
  }
}

/**
 * Validates that the Web Crypto API is available
 */
export function validateWebCryptoSupport(): void {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new CryptoError(
      'Web Crypto API is not available. Please use a modern browser with HTTPS.',
      'validation'
    );
  }
}

/**
 * Validates encrypted data structure
 */
export function validateEncryptedData(data: unknown): data is EncryptedData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const encryptedData = data as Record<string, unknown>;

  return (
    typeof encryptedData.ciphertext === 'string' &&
    typeof encryptedData.iv === 'string' &&
    typeof encryptedData.authTag === 'string' &&
    encryptedData.ciphertext.length > 0 &&
    encryptedData.iv.length > 0 &&
    encryptedData.authTag.length > 0
  );
}

/**
 * Safely converts a value to EncryptedData or throws an error
 */
export function toEncryptedData(data: unknown): EncryptedData {
  if (!validateEncryptedData(data)) {
    throw new DecryptionError('Invalid encrypted data format');
  }
  return data;
}

/**
 * Checks if a value is encrypted (has the encrypted data structure)
 */
export function isEncrypted(value: unknown): value is EncryptedData {
  return validateEncryptedData(value);
}

/**
 * Checks if an array of variables contains any encrypted values
 */
export function hasEncryptedVariables(
  variables: Array<{ value: unknown }>
): boolean {
  return variables.some((variable) => isEncrypted(variable.value));
}

/**
 * Safely handles cryptographic operations with proper error wrapping
 */
export async function safeCryptoOperation<T>(
  operation: () => Promise<T>,
  operationType: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    switch (operationType) {
      case 'key-derivation':
        throw new KeyDerivationError(`Key derivation failed: ${message}`);
      case 'encryption':
        throw new EncryptionError(`Encryption failed: ${message}`);
      case 'decryption':
        throw new DecryptionError(`Decryption failed: ${message}`);
      default:
        throw new CryptoError(
          `Cryptographic operation failed: ${message}`,
          operationType
        );
    }
  }
}

/**
 * Creates a user-friendly error message for cryptographic errors
 */
export function getCryptoErrorMessage(error: unknown): string {
  if (error instanceof KeyDerivationError) {
    return 'Unable to generate encryption key. Please try signing in again.';
  }

  if (error instanceof EncryptionError) {
    return 'Failed to encrypt data. Please try again.';
  }

  if (error instanceof DecryptionError) {
    return 'Unable to decrypt data. This may indicate corrupted data or an authentication issue.';
  }

  if (error instanceof CryptoError) {
    return 'A security operation failed. Please refresh the page and try again.';
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Validates that required parameters are present for key derivation
 */
export function validateKeyDerivationParams(
  userId: string | undefined,
  authSecret: string | undefined,
  salt: string | undefined
): void {
  if (!userId) {
    throw new KeyDerivationError('User ID is required for key derivation');
  }

  if (!authSecret) {
    throw new KeyDerivationError(
      'Authentication secret is required for key derivation'
    );
  }

  if (!salt) {
    throw new KeyDerivationError('Salt is required for key derivation');
  }
}

/**
 * Securely clears sensitive data from memory (best effort)
 */
export function secureClear(data: string | ArrayBuffer | Uint8Array): void {
  try {
    if (typeof data === 'string') {
      // For strings, we can't truly clear memory, but we can overwrite the reference
      data = '';
    } else if (data instanceof ArrayBuffer) {
      // Clear ArrayBuffer by creating a new view and filling with zeros
      const view = new Uint8Array(data);
      view.fill(0);
    } else if (data instanceof Uint8Array) {
      // Clear Uint8Array directly
      data.fill(0);
    }
  } catch (_error) {
    // Ignore errors in secure clear - it's best effort
  }
}

/**
 * Generates a unique key identifier for caching
 */
export function generateKeyId(userId: string, salt: string): string {
  return `${userId}:${salt}`;
}

/**
 * Validates that a string is a valid base64 encoded value
 */
export function isValidBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

/**
 * Constants for cryptographic operations
 */
export const CRYPTO_CONSTANTS = {
  PBKDF2_ITERATIONS: 100000,
  KEY_LENGTH_BITS: 256,
  IV_LENGTH_BYTES: 12, // 96 bits for GCM
  SALT_LENGTH_BYTES: 32, // 256 bits
  AUTH_TAG_LENGTH_BYTES: 16, // 128 bits for GCM
  ALGORITHM: 'AES-GCM',
} as const;
