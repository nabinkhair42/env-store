'use client';

import { Button } from '@/components/ui/button';
import { EnvVariable } from '@/schema/environment-variable';
import { RemoveCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import {
  SmartVariableInput,
  SmartVariableInputRef,
} from './smart-variable-input';

export interface VariableRowRef {
  focusKey: () => void;
  focusValue: () => void;
}

interface VariableRowProps {
  variable: EnvVariable;
  index: number;
  isValueVisible: boolean;
  onUpdate: (field: keyof EnvVariable, value: string) => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onSmartPaste: (variables: EnvVariable[]) => void;
  onNavigateToNext?: () => void;
}

export const VariableRow = memo(
  forwardRef<VariableRowRef, VariableRowProps>(function VariableRow(
    {
      variable,
      index,
      isValueVisible,
      onUpdate,
      onToggleVisibility,
      onDelete,
      onSmartPaste,
      onNavigateToNext,
    },
    ref
  ) {
    const keyInputRef = useRef<SmartVariableInputRef>(null);
    const valueInputRef = useRef<SmartVariableInputRef>(null);

    useImperativeHandle(ref, () => ({
      focusKey: () => keyInputRef.current?.focus(),
      focusValue: () => valueInputRef.current?.focus(),
    }));

    return (
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="flex-1">
          <SmartVariableInput
            ref={keyInputRef}
            variable={variable}
            index={index}
            field="key"
            placeholder="API_KEY"
            onUpdate={onUpdate}
            onSmartPaste={onSmartPaste}
            onNavigateNext={() => valueInputRef.current?.focus()}
            autoFocus={index === 0 && !variable.key}
            label="Key"
          />
        </div>
        <div className="flex-1">
          <SmartVariableInput
            ref={valueInputRef}
            variable={variable}
            index={index}
            field="value"
            type="text"
            placeholder="value"
            onUpdate={onUpdate}
            onSmartPaste={onSmartPaste}
            onNavigateNext={onNavigateToNext}
            isVisibleRequired={true}
            isValueVisible={isValueVisible}
            onToggleVisibility={onToggleVisibility}
            label="Value"
          />
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Delete variable"
        >
          <HugeiconsIcon icon={RemoveCircleIcon} size={16} />
        </Button>
      </div>
    );
  })
);
