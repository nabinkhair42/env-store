'use client';

import { Button } from '@/components/ui/button';
import { EnvVariable } from '@/lib/zod';
import { MinusCircle } from 'lucide-react';
import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import {
  SmartVariableInput,
  SmartVariableInputRef,
} from './SmartVariableInput';

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
  onNavigateToPrevious?: () => void;
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
      onNavigateToPrevious,
    },
    ref
  ) {
    const keyInputRef = useRef<SmartVariableInputRef>(null);
    const valueInputRef = useRef<SmartVariableInputRef>(null);

    useImperativeHandle(ref, () => ({
      focusKey: () => keyInputRef.current?.focus(),
      focusValue: () => valueInputRef.current?.focus(),
    }));

    const handleNavigateFromKey = () => {
      valueInputRef.current?.focus();
    };

    const handleNavigateFromValue = () => {
      if (onNavigateToNext) {
        onNavigateToNext();
      }
    };

    const handleNavigateToKey = () => {
      keyInputRef.current?.focus();
    };

    const handleNavigateToPreviousRow = () => {
      if (onNavigateToPrevious) {
        onNavigateToPrevious();
      }
    };

    return (
      <>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* Key Field */}
          <div className="flex-1">
            <SmartVariableInput
              ref={keyInputRef}
              variable={variable}
              index={index}
              field="key"
              placeholder="API_KEY"
              onUpdate={onUpdate}
              onSmartPaste={onSmartPaste}
              onNavigateNext={handleNavigateFromKey}
              onNavigatePrevious={handleNavigateToPreviousRow}
              autoFocus={index === 0 && !variable.key}
              label="Key"
            />
          </div>

          {/* Value Field with Preview */}
          <div className="flex-1">
            <SmartVariableInput
              ref={valueInputRef}
              variable={variable}
              index={index}
              field="value"
              type="text"
              placeholder="your-secret-value"
              onUpdate={onUpdate}
              onSmartPaste={onSmartPaste}
              onNavigateNext={handleNavigateFromValue}
              onNavigatePrevious={handleNavigateToKey}
              isVisibleRequired={true}
              isValueVisible={isValueVisible}
              onToggleVisibility={onToggleVisibility}
              label="Value"
            />
          </div>

          {/* Actions */}
          <div className="flex sm:items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="size-9 sm:size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label="Delete variable"
            >
              <MinusCircle className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </>
    );
  })
);
