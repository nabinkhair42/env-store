import { EnvVariable } from '@/schema';
import { useCallback, useEffect, useState } from 'react';

export function useVariableManager(initialVariables: EnvVariable[] = []) {
  const [variables, setVariables] = useState<EnvVariable[]>(initialVariables);

  useEffect(() => {
    setVariables(initialVariables);
  }, [initialVariables]);

  const addVariable = useCallback(() => {
    setVariables((prev) => [{ key: '', value: '' }, ...prev]);
  }, []);

  const updateVariable = useCallback(
    (index: number, field: keyof EnvVariable, value: string) => {
      setVariables((prev) =>
        prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
      );
    },
    []
  );

  const deleteVariable = useCallback((index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const bulkAddVariables = useCallback((newVars: EnvVariable[]) => {
    setVariables((prev) => {
      const result = [...prev];
      for (const v of newVars) {
        if (!v.key.trim()) continue;
        const idx = result.findIndex(
          (existing) => existing.key.toLowerCase() === v.key.toLowerCase()
        );
        if (idx >= 0) {
          result[idx] = v;
        } else {
          result.push(v);
        }
      }
      return result;
    });
  }, []);

  const getValidVariables = useCallback(() => {
    return variables.filter((v) => v.key.trim());
  }, [variables]);

  return {
    variables,
    addVariable,
    updateVariable,
    deleteVariable,
    bulkAddVariables,
    getValidVariables,
  };
}
