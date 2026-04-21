'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EnvVariable } from '@/schema/environment-variable';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { memo, useEffect, useRef } from 'react';
import { VariableRow, VariableRowRef } from './VariableRow';

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

      <div>
        {variables.map((variable, index) => (
          <div key={index}>
            {index > 0 && <Separator className="my-3" />}
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
              onNavigateToPrevious={() => handleNavigateToPrevious(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
