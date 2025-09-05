/**
 * Simple encryption/decryption service without complex context
 */

import { CryptoService, EncryptedData } from '@/lib/crypto';
import { env } from '@/env';

export class SimpleCrypto {
  private static keyCache = new Map<string, CryptoKey>();

  static async getKey(userId: string, salt: string): Promise<CryptoKey> {
    const keyId = `${userId}:${salt}`;

    if (this.keyCache.has(keyId)) {
      return this.keyCache.get(keyId)!;
    }

    const key = await CryptoService.deriveKey(userId, env.AUTH_SECRET, salt);
    this.keyCache.set(keyId, key);
    return key;
  }

  static async encrypt(
    value: string,
    userId: string,
    salt: string
  ): Promise<EncryptedData> {
    const key = await this.getKey(userId, salt);
    return await CryptoService.encrypt(value, key);
  }

  static async decrypt(
    encryptedData: EncryptedData,
    userId: string,
    salt: string
  ): Promise<string> {
    console.log('SimpleCrypto decrypt called with:', {
      userId: userId,
      salt: salt,
      encryptedData: encryptedData,
    });
    const key = await this.getKey(userId, salt);
    return await CryptoService.decrypt(encryptedData, key);
  }

  static clearCache(): void {
    this.keyCache.clear();
  }
}
