"use client";

import { ConfirmDialog } from "@/components/modal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useFileImport } from "@/hooks/useFileImport";
import { useProjects } from "@/hooks/useProjects";
import { useVariableManager } from "@/hooks/useVariables";
import { useVisibilityToggle } from "@/hooks/useVisibilityToggle";
import { IProject } from "@/lib/models/Project";
import { downloadFile, generateEnvFile } from "@/lib/utils/env-parser";
import { AlertCircle, Check, Copy, Download, Loader2, Save } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ImportSection } from "./ImportSection";
import { VariableStats } from "./VariableStats";
import { VariablesList } from "./VariablesList";

interface EnvEditorProps {
  project: IProject;
  onUpdate: () => void;
}

export function EnvEditor({ project, onUpdate }: EnvEditorProps) {
  const { updateProject, loading } = useProjects();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Custom hooks for state management
  const {
    variables,
    addVariable,
    updateVariable,
    deleteVariable,
    bulkAddVariables,
    getValidVariables,
  } = useVariableManager(project.variables || []);
  
  const { visibleValues, toggleVisibility } = useVisibilityToggle();
  
  const {
    importText,
    setImportText,
    handleFileUpload,
    parseAndGetVariables,
    clearImport,
  } = useFileImport();

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    index: number;
    varName: string;
  }>({
    open: false,
    index: -1,
    varName: "",
  });

  // Memoized values
  const validVariables = useMemo(() => getValidVariables(), [getValidVariables]);

  // Handlers
  const handleDeleteVariable = useCallback((index: number) => {
    const variable = variables[index];
    setDeleteConfirm({
      open: true,
      index,
      varName: variable.key || `Variable ${index + 1}`,
    });
  }, [variables]);

  const confirmDeleteVariable = useCallback(() => {
    deleteVariable(deleteConfirm.index);
    setDeleteConfirm({ open: false, index: -1, varName: "" });
  }, [deleteVariable, deleteConfirm.index]);

  const saveProject = useCallback(async () => {
    setSaveStatus('saving');
    try {
      await updateProject(project._id!, {
        variables: validVariables,
      });
      setSaveStatus('saved');
      onUpdate();
      
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error("Failed to save project:", error);
      setSaveStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [updateProject, project._id, validVariables, onUpdate]);

  const handleImport = useCallback(() => {
    const newVariables = parseAndGetVariables();
    if (newVariables.length > 0) {
      bulkAddVariables(newVariables);
      clearImport();
    }
  }, [parseAndGetVariables, bulkAddVariables, clearImport]);

  const handleDownload = useCallback(() => {
    try {
      const envContent = generateEnvFile(validVariables);
      downloadFile(envContent, `${project.name}.env`);
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Failed to download environment file: ${error.message}`
          : "Failed to download environment file: Unknown error"
      );
    }
  }, [validVariables, project.name]);

  const copyToClipboard = useCallback(async () => {
    try {
      const envContent = generateEnvFile(validVariables);
      await navigator.clipboard.writeText(envContent);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }, [validVariables]);

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
              disabled={saveStatus === 'saving'}
              variant={saveStatus === 'error' ? 'destructive' : saveStatus === 'saved' ? 'default' : 'default'}
              className={saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {saveStatus === 'saving' && (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Error
                </>
              )}
              {saveStatus === 'idle' && (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <VariableStats variables={variables} />
        
        {/* Import Section - Always visible */}
        <ImportSection
          importText={importText}
          onImportTextChange={setImportText}
          onFileUpload={handleFileUpload}
          onImport={handleImport}
          onClear={clearImport}
        />

        <VariablesList
          variables={variables}
          visibleValues={visibleValues}
          onAddVariable={addVariable}
          onUpdateVariable={updateVariable}
          onToggleVisibility={toggleVisibility}
          onDeleteVariable={handleDeleteVariable}
        />
      </div>

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
