'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useMembers, useUpdateMemberRole, useRemoveMember } from '@/hooks/use-members';
import { MemberRole } from '@/types';
import { InviteForm } from './invite-form';
import { MemberRow } from './member-row';

interface MembersPanelProps {
  projectId: string;
  currentRole: MemberRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MembersPanel({
  projectId,
  currentRole,
  open,
  onOpenChange,
}: MembersPanelProps) {
  const { data, isLoading } = useMembers(projectId);
  const { mutate: updateRole } = useUpdateMemberRole();
  const { mutate: removeMember } = useRemoveMember();

  const isOwner = currentRole === 'owner';
  const members = data?.members ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Team Members</DialogTitle>
          <DialogDescription>
            Manage who has access to this project
          </DialogDescription>
        </DialogHeader>

        {isOwner && (
          <>
            <InviteForm projectId={projectId} />
            <Separator />
          </>
        )}

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner className="size-5" />
          </div>
        ) : members.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No team members yet
          </p>
        ) : (
          <div className="divide-y">
            {members.map((member) => (
              <MemberRow
                key={member._id as string}
                member={member}
                isOwner={isOwner}
                onUpdateRole={(memberId, role) =>
                  updateRole({ projectId, memberId, data: { role } })
                }
                onRemove={(memberId) => removeMember({ projectId, memberId })}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
