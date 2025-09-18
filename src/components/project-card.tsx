'use client';

import { ConfirmDialog } from '@/components/modal/confirm-dialog';
import { Button } from '@/components/ui/button';
import type { IProject } from '@/lib/types';
import { downloadFile, generateEnvFile } from '@/lib/utils/env-parser';
import { Calendar, Copy, Download, Edit, FileText, Trash2 } from 'lucide-react';
import type React from 'react';
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
      const envContent = generateEnvFile(project.variables || []);
      await navigator.clipboard.writeText(envContent);
      toast.success('Environment variables copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy environment variables:', error);
      toast.error('Failed to copy environment variables');
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const envContent = generateEnvFile(project.variables || []);
      downloadFile(envContent, `${project.name}.env`);
    } catch (error) {
      console.error('Failed to download environment file:', error);
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
      <div
        onClick={() => onSelect(project)}
        className="cursor-pointer transition-colors hover:bg-muted/50 w-full flex gap-2 justify-between py-3 px-4 rounded-lg border bg-card"
      >
        {/* Project Name & Description */}
        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            <div className="font-medium text-foreground hover:text-primary transition-colors text-sm sm:text-base">
              {project.name}
            </div>
            {project.description && (
              <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 max-w-xs sm:max-w-md">
                {project.description}
              </div>
            )}
            <div className="flex items-center gap-1 md:hidden mt-1">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {variableCount} var{variableCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {variableCount} {variableCount === 1 ? 'variable' : 'variables'}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {project.updatedAt ? formatDate(project.updatedAt) : '-'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted"
              title="Copy environment variables"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted"
                title="Edit project"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted"
              title="Download .env file"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-destructive hover:text-white"
              title="Delete project"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>

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
