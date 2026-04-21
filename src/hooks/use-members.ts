import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '@/services/member.service';
import { InviteMemberInput, UpdateMemberRoleInput, RespondToInviteInput } from '@/schema';
import { projectKeys } from './use-projects';
import { toast } from 'react-hot-toast';

export const memberKeys = {
  all: ['members'] as const,
  list: (projectId: string) => [...memberKeys.all, 'list', projectId] as const,
};

export function useMembers(projectId: string) {
  return useQuery({
    queryKey: memberKeys.list(projectId),
    queryFn: () => memberService.list(projectId),
    enabled: !!projectId,
  });
}

export function useInviteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: InviteMemberInput }) =>
      memberService.invite(projectId, data),
    onSuccess: ({ message }, { projectId }) => {
      qc.invalidateQueries({ queryKey: memberKeys.list(projectId) });
      toast.success(message ?? 'Invitation sent');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateMemberRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      data,
    }: {
      projectId: string;
      memberId: string;
      data: UpdateMemberRoleInput;
    }) => memberService.updateRole(projectId, memberId, data),
    onSuccess: ({ message }, { projectId }) => {
      qc.invalidateQueries({ queryKey: memberKeys.list(projectId) });
      toast.success(message ?? 'Role updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRemoveMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: string; memberId: string }) =>
      memberService.remove(projectId, memberId),
    onSuccess: ({ message }, { projectId }) => {
      qc.invalidateQueries({ queryKey: memberKeys.list(projectId) });
      toast.success(message ?? 'Member removed');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRespondToInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: RespondToInviteInput }) =>
      memberService.respond(memberId, data),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(message);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
