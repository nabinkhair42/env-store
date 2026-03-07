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
import LoaderScreen from '@/components/ui/loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjects } from '@/hooks/useProjects';
import { IProject } from '@/lib/types';
import {
  Activity,
  Database,
  Download01,
  FileText,
  Github,
  Mail01,
  User,
} from 'hugeicons-react';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { projects, loading, error, refreshProjects } = useProjects();
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
      a.download = `env-store-backup-${
        new Date().toISOString().split('T')[0]
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

    const mostRecent =
      projects.length > 0
        ? projects.sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt || 0);
            const dateB = new Date(b.updatedAt || b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
          })[0]
        : null;

    return { totalVariables, mostRecent };
  }, [projects]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-wide">
            <Activity className="h-4 w-4" />
            Settings
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-muted-foreground">
            Manage your account, projects, and application preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex gap-0 w-full justify-start p-0 bg-transparent border-y border-border">
            <TabsTrigger
              value="profile"
              className="font-mono uppercase text-xs tracking-wide data-[state=active]:bg-muted/50"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="font-mono uppercase text-xs tracking-wide data-[state=active]:bg-muted/50"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="font-mono uppercase text-xs tracking-wide data-[state=active]:bg-muted/50"
            >
              Data
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="border border-border bg-muted/10">
              <div className="border-b border-border bg-muted/20 px-6 py-4">
                <h3 className="flex items-center gap-2 font-bold uppercase tracking-wide text-sm">
                  <User className="h-4 w-4" />
                  Profile Information
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Your account is connected via GitHub OAuth
                </p>
              </div>

              <div className="p-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 border border-border">
                    <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback className="bg-muted font-bold text-lg">
                      {session?.user?.name?.charAt(0) ||
                        session?.user?.email?.charAt(0) ||
                        'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="text-lg font-bold">
                        {session?.user?.name || 'Unknown User'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail01 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-mono">
                          {session?.user?.email || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      <Badge
                        variant="outline"
                        className="font-mono text-xs border-border"
                      >
                        GitHub Connected
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="border border-border bg-muted/10">
              <div className="border-b border-border bg-muted/20 px-6 py-4">
                <h3 className="flex items-center gap-2 font-bold uppercase tracking-wide text-sm">
                  <Database className="h-4 w-4" />
                  Projects Overview
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  View your projects and their statistics
                </p>
              </div>

              <div className="p-6">
                {loading ? (
                  <LoaderScreen />
                ) : error ? (
                  <div className="text-center p-6 border border-destructive bg-destructive/10">
                    <p className="text-destructive mb-3 font-mono text-sm">
                      Failed to load projects
                    </p>
                    <Button
                      onClick={refreshProjects}
                      variant="outline"
                      size="sm"
                      className="font-mono uppercase text-xs"
                    >
                      Retry
                    </Button>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border bg-muted/20">
                    <Database className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="font-mono text-sm text-muted-foreground">
                      No projects found. Create your first project to get
                      started!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-0 border border-border">
                    <div className="p-6 border-r border-border bg-muted/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                          Total Projects
                        </span>
                      </div>
                      <div className="text-3xl font-bold tabular-nums">
                        {projects.length}
                      </div>
                    </div>
                    <div className="p-6 bg-muted/20">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                          Total Variables
                        </span>
                      </div>
                      <div className="text-3xl font-bold tabular-nums">
                        {stats.totalVariables}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-4">
            <div className="border border-border bg-muted/10">
              <div className="border-b border-border bg-muted/20 px-6 py-4">
                <h3 className="flex items-center gap-2 font-bold uppercase tracking-wide text-sm">
                  <Download01 className="h-4 w-4" />
                  Export All Data
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Download a JSON file containing all your projects and
                  environment variables.
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Export Section */}
                <Button
                  onClick={handleExportAllData}
                  disabled={exportLoading || loading || projects.length === 0}
                  className="w-full font-mono uppercase tracking-wide text-xs"
                  size="sm"
                >
                  <Download01 className="h-4 w-4 mr-2" />
                  {exportLoading ? 'Exporting...' : 'Export All Data'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
