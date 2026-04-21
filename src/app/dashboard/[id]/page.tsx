'use client';

import { EnvEditor } from '@/components/editors/index';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useProjects } from '@/hooks/use-project';
import { IProject } from '@/types/projects';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
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
      if (foundProject) {
        setProject(foundProject);
      } else {
        setProject(null);
      }
      setProjectLoading(false);
    } else if (!loading) {
      setProjectLoading(false);
    }
  }, [loading, projects, projectId]);

  const handleProjectUpdate = () => {
    fetchProjects();
  };

  const isLoading = loading || projectLoading;

  return (
    <div>
      {/* Breadcrumb — always visible to prevent layout shift */}
      <div className="mx-auto w-full max-w-4xl px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isLoading ? (
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              ) : (
                <BreadcrumbPage>
                  {project?.name || 'Not Found'}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="mx-auto w-full max-w-4xl px-6 py-12">
          <div className="flex items-center justify-center">
            <Spinner className="size-5" />
          </div>
        </div>
      ) : !project ? (
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold">Project Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The project you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <div className="mt-4">
            <Link href="/dashboard">
              <Button>
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <EnvEditor project={project} onUpdate={handleProjectUpdate} />
      )}
    </div>
  );
}
