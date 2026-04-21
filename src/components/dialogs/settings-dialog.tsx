'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useProjects } from '@/hooks/use-projects';
import { downloadFile } from '@/lib/env-parser';
import {
  Download01Icon,
  GithubIcon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { data } = useProjects();
  const projects = data?.projects ?? [];
  const { data: session } = useSession();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = JSON.stringify(
        {
          user: {
            name: session?.user?.name,
            email: session?.user?.email,
          },
          projects,
          exportedAt: new Date().toISOString(),
        },
        null,
        2
      );
      downloadFile(data, `env-store-backup-${new Date().toISOString().split('T')[0]}.json`);
      toast.success('Data exported');
    } catch {
      toast.error('Failed to export');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Your account and data</DialogDescription>
        </DialogHeader>

        {/* Profile */}
        <div className="flex items-start gap-4">
          <Avatar className="size-12">
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-medium">
              {session?.user?.name || 'Unknown User'}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <HugeiconsIcon icon={Mail01Icon} size={14} />
              {session?.user?.email || 'N/A'}
            </p>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={GithubIcon}
                size={14}
                className="text-muted-foreground"
              />
              <Badge variant="secondary">Connected</Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Export */}
        <div>
          <h3 className="text-sm font-medium">Export All Data</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Download a JSON backup of your projects and variables
          </p>
          <Button
            onClick={handleExport}
            disabled={exporting || projects.length === 0}
            variant="outline"
            className="w-full mt-3"
          >
            <HugeiconsIcon icon={Download01Icon} size={16} />
            {exporting ? 'Exporting...' : 'Export All Data'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
