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
          {/* User Info Section */}
          <div className="px-3 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage
                  src={session?.user?.image || ''}
                  alt={session?.user?.name || ''}
                />
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">
                  {session?.user?.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {session?.user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          {!isPathnameDashboard && (
            <div className="py-1">
              <DropdownMenuItem
                onClick={() => router.push('/dashboard')}
                className="cursor-pointer"
              >
                <Logo size="sm" />
                <span>Go to Dashboard</span>
              </DropdownMenuItem>
            </div>
          )}

          {/* Settings & Logout */}
          <div className="border-t border-border py-1">
            <DropdownMenuItem
              onClick={() => {
                setShowSettingsDialog(true);
                setShowLogoutDialog(false);
              }}
              className="cursor-pointer hover:bg-muted"
            >
              <HugeiconsIcon icon={Settings01Icon} size={16} />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowLogoutDialog(true)}
              className="cursor-pointer hover:bg-muted"
              variant="destructive"
            >
              <HugeiconsIcon icon={Logout01Icon} size={16} />
              <span>Logout</span>
            </DropdownMenuItem>
          </div>
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
