'use client';

import { ProjectCard } from '@/components/project-card';
import { ProjectForm } from '@/components/project-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LoaderScreen from '@/components/ui/loader';
import { useAppContext } from '@/contexts/app-context';
import { useProjects } from '@/hooks/useProjects';
import { IProject } from '@/lib/types';
import { Plus, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function Dashboard() {
  const { projects, loading, fetchProjects, deleteProject } = useProjects();
  const { showProjectForm, setShowProjectForm } = useAppContext();
  const router = useRouter();

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = () => {
    fetchProjects();
    setShowProjectForm(false);
  };

  const handleProjectSelected = (project: IProject) => {
    // Navigate to the dynamic project page
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
      <div className="max-w-4xl mx-auto py-8 border border-dashed border-t-0 border-b-0 min-h-svh">
        <div className="space-y-6 px-4">
          {/* Projects Header */}
          {projects.length > 0 && (
            <div className="flex-col md:flex-row flex items-start gap-4 md:justify-between">
              <div>
                <h2 className="text-lg font-semibold ">Your Projects</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your environment variables by project
                </p>
              </div>
              <Button
                onClick={() => setShowProjectForm(true)}
                className="w-full md:w-auto"
              >
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </div>
          )}

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Upload className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium  mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first project to start managing environment
                  variables
                </p>
                <Button onClick={() => setShowProjectForm(true)}>
                  <Plus className="h-4 w-4" />
                  Create Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id as string}
                  project={project}
                  onSelect={handleProjectSelected}
                  onEdit={handleProjectSelected}
                  onDelete={handleProjectDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm
          onSuccess={handleProjectCreated}
          onCancel={() => setShowProjectForm(false)}
        />
      )}
    </>
  );
}
