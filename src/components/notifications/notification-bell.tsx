'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useMarkAllRead,
  useNotifications,
  useUnreadCount,
} from '@/hooks/use-notifications';
import { INotification } from '@/types';
import { Notification03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useMemo, useState } from 'react';
import { NotificationItem } from './notification-item';

type Tab = 'unread' | 'all';

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <p className="px-4 py-8 text-center text-sm text-muted-foreground">
      {tab === 'unread' ? "You're all caught up" : 'No notifications yet'}
    </p>
  );
}

function NotificationList({ items }: { items: INotification[] }) {
  return (
    <div className="max-h-80 overflow-y-auto">
      {items.map((n) => (
        <NotificationItem key={n._id as string} notification={n} />
      ))}
    </div>
  );
}

export function NotificationBell() {
  const { data } = useNotifications();
  const unreadCount = useUnreadCount();
  const { mutate: markAllRead } = useMarkAllRead();
  const [tab, setTab] = useState<Tab>('unread');

  const notifications = useMemo(() => data?.notifications ?? [], [data]);
  const unread = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer"
          aria-label={
            unreadCount > 0
              ? `Notifications (${unreadCount} unread)`
              : 'Notifications'
          }
        >
          <HugeiconsIcon icon={Notification03Icon} size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
            <TabsList className="h-8">
              <TabsTrigger value="unread" className="text-xs">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1 rounded-full bg-foreground/10 px-1.5 py-px text-[10px] font-medium">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
            </TabsList>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead()}
                className="shrink-0 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <TabsContent value="unread" className="m-0">
            {unread.length === 0 ? (
              <EmptyState tab="unread" />
            ) : (
              <NotificationList items={unread} />
            )}
          </TabsContent>
          <TabsContent value="all" className="m-0">
            {notifications.length === 0 ? (
              <EmptyState tab="all" />
            ) : (
              <NotificationList items={notifications} />
            )}
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
