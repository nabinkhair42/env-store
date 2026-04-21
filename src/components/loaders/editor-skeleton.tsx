export function EditorSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-muted animate-pulse" />
          <div className="h-4 w-64 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
          <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
          <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
        </div>
      </div>

      {/* Variable rows */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md border p-3"
          >
            <div className="h-4 w-32 rounded bg-muted animate-pulse" />
            <div className="h-4 w-4 rounded bg-muted/50 animate-pulse" />
            <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
            <div className="h-4 w-8 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
