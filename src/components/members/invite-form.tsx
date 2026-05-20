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
import { InviteEmailStatus } from '@/types';
import { Copy01Icon, Tick01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface InviteFormProps {
  projectId: string;
}

interface LastInvite {
  url: string;
  emailStatus: InviteEmailStatus;
  identifier: string;
}

const EMAIL_STATUS_COPY: Record<InviteEmailStatus, { variant: 'default' | 'secondary' | 'destructive'; text: string }> = {
  sent: { variant: 'default', text: 'Email sent' },
  failed: { variant: 'destructive', text: "Email couldn't be sent — share the link below" },
  disabled: { variant: 'secondary', text: 'Email delivery is off — share the link below' },
  no_email: { variant: 'secondary', text: 'No email on file — share the link below' },
};

export function InviteForm({ projectId }: InviteFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('viewer');
  const [lastInvite, setLastInvite] = useState<LastInvite | null>(null);
  const [copied, setCopied] = useState(false);
  const { mutateAsync: invite, isPending } = useInviteMember();
  const { data, isFetching } = useUserSearch(identifier);

  const foundUser = data?.user ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = identifier.trim();
    if (!value) return;

    try {
      const res = await invite({ projectId, data: { identifier: value, role } });
      if (res.inviteUrl) {
        setLastInvite({
          url: res.inviteUrl,
          emailStatus: res.emailStatus ?? 'no_email',
          identifier: value,
        });
        setCopied(false);
      }
      setIdentifier('');
    } catch {
      // Error toast handled in hook
    }
  };

  const handleCopy = async () => {
    if (!lastInvite) return;
    try {
      await navigator.clipboard.writeText(lastInvite.url);
      setCopied(true);
      toast.success('Invite link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
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

      {lastInvite && (
        <div className="space-y-2 rounded-md border bg-muted/30 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium">
              Invited <span className="font-semibold">{lastInvite.identifier}</span>
            </p>
            <Badge variant={EMAIL_STATUS_COPY[lastInvite.emailStatus].variant} className="text-[10px]">
              {EMAIL_STATUS_COPY[lastInvite.emailStatus].text}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Input
              value={lastInvite.url}
              readOnly
              className="h-8 text-xs"
              onFocus={(e) => e.target.select()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 shrink-0"
            >
              <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} size={14} />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Share this link with the invitee — works even if they didn&apos;t get the email.
          </p>
        </div>
      )}
    </form>
  );
}
