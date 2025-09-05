/**
 * Cryptographic module exports
 * Provides a clean interface for all encryption/decryption functionality
 */

// Core service
export { CryptoService } from './crypto-service';
export type { EncryptedData, CryptoServiceInterface } from './crypto-service';

// Utilities and error handling
export {
  CryptoError,
  KeyDerivationError,
  EncryptionError,
  DecryptionError,
  validateWebCryptoSupport,
  validateEncryptedData,
  toEncryptedData,
  isEncrypted,
  hasEncryptedVariables,
  safeCryptoOperation,
  getCryptoErrorMessage,
  validateKeyDerivationParams,
  secureClear,
  generateKeyId,
  isValidBase64,
  CRYPTO_CONSTANTS,
} from './crypto-utils';

// Re-export for convenience
export type { CryptoServiceImpl } from './crypto-service';
