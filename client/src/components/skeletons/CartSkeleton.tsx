import { Skeleton } from "@/components/ui/skeleton";

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
      {/* Product image skeleton */}
      <Skeleton className="w-16 h-16 rounded-md" />
      
      <div className="flex-1">
        {/* Product name skeleton */}
        <Skeleton className="h-5 w-3/4 mb-2" />
        
        {/* Price and quantity skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
      
      {/* Remove button skeleton */}
      <Skeleton className="h-8 w-8" />
    </div>
  );
}

export function CartSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Skeleton className="h-6 w-32" />
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: items }).map((_, i) => (
          <CartItemSkeleton key={i} />
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function WishlistSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <Skeleton className="w-20 h-20 rounded-md" />
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}