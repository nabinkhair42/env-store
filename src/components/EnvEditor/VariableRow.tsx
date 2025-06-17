"use client";

import React, { memo } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnvVariable } from "@/lib/validations/project";

interface VariableRowProps {
  variable: EnvVariable;
  index: number;
  isValueVisible: boolean;
  onUpdate: (field: keyof EnvVariable, value: string) => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}

export const VariableRow = memo(function VariableRow({
  variable,
  index,
  isValueVisible,
  onUpdate,
  onToggleVisibility,
  onDelete,
}: VariableRowProps) {

  return (
    <div className="group relative border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="grid gap-4 md:grid-cols-6 items-start">
        {/* Key Field */}
        <div className="md:col-span-2 space-y-2">
          <Label
            htmlFor={`key-${index}`}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Variable Name
          </Label>
          <Input
            id={`key-${index}`}
            value={variable.key}
            onChange={(e) => onUpdate("key", e.target.value)}
            placeholder="API_KEY"
            className="font-mono text-sm"
          />
        </div>

        {/* Value Field with Preview */}
        <div className="md:col-span-3 space-y-2">
          <Label
            htmlFor={`value-${index}`}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Value
          </Label>
          <div className="relative">
            <Input
              id={`value-${index}`}
              type={isValueVisible ? "text" : "password"}
              value={variable.value}
              onChange={(e) => onUpdate("value", e.target.value)}
              placeholder="your-secret-value"
              className="font-mono text-sm pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={onToggleVisibility}
            >
              {isValueVisible ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="md:col-span-1 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});
