import React from 'react';
import { Skeleton } from './Skeleton';

const ReviewSkeleton = () => {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div>
            <Skeleton className="w-32 h-4 mb-2" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
        <Skeleton className="w-24 h-5" />
      </div>
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-3/4 h-4" />
    </div>
  );
};

export default ReviewSkeleton;
