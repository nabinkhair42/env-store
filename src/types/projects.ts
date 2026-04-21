import { ObjectId } from 'mongodb';
import { MemberRole } from './members';

export interface IEnvVariable {
  key: string;
  value: string;
  description?: string;
}

export interface IProjectMember {
  name: string | null;
  image: string | null;
}

export interface IProject {
  _id?: ObjectId | string;
  name: string;
  description?: string;
  userId: string;
  variables?: IEnvVariable[];
  createdAt: Date;
  updatedAt: Date;
  memberRole?: MemberRole;
  members?: IProjectMember[];
}

export interface IProjectResponse {
  project: IProject;
  message?: string;
  warning?: string;
}

export interface IProjectListResponse {
  projects: IProject[];
  sharedProjects: IProject[];
  warning?: string;
}
