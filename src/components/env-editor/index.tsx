'use client';

import { ConfirmDialog } from '@/components/modal/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { useVariableManager } from '@/hooks/useVariables';
import { useVisibilityToggle } from '@/hooks/useVisibilityToggle';
import { IProject } from '@/lib/types';
import { downloadFile, generateEnvFile } from '@/lib/utils/env-parser';
import { EnvVariable } from '@/lib/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AlertCircleIcon,
  Alert01Icon,
  Tick01Icon,
  Copy01Icon,
  Download01Icon,
  Loading03Icon,
  SaveIcon,
} from '@hugeicons/core-free-icons';
import { useCallback, useMemo, useState } from 'react';
import { FileUploadSection } from './FileUploadSection';
import { VariablesList } from './VariablesList';
import { ButtonGroup } from '@/components/ui/button-group';
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
      const updatedProject = await updateProject(project._id as string, {
        variables: validVariables,
      });

      if (updatedProject) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        onUpdate();
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [updateProject, project._id, validVariables, onUpdate]);

  const handleSmartPaste = useCallback(
    (newVariables: EnvVariable[]) => {
      if (newVariables.length > 0) {
        bulkAddVariables(newVariables);
        shiftIndices(newVariables.length);
      }
    },
    [bulkAddVariables, shiftIndices]
  );

  const handleFileVariables = useCallback(
    (newVariables: EnvVariable[]) => {
      if (newVariables.length > 0) {
        bulkAddVariables(newVariables);
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
      <div className="mx-auto w-full max-w-4xl px-6 py-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold uppercase tracking-tight">
              {project.name}
            </h1>
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
              <p className="text-xs font-semibold text-destructive flex items-center gap-1">
                <HugeiconsIcon icon={Alert01Icon} size={12} /> Unsaved changes
              </p>
            )}
          </div>
          <ButtonGroup>
            <Button
              variant="outline"
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              <HugeiconsIcon icon={Copy01Icon} size={16} />
              Copy
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              title="Export as .env file"
            >
              <HugeiconsIcon icon={Download01Icon} size={16} />
              Export
            </Button>
            <Button
              onClick={saveProject}
              disabled={saveStatus === 'saving'}
              variant={saveStatus === 'error' ? 'destructive' : 'default'}
            >
              {saveStatus === 'saving' && (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={16}
                    className="animate-spin"
                  />
                  Saving
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <HugeiconsIcon icon={Tick01Icon} size={16} />
                  Saved!
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <HugeiconsIcon icon={AlertCircleIcon} size={16} />
                  Retry
                </>
              )}
              {saveStatus === 'idle' && (
                <>
                  <HugeiconsIcon icon={SaveIcon} size={16} />
                  Save
                </>
              )}
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="border-t border-border" />

      <VariablesList
        variables={variables}
        visibleValues={visibleValues}
        onAddVariable={handleAddVariable}
        onUpdateVariable={handleUpdateVariable}
        onToggleVisibility={toggleVisibility}
        onDeleteVariable={handleDeleteVariable}
        onSmartPaste={handleSmartPaste}
      />

      <div className="border-t border-border" />

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
