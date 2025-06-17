import { useState, useCallback } from "react";
import { EnvVariable } from "@/lib/validations/project";

export function useVariableManager(initialVariables: EnvVariable[] = []) {
  const [variables, setVariables] = useState<EnvVariable[]>(initialVariables);

  const addVariable = useCallback(() => {
    setVariables((prev) => [...prev, { key: "", value: "" }]);
  }, []);

  const updateVariable = useCallback(
    (index: number, field: keyof EnvVariable, value: string) => {
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
      
      newVariables.forEach(newVar => {
        if (!newVar.key.trim()) return; // Skip empty keys
        
        // Find existing variable with same key (case-insensitive)
        const existingIndex = updatedVariables.findIndex(
          existing => existing.key.trim().toLowerCase() === newVar.key.trim().toLowerCase()
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

  return {
    variables,
    setVariables,
    addVariable,
    updateVariable,
    deleteVariable,
    bulkAddVariables,
    getValidVariables,
  };
}
