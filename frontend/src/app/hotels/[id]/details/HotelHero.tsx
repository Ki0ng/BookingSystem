import React from 'react';
import Image from 'next/image';
import { MapPin, Star, ShieldCheck, ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Hotel } from '@/shared/types';

interface HotelHeroProps {
  hotel: Hotel;
}

export const HotelHero = ({ hotel }: HotelHeroProps) => {
  const router = useRouter();
  
  return (
    <div className="relative h-[70vh] group">
      <Image
        src={hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070'}
        alt={hotel.name}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

      <div className="absolute top-10 left-10">
        <Button onClick={() => router.back()} className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-slate-900 rounded-2xl h-14 px-6 flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" /> Back to Search
        </Button>
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Verified Luxury Property
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">{hotel.name}</h1>
            <div className="flex items-center gap-3 text-white/80 font-bold">
              <MapPin className="w-5 h-5" />
              {hotel.address}
            </div>
          </div>

          <div className="flex items-center gap-8 bg-white/10 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 text-white">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-2xl font-black mb-1">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                {hotel.average_rating && hotel.average_rating > 0 ? hotel.average_rating.toFixed(1) : '5.0'}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Elite Rating</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black mb-1">{hotel.review_count || 0}</div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Guest Reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
