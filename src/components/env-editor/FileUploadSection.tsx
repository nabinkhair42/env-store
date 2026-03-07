'use client';

import React, { memo, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Upload02Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { EnvVariable } from '@/lib/zod';
import { parseEnvFile } from '@/lib/utils/env-parser';
import { toast } from 'react-hot-toast';

interface FileUploadSectionProps {
  onFileVariables: (variables: EnvVariable[]) => void;
}

export const FileUploadSection = memo(function FileUploadSection({
  onFileVariables,
}: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const parsedVars = parseEnvFile(content);
        const variables = parsedVars.map((v) => ({
          key: v.key,
          value: v.value,
        }));

        if (variables.length === 0) {
          toast.error('No valid environment variables found in the file');
          return;
        }

        onFileVariables(variables);
        toast.success(
          `Successfully imported ${variables.length} variable${variables.length !== 1 ? 's' : ''}`
        );
      } catch (error) {
        console.error('Failed to parse file:', error);
        toast.error(
          error instanceof Error
            ? `Failed to parse file: ${error.message}`
            : "Failed to parse file. Please ensure it's in a valid format (.env, .json, .yml)"
        );
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read file. Please try again.');
    };

    reader.readAsText(file);
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  return (
    <div className="rail-bounded">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Upload02Icon}
              size={20}
              className="text-primary"
            />
            <h2 className="text-lg font-bold tracking-tight">
              Import from File
            </h2>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                  aria-label="Show supported file formats"
                >
                  <HugeiconsIcon icon={InformationCircleIcon} size={14} />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Supported Formats</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong>.env files:</strong>
                      <pre className="mt-1 p-2 bg-muted text-[10px]">
                        API_KEY=secret{'\n'}
                        DATABASE_URL=postgres://...
                      </pre>
                    </div>
                    <div>
                      <strong>.json files:</strong>
                      <pre className="mt-1 p-2 bg-muted text-[10px]">
                        {`{\n  "API_KEY": "secret",\n  "DATABASE_URL": "..."\n}`}
                      </pre>
                    </div>
                    <div>
                      <strong>.yml files:</strong>
                      <pre className="mt-1 p-2 bg-muted text-[10px]">
                        API_KEY: secret{'\n'}
                        DATABASE_URL: postgres://...
                      </pre>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload environment variable files (.env, .json, .yml) or drag & drop
          </p>

          <div className="space-y-3 pt-2">
            <Label className="text-sm font-medium">
              Upload File or Drag & Drop
            </Label>
            <div
              className={`border border-dashed border-border p-6 transition-all duration-200 cursor-pointer
                ${
                  dragActive
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'hover:bg-muted/50'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".env,.txt,.json,.yml,.yaml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-center">
                <HugeiconsIcon
                  icon={Upload02Icon}
                  size={32}
                  className={`mx-auto mb-4 transition-colors
                  ${dragActive ? 'text-primary' : 'text-muted-foreground'}
                `}
                />
                <Button variant="outline" className="mb-2" type="button">
                  <span className="text-xs uppercase tracking-wide">
                    Choose file
                  </span>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Supports .env, .txt, .json, .yml files or drag & drop here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
