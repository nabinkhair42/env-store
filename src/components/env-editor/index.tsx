'use client';

import { ConfirmDialog } from '@/components/modal/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { useVariableManager } from '@/hooks/useVariables';
import { useVisibilityToggle } from '@/hooks/useVisibilityToggle';
import { IProject } from '@/lib/types';
import { downloadFile, generateEnvFile } from '@/lib/utils/env-parser';
import { EnvVariable } from '@/lib/zod';
import {
  AlertCircle,
  AlertTriangleIcon,
  Check,
  Copy,
  Download,
  Loader2,
  Save,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { FileUploadSection } from './FileUploadSection';
import { VariablesList } from './VariablesList';
// Local component-only types
type DeleteConfirmState = { open: boolean; index: number; varName: string };

interface EnvEditorProps {
  project: IProject;
  onUpdate: () => void;
}

export function EnvEditor({ project, onUpdate }: EnvEditorProps) {
  const { updateProject } = useProjects();
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Custom hooks for state management
  const {
    variables,
    addVariable,
    updateVariable,
    deleteVariable,
    bulkAddVariables,
    getValidVariables,
  } = useVariableManager(project.variables || []);

  const { visibleValues, toggleVisibility, shiftIndices } =
    useVisibilityToggle();

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    open: false,
    index: -1,
    varName: '',
  });

  // Memoized values
  const validVariables = useMemo(
    () => getValidVariables(),
    [getValidVariables]
  );

  // Handlers
  const handleAddVariable = useCallback(() => {
    addVariable();
    setHasUnsavedChanges(true);
    // Shift all existing visibility indices by 1 since we added at the top
    shiftIndices(1);
  }, [addVariable, shiftIndices]);

  const handleDeleteVariable = useCallback(
    (index: number) => {
      const variable = variables[index];
      setDeleteConfirm({
        open: true,
        index,
        varName: variable.key || `Variable ${index + 1}`,
      });
    },
    [variables]
  );

  const confirmDeleteVariable = useCallback(() => {
    deleteVariable(deleteConfirm.index);
    setHasUnsavedChanges(true);
    setDeleteConfirm({ open: false, index: -1, varName: '' });
  }, [deleteVariable, deleteConfirm.index]);

  const handleUpdateVariable = useCallback(
    (index: number, field: keyof EnvVariable, value: string) => {
      updateVariable(index, field, value);
      setHasUnsavedChanges(true);
    },
    [updateVariable]
  );

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    return date.toLocaleString();
  };

  const saveProject = useCallback(async () => {
    setSaveStatus('saving');
    try {
      await updateProject(project._id as string, {
        variables: validVariables,
      });
      setSaveStatus('saved');
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      onUpdate();

      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save project:', error);
      setSaveStatus('error');

      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [updateProject, project._id, validVariables, onUpdate]);

  const handleSmartPaste = useCallback(
    (newVariables: EnvVariable[]) => {
      if (newVariables.length > 0) {
        bulkAddVariables(newVariables);
        // Shift visibility indices for the new variables
        shiftIndices(newVariables.length);
      }
    },
    [bulkAddVariables, shiftIndices]
  );

  const handleFileVariables = useCallback(
    (newVariables: EnvVariable[]) => {
      if (newVariables.length > 0) {
        bulkAddVariables(newVariables);
        // Shift visibility indices for the new variables
        shiftIndices(newVariables.length);
      }
    },
    [bulkAddVariables, shiftIndices]
  );

  const handleDownload = useCallback(() => {
    try {
      const envContent = generateEnvFile(validVariables);
      downloadFile(envContent, `${project.name}.env`);
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Failed to download environment file: ${error.message}`
          : 'Failed to download environment file: Unknown error'
      );
    }
  }, [validVariables, project.name]);

  const copyToClipboard = useCallback(async () => {
    try {
      const envContent = generateEnvFile(validVariables);
      await navigator.clipboard.writeText(envContent);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [validVariables]);

  return (
    <div>
      {/* Project Header */}
      <div className="rail-bounded">
        <div className="px-6 py-6 bg-muted/20">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="space-y-1">
                <h1 className="text-xl font-bold uppercase tracking-tight">
                  {project.name}
                </h1>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">
                  {project.description ||
                    'Manage environment variables for this project'}
                </p>
                {lastSaved && (
                  <p className="text-xs text-muted-foreground/70">
                    Last saved: {formatLastSaved(lastSaved)}
                  </p>
                )}
                {hasUnsavedChanges && saveStatus === 'idle' && (
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-500">
                    <AlertTriangleIcon /> Unsaved changes
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-stretch w-fit border border-border">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                >
                  <Copy className="size-4" />
                  <span className="text-xs uppercase tracking-wide">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  title="Export as .env file"
                >
                  <Download className="size-4" />
                  <span className="text-xs uppercase tracking-wide">
                    Export
                  </span>
                </Button>
                <Button
                  onClick={saveProject}
                  disabled={saveStatus === 'saving'}
                  variant={saveStatus === 'error' ? 'destructive' : 'outline'}
                >
                  {saveStatus === 'saving' && (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-xs uppercase tracking-wide">
                        Saving
                      </span>
                    </>
                  )}
                  {saveStatus === 'saved' && (
                    <>
                      <Check className="size-4" />
                      <span className="text-xs uppercase tracking-wide">
                        Saved!
                      </span>
                    </>
                  )}
                  {saveStatus === 'error' && (
                    <>
                      <AlertCircle className="size-4" />
                      <span className="text-xs uppercase tracking-wide">
                        Retry
                      </span>
                    </>
                  )}
                  {saveStatus === 'idle' && (
                    <>
                      <Save className="size-4" />
                      <span className="text-xs uppercase tracking-wide">
                        Save
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider" aria-hidden="true" />

      <VariablesList
        variables={variables}
        visibleValues={visibleValues}
        onAddVariable={handleAddVariable}
        onUpdateVariable={handleUpdateVariable}
        onToggleVisibility={toggleVisibility}
        onDeleteVariable={handleDeleteVariable}
        onSmartPaste={handleSmartPaste}
      />

      <div className="section-divider" aria-hidden="true" />

      <FileUploadSection onFileVariables={handleFileVariables} />

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
