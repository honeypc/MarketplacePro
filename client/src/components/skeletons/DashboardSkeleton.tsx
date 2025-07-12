import { Skeleton } from "@/components/ui/skeleton";

export function DashboardCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="w-12 h-12 rounded-lg" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <DashboardCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <Skeleton className="h-6 w-48 mb-4" />
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
          
          {/* Table rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}