'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { parseEnvFile } from '@/lib/utils/env-parser';
import { EnvVariable } from '@/lib/zod';
import { Eye, EyeOff } from 'lucide-react';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

interface SmartVariableInputProps {
  variable: EnvVariable;
  index: number;
  field: keyof EnvVariable;
  placeholder?: string;
  type?: string;
  onUpdate: (field: keyof EnvVariable, value: string) => void;
  onSmartPaste: (variables: EnvVariable[]) => void;
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
  className?: string;
  autoFocus?: boolean;
  isVisibleRequired?: boolean;
  isValueVisible?: boolean;
  onToggleVisibility?: () => void;
  label?: string;
}

export interface SmartVariableInputRef {
  focus: () => void;
  select: () => void;
}

export const SmartVariableInput = forwardRef<
  SmartVariableInputRef,
  SmartVariableInputProps
>(function SmartVariableInput(
  {
    variable,
    index,
    field,
    placeholder,
    type = 'text',
    onUpdate,
    onSmartPaste,
    onNavigateNext,
    onNavigatePrevious,
    className,
    autoFocus = false,
    isVisibleRequired = false,
    isValueVisible = true,
    onToggleVisibility,
    label,
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    select: () => inputRef.current?.select(),
  }));

  // Auto-focus when requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData('text').trim();

      // If empty paste, handle normally
      if (!pastedText) return;

      // Check if pasted content looks like multiple environment variables
      const lines = pastedText.split('\n').filter((line) => line.trim());

      // Detect if this is bulk content
      const hasMultipleLines = lines.length > 1;
      const hasMultipleEquals = lines.some(
        (line) => (line.match(/=/g) || []).length > 1
      );
      const hasKeyValuePairs = lines.some((line) =>
        /^[^=\s]+\s*[=:]\s*.+/.test(line)
      );
      const isJsonLike =
        pastedText.trim().startsWith('{') && pastedText.trim().endsWith('}');

      const isBulkPaste =
        hasMultipleLines ||
        hasMultipleEquals ||
        isJsonLike ||
        (lines.length === 1 && hasKeyValuePairs && lines[0].length > 50);

      if (isBulkPaste) {
        e.preventDefault();

        const variables: EnvVariable[] = [];

        // Try to parse as environment variables first
        try {
          const parsedVars = parseEnvFile(pastedText);
          if (parsedVars.length > 0) {
            variables.push(
              ...parsedVars.map((v) => ({
                key: v.key,
                value: v.value,
              }))
            );
          }
        } catch (_error) {
          console.log('Failed to parse as env file, trying other formats...');
        }

        // If no variables parsed yet, try other formats
        if (variables.length === 0) {
          // Try JSON format
          try {
            const jsonObj = JSON.parse(pastedText);
            if (
              typeof jsonObj === 'object' &&
              jsonObj !== null &&
              !Array.isArray(jsonObj)
            ) {
              Object.entries(jsonObj).forEach(([key, value]) => {
                if (typeof key === 'string') {
                  variables.push({
                    key: String(key).trim(),
                    value: String(value).trim(),
                  });
                }
              });
            }
          } catch {
            // Not JSON, try other formats
          }
        }

        // If still no variables, try manual parsing
        if (variables.length === 0) {
          lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            // Try key:value format (YAML style)
            const colonMatch = trimmedLine.match(/^([^:]+):\s*(.*)$/);
            if (colonMatch) {
              const [, key, value] = colonMatch;
              variables.push({
                key: key.trim().replace(/^["']|["']$/g, ''),
                value: value
                  .trim()
                  .replace(/^["']|["']$/g, '')
                  .replace(/[,;]$/, ''),
              });
              return;
            }

            // Try key=value format
            const equalMatch = trimmedLine.match(/^([^=]+)=(.*)$/);
            if (equalMatch) {
              const [, key, value] = equalMatch;
              variables.push({
                key: key.trim().replace(/^export\s+/, ''),
                value: value.trim().replace(/^["']|["']$/g, ''),
              });
              return;
            }

            // Try space-separated format (KEY VALUE)
            const spaceMatch = trimmedLine.match(/^(\S+)\s+(.+)$/);
            if (
              spaceMatch &&
              !trimmedLine.includes('=') &&
              !trimmedLine.includes(':')
            ) {
              const [, key, value] = spaceMatch;
              variables.push({
                key: key.trim(),
                value: value.trim(),
              });
            }
          });
        }

        if (variables.length > 0) {
          // Filter out empty variables
          const validVariables = variables.filter((v) => v.key.length > 0);
          if (validVariables.length > 0) {
            onSmartPaste(validVariables);
            return;
          }
        }
      }

      // Single value paste - handle normally but with smart navigation
      // For single-line pastes that look like key=value, split them
      if (lines.length === 1 && lines[0].includes('=') && field === 'key') {
        const equalMatch = lines[0].match(/^([^=]+)=(.*)$/);
        if (equalMatch) {
          e.preventDefault();
          const [, key, value] = equalMatch;
          onUpdate('key', key.trim());
          // Wait for the UI to update, then navigate and set value
          setTimeout(() => {
            if (onNavigateNext) {
              onNavigateNext();
              // Set the value after navigation
              setTimeout(() => {
                onUpdate('value', value.trim());
              }, 50);
            }
          }, 0);
          return;
        }
      }

      // Regular paste - handle normally and maybe auto-navigate
      setTimeout(() => {
        if (
          field === 'key' &&
          pastedText &&
          !pastedText.includes('=') &&
          onNavigateNext
        ) {
          onNavigateNext();
        }
      }, 0);
    },
    [field, onSmartPaste, onNavigateNext, onUpdate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      const cursorPosition = target.selectionStart || 0;

      // Enhanced navigation logic
      switch (e.key) {
        case 'Tab':
          // Let default Tab behavior handle navigation unless we want to override
          if (field === 'key' && value.trim() && onNavigateNext) {
            e.preventDefault();
            onNavigateNext();
          }
          break;

        case 'Enter':
          e.preventDefault();
          if (field === 'key' && onNavigateNext) {
            onNavigateNext();
          } else if (field === 'value' && onNavigateNext) {
            // If we're on value field and there's content, move to next row
            onNavigateNext();
          }
          break;

        case 'ArrowRight':
          // If at end of input and there's a next field, navigate
          if (cursorPosition === value.length && onNavigateNext) {
            e.preventDefault();
            onNavigateNext();
          }
          break;

        case 'ArrowLeft':
          // If at beginning of input and there's a previous field, navigate
          if (cursorPosition === 0 && onNavigatePrevious) {
            e.preventDefault();
            onNavigatePrevious();
          }
          break;

        case 'Backspace':
          // If input is empty and at beginning, navigate to previous field
          if (value === '' && cursorPosition === 0 && onNavigatePrevious) {
            e.preventDefault();
            onNavigatePrevious();
          }
          break;

        case 'Escape':
          // Clear focus
          target.blur();
          break;
      }
    },
    [field, onNavigateNext, onNavigatePrevious]
  );

  return (
    <div className="md:col-span-3 flex flex-col gap-1">
      {label && (
        <div className="flex items-center justify-between min-h-[24px]">
          <Label>{label}</Label>
          <div className="flex items-center">
            {isVisibleRequired && onToggleVisibility && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleVisibility}
                className="size-7"
                aria-label="Toggle visibility"
              >
                {isValueVisible ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
      <Input
        ref={inputRef}
        id={`${field}-${index}`}
        type={isVisibleRequired && !isValueVisible ? 'password' : type}
        value={variable[field] || ''}
        onChange={(e) => onUpdate(field, e.target.value)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
});
