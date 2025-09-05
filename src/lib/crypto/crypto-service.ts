/**
 * Cryptographic service for end-to-end encryption of environment variables
 * Uses AES-256-GCM for encryption and PBKDF2 for key derivation
 */

// Removed secure logger dependency for now - will implement basic logging

export interface EncryptedData {
  ciphertext: string; // Base64 encoded
  iv: string; // Base64 encoded
  authTag: string; // Base64 encoded
}

export interface CryptoServiceInterface {
  deriveKey(
    userId: string,
    authSecret: string,
    salt: string
  ): Promise<CryptoKey>;
  encrypt(plaintext: string, key: CryptoKey): Promise<EncryptedData>;
  decrypt(encryptedData: EncryptedData, key: CryptoKey): Promise<string>;
  generateSalt(): string;
  clearKeys(): void;
}

class CryptoServiceImpl implements CryptoServiceInterface {
  private derivedKeys = new Map<string, CryptoKey>();
  private readonly PBKDF2_ITERATIONS = 100000;
  private readonly KEY_LENGTH = 256; // bits
  private readonly ALGORITHM = 'AES-GCM';

  /**
   * Derives an encryption key from user credentials using PBKDF2
   */
  async deriveKey(
    userId: string,
    authSecret: string,
    salt: string
  ): Promise<CryptoKey> {
    const keyId = `${userId}:${salt}`;

    console.log('🔑 [CryptoService] Deriving key for:', {
      userId: userId?.substring(0, 8) + '...',
      authSecretLength: authSecret?.length,
      saltLength: salt?.length,
      keyId: keyId?.substring(0, 20) + '...',
    });

    // Return cached key if available
    if (this.derivedKeys.has(keyId)) {
      console.log(
        '✅ [CryptoService] Using cached key for:',
        keyId?.substring(0, 20) + '...'
      );
      return this.derivedKeys.get(keyId)!;
    }

    try {
      const keyMaterialString = `${userId}:${authSecret}`;
      console.log('Key derivation details:', {
        userId: userId,
        authSecret: authSecret,
        keyMaterialString: keyMaterialString,
        salt: salt,
      });

      // Create key material from user ID and auth secret
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(keyMaterialString),
        'PBKDF2',
        false,
        ['deriveKey']
      );

      // Derive the actual encryption key
      const saltBuffer = this.base64ToArrayBuffer(salt);

      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations: this.PBKDF2_ITERATIONS,
          hash: 'SHA-256',
        },
        keyMaterial,
        {
          name: this.ALGORITHM,
          length: this.KEY_LENGTH,
        },
        false, // Not extractable for security
        ['encrypt', 'decrypt']
      );

      // Cache the derived key
      this.derivedKeys.set(keyId, derivedKey);
      return derivedKey;
    } catch (error) {
      console.error('❌ [CryptoService] Key derivation failed:', error);
      throw new Error(
        `Key derivation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Encrypts plaintext using AES-256-GCM
   */
  async encrypt(plaintext: string, key: CryptoKey): Promise<EncryptedData> {
    try {
      // Generate a random IV
      const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM

      // Encrypt the data
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        key,
        new TextEncoder().encode(plaintext)
      );

      // Extract ciphertext and auth tag
      const encryptedArray = new Uint8Array(encryptedBuffer);
      const ciphertext = encryptedArray.slice(0, -16); // All but last 16 bytes
      const authTag = encryptedArray.slice(-16); // Last 16 bytes

      const result = {
        ciphertext: this.arrayBufferToBase64(ciphertext),
        iv: this.arrayBufferToBase64(iv),
        authTag: this.arrayBufferToBase64(authTag),
      };
      return result;
    } catch (error) {
      throw new Error(
        `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Decrypts encrypted data using AES-256-GCM
   */
  async decrypt(encryptedData: EncryptedData, key: CryptoKey): Promise<string> {
    try {
      // Validate encrypted data structure
      if (!this.validateEncryptedData(encryptedData)) {
        throw new Error('Invalid encrypted data structure or content');
      }

      // Reconstruct the encrypted buffer with auth tag
      const ciphertext = this.base64ToArrayBuffer(encryptedData.ciphertext);
      const authTag = this.base64ToArrayBuffer(encryptedData.authTag);
      const iv = this.base64ToArrayBuffer(encryptedData.iv);

      // Combine ciphertext and auth tag
      const encryptedBuffer = new Uint8Array(
        ciphertext.byteLength + authTag.byteLength
      );
      encryptedBuffer.set(new Uint8Array(ciphertext), 0);
      encryptedBuffer.set(new Uint8Array(authTag), ciphertext.byteLength);

      // Decrypt the data
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        key,
        encryptedBuffer
      );

      const result = new TextDecoder().decode(decryptedBuffer);
      return result;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error(
        `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generates a cryptographically secure random salt
   */
  generateSalt(): string {
    const saltArray = crypto.getRandomValues(new Uint8Array(32)); // 256-bit salt
    return this.arrayBufferToBase64(saltArray);
  }

  /**
   * Clears all cached keys from memory
   */
  clearKeys(): void {
    this.derivedKeys.clear();
  }

  /**
   * Test encryption/decryption cycle with a given key
   */
  async testEncryptionCycle(
    key: CryptoKey,
    testValue: string = 'test_value_123'
  ): Promise<boolean> {
    try {
      console.log(
        '🧪 [CryptoService] Testing encryption cycle with test value:',
        testValue
      );

      // Encrypt
      const encrypted = await this.encrypt(testValue, key);
      console.log('🧪 [CryptoService] Encryption successful:', encrypted);

      // Decrypt
      const decrypted = await this.decrypt(encrypted, key);
      console.log('🧪 [CryptoService] Decryption successful:', decrypted);

      // Compare
      const success = decrypted === testValue;
      console.log('🧪 [CryptoService] Test result:', success ? 'PASS' : 'FAIL');

      return success;
    } catch (error) {
      console.error('🧪 [CryptoService] Test failed:', error);
      return false;
    }
  }

  /**
   * Utility: Convert ArrayBuffer to Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Utility: Convert Base64 to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error) {
      console.error(
        '❌ [CryptoService] Failed to decode base64:',
        base64?.substring(0, 20) + '...'
      );
      throw new Error(
        `Invalid base64 data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validates encrypted data structure and content
   */
  validateEncryptedData(encryptedData: EncryptedData): boolean {
    try {
      if (!encryptedData || typeof encryptedData !== 'object') {
        return false;
      }

      if (
        !encryptedData.ciphertext ||
        !encryptedData.iv ||
        !encryptedData.authTag
      ) {
        return false;
      }

      // Check if base64 strings are valid
      try {
        atob(encryptedData.ciphertext);
        atob(encryptedData.iv);
        atob(encryptedData.authTag);
      } catch (error) {
        console.warn(error);
        return false;
      }

      // Check expected lengths
      const ivBytes = atob(encryptedData.iv).length;
      const authTagBytes = atob(encryptedData.authTag).length;

      if (ivBytes !== 12 || authTagBytes !== 16) {
        console.warn('Invalid lengths:', { ivBytes, authTagBytes });
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Validation failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const CryptoService = new CryptoServiceImpl();

// Export for testing
export { CryptoServiceImpl };
