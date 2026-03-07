'use client';

import { ConfirmDialog } from '@/components/modal/confirm-dialog';
import { Button } from '@/components/ui/button';
import type { IProject } from '@/lib/types';
import { downloadFile, generateEnvFile } from '@/lib/utils/env-parser';
import { Copy, Download, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ProjectCardProps {
  project: IProject;
  onSelect: (project: IProject) => void;
  onEdit?: (project: IProject) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onSelect, onDelete }: ProjectCardProps) {
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

  const confirmDelete = () => {
    onDelete(project._id as string);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="group transition-colors hover:bg-muted/20">
        <div
          onClick={() => onSelect(project)}
          className="w-full cursor-pointer px-6 text-left transition-colors hover:bg-muted/30 flex items-start justify-between flex-col lg:flex-row gap-1 py-4"
        >
          {/* Project Content */}
          <div className="flex items-start justify-between flex-col gap-1">
            <div className="min-w-0 flex-1">
              <h3 className="mt-1 text-lg font-bold tracking-tight text-foreground">
                {project.name}
              </h3>
            </div>
            {project.description && (
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
          {/* Project Actions */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size={'icon'}
              onClick={handleCopy}
              className="flex-1 rounded-none hover:bg-primary/10 hover:text-primary"
              title="Copy to clipboard"
            >
              <Copy className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size={'icon'}
              onClick={handleDownload}
              className="flex-1 rounded-none hover:bg-primary/10 hover:text-primary"
              title="Download .env file"
            >
              <Download className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size={'icon'}
              onClick={handleDelete}
              className="flex-1 rounded-none hover:bg-destructive/10 hover:text-destructive"
              title="Delete project"
            >
              <Trash2 className="size-4" />
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
