import { useState, useCallback } from 'react';
import { EnvVariable } from '@/lib/validations/project';
import { parseEnvFile, generateEnvFile, downloadFile } from '@/lib/utils/env-parser';
import { toast } from 'sonner';

interface UseEnvVariablesState {
  variables: EnvVariable[];
  hasChanges: boolean;
}

interface UseEnvVariablesActions {
  setVariables: (variables: EnvVariable[]) => void;
  addVariable: () => void;
  updateVariable: (index: number, field: keyof EnvVariable, value: string) => void;
  removeVariable: (index: number) => void;
  importFromText: (content: string) => void;
  exportToFile: (filename: string) => void;
  copyToClipboard: () => Promise<void>;
  resetChanges: () => void;
}

export function useEnvVariables(initialVariables: EnvVariable[] = []): UseEnvVariablesState & UseEnvVariablesActions {
  const [variables, setVariablesState] = useState<EnvVariable[]>(initialVariables);
  const [originalVariables] = useState<EnvVariable[]>(initialVariables);

  const hasChanges = JSON.stringify(variables) !== JSON.stringify(originalVariables);

  const setVariables = useCallback((newVariables: EnvVariable[]) => {
    setVariablesState(newVariables);
  }, []);

  const addVariable = useCallback(() => {
    setVariablesState(prev => [...prev, { key: '', value: '', description: '' }]);
  }, []);

  const updateVariable = useCallback((index: number, field: keyof EnvVariable, value: string) => {
    setVariablesState(prev => prev.map((variable, i) => 
      i === index ? { ...variable, [field]: value } : variable
    ));
  }, []);

  const removeVariable = useCallback((index: number) => {
    setVariablesState(prev => prev.filter((_, i) => i !== index));
  }, []);

  const importFromText = useCallback((content: string) => {
    try {
      const parsed = parseEnvFile(content);
      const newVariables = parsed.map(p => ({ ...p, description: '' }));
      setVariablesState(prev => [...prev, ...newVariables]);
      toast.success(`Imported ${parsed.length} variables`);
    } catch (error) {
      toast.error('Failed to parse environment file');
    }
  }, []);

  const exportToFile = useCallback((filename: string) => {
    try {
      const envContent = generateEnvFile(variables.filter(v => v.key.trim()));
      downloadFile(envContent, filename);
      toast.success('Environment file downloaded');
    } catch (error) {
      toast.error('Failed to download environment file');
    }
  }, [variables]);

  const copyToClipboard = useCallback(async () => {
    try {
      const envContent = generateEnvFile(variables.filter(v => v.key.trim()));
      await navigator.clipboard.writeText(envContent);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  }, [variables]);

  const resetChanges = useCallback(() => {
    setVariablesState(originalVariables);
  }, [originalVariables]);

  return {
    variables,
    hasChanges,
    setVariables,
    addVariable,
    updateVariable,
    removeVariable,
    importFromText,
    exportToFile,
    copyToClipboard,
    resetChanges,
  };
}
