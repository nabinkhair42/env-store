import { ObjectId } from 'mongodb';
import { EncryptedData } from '@/lib/crypto';

// Environment variable with encrypted value
export interface EnvVariable {
  key: string;
  value: string | EncryptedData;
  description?: string;
}

export interface IProject {
  _id?: ObjectId | string;
  name: string;
  description?: string;
  userId: string;
  variables?: EnvVariable[];
  userSalt?: string; // Salt for key derivation
  createdAt: Date;
  updatedAt: Date;
}
