'use client';

import { ProjectCard } from '@/components/dashboard/project-card';
import { ProjectForm } from '@/components/dashboard/project-form';
import { Button } from '@/components/ui/button';
import LoaderScreen from '@/components/ui/loader';
import { useAppContext } from '@/contexts/app-context';
import { useProjects } from '@/hooks/useProjects';
import { IProject } from '@/lib/types';
import { FileText, Plus } from 'lucide-react';
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
      <div className="page-rails min-h-svh">
        {/* Header Section */}
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
                <Plus className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">
                  New Project
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Projects List */}
        <div className="section-divider" aria-hidden="true" />

        {projects.length === 0 ? (
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="flex min-h-[400px] items-center justify-center py-16">
              <div className="space-y-6 text-center">
                <div className="mx-auto inline-flex size-14 items-center justify-center rounded-xl border border-border bg-muted/30 text-muted-foreground">
                  <FileText className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold uppercase tracking-wide">
                    No Projects Yet
                  </h3>
                  <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                    Create your first project to start managing environment
                    variables
                  </p>
                </div>
                <Button onClick={() => setShowProjectForm(true)}>
                  <Plus className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wide">
                    Create Project
                  </span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rail-bounded">
            {projects.map((project, index) => (
              <div key={project._id as string}>
                {index > 0 && (
                  <div className="h-px bg-border" aria-hidden="true" />
                )}
                <ProjectCard
                  project={project}
                  onSelect={handleProjectSelected}
                  onEdit={handleProjectSelected}
                  onDelete={handleProjectDeleted}
                />
              </div>
            ))}
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
