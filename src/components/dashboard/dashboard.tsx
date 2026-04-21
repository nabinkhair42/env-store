'use client';

import { ProjectCard } from '@/components/dashboard/project-card';
import { ProjectForm } from '@/components/dashboard/project-form';
import { DashboardSkeleton } from '@/components/loaders';
import { Button } from '@/components/ui/button';
import { ItemGroup } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/contexts/app-context';
import { useDeleteProject, useProjects } from '@/hooks/use-projects';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';

export function Dashboard() {
  const { data, isLoading } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const { showProjectForm, setShowProjectForm } = useAppContext();
  const router = useRouter();

  const projects = data?.projects ?? [];
  const sharedProjects = data?.sharedProjects ?? [];
  const hasProjects = projects.length > 0 || sharedProjects.length > 0;

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
          {!isLoading && hasProjects && (
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
          <DashboardSkeleton />
        ) : !hasProjects ? (
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
          <div className="relative">
            {/* Top fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-6 bg-gradient-to-b from-background to-transparent" />
            {/* Bottom fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-16 bg-gradient-to-t from-background to-transparent" />

          <ScrollArea className="h-[calc(100svh-220px)]">
            <div className="py-4">
            {/* My Projects */}
            {projects.length > 0 && (
              <div>
                {sharedProjects.length > 0 && (
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    My Projects
                  </p>
                )}
                <ItemGroup>
                  {projects.map((project) => (
                    <div key={project._id as string}>
                      <ProjectCard
                        project={project}
                        role="owner"
                        onSelect={(p) => router.push(`/dashboard/${p._id}`)}
                        onDelete={(id) => deleteProject(id)}
                      />
                    </div>
                  ))}
                </ItemGroup>
              </div>
            )}

            {/* Shared with Me */}
            {sharedProjects.length > 0 && (
              <div className={projects.length > 0 ? 'mt-8' : ''}>
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  Shared with Me
                </p>
                <ItemGroup>
                  {sharedProjects.map((project) => (
                    <div key={project._id as string}>
                      <ProjectCard
                        project={project}
                        role={project.memberRole ?? 'viewer'}
                        onSelect={(p) => router.push(`/dashboard/${p._id}`)}
                        onDelete={(id) => deleteProject(id)}
                      />
                    </div>
                  ))}
                </ItemGroup>
              </div>
            )}
            </div>
          </ScrollArea>
          </div>
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
