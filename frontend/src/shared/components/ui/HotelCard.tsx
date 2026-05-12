'use client';

import { Star, MapPin, Heart, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/shared/utils/utils';

interface HotelCardProps {
  id: string;
  name: string;
  address: string;
  images: { url: string }[];
  average_rating: number;
  rooms?: { base_price: number }[];
  className?: string;
  variant?: 'grid' | 'list';
  searchParams?: Record<string, string | string[] | undefined>;
}

export const HotelCard = ({
  id,
  name,
  address,
  images,
  average_rating,
  rooms,
  className = '',
  variant = 'grid',
  searchParams
}: HotelCardProps) => {
  const price = rooms && rooms.length > 0 ? rooms[0].base_price : null;
  const image = images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';

  const getDetailLink = () => {
    const baseUrl = `/hotels/${id}`;
    if (!searchParams) return baseUrl;
    
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (value !== undefined) {
        params.append(key, value);
      }
    });
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  if (variant === 'list') {
    return (
      <div className={cn(
        "group relative bg-white border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-[0_30px_60px_rgba(37,99,235,0.08)] hover:-translate-y-1.5 overflow-hidden flex flex-col md:flex-row h-full md:h-72",
        "rounded-[2rem]",
        className
      )}>
        <div className="w-full md:w-80 h-60 md:h-auto overflow-hidden relative">
          <Image 
            src={image} 
            alt={name} 
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000" 
          />
          <div className="absolute top-5 left-5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-sm">
            Top Rated
          </div>
        </div>
        
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1.5">
              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{name}</h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-blue-600" />
                {average_rating || '5.0'}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest mb-5">
              <MapPin className="w-3 h-3" />
              {address}
            </div>

            <div className="flex flex-wrap gap-2">
              {['WiFi', 'AC', 'Pool'].map(a => (
                <div key={a} className="px-3.5 py-1.5 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  {a}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {price ? 'Starting from' : 'Price Status'}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900">
                  {price ? `$${price}` : 'TBA'}
                </span>
                {price && <span className="text-slate-400 text-[11px] font-bold">/night</span>}
              </div>
            </div>
            <Link href={getDetailLink()}>
              <Button variant="premium" size="lg" className="h-12 px-6 flex items-center gap-2 rounded-xl text-xs font-bold">
                View Details <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "group relative bg-white border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-[0_30px_60px_rgba(37,99,235,0.1)] hover:-translate-y-1.5 overflow-hidden flex flex-col h-full",
      "rounded-[2rem]",
      className
    )}>
      <div className="relative h-60 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-bold text-blue-600 shadow-sm flex items-center tracking-widest">
          <Star className="w-3 h-3 mr-1 fill-blue-600" /> {average_rating || '5.0'}
        </div>
        <button className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all">
          <Heart className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-7 flex-1 flex flex-col justify-between">
        <div className="mb-5">
          <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight mb-1.5 truncate">{name}</h3>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-blue-500" /> {address}
          </p>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
          <div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Per Night</p>
            <p className="text-xl font-extrabold text-blue-600 tracking-tight">
              {price ? `$${price}` : 'TBA'}
            </p>
          </div>
          <Link href={getDetailLink()}>
            <Button variant="secondary" size="sm" className="h-9 px-4 rounded-xl font-bold text-[9px] uppercase tracking-widest">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
