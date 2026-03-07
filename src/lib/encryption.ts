import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

/**
 * Derives a cryptographic key from the encryption secret using PBKDF2
 */
function deriveKey(secret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(secret, salt, ITERATIONS, KEY_LENGTH, 'sha256');
}

/**
 * Encrypts a string value using AES-256-GCM
 * @param text - The plain text to encrypt
 * @param encryptionSecret - The encryption secret from environment variables
 * @returns Encrypted string in format: salt:iv:encrypted:authTag (all hex encoded)
 */
export function encrypt(text: string, encryptionSecret: string): string {
  if (!text) return text;
  if (!encryptionSecret) {
    throw new Error('Encryption secret is not configured');
  }

  try {
    // Generate random salt and IV
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);

    // Derive key from secret using salt
    const key = deriveKey(encryptionSecret, salt);

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    // Combine salt, iv, encrypted data, and auth tag
    // Format: salt:iv:encrypted:authTag
    return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data', { cause: error });
  }
}

/**
 * Decrypts an encrypted string
 * @param encryptedText - The encrypted text in format: salt:iv:encrypted:authTag
 * @param encryptionSecret - The encryption secret from environment variables
 * @returns Decrypted plain text
 */
export function decrypt(
  encryptedText: string,
  encryptionSecret: string
): string {
  if (!encryptedText) return encryptedText;
  if (!encryptionSecret) {
    throw new Error('Encryption secret is not configured');
  }

  try {
    // Check if the text is encrypted (contains our format)
    if (!encryptedText.includes(':')) {
      // Backward compatibility: return as-is if not encrypted
      return encryptedText;
    }

    const parts = encryptedText.split(':');
    if (parts.length !== 4) {
      // Not in expected format, return as-is for backward compatibility
      return encryptedText;
    }

    const [saltHex, ivHex, encrypted, authTagHex] = parts;

    // Convert hex strings back to buffers
    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    // Derive the same key using the salt
    const key = deriveKey(encryptionSecret, salt);

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    // Decrypt the text
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    // Backward compatibility: if decryption fails, it might be unencrypted legacy data
    // In production, you might want to handle this differently
    return encryptedText;
  }
}

/**
 * Checks if a value appears to be encrypted
 */
export function isEncrypted(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  const parts = value.split(':');
  // Our encrypted format has exactly 4 parts separated by colons
  // Each part should be a valid hex string
  if (parts.length !== 4) return false;

  const [salt, iv, encrypted, authTag] = parts;

  // Check if all parts are valid hex strings with expected lengths
  return (
    /^[0-9a-f]+$/i.test(salt) &&
    /^[0-9a-f]+$/i.test(iv) &&
    /^[0-9a-f]+$/i.test(encrypted) &&
    /^[0-9a-f]+$/i.test(authTag) &&
    salt.length === SALT_LENGTH * 2 && // hex encoding doubles the length
    iv.length === IV_LENGTH * 2 &&
    authTag.length === TAG_LENGTH * 2
  );
}
