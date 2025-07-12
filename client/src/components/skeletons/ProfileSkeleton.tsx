import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-6">
        {/* Avatar skeleton */}
        <Skeleton className="w-24 h-24 rounded-full" />
        
        <div className="flex-1">
          {/* Name skeleton */}
          <Skeleton className="h-8 w-48 mb-2" />
          
          {/* Email skeleton */}
          <Skeleton className="h-4 w-64 mb-2" />
          
          {/* Role skeleton */}
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        {/* Edit button skeleton */}
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function ProfileFormSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <Skeleton className="h-6 w-32 mb-6" />
      
      <div className="space-y-4">
        {/* Form fields skeleton */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        
        {/* Submit button skeleton */}
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}