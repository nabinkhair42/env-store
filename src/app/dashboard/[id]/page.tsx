'use client';

import { EnvEditor } from '@/components/env-editor/index';
import LoaderScreen from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { IProject } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProjectPage() {
  const params = useParams();
  const { projects, loading, fetchProjects } = useProjects();
  const [project, setProject] = useState<IProject | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);

  const projectId = params.id as string;

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (!loading && projects.length > 0) {
      const foundProject = projects.find((p) => p._id === projectId);
      setProject(foundProject || null);
      setProjectLoading(false);
    } else if (!loading) {
      setProjectLoading(false);
    }
  }, [loading, projects, projectId]);

  const handleProjectUpdate = () => {
    fetchProjects();
  };

  if (loading || projectLoading) {
    return <LoaderScreen />;
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-svh max-w-4xl mx-auto border border-dashed border-t-0 border-b-0">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Project Not Found
          </h1>
          <p className="text-muted-foreground">
            The project you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Link href="/dashboard">
            <Button>
              <ChevronLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh">
      <div className="max-w-4xl mx-auto py-8 border border-dashed border-t-0 border-b-0">
        <div className="space-y-6">
          {/* Back Navigation */}
          <div className="flex items-center gap-4 px-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>

          {/* Environment Editor */}
          <EnvEditor project={project} onUpdate={handleProjectUpdate} />
        </div>
      </div>
    </div>
  );
}
