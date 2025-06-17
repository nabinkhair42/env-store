"use client";

import { EnvEditor } from "@/components/EnvEditor";
import { LogOutDialog } from "@/components/LogOutDialog";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectForm } from "@/components/ProjectForm";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AppContext";
import { useProjects } from "@/hooks/useProjects";
import { IProject } from "@/lib/models/Project";
import { LogOut, Plus, Settings, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";
import { ModeSwitcher } from "./ui/mode";

export function Dashboard() {
  const { projects, loading, fetchProjects, deleteProject } = useProjects();
  const {
    selectedProject,
    setSelectedProject,
    showProjectForm,
    setShowProjectForm,
  } = useAppContext();
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Switch to projects tab when no project is selected
  useEffect(() => {
    if (!selectedProject && activeTab === "editor") {
      setActiveTab("projects");
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
      setActiveTab("editor");
    }
  };

  const handleProjectDeleted = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      if (selectedProject?._id === projectId) {
        setSelectedProject(null);
        setActiveTab("projects"); // Switch back to projects tab when deleting selected project
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold ">EnvSync</h1>
              <span className="ml-2 text-sm">Environment Variable Manager</span>
            </div>
            <div className="flex items-center gap-4">
              <ModeSwitcher />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                <h2 className="text-lg font-semibold ">Your Projects</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your environment variables by project
                </p>
              </div>
              <Button onClick={() => setShowProjectForm(true)} variant={"link"}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onSelect={(project) => handleProjectSelected(project, false)}
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

      {/* Settings Dialog */}
      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        projects={projects}
      />

      {/* Logout Dialog */}
      <LogOutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      />
    </div>
  );
}
