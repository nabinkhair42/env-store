import { EditorSkeleton } from '@/components/loaders';

export default function Loading() {
  return (
    <div>
      <div className="mx-auto w-full max-w-4xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 rounded bg-muted animate-pulse" />
            <span className="text-muted-foreground/30">/</span>
            <div className="h-4 w-32 rounded bg-muted animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
            <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
      </div>
      <EditorSkeleton />
    </div>
  );
}
