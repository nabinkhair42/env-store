"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IProject } from "@/lib/models/Project";
import { Database, Download, Github, Shield, Trash2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: IProject[];
}

export function SettingsDialog({
  open,
  onOpenChange,
  projects,
}: SettingsDialogProps) {
  const { data: session } = useSession();
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportAllData = async () => {
    setExportLoading(true);
    try {
      const exportData = {
        user: {
          name: session?.user?.name,
          email: session?.user?.email,
          image: session?.user?.image,
        },
        projects: projects,
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `env-store-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setExportLoading(false);
    }
  };

  const totalVariables = projects.reduce(
    (sum: number, project: IProject) => sum + (project.variables?.length || 0),
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account, projects, and application preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account is connected via GitHub OAuth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) ||
                        session?.user?.email?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label>Name:</Label>
                      <span className="font-medium">
                        {session?.user?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Email:</Label>
                      <span className="text-sm text-muted-foreground">
                        {session?.user?.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      <Badge variant="outline">GitHub Connected</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Project Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border bg-muted">
                    <div className="text-2xl font-bold text-blue-600 ">
                      {projects.length}
                    </div>
                    <div className="text-sm text-blue-600 ">Total Projects</div>
                  </div>
                  <div className="text-center p-4 border bg-muted">
                    <div className="text-2xl font-bold text-green-600 ">
                      {totalVariables}
                    </div>
                    <div className="text-sm text-green-600 ">
                      Environment Variables
                    </div>
                  </div>
                </div>

                {projects.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">
                      Recent Projects:
                    </Label>
                    <div className="mt-2 space-y-2">
                      {projects.slice(0, 3).map((project: IProject) => (
                        <div
                          key={project._id}
                          className="flex justify-between items-center p-2  bg-muted"
                        >
                          <span className="font-medium">{project.name}</span>
                          <Badge variant="outline">
                            {project.variables?.length || 0} vars
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Export your data or manage your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Export All Data</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download a complete backup of all your projects and
                      environment variables in JSON format.
                    </p>
                    <Button
                      onClick={handleExportAllData}
                      disabled={exportLoading}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {exportLoading ? "Exporting..." : "Export All Data"}
                    </Button>
                  </div>

                  <div className="border border-destructive p-4">
                    <h4 className="font-medium mb-2 text-destructive">
                      Danger Zone
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <Button variant="destructive" className="w-full" disabled>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About ENV Store</CardTitle>
                <CardDescription>
                  Environment Variable Manager for Developers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Version:</span>
                    <Badge variant="outline">1.0.0</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Built with:</span>
                    <span className="text-sm">
                      Next.js 15, TypeScript, MongoDB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Authentication:</span>
                    <span className="text-sm">
                      NextAuth.js v5 + GitHub OAuth
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    ENV Store helps developers manage environment variables
                    across multiple devices and projects securely. Never lose
                    your environment configurations again!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
