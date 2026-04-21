import api from '@/config/axios';
import { API_ENDPOINTS } from '@/config/api-endpoints';
import { IMemberListResponse, IMemberResponse } from '@/types';
import { InviteMemberInput, UpdateMemberRoleInput, RespondToInviteInput } from '@/schema';

export const memberService = {
  list: (projectId: string) =>
    api.get<never, IMemberListResponse>(API_ENDPOINTS.MEMBERS.LIST(projectId)),

  invite: (projectId: string, data: InviteMemberInput) =>
    api.post<never, IMemberResponse>(API_ENDPOINTS.MEMBERS.INVITE(projectId), data),

  updateRole: (projectId: string, memberId: string, data: UpdateMemberRoleInput) =>
    api.put<never, IMemberResponse>(API_ENDPOINTS.MEMBERS.UPDATE(projectId, memberId), data),

  remove: (projectId: string, memberId: string) =>
    api.delete<never, { message: string }>(API_ENDPOINTS.MEMBERS.REMOVE(projectId, memberId)),

  respond: (memberId: string, data: RespondToInviteInput) =>
    api.post<never, { message: string }>(API_ENDPOINTS.MEMBERS.RESPOND(memberId), data),
};
