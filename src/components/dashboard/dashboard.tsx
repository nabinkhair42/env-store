'use client';

import { ProjectCard } from '@/components/dashboard/project-card';
import { ProjectForm } from '@/components/dashboard/project-form';
import { Button } from '@/components/ui/button';
import { ItemGroup } from '@/components/ui/item';
import LoaderScreen from '@/components/ui/loader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/contexts/app-context';
import { useProjects } from '@/hooks/use-project';
import { IProject } from '@/types/projects';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function Dashboard() {
  const { projects, loading, fetchProjects, deleteProject } = useProjects();
  const { showProjectForm, setShowProjectForm } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = () => {
    fetchProjects();
    setShowProjectForm(false);
  };

  const handleProjectSelected = (project: IProject) => {
    router.push(`/dashboard/${project._id}`);
  };

  const handleProjectDeleted = async (projectId: string) => {
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (loading) {
    return <LoaderScreen />;
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-6">
        {/* Header */}
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
          {projects.length > 0 && (
            <Button
              onClick={() => setShowProjectForm(true)}
              className="w-full md:w-auto"
            >
              <HugeiconsIcon icon={Add01Icon} size={16} />
              New Project
            </Button>
          )}
        </div>

        {/* Content */}
        {projects.length === 0 ? (
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
                    onSelect={handleProjectSelected}
                    onEdit={handleProjectSelected}
                    onDelete={handleProjectDeleted}
                  />
                </div>
              ))}
            </ItemGroup>
          </ScrollArea>
        )}
      </div>

      {showProjectForm && (
        <ProjectForm
          onSuccess={handleProjectCreated}
          onCancel={() => setShowProjectForm(false)}
        />
      )}
    </>
  );
}
