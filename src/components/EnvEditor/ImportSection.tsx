"use client";

import React, { memo, useRef, useState } from "react";
import { Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ImportSectionProps {
  importText: string;
  onImportTextChange: (text: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
  onClear: () => void;
}

export const ImportSection = memo(function ImportSection({
  importText,
  onImportTextChange,
  onFileUpload,
  onImport,
  onClear,
}: ImportSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const variableCount = importText
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#")).length;

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onImportTextChange(content);
      };
      reader.readAsText(file);
    }
  };

  // Smart paste detection - automatically detect and format pasted content
  const handleSmartPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    
    // Auto-format common patterns
    let formattedText = pastedText;
    
    // Detect JSON format and convert to .env format
    try {
      const parsed = JSON.parse(pastedText);
      if (typeof parsed === 'object' && parsed !== null) {
        formattedText = Object.entries(parsed)
          .map(([key, value]) => `${key}=${value}`)
          .join('\n');
      }
    } catch {
      // Not JSON, continue with other formats
    }
    
    // Detect key-value pairs with colons and convert to equals
    if (formattedText.includes(':') && !formattedText.includes('=')) {
      formattedText = formattedText
        .split('\n')
        .map(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim().replace(/["']/g, '');
            const value = line.substring(colonIndex + 1).trim().replace(/["',]/g, '');
            return `${key}=${value}`;
          }
          return line;
        })
        .join('\n');
    }
    
    // Clean up common issues
    formattedText = formattedText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//') && !line.startsWith('/*'))
      .join('\n');
    
    // If the formatted text is different, use it
    if (formattedText !== pastedText) {
      e.preventDefault();
      onImportTextChange(formattedText);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Smart Import
        </CardTitle>
        <CardDescription>
          Import environment variables from files, JSON, or paste any format - we'll automatically convert it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section with Drag & Drop */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Upload File or Drag & Drop</Label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
              ${dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-muted/50'
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
              onChange={onFileUpload}
              className="hidden"
            />
            <div className="text-center">
              <Upload className={`h-8 w-8 mx-auto mb-4 transition-colors
                ${dragActive ? 'text-blue-500' : 'text-muted-foreground'}
              `} />
              <Button
                variant="outline"
                className="mb-2"
                type="button"
              >
                Choose file
              </Button>
              <p className="text-xs text-muted-foreground">
                Supports .env, .txt, .json, .yml files or drag & drop here
              </p>
            </div>
          </div>
        </div>

        {/* Smart Paste Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            Smart Paste Area
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
              Auto-formats
            </span>
          </Label>
          <Textarea
            value={importText}
            onChange={(e) => onImportTextChange(e.target.value)}
            onPaste={handleSmartPaste}
            placeholder={`# Paste any format - we'll auto-convert it!

Examples that work:
• KEY=value (standard .env)
• "key": "value" (JSON format)  
• key: value (YAML style)
• KEY=value1,KEY2=value2 (comma-separated)

Try pasting:
{
  "API_KEY": "your-key",
  "DATABASE_URL": "postgres://..."
}`}
            className="font-mono text-sm min-h-[200px] resize-none"
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <p className="text-xs text-muted-foreground">
                {variableCount} variables detected
              </p>
              {variableCount > 0 && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full">
                  Ready to import
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClear}>
                Clear
              </Button>
              <Button
                size="sm"
                onClick={onImport}
                disabled={!importText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import {variableCount > 0 ? `${variableCount} Variables` : 'Variables'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tips */}
        {variableCount === 0 && importText.trim() && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              💡 <strong>Tip:</strong> Make sure your format includes key-value pairs. Try pasting JSON objects, YAML content, or standard KEY=value pairs.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
