import { ObjectId } from 'mongodb';

export type MemberRole = 'owner' | 'editor' | 'viewer';
export type MemberStatus = 'pending' | 'accepted' | 'declined';

export interface IMember {
  _id?: ObjectId | string;
  projectId: string;
  userId: string | null;
  invitedEmail: string | null;
  invitedGithubUsername: string | null;
  role: Exclude<MemberRole, 'owner'>;
  status: MemberStatus;
  invitedBy: string;
  createdAt: Date;
  updatedAt: Date;
  // Populated from users collection at query time
  user?: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export interface IMemberResponse {
  member: IMember;
  message?: string;
}

export interface IMemberListResponse {
  members: IMember[];
}

export type NotificationType =
  | 'invite'
  | 'invite_accepted'
  | 'invite_declined'
  | 'role_changed'
  | 'removed';

export interface INotification {
  _id?: ObjectId | string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: {
    projectId?: string;
    projectName?: string;
    memberId?: string;
    role?: string;
  };
  read: boolean;
  createdAt: Date;
}

export interface INotificationListResponse {
  notifications: INotification[];
  unreadCount: number;
}

export interface IUserSearchResult {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  source: 'local' | 'github';
}

export interface IUserSearchResponse {
  user: IUserSearchResult | null;
}
