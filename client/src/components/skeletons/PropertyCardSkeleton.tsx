import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Image skeleton */}
      <div className="relative">
        <Skeleton className="w-full h-48" />
        <div className="absolute top-3 right-3">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
      
      <div className="p-4">
        {/* Title and location skeleton */}
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        
        {/* Rating and reviews skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Amenities skeleton */}
        <div className="flex flex-wrap gap-1 mb-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
        
        {/* Price skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-24 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}