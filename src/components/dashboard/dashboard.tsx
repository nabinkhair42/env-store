'use client';

import { ProjectCard } from '@/components/dashboard/project-card';
import { ProjectForm } from '@/components/dashboard/project-form';
import { Button } from '@/components/ui/button';
import { ItemGroup } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { useAppContext } from '@/contexts/app-context';
import { useProjects, useDeleteProject } from '@/hooks/use-projects';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';

export function Dashboard() {
  const { data: projects, isLoading } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const { showProjectForm, setShowProjectForm } = useAppContext();
  const router = useRouter();

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="flex flex-col gap-4 py-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Your Projects
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage environment variables by project
            </p>
          </div>
          {!isLoading && projects && projects.length > 0 && (
            <Button
              onClick={() => setShowProjectForm(true)}
              className="w-full md:w-auto"
            >
              <HugeiconsIcon icon={Add01Icon} size={16} />
              New Project
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-5" />
          </div>
        ) : !projects || projects.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">
              No projects yet. Create one to get started.
            </p>
            <div className="mt-4">
              <Button onClick={() => setShowProjectForm(true)}>
                <HugeiconsIcon icon={Add01Icon} size={16} />
                Create Project
              </Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100svh-220px)]">
            <ItemGroup>
              {projects.map((project) => (
                <div key={project._id as string}>
                  <ProjectCard
                    project={project}
                    onSelect={(p) => router.push(`/dashboard/${p._id}`)}
                    onDelete={(id) => deleteProject(id)}
                  />
                </div>
              ))}
            </ItemGroup>
          </ScrollArea>
        )}
      </div>

      {showProjectForm && (
        <ProjectForm
          onSuccess={() => setShowProjectForm(false)}
          onCancel={() => setShowProjectForm(false)}
        />
      )}
    </>
  );
}
