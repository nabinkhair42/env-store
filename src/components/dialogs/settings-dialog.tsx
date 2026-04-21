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
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjects } from '@/hooks/use-projects';
import { IProject } from '@/types';
import {
  Download01Icon,
  GithubIcon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { data: projects = [], isLoading: loading, error, refetch: fetchProjects } = useProjects();
  const { data: session } = useSession();
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportAllData = async () => {
    setExportLoading(true);
    try {
      const exportData = {
        user: {
          name: session?.user?.name,
          email: session?.user?.email,
          image: session?.user?.image,
        },
        projects: projects,
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `env-store-backup-${new Date().toISOString().split('T')[0]
        }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (_error) {
      toast.error('Failed to export data');
    } finally {
      setExportLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalVariables = projects.reduce(
      (sum: number, project: IProject) =>
        sum + (project.variables?.length || 0),
      0
    );

    return { totalVariables };
  }, [projects]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account, projects, and data
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Profile Information</h3>
              <p className="text-sm text-muted-foreground">
                Your account is connected via GitHub OAuth
              </p>
            </div>
            <Separator />
            <div className="flex items-start gap-4">
              <Avatar className="size-14">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) ||
                    session?.user?.email?.charAt(0) ||
                    'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-medium">
                    {session?.user?.name || 'Unknown User'}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={Mail01Icon} size={14} />
                    {session?.user?.email || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={GithubIcon}
                    size={14}
                    className="text-muted-foreground"
                  />
                  <Badge variant="secondary">Connected</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Projects Overview</h3>
              <p className="text-sm text-muted-foreground">
                Your projects and their statistics
              </p>
            </div>
            <Separator />
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Spinner className="size-5" />
              </div>
            ) : error ? (
              <div className="text-center py-6">
                <p className="text-sm text-destructive mb-3">
                  Failed to load projects
                </p>
                <Button
                  onClick={() => fetchProjects()}
                  variant="outline"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            ) : projects.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No projects yet. Create your first project to get started.
              </p>
            ) : (
              <div className="flex gap-8">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Projects</p>
                  <p className="text-2xl font-semibold tabular-nums">
                    {projects.length}
                  </p>
                </div>
                <Separator orientation="vertical" className="h-auto" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Variables
                  </p>
                  <p className="text-2xl font-semibold tabular-nums">
                    {stats.totalVariables}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Export All Data</h3>
              <p className="text-sm text-muted-foreground">
                Download a JSON backup of all your projects and variables
              </p>
            </div>
            <Separator />
            <Button
              onClick={handleExportAllData}
              disabled={exportLoading || loading || projects.length === 0}
              variant="outline"
              className="w-full"
            >
              <HugeiconsIcon icon={Download01Icon} size={16} />
              {exportLoading ? 'Exporting...' : 'Export All Data'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
