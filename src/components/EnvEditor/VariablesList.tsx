"use client";

import React, { memo } from "react";
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
import { VariableRow } from "./VariableRow";

interface VariablesListProps {
  variables: EnvVariable[];
  visibleValues: Set<number>;
  onAddVariable: () => void;
  onUpdateVariable: (index: number, field: keyof EnvVariable, value: string) => void;
  onToggleVisibility: (index: number) => void;
  onDeleteVariable: (index: number) => void;
}

export const VariablesList = memo(function VariablesList({
  variables,
  visibleValues,
  onAddVariable,
  onUpdateVariable,
  onToggleVisibility,
  onDeleteVariable,
}: VariablesListProps) {
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
              variable={variable}
              index={index}
              isValueVisible={visibleValues.has(index)}
              onUpdate={(field, value) => onUpdateVariable(index, field, value)}
              onToggleVisibility={() => onToggleVisibility(index)}
              onDelete={() => onDeleteVariable(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
