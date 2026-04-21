'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IMember } from '@/types';
import { Delete02Icon, MoreVerticalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface MemberRowProps {
  member: IMember;
  isOwner: boolean;
  onUpdateRole: (memberId: string, role: 'editor' | 'viewer') => void;
  onRemove: (memberId: string) => void;
}

export function MemberRow({ member, isOwner, onUpdateRole, onRemove }: MemberRowProps) {
  const displayName =
    member.user?.name ||
    member.invitedEmail ||
    member.invitedGithubUsername ||
    'Unknown';

  const statusColor =
    member.status === 'accepted'
      ? 'default'
      : member.status === 'pending'
        ? 'secondary'
        : 'destructive';

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarImage src={member.user?.image || ''} />
          <AvatarFallback className="text-xs">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{displayName}</p>
          {member.user?.email && member.user.email !== displayName && (
            <p className="text-xs text-muted-foreground">{member.user.email}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={statusColor}>{member.status}</Badge>
        <Badge variant="outline">{member.role}</Badge>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <HugeiconsIcon icon={MoreVerticalIcon} size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  onUpdateRole(
                    member._id as string,
                    member.role === 'editor' ? 'viewer' : 'editor',
                  )
                }
              >
                Change to {member.role === 'editor' ? 'Viewer' : 'Editor'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onRemove(member._id as string)}
                className="text-destructive"
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
