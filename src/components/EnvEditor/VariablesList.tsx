"use client";

import React, { memo, useRef, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EnvVariable } from "@/lib/validations/project";
import { VariableRow, VariableRowRef } from "./VariableRow";

interface VariablesListProps {
  variables: EnvVariable[];
  visibleValues: Set<number>;
  onAddVariable: () => void;
  onUpdateVariable: (index: number, field: keyof EnvVariable, value: string) => void;
  onToggleVisibility: (index: number) => void;
  onDeleteVariable: (index: number) => void;
  onSmartPaste: (variables: EnvVariable[]) => void;
}

export const VariablesList = memo(function VariablesList({
  variables,
  visibleValues,
  onAddVariable,
  onUpdateVariable,
  onToggleVisibility,
  onDeleteVariable,
  onSmartPaste,
}: VariablesListProps) {
  const rowRefs = useRef<(VariableRowRef | null)[]>([]);

  // Update refs array when variables change
  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, variables.length);
  }, [variables.length]);

  const handleNavigateToNext = (fromIndex: number) => {
    if (fromIndex === 0) {
      // If we're on the first (newest) row, add a new variable
      onAddVariable();
    } else {
      // Navigate to the previous row (newer in the list) - focus on key field
      const targetIndex = fromIndex - 1;
      setTimeout(() => {
        rowRefs.current[targetIndex]?.focusKey();
      }, 50);
    }
  };

  const handleNavigateToPrevious = (fromIndex: number) => {
    // Navigate to the next row (older in the list) - focus on value field
    const targetIndex = fromIndex + 1;
    if (targetIndex < variables.length) {
      setTimeout(() => {
        rowRefs.current[targetIndex]?.focusValue();
      }, 50);
    }
  };
  if (variables.length === 0) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">Environment Variables</CardTitle>
              <CardDescription>
                Manage your application&apos;s environment configuration
              </CardDescription>
            </div>
            <Button onClick={onAddVariable} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Variable
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 border border-dashed rounded-lg">
            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No variables configured</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first environment variable
            </p>
            <Button onClick={onAddVariable} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add your first variable
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Environment Variables</CardTitle>
            <CardDescription>
              Manage your application&apos;s environment configuration
            </CardDescription>
          </div>
          <Button onClick={onAddVariable} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Variable
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3">
          {variables.map((variable, index) => (
            <VariableRow
              key={index}
              ref={(el) => { rowRefs.current[index] = el; }}
              variable={variable}
              index={index}
              isValueVisible={visibleValues.has(index)}
              onUpdate={(field, value) => onUpdateVariable(index, field, value)}
              onToggleVisibility={() => onToggleVisibility(index)}
              onDelete={() => onDeleteVariable(index)}
              onSmartPaste={onSmartPaste}
              onNavigateToNext={() => handleNavigateToNext(index)}
              onNavigateToPrevious={() => handleNavigateToPrevious(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
