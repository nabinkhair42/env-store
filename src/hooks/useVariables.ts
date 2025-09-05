import { useState, useCallback } from 'react';
import { EnvVariable } from '@/lib/zod';
import { EncryptedData } from '@/lib/crypto';

export function useVariableManager(initialVariables: EnvVariable[] = []) {
  const [variables, setVariables] = useState<EnvVariable[]>(initialVariables);

  const addVariable = useCallback(() => {
    setVariables((prev) => [{ key: '', value: '' }, ...prev]);
  }, []);

  const updateVariable = useCallback(
    (
      index: number,
      field: keyof EnvVariable,
      value: string | EncryptedData
    ) => {
      setVariables((prev) =>
        prev.map((variable, i) =>
          i === index ? { ...variable, [field]: value } : variable
        )
      );
    },
    []
  );

  const deleteVariable = useCallback((index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const bulkAddVariables = useCallback((newVariables: EnvVariable[]) => {
    setVariables((prev) => {
      const updatedVariables = [...prev];

      newVariables.forEach((newVar) => {
        if (!newVar.key.trim()) return; // Skip empty keys

        // Find existing variable with same key (case-insensitive)
        const existingIndex = updatedVariables.findIndex(
          (existing) =>
            existing.key.trim().toLowerCase() ===
            newVar.key.trim().toLowerCase()
        );

        if (existingIndex >= 0) {
          // Overwrite existing variable with new value
          updatedVariables[existingIndex] = { ...newVar };
        } else {
          // Add new variable
          updatedVariables.push({ ...newVar });
        }
      });

      return updatedVariables;
    });
  }, []);

  const getValidVariables = useCallback(() => {
    return variables.filter((v) => v.key.trim());
  }, [variables]);

  const clearVariables = useCallback(() => {
    setVariables([]);
  }, []);

  const hasChanges = useCallback(() => {
    return (
      variables.length !== initialVariables.length ||
      variables.some(
        (v, i) =>
          !initialVariables[i] ||
          v.key !== initialVariables[i].key ||
          v.value !== initialVariables[i].value ||
          v.description !== initialVariables[i].description
      )
    );
  }, [variables, initialVariables]);

  return {
    variables,
    setVariables,
    addVariable,
    updateVariable,
    deleteVariable,
    bulkAddVariables,
    getValidVariables,
    clearVariables,
    hasChanges: hasChanges(),
  };
}
