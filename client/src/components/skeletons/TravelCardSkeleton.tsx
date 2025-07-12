import { Skeleton } from "@/components/ui/skeleton";

export function FlightCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        {/* Airline info skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded" />
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        
        {/* Price skeleton */}
        <div className="text-right">
          <Skeleton className="h-6 w-24 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      
      {/* Flight details skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <Skeleton className="h-6 w-16 mb-1" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-1 w-16" />
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-1 w-16" />
          </div>
          <div className="text-center">
            <Skeleton className="h-6 w-16 mb-1" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        
        <div className="text-center">
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      
      {/* Amenities skeleton */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>
      
      {/* Action buttons skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function TourCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48" />
      
      <div className="p-4">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        
        {/* Location and duration skeleton */}
        <div className="flex items-center gap-4 mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Price and rating skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <Skeleton className="h-6 w-20 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        
        {/* Features skeleton */}
        <div className="flex flex-wrap gap-1 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
        
        {/* Button skeleton */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function TravelGridSkeleton({ count = 6, type = "flight" }: { count?: number; type?: "flight" | "tour" }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        type === "flight" ? <FlightCardSkeleton key={i} /> : <TourCardSkeleton key={i} />
      ))}
    </div>
  );
}