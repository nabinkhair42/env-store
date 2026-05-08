'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EnvVariable } from '@/schema';
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
    value: string,
  ) => void;
  onToggleVisibility: (index: number) => void;
  onDeleteVariable: (index: number) => void;
  onSmartPaste: (variables: EnvVariable[]) => void;
}

interface RowProps {
  variable: EnvVariable;
  index: number;
  isValueVisible: boolean;
  onUpdateVariable: VariablesListProps['onUpdateVariable'];
  onToggleVisibility: VariablesListProps['onToggleVisibility'];
  onDeleteVariable: VariablesListProps['onDeleteVariable'];
  onSmartPaste: VariablesListProps['onSmartPaste'];
  onNavigateToNext: (index: number) => void;
  rowRefs: React.MutableRefObject<(VariableRowRef | null)[]>;
}

// Per-row wrapper that binds index-aware callbacks once per (index, parent-cb).
// Memoized so the heavy VariableRow only re-renders when *its own* props change.
const Row = memo(function Row({
  variable,
  index,
  isValueVisible,
  onUpdateVariable,
  onToggleVisibility,
  onDeleteVariable,
  onSmartPaste,
  onNavigateToNext,
  rowRefs,
}: RowProps) {
  return (
    <VariableRow
      ref={(el) => {
        rowRefs.current[index] = el;
      }}
      variable={variable}
      index={index}
      isValueVisible={isValueVisible}
      onUpdate={(field, value) => onUpdateVariable(index, field, value)}
      onToggleVisibility={() => onToggleVisibility(index)}
      onDelete={() => onDeleteVariable(index)}
      onSmartPaste={onSmartPaste}
      onNavigateToNext={() => onNavigateToNext(index)}
    />
  );
});

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

  // Stable, no closure over render-scoped vars — keeps Row memo intact across renders.
  const handleNavigateToNext = useRef((fromIndex: number) => {
    if (fromIndex === 0) {
      onAddVariableRef.current();
    } else {
      rowRefs.current[fromIndex - 1]?.focusKey();
    }
  }).current;

  // Latest-callback ref so the stable `handleNavigateToNext` calls the up-to-date prop.
  const onAddVariableRef = useRef(onAddVariable);
  onAddVariableRef.current = onAddVariable;

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
            <Row
              variable={variable}
              index={index}
              isValueVisible={!hiddenValues.has(index)}
              onUpdateVariable={onUpdateVariable}
              onToggleVisibility={onToggleVisibility}
              onDeleteVariable={onDeleteVariable}
              onSmartPaste={onSmartPaste}
              onNavigateToNext={handleNavigateToNext}
              rowRefs={rowRefs}
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
});
