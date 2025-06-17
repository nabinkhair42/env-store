import { useState, useCallback } from "react";
import { parseEnvFile } from "@/lib/utils/env-parser";
import { EnvVariable } from "@/lib/validations/project";

export function useFileImport() {
  const [importText, setImportText] = useState("");

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setImportText(content);
        };
        reader.readAsText(file);
      }
    },
    []
  );

  const parseAndGetVariables = useCallback((): EnvVariable[] => {
    try {
      const parsed = parseEnvFile(importText);
      return parsed.map((p) => ({ key: p.key, value: p.value }));
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Failed to import variables: ${error.message}`
          : "Failed to import variables: Unknown error"
      );
      return [];
    }
  }, [importText]);

  const clearImport = useCallback(() => {
    setImportText("");
  }, []);

  const getVariableCount = useCallback(() => {
    return importText
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#")).length;
  }, [importText]);

  return {
    importText,
    setImportText,
    handleFileUpload,
    parseAndGetVariables,
    clearImport,
    getVariableCount,
  };
}
