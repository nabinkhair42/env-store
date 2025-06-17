"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/modal/confirm-dialog";
import type { IProject } from "@/lib/models/Project";
import { downloadFile, generateEnvFile } from "@/lib/utils/env-parser";
import { toast } from "@/lib/utils/toast";
import { Clock, Copy, Download, Edit, FileText, Trash2 } from "lucide-react";
import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const envContent = generateEnvFile(project.variables || []);
      await navigator.clipboard.writeText(envContent);
      toast.success("Environment variables copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy environment variables:", error);
      toast.error("Failed to copy environment variables");
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const envContent = generateEnvFile(project.variables || []);
      downloadFile(envContent, `${project.name}.env`);
    } catch (error) {
      console.error("Failed to download environment file:", error);
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

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const variableCount = project.variables?.length || 0;

  return (
    <>
      <Card
        onClick={() => onSelect(project)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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

            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 p-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ${
                isHovered ? "opacity-100 text-destructive hover:text-destructive bg-destructive/20 hover:bg-destructive/20 " : ""
              }`}
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex flex-col items-start gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span className="font-medium">{variableCount}</span>
              <span>
                environment {variableCount === 1 ? "variable" : "variables"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Updated {formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 border-t">
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={handleCopy}
            >
              <Copy className="h-3 w-3 mr-1.5" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={handleEdit}
            >
              <Edit className="h-3 w-3 mr-1.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={handleDownload}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
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
