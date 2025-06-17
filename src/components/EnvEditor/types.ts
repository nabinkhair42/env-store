import { EnvVariable } from "@/lib/validations/project";

export interface EnvEditorProps {
  project: {
    _id?: string;
    name: string;
    description?: string;
    variables?: EnvVariable[];
  };
  onUpdate: () => void;
}

export interface VariableStats {
  total: number;
  active: number;
  draft: number;
  withValues: number;
}

export interface DeleteConfirmState {
  open: boolean;
  index: number;
  varName: string;
}

// Utility functions for variable statistics
export const calculateVariableStats = (variables: EnvVariable[]): VariableStats => ({
  total: variables.length,
  active: variables.filter((v) => v.key.trim()).length,
  draft: variables.filter((v) => !v.key.trim()).length,
  withValues: variables.filter((v) => v.key.trim() && v.value.trim()).length,
});

// Variable validation utilities
export const isValidVariable = (variable: EnvVariable): boolean => {
  return variable.key.trim() !== "";
};

export const isCompleteVariable = (variable: EnvVariable): boolean => {
  return variable.key.trim() !== "" && variable.value.trim() !== "";
};
