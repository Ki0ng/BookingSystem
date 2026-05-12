import { Skeleton } from "./Skeleton";

export const HotelCardSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[450px] w-full rounded-[2rem]" />
      <div className="flex justify-between items-center px-2">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-2 items-end flex flex-col">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
};
