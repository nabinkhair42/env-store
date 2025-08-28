'use client';

import { EnvEditor } from '@/components/env-editor/index';
import { ProjectCard } from '@/components/project-card';
import { ProjectForm } from '@/components/project-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Loader from '@/components/ui/Loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/app-context';
import { useProjects } from '@/hooks/useProjects';
import { IProject } from '@/lib/types';
import { Home, Plus, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaProjectDiagram } from 'react-icons/fa';

export function Dashboard() {
  const { projects, loading, fetchProjects, deleteProject } = useProjects();
  const {
    selectedProject,
    setSelectedProject,
    showProjectForm,
    setShowProjectForm,
  } = useAppContext();
  const [activeTab, setActiveTab] = useState('projects');

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Switch to projects tab when no project is selected
  useEffect(() => {
    if (!selectedProject && activeTab === 'editor') {
      setActiveTab('projects');
    }
  }, [selectedProject, activeTab]);

  const handleProjectCreated = () => {
    fetchProjects();
    setShowProjectForm(false);
  };

  const handleProjectUpdated = () => {
    fetchProjects();
  };

  const handleProjectSelected = (project: IProject, switchToEditor = false) => {
    setSelectedProject(project);
    if (switchToEditor) {
      setActiveTab('editor');
    }
  };

  const handleProjectDeleted = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      if (selectedProject?._id === projectId) {
        setSelectedProject(null);
        setActiveTab('projects'); // Switch back to projects tab when deleting selected project
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 border border-dashed border-t-0 border-b-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6 px-4"
        >
          <TabsList className="flex w-full justify-start gap-4">
            <TabsTrigger
              value="projects"
              className="flex flex-row gap-2 items-center justify-center"
            >
              <Home className="size-3" />
              Projects
            </TabsTrigger>

            <div className="h-4 w-px bg-primary" />
            {selectedProject && (
              <TabsTrigger
                value="editor"
                className="flex flex-row gap-2 items-center justify-center"
              >
                <FaProjectDiagram className="size-3" />
                {selectedProject.name}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {/* Projects Header */}
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
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

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
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id as string}
                    project={project}
                    onSelect={(project) => handleProjectSelected(project, true)}
                    onEdit={(project) => handleProjectSelected(project, true)}
                    onDelete={handleProjectDeleted}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {selectedProject && (
            <TabsContent value="editor">
              <EnvEditor
                project={selectedProject}
                onUpdate={handleProjectUpdated}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm
          onSuccess={handleProjectCreated}
          onCancel={() => setShowProjectForm(false)}
        />
      )}
    </div>
  );
}
