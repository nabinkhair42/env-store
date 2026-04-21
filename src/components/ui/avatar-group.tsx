'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarGroupItem {
  name: string | null;
  image: string | null;
}

interface AvatarGroupProps {
  items: AvatarGroupItem[];
  max?: number;
  size?: 'sm' | 'md';
}

export function AvatarGroup({ items, max = 3, size = 'sm' }: AvatarGroupProps) {
  if (items.length === 0) return null;

  const visible = items.slice(0, max);
  const overflow = items.length - max;

  const sizeClass = size === 'sm' ? 'size-6 text-[10px]' : 'size-8 text-xs';

  return (
    <div className="flex -space-x-1.5">
      {visible.map((item, i) => (
        <Avatar
          key={i}
          className={cn(sizeClass, 'ring-2 ring-background')}
        >
          <AvatarImage src={item.image || ''} />
          <AvatarFallback className={cn(sizeClass, 'font-medium')}>
            {(item.name || '?').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            sizeClass,
            'flex items-center justify-center rounded-full bg-muted ring-2 ring-background font-medium text-muted-foreground',
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
