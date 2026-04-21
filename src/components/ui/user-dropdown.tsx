'use client';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HugeiconsIcon } from '@hugeicons/react';
import { Logout01Icon, Settings01Icon } from '@hugeicons/core-free-icons';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Logo } from './logo';
const SettingsDialog = dynamic(
  () =>
    import('@/components/modal/settings-dialog').then((m) => m.SettingsDialog),
  { ssr: false }
);
const LogOutDialog = dynamic(
  () => import('@/components/modal/logout-dialog').then((m) => m.LogOutDialog),
  { ssr: false }
);

export function UserDropdown() {
  const { data: session } = useSession();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isPathnameDashboard = pathname === '/dashboard';

  return (
    <>
      <DropdownMenu key={`${showSettingsDialog}-${showLogoutDialog}`}>
        {/* This key is used to force a re-render of the dropdown menu when the dialogs are closed */}
        <DropdownMenuTrigger asChild>
          <button className="group relative cursor-pointer outline-none">
            <Avatar className="h-8 w-8 border border-border transition-colors group-hover:border-foreground/20">
              <AvatarImage
                src={session?.user?.image || ''}
                alt={session?.user?.name || ''}
              />
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2.5">
            <p className="text-sm font-semibold truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>

          {!isPathnameDashboard && (
            <>
              <DropdownMenuItem
                onClick={() => router.push('/dashboard')}
                className="cursor-pointer"
              >
                <Logo size="sm" />
                <span>Go to Dashboard</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem
            onClick={() => {
              setShowSettingsDialog(true);
              setShowLogoutDialog(false);
            }}
            className="cursor-pointer"
          >
            <HugeiconsIcon icon={Settings01Icon} size={16} />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowLogoutDialog(true)}
            className="cursor-pointer"
            variant="destructive"
          >
            <HugeiconsIcon icon={Logout01Icon} size={16} />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
      />
      <LogOutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      />
    </>
  );
}
