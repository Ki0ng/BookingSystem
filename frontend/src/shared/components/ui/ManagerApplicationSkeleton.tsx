import { Skeleton } from "./Skeleton";

export const ManagerApplicationSkeleton = () => {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      
      <div className="space-y-3 pt-4 border-t border-gray-50">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      <div className="flex gap-3 pt-6">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 flex-1 rounded-xl" />
      </div>
    </div>
  );
};
