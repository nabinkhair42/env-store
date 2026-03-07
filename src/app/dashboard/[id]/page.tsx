'use client';

import { EnvEditor } from '@/components/env-editor/index';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import LoaderScreen from '@/components/ui/loader';
import { useProjects } from '@/hooks/useProjects';
import { IProject } from '@/lib/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
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
        // Always update to latest from server
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
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-rails min-h-svh">
      {/* Breadcrumb Navigation */}
      <div className="rail-bounded">
        <div className="px-6 py-4">
          <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard" className="flex items-center gap-1">
                      <span>Dashboard</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{project.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <div className="section-divider" aria-hidden="true" />

      {/* Environment Editor */}
      <EnvEditor project={project} onUpdate={handleProjectUpdate} />
    </div>
  );
}
