'use client';

import { ProjectCard } from '@/components/dashboard/project-card';
import { ProjectForm } from '@/components/dashboard/project-form';
import { Button } from '@/components/ui/button';
import { ItemGroup } from '@/components/ui/item';
import LoaderScreen from '@/components/ui/loader';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/contexts/app-context';
import { useProjects } from '@/hooks/useProjects';
import { IProject } from '@/lib/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
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
      <div className="min-h-svh">
        {/* Header */}
        <div className="mx-auto w-full max-w-4xl px-6 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Dashboard
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Your Projects
              </h1>
              <p className="text-sm text-muted-foreground">
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
        </div>

        {/* Projects List */}
        <Separator />

        {projects.length === 0 ? (
          <div className="mx-auto w-full max-w-4xl px-6 mt-6">
            <div className="flex min-h-100 items-center justify-center py-16">
              <div className="space-y-4 text-center">
                <h3 className="text-base font-semibold">No Projects Yet</h3>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                  Create your first project to start managing environment
                  variables
                </p>
                <Button onClick={() => setShowProjectForm(true)}>
                  <HugeiconsIcon icon={Add01Icon} size={16} />
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-4xl px-6 mt-6">
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
          </div>
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
