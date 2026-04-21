export function DashboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="space-y-2 flex-1">
            <div className="h-4 w-40 rounded bg-muted animate-pulse" />
            <div className="h-3 w-56 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}
