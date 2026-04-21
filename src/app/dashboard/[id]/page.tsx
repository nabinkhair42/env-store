'use client';

import { EnvEditor } from '@/components/editors/index';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useProject } from '@/hooks/use-projects';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, refetch } = useProject(id);

  return (
    <div>
      <div className="mx-auto w-full max-w-4xl px-6 py-4">
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
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="size-5" />
        </div>
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
        <EnvEditor project={project} onUpdate={() => refetch()} />
      )}
    </div>
  );
}
