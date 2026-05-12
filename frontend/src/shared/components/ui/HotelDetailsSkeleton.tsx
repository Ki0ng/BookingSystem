import React from 'react';
import { Skeleton } from './Skeleton';

export const HotelDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-32 animate-in fade-in duration-500">
      {/* Hero Skeleton */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-20 left-12 right-12 max-w-7xl mx-auto w-full px-6">
          <Skeleton className="h-4 w-32 mb-4 bg-white/20" />
          <Skeleton className="h-16 w-3/4 mb-6 bg-white/20" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-40 bg-white/20 rounded-full" />
            <Skeleton className="h-10 w-32 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          {/* About Section */}
          <section className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </section>

          {/* Amenities Section */}
          <section className="space-y-8">
            <Skeleton className="h-6 w-56" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-4 p-8 bg-white rounded-[2.5rem] border border-slate-100">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </section>

          {/* Rooms Section */}
          <section className="space-y-8">
            <Skeleton className="h-8 w-64" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex gap-6 h-48">
                  <Skeleton className="w-64 h-full rounded-[1.5rem]" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between items-end pt-4">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-12 w-32 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Map Section */}
          <section className="space-y-8">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-[450px] w-full rounded-[3rem]" />
          </section>

          {/* Reviews Section */}
          <section className="space-y-8">
            <div className="flex justify-between items-end mb-8">
              <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-10 w-40 rounded-xl" />
            </div>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 space-y-4">
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Widget */}
        <aside className="lg:col-span-1">
          <div className="sticky top-32 bg-white rounded-[3rem] border border-slate-100 p-10 space-y-10 shadow-sm">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="w-12 h-12 rounded-2xl" />
            </div>
            
            <div className="p-6 bg-slate-50 rounded-[2rem] space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="pt-6 border-t border-slate-100 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            <Skeleton className="h-16 w-full rounded-[1.5rem]" />
          </div>
        </aside>
      </div>
    </div>
  );
};
