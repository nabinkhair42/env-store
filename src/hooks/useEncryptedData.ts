'use client';

import { useCallback } from 'react';
import { SimpleCrypto } from '@/lib/simple-crypto';
import { EncryptedData, isEncrypted } from '@/lib/crypto';

interface UseEncryptedDataProps {
  userId: string;
  salt: string;
}

interface UseEncryptedDataReturn {
  encryptIfNeeded: (value: string | EncryptedData) => Promise<EncryptedData>;
  decryptIfNeeded: (value: string | EncryptedData) => Promise<string>;
  isEncryptedValue: (value: unknown) => value is EncryptedData;
}

export function useEncryptedData({
  userId,
  salt,
}: UseEncryptedDataProps): UseEncryptedDataReturn {
  const encryptIfNeeded = useCallback(
    async (value: string | EncryptedData): Promise<EncryptedData> => {
      // If already encrypted, return as-is
      if (isEncrypted(value)) {
        return value;
      }

      // If no encryption params, return as plain text (but still as EncryptedData structure)
      if (!userId || !salt) {
        throw new Error('Encryption parameters not available');
      }

      // Encrypt the string value
      return await SimpleCrypto.encrypt(value, userId, salt);
    },
    [userId, salt]
  );

  const decryptIfNeeded = useCallback(
    async (value: string | EncryptedData): Promise<string> => {
      // If it's a plain string, return as-is
      if (typeof value === 'string') {
        return value;
      }

      // If it's encrypted data, decrypt it
      if (isEncrypted(value)) {
        if (!userId || !salt) {
          throw new Error('Decryption parameters not available');
        }

        try {
          return await SimpleCrypto.decrypt(value, userId, salt);
        } catch (error) {
          console.error('Decryption failed:', error);
          throw new Error('Decryption failed');
        }
      }

      // Fallback for unknown format
      return String(value);
    },
    [userId, salt]
  );

  const isEncryptedValue = useCallback(
    (value: unknown): value is EncryptedData => {
      return isEncrypted(value);
    },
    []
  );

  return {
    encryptIfNeeded,
    decryptIfNeeded,
    isEncryptedValue,
  };
}
