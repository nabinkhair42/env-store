'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EnvVariable } from '@/schema/environment-variable';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { memo, useRef } from 'react';
import { VariableRow, VariableRowRef } from './variable-row';

interface VariablesListProps {
  variables: EnvVariable[];
  hiddenValues: Set<number>;
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
  hiddenValues,
  onAddVariable,
  onUpdateVariable,
  onToggleVisibility,
  onDeleteVariable,
  onSmartPaste,
}: VariablesListProps) {
  const rowRefs = useRef<(VariableRowRef | null)[]>([]);

  const handleNavigateToNext = (fromIndex: number) => {
    if (fromIndex === 0) {
      onAddVariable();
    } else {
      rowRefs.current[fromIndex - 1]?.focusKey();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between py-3">
        <p className="text-sm text-muted-foreground">
          {variables.length} variable{variables.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={onAddVariable} variant="outline" size="sm">
          <HugeiconsIcon icon={Add01Icon} size={14} />
          Add
        </Button>
      </div>

      {/* Column headers */}
      <div className="hidden sm:flex items-center gap-2 pb-2 text-xs font-medium text-muted-foreground">
        <div className="flex-1">Key</div>
        <div className="flex-1">Value</div>
        <div className="w-8" />
      </div>

      <ScrollArea className="h-[calc(100svh-320px)]">
        {variables.map((variable, index) => (
          <div key={index}>
            {index > 0 && <Separator className="my-2" />}
            <VariableRow
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              variable={variable}
              index={index}
              isValueVisible={!hiddenValues.has(index)}
              onUpdate={(field, value) =>
                onUpdateVariable(index, field, value)
              }
              onToggleVisibility={() => onToggleVisibility(index)}
              onDelete={() => onDeleteVariable(index)}
              onSmartPaste={onSmartPaste}
              onNavigateToNext={() => handleNavigateToNext(index)}
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
});
