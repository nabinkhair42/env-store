"use client";

import { EnvEditor } from "@/components/EnvEditor";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectForm } from "@/components/ProjectForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from "@/hooks/useProjects";
import { useAppContext } from "@/contexts/AppContext";
import { SettingsDialog } from "@/components/SettingsDialog";
import { LogOut, Plus, Settings, Upload } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export function Dashboard() {
  const { projects, loading, fetchProjects, deleteProject } = useProjects();
  const { selectedProject, setSelectedProject, showProjectForm, setShowProjectForm } = useAppContext();
  const [showSettings, setShowSettings] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = () => {
    fetchProjects();
    setShowProjectForm(false);
    toast.success("Project created successfully");
  };

  const handleProjectUpdated = () => {
    fetchProjects();
    toast.success("Project updated successfully");
  };

  const handleProjectDeleted = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      if (selectedProject?._id === projectId) {
        setSelectedProject(null);
      }
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold ">EnvSync</h1>
              <span className="ml-2 text-sm">
                Environment Variable Manager
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  fetchProjects(); // Refresh projects before opening settings
                  setShowSettings(true);
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            {selectedProject && (
              <TabsTrigger value="editor">
                {selectedProject.name} - Editor
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {/* Projects Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Projects
                </h2>
                <p className="text-sm text-gray-600">
                  Manage your environment variables by project
                </p>
              </div>
              <Button onClick={() => setShowProjectForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Upload className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No projects yet
                  </h3>
                  <p className="text-gray-600 mb-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onSelect={setSelectedProject}
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

      {/* Settings Dialog */}
      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings}
        projects={projects}
      />
    </div>
  );
}
