import { ObjectId } from 'mongodb';

export interface IProject {
  _id?: ObjectId | string;
  name: string;
  description?: string;
  userId: string;
  variables?: {
    key: string;
    value: string;
    description?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
