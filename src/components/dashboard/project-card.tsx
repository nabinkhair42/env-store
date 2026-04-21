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
import type { IProject } from '@/types';
import {
  Copy01Icon,
  Delete02Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { type MouseEvent, useState } from 'react';
import { toast } from 'react-hot-toast';

interface ProjectCardProps {
  project: IProject;
  onSelect: (project: IProject) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onSelect, onDelete }: ProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getEnvContent = () => generateEnvFile(project.variables || []);

  const handleAction = (e: MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
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
              onClick={(e) =>
                handleAction(e, async () => {
                  await navigator.clipboard.writeText(getEnvContent());
                  toast.success('Copied to clipboard');
                })
              }
              title="Copy"
            >
              <HugeiconsIcon icon={Copy01Icon} size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) =>
                handleAction(e, () =>
                  downloadFile(getEnvContent(), `${project.name}.env`)
                )
              }
              title="Download"
            >
              <HugeiconsIcon icon={Download01Icon} size={16} />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => handleAction(e, () => setShowDeleteConfirm(true))}
              title="Delete"
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
        description={`Are you sure you want to delete "${project.name}"? This will permanently remove all variables.`}
        confirmText="Yes, Delete"
        cancelText="No, Keep it"
        onConfirm={() => {
          onDelete(project._id as string);
          setShowDeleteConfirm(false);
        }}
        variant="destructive"
      />
    </>
  );
}
