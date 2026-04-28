import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '@/services/member.service';
import { InviteMemberInput, UpdateMemberRoleInput, RespondToInviteInput } from '@/schema';
import { IMemberListResponse } from '@/types';
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
    staleTime: 60_000, // Members change rarely; treat as fresh for 1 min
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
    // Optimistic role change for instant UI feedback
    onMutate: async ({ projectId, memberId, data }) => {
      await qc.cancelQueries({ queryKey: memberKeys.list(projectId) });
      const prev = qc.getQueryData<IMemberListResponse>(memberKeys.list(projectId));
      if (prev) {
        qc.setQueryData<IMemberListResponse>(memberKeys.list(projectId), {
          ...prev,
          members: prev.members.map((m) =>
            String(m._id) === memberId ? { ...m, role: data.role } : m,
          ),
        });
      }
      return { prev };
    },
    onError: (err: Error, { projectId }, ctx) => {
      if (ctx?.prev) qc.setQueryData(memberKeys.list(projectId), ctx.prev);
      toast.error(err.message);
    },
    onSuccess: ({ message }) => {
      toast.success(message ?? 'Role updated');
    },
    onSettled: (_data, _err, { projectId }) => {
      qc.invalidateQueries({ queryKey: memberKeys.list(projectId) });
    },
  });
}

export function useRemoveMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: string; memberId: string }) =>
      memberService.remove(projectId, memberId),
    // Optimistic removal — disappear immediately, restore on error
    onMutate: async ({ projectId, memberId }) => {
      await qc.cancelQueries({ queryKey: memberKeys.list(projectId) });
      const prev = qc.getQueryData<IMemberListResponse>(memberKeys.list(projectId));
      if (prev) {
        qc.setQueryData<IMemberListResponse>(memberKeys.list(projectId), {
          ...prev,
          members: prev.members.filter((m) => String(m._id) !== memberId),
        });
      }
      return { prev };
    },
    onError: (err: Error, { projectId }, ctx) => {
      if (ctx?.prev) qc.setQueryData(memberKeys.list(projectId), ctx.prev);
      toast.error(err.message);
    },
    onSuccess: ({ message }) => {
      toast.success(message ?? 'Member removed');
    },
    onSettled: (_data, _err, { projectId }) => {
      qc.invalidateQueries({ queryKey: memberKeys.list(projectId) });
    },
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
