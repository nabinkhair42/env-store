'use client';

import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { downloadFile, generateEnvFile } from '@/lib/env-parser';
import type { IProject } from '@/types/projects';
import {
  Copy01Icon,
  Delete02Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState, type MouseEvent } from 'react';
import { toast } from 'react-hot-toast';

interface ProjectCardProps {
  project: IProject;
  onSelect: (project: IProject) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onSelect, onDelete }: ProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCopy = async (e: MouseEvent) => {
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

  const handleDownload = (e: MouseEvent) => {
    e.stopPropagation();
    try {
      const envContent = generateEnvFile(project.variables || []);
      downloadFile(envContent, `${project.name}.env`);
    } catch (error) {
      console.error('Failed to download environment file:', error);
    }
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(project._id as string);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Item
        className="cursor-pointer"
        variant="outline"
        onClick={() => onSelect(project)}
      >
        <ItemContent>
          <ItemTitle>{project.name}</ItemTitle>
          {project.description && (
            <ItemDescription>{project.description}</ItemDescription>
          )}
        </ItemContent>
        <ItemActions>
          <ButtonGroup>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              <HugeiconsIcon icon={Copy01Icon} size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              title="Download .env file"
            >
              <HugeiconsIcon icon={Download01Icon} size={16} />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              title="Delete project"
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </Button>
          </ButtonGroup>
        </ItemActions>
      </Item>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.name}"? This action cannot be undone and will permanently remove all environment variables in this project.`}
        confirmText="Yes, Delete"
        cancelText='No, Keep it'
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </>
  );
}
