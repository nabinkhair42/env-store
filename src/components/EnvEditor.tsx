"use client";

import { useState, useRef } from "react";
import { Plus, Upload, Download, Save, X, Copy, FileText } from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold ">{project.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {project.description || "No description"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={saveProject} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor">Variable Editor</TabsTrigger>
          <TabsTrigger value="import">Import .env</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          {/* Variables List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>
                  Add and manage your environment variables
                </CardDescription>
              </div>
              <Button onClick={addVariable} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Variable
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {variables.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>No environment variables yet.</p>
                  <Button
                    onClick={addVariable}
                    variant="outline"
                    className="mt-2"
                  >
                    Add your first variable
                  </Button>
                </div>
              ) : (
                variables.map((variable, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-start p-4 border rounded-lg"
                  >
                    <div className="col-span-3">
                      <Label htmlFor={`key-${index}`}>Key</Label>
                      <Input
                        id={`key-${index}`}
                        value={variable.key}
                        onChange={(e) =>
                          updateVariable(index, "key", e.target.value)
                        }
                        placeholder="API_KEY"
                      />
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor={`value-${index}`}>Value</Label>
                      <Input
                        id={`value-${index}`}
                        type="password"
                        value={variable.value}
                        onChange={(e) =>
                          updateVariable(index, "value", e.target.value)
                        }
                        placeholder="your-secret-value"
                      />
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor={`desc-${index}`}>
                        Description (Optional)
                      </Label>
                      <Input
                        id={`desc-${index}`}
                        value={variable.description || ""}
                        onChange={(e) =>
                          updateVariable(index, "description", e.target.value)
                        }
                        placeholder="Description of this variable"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end pt-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVariable(index)}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import from .env file</CardTitle>
              <CardDescription>
                Upload a .env file or paste the content to import multiple
                variables at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload Section */}
              <div className="space-y-2">
                <Label>Upload .env file</Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".env,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose .env file
                  </Button>
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
              <Textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={`API_KEY=your-api-key
DATABASE_URL=mongodb://localhost:27017/mydb
DEBUG=true`}
                rows={8}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setImportText("")}>
                  Clear
                </Button>
                <Button onClick={handleImport} disabled={!importText.trim()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Variables
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Environment File Preview</CardTitle>
              <CardDescription>
                Preview of your .env file as it will be generated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap min-h-40">
                {variables.filter((v) => v.key.trim()).length > 0
                  ? generateEnvFile(variables.filter((v) => v.key.trim()))
                  : "# No variables defined yet"}
              </pre>
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
