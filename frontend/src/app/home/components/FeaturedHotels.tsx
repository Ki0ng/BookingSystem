import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { HotelCard } from '@/shared/components/ui/HotelCard';
import { HotelCardSkeleton } from '@/shared/components/ui/HotelCardSkeleton';
import { Hotel } from '@/shared/types';

interface FeaturedHotelsProps {
  hotels: Hotel[];
  loading: boolean;
}

export const FeaturedHotels = ({ hotels, loading }: FeaturedHotelsProps) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 w-full">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="max-w-xl">
          <span className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">Curated Selection</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 leading-tight tracking-tight">Featured <span className="italic font-serif text-blue-600">Destinations</span></h2>
          <p className="text-gray-500 mt-4 text-base font-medium">Extraordinary stays, handpicked for the discerning traveler.</p>
        </div>
        <Link href="/hotels">
          <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50 h-11 px-6 font-bold text-xs uppercase tracking-widest">
            Explore All <ArrowRight className="ml-2 w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {loading ? (
          [1, 2, 3].map(i => <HotelCardSkeleton key={i} />)
        ) : hotels.length > 0 ? (
          hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              id={hotel.id}
              name={hotel.name}
              address={hotel.address}
              images={hotel.images}
              average_rating={hotel.average_rating}
              rooms={hotel.rooms}
              variant="grid"
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">No featured properties yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};
