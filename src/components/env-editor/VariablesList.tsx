'use client';

import { memo, useRef, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, KeyboardIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, variables.length);
  }, [variables.length]);

  const handleNavigateToNext = (fromIndex: number) => {
    if (fromIndex === 0) {
      onAddVariable();
    } else {
      const targetIndex = fromIndex - 1;
      setTimeout(() => {
        rowRefs.current[targetIndex]?.focusKey();
      }, 50);
    }
  };

  const handleNavigateToPrevious = (fromIndex: number) => {
    const targetIndex = fromIndex + 1;
    if (targetIndex < variables.length) {
      setTimeout(() => {
        rowRefs.current[targetIndex]?.focusValue();
      }, 50);
    }
  };

  if (variables.length === 0) {
    return (
      <div>
        <div className="mx-auto w-full max-w-4xl px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Environment Variables
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your application&apos;s environment configuration
              </p>
            </div>
            <Button onClick={onAddVariable} className="w-full md:w-auto">
              <HugeiconsIcon icon={Add01Icon} size={16} />
              Add Variable
            </Button>
          </div>
        </div>

        <Separator />

        <div className="mx-auto w-full max-w-4xl px-6">
          <div className="flex min-h-60 items-center justify-center py-16">
            <div className="space-y-4 text-center">
              <h3 className="text-base font-semibold">
                No Variables Configured
              </h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Start by adding your first environment variable
              </p>
              <Button onClick={onAddVariable} variant="outline">
                <HugeiconsIcon icon={Add01Icon} size={16} />
                Add Variable
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-4xl px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight">
                Environment Variables
              </h2>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground"
                    aria-label="Show keyboard shortcuts"
                  >
                    <HugeiconsIcon icon={KeyboardIcon} size={14} />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-72">
                  <h4 className="font-semibold text-sm mb-2">
                    Keyboard Shortcuts
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tab / Enter</span>
                      <span>Next field</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shift + Tab</span>
                      <span>Previous field</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Escape</span>
                      <span>Clear focus</span>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <p className="text-xs text-muted-foreground">
                    Paste multiple variables at once (.env, JSON, YAML).
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage your application&apos;s environment configuration
            </p>
          </div>
          <Button onClick={onAddVariable} className="w-full md:w-auto">
            <HugeiconsIcon icon={Add01Icon} size={16} />
            Add Variable
          </Button>
        </div>
      </div>

      <Separator />

      <div className="mx-auto w-full max-w-4xl px-6 py-4">
        {variables.map((variable, index) => (
          <div key={index}>
            {index > 0 && <Separator className="my-3" />}
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
  );
});
