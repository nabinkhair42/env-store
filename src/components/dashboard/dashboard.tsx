'use client';

import { ProjectCard } from '@/components/dashboard/project-card';
import { ProjectForm } from '@/components/dashboard/project-form';
import { DashboardSkeleton } from '@/components/loaders';
import { Button } from '@/components/ui/button';
import { ItemGroup } from '@/components/ui/item';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAppContext } from '@/contexts/app-context';
import { useDeleteProject, useProjects } from '@/hooks/use-projects';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function buildPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

export function Dashboard() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProjects(page);
  const { mutate: deleteProject } = useDeleteProject();
  const { showProjectForm, setShowProjectForm } = useAppContext();
  const router = useRouter();

  const projects = data?.projects ?? [];
  const sharedProjects = data?.sharedProjects ?? [];
  const pagination = data?.pagination;
  const hasProjects = projects.length > 0 || sharedProjects.length > 0;
  const totalPages = pagination?.totalPages ?? 1;
  const showPagination = totalPages > 1;

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="flex flex-col gap-4 py-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Your Projects
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {pagination?.total
                ? `${pagination.total} project${pagination.total !== 1 ? 's' : ''} · Manage environment variables by project`
                : 'Manage environment variables by project'}
            </p>
          </div>
          {!isLoading && hasProjects && (
            <Button
              onClick={() => setShowProjectForm(true)}
              className="w-full md:w-auto"
            >
              <HugeiconsIcon icon={Add01Icon} size={16} />
              New Project
            </Button>
          )}
        </div>

        {isLoading ? (
          <DashboardSkeleton />
        ) : !hasProjects ? (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">
              No projects yet. Create one to get started.
            </p>
            <div className="mt-4">
              <Button onClick={() => setShowProjectForm(true)}>
                <HugeiconsIcon icon={Add01Icon} size={16} />
                Create Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 pb-12">
            {projects.length > 0 && (
              <div>
                {sharedProjects.length > 0 && (
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    My Projects
                  </p>
                )}
                <ItemGroup>
                  {projects.map((project) => (
                    <div key={project._id as string}>
                      <ProjectCard
                        project={project}
                        role="owner"
                        onSelect={(p) => router.push(`/dashboard/${p._id}`)}
                        onDelete={(id) => deleteProject(id)}
                      />
                    </div>
                  ))}
                </ItemGroup>

                {showPagination && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={(e) => {
                              e.preventDefault();
                              goTo(page - 1);
                            }}
                            aria-disabled={page === 1}
                            className={
                              page === 1
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>

                        {buildPageList(page, totalPages).map((p, i) =>
                          p === 'ellipsis' ? (
                            <PaginationItem key={`e-${i}`}>
                              <span className="px-2 text-muted-foreground">…</span>
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={p}>
                              <PaginationLink
                                onClick={(e) => {
                                  e.preventDefault();
                                  goTo(p);
                                }}
                                isActive={p === page}
                                className="cursor-pointer"
                              >
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          ),
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={(e) => {
                              e.preventDefault();
                              goTo(page + 1);
                            }}
                            aria-disabled={page === totalPages}
                            className={
                              page === totalPages
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            )}

            {sharedProjects.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  Shared with Me
                </p>
                <ItemGroup>
                  {sharedProjects.map((project) => (
                    <div key={project._id as string}>
                      <ProjectCard
                        project={project}
                        role={project.memberRole ?? 'viewer'}
                        onSelect={(p) => router.push(`/dashboard/${p._id}`)}
                        onDelete={(id) => deleteProject(id)}
                      />
                    </div>
                  ))}
                </ItemGroup>
              </div>
            )}
          </div>
        )}
      </div>

      {showProjectForm && (
        <ProjectForm
          onSuccess={() => setShowProjectForm(false)}
          onCancel={() => setShowProjectForm(false)}
        />
      )}
    </>
  );
}
