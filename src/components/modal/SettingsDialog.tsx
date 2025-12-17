'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjects } from '@/hooks/useProjects';
import { IProject } from '@/lib/types';
import { Download, Github } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import LoaderScreen from '../ui/loader';

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

  const totalVariables = projects.reduce(
    (sum: number, project: IProject) => sum + (project.variables?.length || 0),
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account, projects, and application preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="flex gap-4 w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="projects">Projects Stats</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="p-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account is connected via GitHub OAuth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border border-primary">
                    <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) ||
                        session?.user?.email?.charAt(0) ||
                        'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label>Name:</Label>
                      <span className="font-medium">
                        {session?.user?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Email:</Label>
                      <span className="text-sm text-muted-foreground">
                        {session?.user?.email || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      <Badge variant="outline">GitHub Connected</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card className="p-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Projects Stats
                </CardTitle>
                <CardDescription>
                  View your projects and their statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoaderScreen />
                ) : error ? (
                  <div className="text-center p-4">
                    <p className="text-destructive mb-2">
                      Failed to load projects
                    </p>
                    <Button
                      onClick={refreshProjects}
                      variant="outline"
                      size="sm"
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border bg-muted">
                        <div className="text-2xl font-medium text-blue-600 ">
                          {projects.length}
                        </div>
                        <div className="text-sm text-blue-600 ">
                          Total Projects
                        </div>
                      </div>
                      <div className="text-center p-4 border bg-muted">
                        <div className="text-2xl font-medium text-green-600 ">
                          {totalVariables}
                        </div>
                        <div className="text-sm text-green-600 ">
                          Environment Variables
                        </div>
                      </div>
                    </div>

                    {projects.length === 0 && (
                      <div className="text-center p-4 text-muted-foreground">
                        No projects found. Create your first project to get
                        started!
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card className="p-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Data Management
                </CardTitle>
                <CardDescription>
                  Export your data or manage your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleExportAllData}
                  disabled={exportLoading || loading || projects.length === 0}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exportLoading ? 'Exporting...' : 'Export All Data'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
