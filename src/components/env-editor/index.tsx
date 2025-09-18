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
    setDeleteConfirm({ open: false, index: -1, varName: '' });
  }, [deleteVariable, deleteConfirm.index]);

  const saveProject = useCallback(async () => {
    setSaveStatus('saving');
    try {
      await updateProject(project._id as string, {
        variables: validVariables,
      });
      setSaveStatus('saved');
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
      <div className="border-b pb-6 px-4 border-dashed">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {project.name}
            </h1>
            <p className="text-muted-foreground">
              {project.description ||
                'Manage environment variables for this project'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Export .env
            </Button>
            <Button
              onClick={saveProject}
              disabled={saveStatus === 'saving'}
              variant={
                saveStatus === 'error'
                  ? 'destructive'
                  : saveStatus === 'saved'
                    ? 'default'
                    : 'default'
              }
              className={
                saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-700' : ''
              }
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

      <VariablesList
        variables={variables}
        visibleValues={visibleValues}
        onAddVariable={handleAddVariable}
        onUpdateVariable={updateVariable}
        onToggleVisibility={toggleVisibility}
        onDeleteVariable={handleDeleteVariable}
        onSmartPaste={handleSmartPaste}
      />

      <div className="border-b pb-6 px-4 border-dashed" />
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
