import { ObjectId } from 'mongodb';
import { MemberRole } from './members';

export interface IEnvVariable {
  key: string;
  value: string;
  description?: string;
}

export interface IEnvironment {
  name: string;
  variables: IEnvVariable[];
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
  environments: IEnvironment[];
  /** @deprecated Present only on unmigrated documents */
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
