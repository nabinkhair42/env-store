'use client';

import { EnvEditor } from '@/components/editors/index';
import { EditorSkeleton } from '@/components/loaders';
import { MembersPanel } from '@/components/members';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useProject } from '@/hooks/use-projects';
import { ArrowLeft01Icon, UserMultiple02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, refetch } = useProject(id);
  const [showMembers, setShowMembers] = useState(false);

  const role = project?.memberRole ?? 'owner';
  const readOnly = role === 'viewer';

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMembers(true)}
            >
              <HugeiconsIcon icon={UserMultiple02Icon} size={16} />
              Share
            </Button>
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
        <MembersPanel
          projectId={project._id as string}
          currentRole={role}
          open={showMembers}
          onOpenChange={setShowMembers}
        />
      )}
    </div>
  );
}
