import { Skeleton } from "./Skeleton";

export const ProfileSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Sidebar Skeleton */}
        <div className="w-full md:w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2 text-center w-full">
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            </div>
            <div className="space-y-3 pt-6 border-t border-gray-50">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 space-y-8 w-full">
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>
            
            <Skeleton className="h-14 w-40 rounded-xl pt-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
