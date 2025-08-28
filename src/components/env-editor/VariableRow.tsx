'use client';

import { Button } from '@/components/ui/button';
import { EnvVariable } from '@/lib/zod';
import { X } from 'lucide-react';
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
      <div className="group relative border rounded-lg p-4 hover:bg-muted/50 transition-colors">
        <div className="grid gap-4 md:grid-cols-6 ">
          {/* Key Field */}
          <div className="md:col-span-2">
            <SmartVariableInput
              ref={keyInputRef}
              variable={variable}
              index={index}
              field="key"
              placeholder="API_KEY"
              className="font-mono text-sm"
              onUpdate={onUpdate}
              onSmartPaste={onSmartPaste}
              onNavigateNext={handleNavigateFromKey}
              onNavigatePrevious={handleNavigateToPreviousRow}
              autoFocus={index === 0 && !variable.key}
              label="Key"
            />
          </div>

          {/* Value Field with Preview */}
          <div className="md:col-span-3">
            <SmartVariableInput
              ref={valueInputRef}
              variable={variable}
              index={index}
              field="value"
              type="text"
              placeholder="your-secret-value"
              className="font-mono text-sm"
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
  })
);
