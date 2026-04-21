'use client';

import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Spinner } from '@/components/ui/spinner';
import { useProjects } from '@/hooks/use-project';
import { useVariableManager } from '@/hooks/use-variables';
import { downloadFile, generateEnvFile } from '@/lib/utils/env-parser';
import { EnvVariable } from '@/schema/environment-variable';
import { IProject } from '@/types/projects';
import {
  Alert01Icon,
  AlertCircleIcon,
  Copy01Icon,
  Download01Icon,
  SaveIcon,
  Tick01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useCallback, useMemo, useState } from 'react';
import { FileUploadSection } from './fie-upload-section';
import { VariablesList } from './variable-list';

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

  const {
    variables,
    addVariable,
    updateVariable,
    deleteVariable,
    bulkAddVariables,
    getValidVariables,
  } = useVariableManager(project.variables || []);

  const [hiddenValues, setHiddenValues] = useState<Set<number>>(new Set());

  const toggleVisibility = useCallback((index: number) => {
    setHiddenValues((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }, []);

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    open: false,
    index: -1,
    varName: '',
  });

  const validVariables = useMemo(
    () => getValidVariables(),
    [getValidVariables]
  );

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
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
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
          ? `Failed to download: ${error.message}`
          : 'Failed to download'
      );
    }
  }, [validVariables, project.name]);

  const copyToClipboard = useCallback(async () => {
    try {
      const envContent = generateEnvFile(validVariables);
      await navigator.clipboard.writeText(envContent);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [validVariables]);

  const hasVariables = variables.length > 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">{project.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-muted-foreground">
              {project.description || 'Environment variables'}
            </p>
            {lastSaved && (
              <span className="text-xs text-muted-foreground/60">
                Saved {formatLastSaved(lastSaved)}
              </span>
            )}
          </div>
          {hasUnsavedChanges && saveStatus === 'idle' && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <HugeiconsIcon icon={Alert01Icon} size={12} /> Unsaved changes
            </p>
          )}
        </div>
        {hasVariables && (
          <ButtonGroup>
            <Button variant="outline" onClick={copyToClipboard} title="Copy">
              <HugeiconsIcon icon={Copy01Icon} size={16} />
              Copy
            </Button>
            <Button variant="outline" onClick={handleDownload} title="Export">
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
                  <Spinner />
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
        )}
      </div>

      {/* Content */}
      {hasVariables ? (
        <>
          <VariablesList
            variables={variables}
            hiddenValues={hiddenValues}
            onAddVariable={handleAddVariable}
            onUpdateVariable={handleUpdateVariable}
            onToggleVisibility={toggleVisibility}
            onDeleteVariable={handleDeleteVariable}
            onSmartPaste={handleSmartPaste}
          />
          <FileUploadSection onFileVariables={handleFileVariables} />
        </>
      ) : (
        <EmptyState
          onAddVariable={handleAddVariable}
          onFileVariables={handleFileVariables}
        />
      )}

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

function EmptyState({
  onAddVariable,
  onFileVariables,
}: {
  onAddVariable: () => void;
  onFileVariables: (variables: EnvVariable[]) => void;
}) {
  return (
    <div className="py-20 text-center">
      <p className="text-sm text-muted-foreground">
        No variables yet. Get started by adding one or importing a file.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onAddVariable}>Add Variable</Button>
        <FileUploadSection onFileVariables={onFileVariables} inline />
      </div>
    </div>
  );
}
