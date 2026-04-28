'use client';

import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { AvatarGroup } from '@/components/ui/avatar-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { projectKeys } from '@/hooks/use-projects';
import { projectService } from '@/services/project.service';
import type { IProject, MemberRole } from '@/types';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQueryClient } from '@tanstack/react-query';
import { type MouseEvent, memo, useCallback, useState } from 'react';

interface ProjectCardProps {
  project: IProject;
  role: MemberRole;
  onSelect: (project: IProject) => void;
  onDelete: (projectId: string) => void;
}

function ProjectCardImpl({ project, role, onSelect, onDelete }: ProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isOwner = role === 'owner';
  const qc = useQueryClient();
  const projectId = project._id as string;

  // Prefetch project detail on hover for instant navigation
  const handlePrefetch = useCallback(() => {
    qc.prefetchQuery({
      queryKey: projectKeys.detail(projectId),
      queryFn: async () => {
        const res = await projectService.getById(projectId);
        return res.project;
      },
      staleTime: 30_000,
    });
  }, [qc, projectId]);

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
        onMouseEnter={handlePrefetch}
        onFocus={handlePrefetch}
      >
        <ItemContent>
          <div className="flex items-center gap-2">
            <ItemTitle>{project.name}</ItemTitle>
            {!isOwner && (
              <Badge variant="outline" className="text-[10px]">
                {role}
              </Badge>
            )}
          </div>
          {project.description && (
            <ItemDescription>{project.description}</ItemDescription>
          )}
        </ItemContent>
        {project.members && project.members.length > 0 && (
          <AvatarGroup items={project.members} max={4} />
        )}
        {isOwner && (
          <ItemActions>
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => handleAction(e, () => setShowDeleteConfirm(true))}
              title="Delete"
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </Button>
          </ItemActions>
        )}
      </Item>

      {isOwner && (
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
      )}
    </>
  );
}

export const ProjectCard = memo(ProjectCardImpl);
