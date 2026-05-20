'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useRespondToInvite } from '@/hooks/use-members';
import {
  useDismissNotification,
  useMarkRead,
  useMarkUnread,
} from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';
import { INotification } from '@/types';
import {
  Delete02Icon,
  Mail01Icon,
  MailOpen02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { memo, useCallback, type MouseEvent } from 'react';

interface NotificationItemProps {
  notification: INotification;
}

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function stop(e: MouseEvent) {
  e.stopPropagation();
}

function NotificationItemImpl({ notification }: NotificationItemProps) {
  const router = useRouter();
  const { mutate: markRead } = useMarkRead();
  const { mutate: markUnread } = useMarkUnread();
  const { mutate: dismiss } = useDismissNotification();
  const { mutate: respond, isPending: respondPending, variables: respondVars } =
    useRespondToInvite();

  const id = notification._id as string;
  const isInvite =
    notification.type === 'invite' && !!notification.metadata.memberId;
  const pendingAction = respondPending ? respondVars?.data.action : undefined;

  const handleBodyClick = useCallback(() => {
    if (!notification.read) markRead(id);
    // Invite notifications act via the inline buttons. Other types still
    // navigate to the related project.
    if (!isInvite && notification.metadata.projectId) {
      router.push(`/dashboard/${notification.metadata.projectId}`);
    }
  }, [notification, isInvite, id, markRead, router]);

  const handleToggleRead = (e: MouseEvent) => {
    e.stopPropagation();
    if (notification.read) markUnread(id);
    else markRead(id);
  };

  const handleDismiss = (e: MouseEvent) => {
    e.stopPropagation();
    dismiss(id);
  };

  const handleRespond = (action: 'accept' | 'decline') => {
    const memberId = notification.metadata.memberId;
    if (!memberId) return;
    respond(
      { memberId, data: { action } },
      {
        onSuccess: () => {
          // Action complete — remove the actionable notification entirely.
          dismiss(id);
        },
      },
    );
  };

  return (
    <div
      className={cn(
        'group/notif relative border-b last:border-b-0 transition-colors',
        !notification.read && 'bg-muted/30',
        'hover:bg-muted/50',
      )}
    >
      <button
        type="button"
        onClick={handleBodyClick}
        className="w-full px-4 py-3 text-left cursor-pointer"
      >
        <div className="flex items-start gap-2 pr-14">
          {!notification.read && (
            <span
              aria-label="Unread"
              className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className={cn('text-sm', !notification.read && 'font-medium')}>
              {notification.message}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {timeAgo(notification.createdAt)}
            </p>
          </div>
        </div>
      </button>

      <div
        className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/notif:opacity-100 focus-within:opacity-100"
        onClick={stop}
      >
        <Button
          variant="ghost"
          size="icon"
          className="size-7 cursor-pointer"
          onClick={handleToggleRead}
          aria-label={notification.read ? 'Mark as unread' : 'Mark as read'}
          title={notification.read ? 'Mark as unread' : 'Mark as read'}
        >
          <HugeiconsIcon
            icon={notification.read ? Mail01Icon : MailOpen02Icon}
            size={14}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 cursor-pointer text-muted-foreground hover:text-destructive"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          title="Dismiss"
        >
          <HugeiconsIcon icon={Delete02Icon} size={14} />
        </Button>
      </div>

      {isInvite && (
        <div className="flex items-center gap-2 px-4 pb-3" onClick={stop}>
          <Button
            size="sm"
            variant="outline"
            className="h-7 flex-1 cursor-pointer"
            disabled={respondPending}
            onClick={() => handleRespond('decline')}
          >
            {pendingAction === 'decline' ? <Spinner /> : null}
            Decline
          </Button>
          <Button
            size="sm"
            className="h-7 flex-1 cursor-pointer"
            disabled={respondPending}
            onClick={() => handleRespond('accept')}
          >
            {pendingAction === 'accept' ? <Spinner /> : null}
            Accept
          </Button>
        </div>
      )}
    </div>
  );
}

export const NotificationItem = memo(NotificationItemImpl);
