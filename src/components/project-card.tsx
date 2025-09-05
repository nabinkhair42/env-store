'use client';

import type React from 'react';

import { ConfirmDialog } from '@/components/modal/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { IProject } from '@/lib/types';
import { downloadFile, generateEnvFile } from '@/lib/utils/env-parser';
import { hasEncryptedVariables } from '@/lib/crypto';
import { Clock, Copy, Download, Edit, FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ProjectCardProps {
  project: IProject;
  onSelect: (project: IProject) => void;
  onEdit?: (project: IProject) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({
  project,
  onSelect,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Check if variables contain encrypted data
      if (project.variables && hasEncryptedVariables(project.variables)) {
        toast.error(
          'Cannot copy encrypted variables. Please open the project to decrypt and copy.'
        );
        return;
      }

      // Only process if all values are strings
      const stringVariables =
        project.variables
          ?.filter((v) => typeof v.value === 'string')
          .map((v) => ({
            key: v.key,
            value: v.value as string,
            description: v.description,
          })) || [];

      if (stringVariables.length === 0) {
        toast.error('No variables available to copy.');
        return;
      }

      const envContent = generateEnvFile(stringVariables);
      await navigator.clipboard.writeText(envContent);
      toast.success('Environment variables copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy environment variables');
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Check if variables contain encrypted data
      if (project.variables && hasEncryptedVariables(project.variables)) {
        toast.error(
          'Cannot download encrypted variables. Please open the project to decrypt and download.'
        );
        return;
      }

      // Only process if all values are strings
      const stringVariables =
        project.variables
          ?.filter((v) => typeof v.value === 'string')
          .map((v) => ({
            key: v.key,
            value: v.value as string,
            description: v.description,
          })) || [];

      if (stringVariables.length === 0) {
        toast.error('No variables available to download.');
        return;
      }

      const envContent = generateEnvFile(stringVariables);
      downloadFile(envContent, `${project.name}.env`);
      toast.success('Environment file downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download environment file');
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(project);
    }
  };

  const confirmDelete = () => {
    onDelete(project._id as string);
    setShowDeleteConfirm(false);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const variableCount = project.variables?.length || 0;

  return (
    <>
      <Card
        onClick={() => onSelect(project)}
        className="border cursor-pointer hover:border-primary border-dashed duration-300 ease-in-out"
      >
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
              </div>
              {project.description && (
                <CardDescription className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex flex-col items-start gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span className="font-medium">{variableCount}</span>
              <span>
                environment {variableCount === 1 ? 'variable' : 'variables'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Updated {formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 border-t flex justify-between border-dashed">
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="h-3 w-3" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-3 w-3" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-3 w-3" />
            </Button>
          </div>
          <Button variant="destructive" onClick={handleDelete} size="icon">
            <Trash2 className="size-4" />
          </Button>
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.name}"? This action cannot be undone and will permanently remove all environment variables in this project.`}
        confirmText="Delete Project"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </>
  );
}
