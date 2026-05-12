import { Skeleton } from "./Skeleton";

export const HotelCardSkeleton = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden flex flex-col h-full shadow-sm">
      <Skeleton className="h-60 w-full" />
      <div className="p-7 flex-1 flex flex-col justify-between">
        <div className="mb-5 space-y-3">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-3 w-1/2 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
          <div className="space-y-1.5">
            <Skeleton className="h-2 w-12 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
