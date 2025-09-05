'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSession } from 'next-auth/react';
import {
  CryptoService,
  EncryptedData,
  validateWebCryptoSupport,
} from '@/lib/crypto';
import { env } from '@/env';

interface EncryptionContextType {
  isReady: boolean;
  isInitializing: boolean;
  error: string | null;
  encryptValue: (value: string) => Promise<EncryptedData>;
  decryptValue: (encryptedData: EncryptedData) => Promise<string>;
  initializeForUser: (userId: string, userSalt?: string) => Promise<string>;
  initializeForProject: (userId: string, projectSalt: string) => Promise<void>;
  clearSession: () => void;
}

const EncryptionContext = createContext<EncryptionContextType | null>(null);

interface EncryptionProviderProps {
  children: React.ReactNode;
}

export function EncryptionProvider({ children }: EncryptionProviderProps) {
  const { data: session } = useSession();
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState<CryptoKey | null>(null);
  const [_currentSalt, setCurrentSalt] = useState<string | null>(null);

  const clearSession = useCallback(() => {
    console.log(
      '🔄 [EncryptionContext] Clearing session - resetting all encryption state'
    );
    setCurrentKey(null);
    setCurrentSalt(null);
    setIsReady(false);
    setError(null);
    CryptoService.clearKeys();
  }, []);

  const initializeForUser = useCallback(
    async (userId: string, userSalt?: string): Promise<string> => {
      try {
        setIsInitializing(true);
        setError(null);

        // Clear any existing session first
        clearSession();

        // Validate Web Crypto API support
        validateWebCryptoSupport();

        // Generate salt if not provided
        const salt = userSalt || CryptoService.generateSalt();

        // Derive encryption key
        const key = await CryptoService.deriveKey(
          userId,
          env.AUTH_SECRET,
          salt
        );

        setCurrentKey(key);
        setCurrentSalt(salt);
        setIsReady(true);

        return salt;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to initialize encryption';
        setError(errorMessage);
        setIsReady(false);
        throw err;
      } finally {
        setIsInitializing(false);
      }
    },
    [clearSession]
  );

  const initializeForProject = useCallback(
    async (userId: string, projectSalt: string): Promise<void> => {
      try {
        console.log('🔐 [EncryptionContext] Initializing for project:', {
          userId: userId?.substring(0, 8) + '...',
          projectSalt: projectSalt?.substring(0, 20) + '...',
          authSecretAvailable: !!env.AUTH_SECRET,
          authSecretLength: env.AUTH_SECRET?.length,
          authSecretValue: env.AUTH_SECRET, // Log the actual value for debugging
          currentState: {
            isReady,
            isInitializing,
            hasCurrentKey: !!currentKey,
          },
        });

        // Prevent multiple simultaneous initializations
        if (isInitializing) {
          console.log(
            '⏳ [EncryptionContext] Already initializing, skipping...'
          );
          return;
        }

        // If already initialized with the same salt, skip
        if (isReady && _currentSalt === projectSalt) {
          console.log(
            '✅ [EncryptionContext] Already initialized with same salt, skipping...'
          );
          return;
        }

        setIsInitializing(true);
        setError(null);

        // Clear any existing session first
        console.log(
          '🔄 [EncryptionContext] Clearing existing session before project initialization'
        );
        clearSession();

        // Validate Web Crypto API support
        validateWebCryptoSupport();

        // Derive encryption key using project salt
        console.log('🔑 [EncryptionContext] Key derivation parameters:', {
          userId: userId?.substring(0, 8) + '...',
          authSecretLength: env.AUTH_SECRET?.length,
          projectSalt: projectSalt?.substring(0, 20) + '...',
          projectSaltLength: projectSalt?.length,
        });

        const key = await CryptoService.deriveKey(
          userId,
          env.AUTH_SECRET,
          projectSalt
        );

        console.log(
          '✅ [EncryptionContext] Key derived successfully for project'
        );

        // Test the encryption/decryption cycle
        const testResult = await CryptoService.testEncryptionCycle(key);
        if (!testResult) {
          throw new Error('Encryption test failed - key may be invalid');
        }

        console.log('✅ [EncryptionContext] Encryption test passed');

        setCurrentKey(key);
        setCurrentSalt(projectSalt);
        setIsReady(true);

        console.log(
          '✅ [EncryptionContext] Project initialization completed:',
          {
            hasCurrentKey: !!key,
            isReady: true,
            saltSet: !!projectSalt,
          }
        );
      } catch (err) {
        console.error(
          '❌ [EncryptionContext] Failed to initialize project encryption:',
          err
        );
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to initialize project encryption';
        setError(errorMessage);
        setIsReady(false);
        throw err;
      } finally {
        setIsInitializing(false);
      }
    },
    [clearSession, isReady, isInitializing, currentKey, _currentSalt]
  );

  const encryptValue = useCallback(
    async (value: string): Promise<EncryptedData> => {
      if (!currentKey) {
        throw new Error('Encryption key not available. Please sign in again.');
      }

      try {
        return await CryptoService.encrypt(value, currentKey);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMessage);
        throw err;
      }
    },
    [currentKey]
  );

  const decryptValue = useCallback(
    async (encryptedData: EncryptedData): Promise<string> => {
      console.log('🔓 [EncryptionContext] Decrypt request:', {
        hasCurrentKey: !!currentKey,
        isReady,
        isInitializing,
        currentSalt: _currentSalt?.substring(0, 20) + '...',
        encryptedDataStructure: {
          hasCiphertext: !!encryptedData.ciphertext,
          hasIv: !!encryptedData.iv,
          hasAuthTag: !!encryptedData.authTag,
        },
      });

      if (!currentKey) {
        console.error(
          '❌ [EncryptionContext] No current key available for decryption'
        );
        throw new Error('Decryption key not available. Please sign in again.');
      }

      if (!isReady) {
        console.error(
          '❌ [EncryptionContext] Encryption context not ready for decryption'
        );
        throw new Error(
          'Encryption system not ready. Please wait and try again.'
        );
      }

      try {
        const result = await CryptoService.decrypt(encryptedData, currentKey);
        console.log('✅ [EncryptionContext] Decryption successful');
        return result;
      } catch (err) {
        console.error('❌ [EncryptionContext] Decryption failed:', err);

        // Add specific debugging for OperationError
        if (err instanceof Error && err.name === 'OperationError') {
          console.error(
            '🔍 [EncryptionContext] OperationError detected - this usually means wrong decryption key'
          );
          console.error(
            '🔍 [EncryptionContext] Current key derivation parameters:',
            {
              currentSalt: _currentSalt,
              hasAuthSecret: !!env.AUTH_SECRET,
              authSecretLength: env.AUTH_SECRET?.length,
            }
          );
        }

        const errorMessage =
          err instanceof Error ? err.message : 'Decryption failed';
        setError(errorMessage);
        throw err;
      }
    },
    [currentKey, _currentSalt, isReady, isInitializing]
  );

  // Auto-initialize when session changes (only if no project-specific encryption is set)
  useEffect(() => {
    // Only auto-initialize if we don't have a project-specific salt
    if (session?.user?.id && !isReady && !isInitializing && !_currentSalt) {
      console.log(
        '🔄 [EncryptionContext] Auto-initializing for user:',
        session.user.id
      );
      initializeForUser(session.user.id).catch((_err) => {
        // Silently handle initialization errors
        console.log('⚠️ [EncryptionContext] Auto-initialization failed:', _err);
      });
    } else if (!session?.user?.id) {
      console.log('🔄 [EncryptionContext] Clearing session - no user ID');
      clearSession();
    }
  }, [
    session?.user?.id,
    isReady,
    isInitializing,
    _currentSalt,
    initializeForUser,
    clearSession,
  ]);

  // Clear keys on unmount
  useEffect(() => {
    return () => {
      clearSession();
    };
  }, [clearSession]);

  const value: EncryptionContextType = {
    isReady,
    isInitializing,
    error,
    encryptValue,
    decryptValue,
    initializeForUser,
    initializeForProject,
    clearSession,
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption(): EncryptionContextType {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
}
