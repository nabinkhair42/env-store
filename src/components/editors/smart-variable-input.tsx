'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseEnvFile } from '@/lib/env-parser';
import { EnvVariable } from '@/schema/environment-variable';
import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { toast } from 'react-hot-toast';

interface SmartVariableInputProps {
  variable: EnvVariable;
  index: number;
  field: keyof EnvVariable;
  placeholder?: string;
  type?: string;
  onUpdate: (field: keyof EnvVariable, value: string) => void;
  onSmartPaste: (variables: EnvVariable[]) => void;
  onNavigateNext?: () => void;
  className?: string;
  autoFocus?: boolean;
  isVisibleRequired?: boolean;
  isValueVisible?: boolean;
  onToggleVisibility?: () => void;
}

export interface SmartVariableInputRef {
  focus: () => void;
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
    className,
    autoFocus = false,
    isVisibleRequired = false,
    isValueVisible = true,
    onToggleVisibility,
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData('text').trim();
      if (!text) return;

      const lines = text.split('\n').filter((l) => l.trim());

      if (lines.length === 1 && field === 'key' && text.includes('=')) {
        const match = text.match(/^([^=]+)=(.*)$/);
        if (match) {
          e.preventDefault();
          onUpdate('key', match[1].trim());
          onUpdate('value', match[2].trim());
          return;
        }
      }

      const isMultiLine = lines.length > 1;
      const isJson = text.startsWith('{') && text.endsWith('}');
      if (!isMultiLine && !isJson) return;

      e.preventDefault();
      let parsed: EnvVariable[] = [];

      try {
        parsed = parseEnvFile(text).map((v) => ({ key: v.key, value: v.value }));
      } catch {
        // ignore
      }

      if (parsed.length === 0 && isJson) {
        try {
          const obj = JSON.parse(text);
          if (typeof obj === 'object' && obj && !Array.isArray(obj)) {
            parsed = Object.entries(obj).map(([k, v]) => ({
              key: k.trim(),
              value: String(v).trim(),
            }));
          }
        } catch {
          // ignore
        }
      }

      const valid = parsed.filter((v) => v.key.length > 0);
      if (valid.length > 0) {
        onSmartPaste(valid);
        toast.success(`Pasted ${valid.length} variable${valid.length !== 1 ? 's' : ''}`);
      } else {
        toast.error('Could not parse pasted content');
      }
    },
    [field, onSmartPaste, onUpdate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onNavigateNext) {
        e.preventDefault();
        onNavigateNext();
      }
      if (e.key === 'Tab' && field === 'key' && onNavigateNext) {
        e.preventDefault();
        onNavigateNext();
      }
      if (e.key === 'Escape') {
        (e.target as HTMLInputElement).blur();
      }
    },
    [field, onNavigateNext]
  );

  return (
    <div className="relative w-full">
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
      {isVisibleRequired && onToggleVisibility && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onToggleVisibility}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-label={isValueVisible ? 'Hide value' : 'Show value'}
        >
          <HugeiconsIcon
            icon={isValueVisible ? ViewOffIcon : ViewIcon}
            size={14}
          />
        </Button>
      )}
    </div>
  );
});
