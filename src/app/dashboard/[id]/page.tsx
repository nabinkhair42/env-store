'use client';

import { EnvEditor } from '@/components/editors/index';
import { EditorSkeleton } from '@/components/loaders';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useProject } from '@/hooks/use-projects';
import {
  ArrowLeft01Icon,
  PencilEdit01Icon,
  UserMultiple02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const MembersPanel = dynamic(
  () => import('@/components/members').then((m) => m.MembersPanel),
  { ssr: false },
);
const ProjectForm = dynamic(
  () => import('@/components/dashboard/project-form').then((m) => m.ProjectForm),
  { ssr: false },
);

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, refetch } = useProject(id);
  const [showMembers, setShowMembers] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const role = project?.memberRole ?? 'owner';
  const readOnly = role === 'viewer';
  const canEdit = role === 'owner' || role === 'editor';

  return (
    <div>
      <div className="mx-auto w-full max-w-4xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLoading ? (
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                ) : (
                  <BreadcrumbPage>
                    {project?.name || 'Not Found'}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {project && (
            <ButtonGroup>
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEdit(true)}
                >
                  <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                  Edit
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMembers(true)}
              >
                <HugeiconsIcon icon={UserMultiple02Icon} size={16} />
                Share
              </Button>
            </ButtonGroup>
          )}
        </div>
      </div>

      {isLoading ? (
        <EditorSkeleton />
      ) : !project ? (
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold">Project Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            This project doesn&apos;t exist or has been deleted.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/dashboard">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                Back to Projects
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <EnvEditor
          project={project}
          onUpdate={() => refetch()}
          readOnly={readOnly}
        />
      )}

      {project && (
        <>
          {showMembers && (
            <MembersPanel
              projectId={project._id as string}
              currentRole={role}
              open={showMembers}
              onOpenChange={setShowMembers}
            />
          )}
          {showEdit && (
            <ProjectForm
              project={project}
              onSuccess={() => {
                setShowEdit(false);
                refetch();
              }}
              onCancel={() => setShowEdit(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
