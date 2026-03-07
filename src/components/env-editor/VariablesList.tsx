'use client';

import { memo, useRef, useEffect } from 'react';
import { Add01, FileText, Keyboard01 } from 'hugeicons-react';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { EnvVariable } from '@/lib/zod';
import { VariableRow, VariableRowRef } from './VariableRow';

interface VariablesListProps {
  variables: EnvVariable[];
  visibleValues: Set<number>;
  onAddVariable: () => void;
  onUpdateVariable: (
    index: number,
    field: keyof EnvVariable,
    value: string
  ) => void;
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
      <div className="rail-bounded">
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Variables
              </p>
              <h2 className="text-lg font-bold tracking-tight">
                Environment Variables
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your application&apos;s environment configuration
              </p>
            </div>
            <Button onClick={onAddVariable} className="w-full md:w-auto">
              <Add01 className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">
                Add Variable
              </span>
            </Button>
          </div>
        </div>

        <div className="section-divider" aria-hidden="true" />

        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex min-h-[300px] items-center justify-center py-16">
            <div className="space-y-6 text-center">
              <div className="mx-auto inline-flex size-14 items-center justify-center rounded-xl border text-muted-foreground">
                <FileText className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold uppercase tracking-wide">
                  No Variables Configured
                </h3>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                  Start by adding your first environment variable
                </p>
              </div>
              <Button onClick={onAddVariable} variant="outline">
                <Add01 className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">
                  Add Variable
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rail-bounded">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Variables
              </p>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                    aria-label="Show keyboard shortcuts"
                  >
                    <Keyboard01 className="h-3.5 w-3.5" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Keyboard01 className="h-4 w-4" />
                      Keyboard Shortcuts
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Tab / Enter
                        </span>
                        <span>Navigate to next field</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Shift + Tab
                        </span>
                        <span>Navigate to previous field</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Arrow Right
                        </span>
                        <span>Next field (at end of input)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Arrow Left
                        </span>
                        <span>Previous field (at start)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Escape</span>
                        <span>Clear focus</span>
                      </div>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-xs text-muted-foreground">
                        <strong>Tip:</strong> Paste multiple variables at once.
                        Supports .env, JSON, and YAML formats.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <h2 className="text-lg font-bold tracking-tight">
              Environment Variables
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your application&apos;s environment configuration
            </p>
          </div>
          <Button onClick={onAddVariable} className="w-full md:w-auto">
            <Plus className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wide">
              Add Variable
            </span>
          </Button>
        </div>
      </div>

      <div className="section-divider" aria-hidden="true" />

      <div className="mx-auto w-full max-w-6xl px-6 py-4">
        <div className="space-y-0">
          {variables.map((variable, index) => (
            <div key={index}>
              {index > 0 && (
                <div className="h-px bg-border my-3" aria-hidden="true" />
              )}
              <VariableRow
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                variable={variable}
                index={index}
                isValueVisible={visibleValues.has(index)}
                onUpdate={(field, value) =>
                  onUpdateVariable(index, field, value)
                }
                onToggleVisibility={() => onToggleVisibility(index)}
                onDelete={() => onDeleteVariable(index)}
                onSmartPaste={onSmartPaste}
                onNavigateToNext={() => handleNavigateToNext(index)}
                onNavigateToPrevious={() => handleNavigateToPrevious(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
