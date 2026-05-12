import { Skeleton } from "./Skeleton";

export const HotelListSkeleton = () => {
  return (
    <div className="bg-white rounded-[3rem] overflow-hidden border border-slate-50 flex flex-col md:flex-row h-auto md:h-80 shadow-sm">
      {/* Image Skeleton */}
      <div className="w-full md:w-[40%] h-64 md:h-full relative overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>

          <div className="flex gap-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        <div className="flex justify-between items-end pt-6 border-t border-slate-50">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-14 w-40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
