'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInviteMember } from '@/hooks/use-members';
import { useUserSearch } from '@/hooks/use-user-search';
import { Tick01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';

interface InviteFormProps {
  projectId: string;
}

export function InviteForm({ projectId }: InviteFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('viewer');
  const { mutateAsync: invite, isPending } = useInviteMember();
  const { data, isFetching } = useUserSearch(identifier);

  const foundUser = data?.user ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    try {
      await invite({ projectId, data: { identifier: identifier.trim(), role } });
      setIdentifier('');
    } catch {
      // Error handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="identifier">GitHub username or email</Label>
        <Input
          id="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="username or user@email.com"
          disabled={isPending}
        />
      </div>

      {/* User preview */}
      {identifier.length >= 2 && (
        <div className="rounded-md border px-3 py-2.5">
          {isFetching ? (
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-muted animate-pulse" />
              <div className="h-3 w-28 rounded bg-muted animate-pulse" />
            </div>
          ) : foundUser ? (
            <div className="flex items-center gap-2.5">
              <Avatar className="size-6">
                <AvatarImage src={foundUser.image || ''} />
                <AvatarFallback className="text-[10px]">
                  {(foundUser.name || '?').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium truncate">{foundUser.name}</p>
                  {foundUser.source === 'github' && (
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      GitHub
                    </Badge>
                  )}
                </div>
                {foundUser.email && (
                  <p className="text-xs text-muted-foreground truncate">
                    {foundUser.email}
                  </p>
                )}
              </div>
              <HugeiconsIcon
                icon={Tick01Icon}
                size={14}
                className="text-emerald-500 shrink-0"
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No user found with this username or email
            </p>
          )}
        </div>
      )}

      <ButtonGroup>
        <Select
          value={role}
          onValueChange={(v) => setRole(v as 'editor' | 'viewer')}
          disabled={isPending}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={isPending || !identifier.trim()} size="sm">
          {isPending ? 'Sending...' : 'Send Invite'}
        </Button>
      </ButtonGroup>
    </form>
  );
}
