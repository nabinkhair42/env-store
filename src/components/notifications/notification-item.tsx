'use client';

import { cn } from '@/lib/utils';
import { INotification } from '@/types';
import { useMarkRead } from '@/hooks/use-notifications';
import { useRouter } from 'next/navigation';

interface NotificationItemProps {
  notification: INotification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const { mutate: markRead } = useMarkRead();

  const handleClick = () => {
    if (!notification.read) {
      markRead(notification._id as string);
    }
    if (notification.metadata.projectId) {
      router.push(`/dashboard/${notification.metadata.projectId}`);
    }
  };

  const timeAgo = (date: Date) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-b-0',
        !notification.read && 'bg-muted/30',
      )}
    >
      <p className={cn('text-sm', !notification.read && 'font-medium')}>
        {notification.message}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {timeAgo(notification.createdAt)}
      </p>
    </button>
  );
}
