'use client';

import React, { memo, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EnvVariable } from '@/lib/zod';
import { parseEnvFile } from '@/lib/utils/env-parser';

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
        onFileVariables(variables);
      } catch (error) {
        console.error('Failed to parse file:', error);
      }
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
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Import from File
        </CardTitle>
        <CardDescription>
          Upload environment variable files (.env, .json, .yml) or drag & drop
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* File Upload Section with Drag & Drop */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Upload File or Drag & Drop
          </Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
              ${
                dragActive
                  ? 'border-primary bg-primary/10 dark:bg-primary/20'
                  : 'border hover:bg-muted/50'
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
              <Upload
                className={`h-8 w-8 mx-auto mb-4 transition-colors
                ${dragActive ? 'text-primary' : 'text-muted-foreground'}
              `}
              />
              <Button variant="outline" className="mb-2" type="button">
                Choose file
              </Button>
              <p className="text-xs text-muted-foreground">
                Supports .env, .txt, .json, .yml files or drag & drop here
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
