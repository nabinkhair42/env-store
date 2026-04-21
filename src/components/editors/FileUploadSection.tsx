'use client';

import { Button } from '@/components/ui/button';
import { parseEnvFile } from '@/lib/utils/env-parser';
import { EnvVariable } from '@/schema/environment-variable';
import { Upload02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import React, { memo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

interface FileUploadSectionProps {
  onFileVariables: (variables: EnvVariable[]) => void;
  inline?: boolean;
}

export const FileUploadSection = memo(function FileUploadSection({
  onFileVariables,
  inline = false,
}: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
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
          toast.error('No valid environment variables found');
          return;
        }

        onFileVariables(variables);
        toast.success(
          `Imported ${variables.length} variable${variables.length !== 1 ? 's' : ''}`
        );
      } catch (error) {
        console.error('Failed to parse file:', error);
        toast.error('Failed to parse file');
      }
    };
    reader.onerror = () => toast.error('Failed to read file');
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) processFile(files[0]);
  };

  const hiddenInput = (
    <input
      type="file"
      ref={fileInputRef}
      accept=".env,.txt,.json,.yml,.yaml"
      onChange={handleFileUpload}
      className="hidden"
    />
  );

  // Inline mode: just a button (used in empty state)
  if (inline) {
    return (
      <>
        {hiddenInput}
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <HugeiconsIcon icon={Upload02Icon} size={16} />
          Import File
        </Button>
      </>
    );
  }

  // Full mode: compact drop zone
  return (
    <div className="mt-6 pb-6">
      {hiddenInput}
      <div
        className={`rounded-lg border border-dashed p-4 transition-colors cursor-pointer text-center ${
          dragActive ? 'border-primary bg-muted/50' : 'hover:bg-muted/20'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="text-sm text-muted-foreground">
          Drop a file here or{' '}
          <span className="text-foreground font-medium">browse</span>
          <span className="text-muted-foreground/60 ml-1">
            (.env, .json, .yml)
          </span>
        </p>
      </div>
    </div>
  );
});
