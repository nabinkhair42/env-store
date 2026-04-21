import { ObjectId } from 'mongodb';

export interface IEnvVariable {
  key: string;
  value: string;
  description?: string;
}

export interface IProject {
  _id?: ObjectId | string;
  name: string;
  description?: string;
  userId: string;
  variables?: IEnvVariable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectResponse {
  project: IProject;
  message?: string;
  warning?: string;
}

export interface IProjectListResponse {
  projects: IProject[];
  warning?: string;
}
