"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { IProject } from '@/lib/models/Project';
import { downloadFile, generateEnvFile } from '@/lib/utils/env-parser';
import { Calendar, Download, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProjectCardProps {
  project: IProject;
  onSelect: (project: IProject) => void;
  onEdit?: (project: IProject) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onSelect, onEdit, onDelete }: ProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    onDelete(project._id!);
    setShowDeleteConfirm(false);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(project)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg truncate">{project.name}</CardTitle>
            {project.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {project.description}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{project.variables?.length || 0} variables</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-auto p-1 text-xs" onClick={handleEdit}>
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
      
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.name}"? This action cannot be undone and will permanently remove all environment variables in this project.`}
        confirmText="Delete Project"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </Card>
  );
}
