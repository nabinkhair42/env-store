'use client';

import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEnvironmentManager } from '@/hooks/use-environment-manager';
import { useUpdateProject } from '@/hooks/use-projects';
import { useVariableManager } from '@/hooks/use-variables';
import { downloadFile, generateEnvFile, parseEnvFile } from '@/lib/env-parser';
import { cn } from '@/lib/utils';
import { EnvVariable } from '@/schema';
import { IProject } from '@/types';
import {
  Add01Icon,
  Alert01Icon,
  AlertCircleIcon,
  Cancel01Icon,
  Copy01Icon,
  Download01Icon,
  SaveIcon,
  Tick01Icon,
  Delete02Icon,
  Upload02Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import React, { useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { VariablesList } from './variable-list';

type DeleteConfirmState = { open: boolean; index: number; varName: string };

interface EnvEditorProps {
  project: IProject;
  onUpdate: () => void;
  readOnly?: boolean;
}

export function EnvEditor({ project, onUpdate, readOnly = false }: EnvEditorProps) {
  const { mutateAsync: updateProject } = useUpdateProject();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [addingEnv, setAddingEnv] = useState(false);
  const [newEnvName, setNewEnvName] = useState('');
  const [deleteEnvConfirm, setDeleteEnvConfirm] = useState<{ open: boolean; name: string }>({ open: false, name: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    envNames,
    activeTab,
    setActiveTab,
    activeVariables,
    updateVariables,
    addEnvironment,
    removeEnvironment,
    getAllEnvironments,
  } = useEnvironmentManager(project.environments ?? []);

  // Variable manager for the active environment
  const {
    variables,
    addVariable,
    updateVariable,
    deleteVariable,
    bulkAddVariables,
    getValidVariables,
  } = useVariableManager(activeVariables);

  // Sync variable changes back to the environment manager
  const markChanged = useCallback(() => setHasUnsavedChanges(true), []);

  // When the variable manager's state changes, push it to the env manager
  // We do this on save instead of on every keystroke to avoid loops
  const [hiddenValues, setHiddenValues] = useState<Set<number>>(new Set());

  const toggleVisibility = useCallback((index: number) => {
    setHiddenValues((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    open: false,
    index: -1,
    varName: '',
  });

  const handleAddVariable = useCallback(() => {
    addVariable();
    markChanged();
  }, [addVariable, markChanged]);

  const handleDeleteVariable = useCallback(
    (index: number) => {
      const variable = variables[index];
      setDeleteConfirm({
        open: true,
        index,
        varName: variable.key || `Variable ${index + 1}`,
      });
    },
    [variables],
  );

  const confirmDeleteVariable = useCallback(() => {
    deleteVariable(deleteConfirm.index);
    markChanged();
    setDeleteConfirm({ open: false, index: -1, varName: '' });
  }, [deleteVariable, deleteConfirm.index, markChanged]);

  const handleUpdateVariable = useCallback(
    (index: number, field: keyof EnvVariable, value: string) => {
      updateVariable(index, field, value);
      markChanged();
    },
    [updateVariable, markChanged],
  );

  const formatLastSaved = (date: Date) => {
    const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  const saveProject = useCallback(async () => {
    setSaveStatus('saving');
    try {
      // Push current tab's variables to the env manager before collecting all
      updateVariables(activeTab, getValidVariables());

      // Need a small delay for state to settle, or read directly
      const currentEnvs = getAllEnvironments().map((e) =>
        e.name === activeTab ? { ...e, variables: getValidVariables() } : e,
      );

      await updateProject({
        id: project._id as string,
        data: { environments: currentEnvs },
      });
      setSaveStatus('saved');
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      onUpdate();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [updateProject, project._id, activeTab, getValidVariables, updateVariables, getAllEnvironments, onUpdate]);

  const handleTabChange = useCallback(
    (newTab: string) => {
      // Save current tab's variables before switching
      updateVariables(activeTab, variables);
      setActiveTab(newTab);
      setHiddenValues(new Set());
    },
    [activeTab, variables, updateVariables, setActiveTab],
  );

  const handleBulkAdd = useCallback(
    (newVariables: EnvVariable[]) => {
      if (newVariables.length > 0) {
        bulkAddVariables(newVariables);
        markChanged();
      }
    },
    [bulkAddVariables, markChanged],
  );

  const handleDownload = useCallback(() => {
    try {
      const valid = getValidVariables();
      const filename = `${project.name}.${activeTab}.env`;
      downloadFile(generateEnvFile(valid), filename);
    } catch {
      toast.error('Failed to download');
    }
  }, [getValidVariables, project.name, activeTab]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generateEnvFile(getValidVariables()));
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  }, [getValidVariables]);

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const parsed = parseEnvFile(content).map((v) => ({ key: v.key, value: v.value }));
          if (parsed.length === 0) {
            toast.error('No valid variables found');
            return;
          }
          handleBulkAdd(parsed);
          toast.success(`Imported ${parsed.length} variable${parsed.length !== 1 ? 's' : ''}`);
        } catch {
          toast.error('Failed to parse file');
        }
      };
      reader.readAsText(file);
    },
    [handleBulkAdd],
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleAddEnvironment = () => {
    const name = newEnvName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!name) return;
    if (addEnvironment(name)) {
      setNewEnvName('');
      setAddingEnv(false);
      markChanged();
    } else {
      toast.error('Environment already exists or limit reached');
    }
  };

  const hasVariables = variables.length > 0;

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-4xl px-6 relative',
        dragActive && 'ring-2 ring-primary ring-inset rounded-lg',
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept=".env,.txt,.json,.yml,.yaml"
        onChange={handleFileInput}
        className="hidden"
      />

      {dragActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/90 border-2 border-dashed border-primary">
          <div className="text-center">
            <HugeiconsIcon icon={Upload02Icon} size={32} className="mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Drop your .env file here</p>
          </div>
        </div>
      )}

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
        <ButtonGroup>
          <Button variant="outline" onClick={copyToClipboard} title="Copy">
            <HugeiconsIcon icon={Copy01Icon} size={16} />
            Copy
          </Button>
          <Button variant="outline" onClick={handleDownload} title="Export">
            <HugeiconsIcon icon={Download01Icon} size={16} />
            Export
          </Button>
          {!readOnly && (
            <Button
              onClick={saveProject}
              disabled={saveStatus === 'saving'}
              variant={saveStatus === 'error' ? 'destructive' : 'default'}
            >
              {saveStatus === 'saving' && <><Spinner /> Saving</>}
              {saveStatus === 'saved' && <><HugeiconsIcon icon={Tick01Icon} size={16} /> Saved!</>}
              {saveStatus === 'error' && <><HugeiconsIcon icon={AlertCircleIcon} size={16} /> Retry</>}
              {saveStatus === 'idle' && <><HugeiconsIcon icon={SaveIcon} size={16} /> Save</>}
            </Button>
          )}
        </ButtonGroup>
      </div>

      {/* Environment Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center gap-2">
          <TabsList>
            {envNames.map((name) => (
              <TabsTrigger key={name} value={name} className="gap-1.5">
                {name}
                {!readOnly && envNames.length > 1 && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setDeleteEnvConfirm({ open: true, name });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.stopPropagation();
                        setDeleteEnvConfirm({ open: true, name });
                      }
                    }}
                    className="ml-1 inline-flex rounded-full p-0.5"
                  >
                    <HugeiconsIcon icon={Trash2} size={10} className="text-destructive" />
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {!readOnly && (
            addingEnv ? (
              <div className="flex items-center gap-1">
                <Input
                  value={newEnvName}
                  onChange={(e) => setNewEnvName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddEnvironment();
                    if (e.key === 'Escape') { setAddingEnv(false); setNewEnvName(''); }
                  }}
                  placeholder="env name"
                  className="h-7 w-28 text-xs"
                  autoFocus
                />
                <Button size="icon" variant="ghost" className="size-7" onClick={handleAddEnvironment}>
                  <HugeiconsIcon icon={Tick01Icon} size={14} />
                </Button>
                <Button size="icon" variant="ghost" className="size-7" onClick={() => { setAddingEnv(false); setNewEnvName(''); }}>
                  <HugeiconsIcon icon={Cancel01Icon} size={14} />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setAddingEnv(true)}
                title="Add environment"
              >
                <HugeiconsIcon icon={Add01Icon} size={14} />
              </Button>
            )
          )}
        </div>

        {envNames.map((name) => (
          <TabsContent key={name} value={name} className="mt-4">
            {name === activeTab && (
              hasVariables ? (
                <VariablesList
                  variables={variables}
                  hiddenValues={hiddenValues}
                  onAddVariable={handleAddVariable}
                  onUpdateVariable={handleUpdateVariable}
                  onToggleVisibility={toggleVisibility}
                  onDeleteVariable={handleDeleteVariable}
                  onSmartPaste={handleBulkAdd}
                />
              ) : (
                <div className="py-16 text-center">
                  <p className="text-sm text-muted-foreground">
                    {readOnly
                      ? `No variables in ${name}.`
                      : `No variables in ${name}. Add one, paste content, or drop a file.`}
                  </p>
                  {!readOnly && (
                    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                      <Button onClick={handleAddVariable}>Add Variable</Button>
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <HugeiconsIcon icon={Upload02Icon} size={16} />
                        Import File
                      </Button>
                    </div>
                  )}
                </div>
              )
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Delete variable confirm */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title="Delete Environment Variable"
        description={`Are you sure you want to delete "${deleteConfirm.varName}"?`}
        confirmText="Yes, Delete"
        cancelText="No, Keep it"
        onConfirm={confirmDeleteVariable}
        variant="destructive"
      />

      {/* Delete environment confirm */}
      <ConfirmDialog
        open={deleteEnvConfirm.open}
        onOpenChange={(open) => setDeleteEnvConfirm((prev) => ({ ...prev, open }))}
        title="Delete Environment"
        description={`Are you sure you want to delete the "${deleteEnvConfirm.name}" environment and all its variables?`}
        confirmText="Yes, Delete"
        cancelText="No, Keep it"
        onConfirm={() => {
          removeEnvironment(deleteEnvConfirm.name);
          markChanged();
          setDeleteEnvConfirm({ open: false, name: '' });
        }}
        variant="destructive"
      />
    </div>
  );
}
