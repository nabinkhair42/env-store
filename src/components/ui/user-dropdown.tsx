'use client';
import dynamic from 'next/dynamic';
const SettingsDialog = dynamic(
  () =>
    import('@/components/modal/SettingsDialog').then((m) => m.SettingsDialog),
  { ssr: false }
);
const LogOutDialog = dynamic(
  () => import('@/components/modal/LogOutDialog').then((m) => m.LogOutDialog),
  { ssr: false }
);
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Logo } from './Logo';

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
          <Avatar className="h-8 w-8 border cursor-pointer">
            <AvatarImage
              src={session?.user?.image || ''}
              alt={session?.user?.name || ''}
            />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex flex-col items-start">
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{session?.user?.name}</span>
              <span className="text-xs text-muted-foreground">
                {session?.user?.email}
              </span>
            </div>
          </DropdownMenuItem>
          {!isPathnameDashboard && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push('/dashboard')}
                className="cursor-pointer"
              >
                <Logo size="sm" />
                Go to Dashboard
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setShowSettingsDialog(true);
              setShowLogoutDialog(false);
            }}
            className="cursor-pointer"
          >
            <Settings />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowLogoutDialog(true)}
            className="cursor-pointer"
          >
            <LogOut />
            Logout
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
