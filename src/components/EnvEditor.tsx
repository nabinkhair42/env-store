"use client";

import { useState, useRef } from "react";
import {
  Plus,
  Upload,
  Download,
  Save,
  X,
  Copy,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { IProject } from "@/lib/models/Project";
import { EnvVariable } from "@/lib/validations/project";
import {
  parseEnvFile,
  generateEnvFile,
  downloadFile,
} from "@/lib/utils/env-parser";
import { useProjects } from "@/hooks/useProjects";

interface EnvEditorProps {
  project: IProject;
  onUpdate: () => void;
}

export function EnvEditor({ project, onUpdate }: EnvEditorProps) {
  const { updateProject, loading } = useProjects();
  const [variables, setVariables] = useState<EnvVariable[]>(
    project.variables || []
  );
  const [importText, setImportText] = useState("");
  const [visibleValues, setVisibleValues] = useState<Set<number>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    index: number;
    varName: string;
  }>({
    open: false,
    index: -1,
    varName: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addVariable = () => {
    setVariables((prev) => [...prev, { key: "", value: "", description: "" }]);
  };

  const updateVariable = (
    index: number,
    field: keyof EnvVariable,
    value: string
  ) => {
    setVariables((prev) =>
      prev.map((variable, i) =>
        i === index ? { ...variable, [field]: value } : variable
      )
    );
  };

  const toggleValueVisibility = (index: number) => {
    setVisibleValues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleDeleteVariable = (index: number) => {
    const variable = variables[index];
    setDeleteConfirm({
      open: true,
      index,
      varName: variable.key || `Variable ${index + 1}`,
    });
  };

  const confirmDeleteVariable = () => {
    setVariables((prev) => prev.filter((_, i) => i !== deleteConfirm.index));
    setDeleteConfirm({ open: false, index: -1, varName: "" });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportText(content);
      };
      reader.readAsText(file);
    }
  };

  const saveProject = async () => {
    try {
      await updateProject(project._id!, {
        variables: variables.filter((v) => v.key.trim()),
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  const handleImport = () => {
    try {
      const parsed = parseEnvFile(importText);
      const newVariables = parsed.map((p) => ({ ...p, description: "" }));
      setVariables((prev) => [...prev, ...newVariables]);
      setImportText("");
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Failed to import variables: ${error.message}`
          : "Failed to import variables: Unknown error"
      );
    }
  };

  const handleDownload = () => {
    try {
      const envContent = generateEnvFile(variables.filter((v) => v.key.trim()));
      downloadFile(envContent, `${project.name}.env`);
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Failed to download environment file: ${error.message}`
          : "Failed to download environment file: Unknown error"
      );
    }
  };

  const copyToClipboard = async () => {
    try {
      const envContent = generateEnvFile(variables.filter((v) => v.key.trim()));
      await navigator.clipboard.writeText(envContent);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Vercel-inspired design */}
      <div className="border-b pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {project.name}
            </h1>
            <p className="text-muted-foreground">
              {project.description ||
                "Manage environment variables for this project"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Export .env
            </Button>
            <Button
              size="sm"
              onClick={saveProject}
              disabled={loading}
              className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="editor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="editor" className="text-sm">
            Variables
          </TabsTrigger>
          <TabsTrigger value="import" className="text-sm">
            Import
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-sm">
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          {/* Stats Card */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {variables.filter((v) => v.key.trim()).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active Variables
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {variables.filter((v) => !v.key.trim()).length}
                </div>
                <p className="text-xs text-muted-foreground">Draft Variables</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {variables.filter((v) => v.description?.trim()).length}
                </div>
                <p className="text-xs text-muted-foreground">Documented</p>
              </CardContent>
            </Card>
          </div>

          {/* Variables List */}
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    Environment Variables
                  </CardTitle>
                  <CardDescription>
                    Manage your application's environment configuration
                  </CardDescription>
                </div>
                <Button onClick={addVariable} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variable
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {variables.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No variables configured
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your first environment variable
                  </p>
                  <Button onClick={addVariable} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first variable
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {variables.map((variable, index) => (
                    <div
                      key={index}
                      className="group relative border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="grid gap-4 md:grid-cols-12 items-start">
                        {/* Key Field */}
                        <div className="md:col-span-3 space-y-2">
                          <Label
                            htmlFor={`key-${index}`}
                            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                          >
                            Variable Name
                          </Label>
                          <Input
                            id={`key-${index}`}
                            value={variable.key}
                            onChange={(e) =>
                              updateVariable(index, "key", e.target.value)
                            }
                            placeholder="API_KEY"
                            className="font-mono text-sm"
                          />
                        </div>

                        {/* Value Field with Preview */}
                        <div className="md:col-span-4 space-y-2">
                          <Label
                            htmlFor={`value-${index}`}
                            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                          >
                            Value
                          </Label>
                          <div className="relative">
                            <Input
                              id={`value-${index}`}
                              type={
                                visibleValues.has(index) ? "text" : "password"
                              }
                              value={variable.value}
                              onChange={(e) =>
                                updateVariable(index, "value", e.target.value)
                              }
                              placeholder="your-secret-value"
                              className="font-mono text-sm pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => toggleValueVisibility(index)}
                            >
                              {visibleValues.has(index) ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Description Field */}
                        <div className="md:col-span-4 space-y-2">
                          <Label
                            htmlFor={`desc-${index}`}
                            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                          >
                            Description
                          </Label>
                          <Input
                            id={`desc-${index}`}
                            value={variable.description || ""}
                            onChange={(e) =>
                              updateVariable(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="What this variable is used for"
                            className="text-sm"
                          />
                        </div>

                        {/* Actions */}
                        <div className="md:col-span-1 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteVariable(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Variable Status Indicator */}
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        {variable.key.trim() && variable.value.trim() && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        {variable.key.trim() && !variable.value.trim() && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        )}
                        {!variable.key.trim() && (
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Import Variables</CardTitle>
              <CardDescription>
                Import environment variables from a .env file or paste content
                directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Upload .env File</Label>
                <div className="border border-dashed rounded-lg p-6 transition-colors hover:bg-muted/50">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".env,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mb-2"
                    >
                      Choose .env file
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      or drag and drop your .env file here
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or paste content
                  </span>
                </div>
              </div>

              {/* Manual Paste Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Environment Variables Content
                </Label>
                <Textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={`# Paste your .env content here
API_KEY=your-api-key-here
DATABASE_URL=mongodb://localhost:27017/mydb
DEBUG=true
NODE_ENV=development`}
                  className="font-mono text-sm min-h-[200px] resize-none"
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {
                      importText
                        .split("\n")
                        .filter((line) => line.trim() && !line.startsWith("#"))
                        .length
                    }{" "}
                    variables detected
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setImportText("")}
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleImport}
                      disabled={!importText.trim()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import Variables
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    Environment File Preview
                  </CardTitle>
                  <CardDescription>
                    Preview your .env file as it will be generated and exported
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute top-3 right-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {variables.filter((v) => v.key.trim()).length} variables
                  </span>
                  <span>•</span>
                  <span>.env format</span>
                </div>
                <pre className="bg-muted/50 border rounded-lg p-4 text-sm font-mono whitespace-pre-wrap min-h-[300px] overflow-auto">
                  {variables.filter((v) => v.key.trim()).length > 0
                    ? generateEnvFile(variables.filter((v) => v.key.trim()))
                    : `# No variables defined yet
# Add some environment variables in the Variables tab to see them here

# Example:
# API_KEY=your-api-key-here
# DATABASE_URL=your-database-url
# DEBUG=true`}
                </pre>
              </div>

              {variables.filter((v) => v.key.trim()).length > 0 && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-dashed">
                  <h4 className="text-sm font-medium mb-2">Quick Stats</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total: </span>
                      <span className="font-medium">
                        {variables.filter((v) => v.key.trim()).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        With values:{" "}
                      </span>
                      <span className="font-medium">
                        {
                          variables.filter(
                            (v) => v.key.trim() && v.value.trim()
                          ).length
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Documented:{" "}
                      </span>
                      <span className="font-medium">
                        {variables.filter((v) => v.description?.trim()).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">File size: </span>
                      <span className="font-medium">
                        {
                          generateEnvFile(variables.filter((v) => v.key.trim()))
                            .length
                        }{" "}
                        bytes
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Variable Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title="Delete Environment Variable"
        description={`Are you sure you want to delete the variable "${deleteConfirm.varName}"? This action cannot be undone.`}
        confirmText="Delete Variable"
        onConfirm={confirmDeleteVariable}
        variant="destructive"
      />
    </div>
  );
}
