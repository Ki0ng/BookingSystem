'use client';

import React from 'react';
import { 
  Hotel as HotelIcon, 
  MapPin, 
  Star, 
  Plus, 
  BedDouble, 
  Edit, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import Link from 'next/link';
import { useManagerHotels } from '@/features/hotels';

export default function ManagerHotelsPage() {
  const { hotels, loading, handleDelete } = useManagerHotels();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-[2rem] overflow-hidden border border-slate-50 shadow-sm space-y-5 flex flex-col h-[480px]">
            <Skeleton className="h-60 w-full" />
            <div className="p-7 space-y-3 flex-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <div className="pt-5 space-y-3">
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-2">Portfolio Management</p>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">Luxury Properties</h2>
        </div>
        <Link href="/manager/hotels/new">
          <Button className="rounded-xl h-14 px-8 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 font-bold uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-4 h-4" /> Add Elite Property
          </Button>
        </Link>
      </div>

      {hotels.length === 0 ? (
        <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <HotelIcon className="w-9 h-9 text-slate-300" />
          </div>
          <div className="max-w-xs mx-auto">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">No Properties Identified</h3>
            <p className="text-slate-400 text-[13px] mt-2 font-medium leading-relaxed">Start your hospitality journey by registering your first elite property on the platform.</p>
          </div>
          <Link href="/manager/hotels/new" className="inline-block">
            <Button className="rounded-xl px-8 h-12 font-bold uppercase text-[9px] tracking-[0.2em] bg-slate-900 hover:bg-blue-600 shadow-lg shadow-slate-200">
              Begin Onboarding
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col relative">
              {/* Image Preview with Glass UI */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} 
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Link href={`/manager/hotels/edit/${hotel.id}`}>
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl text-slate-900 hover:bg-blue-600 hover:text-white transition-all shadow-xl flex items-center justify-center">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(hotel.id)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-xl flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-900/60 backdrop-blur-xl text-white px-3 py-1.5 rounded-xl text-[9px] font-bold tracking-widest border border-white/20">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {hotel.average_rating?.toFixed(1) || '0.0'}
                </div>
              </div>

              {/* Content with Refined Typography */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 text-[9px] font-bold uppercase tracking-[0.2em] mb-3">
                    <MapPin className="w-3 h-3" />
                    {hotel.address.split(',').slice(-2).join(',').trim()}
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
                  <p className="text-slate-400 text-[12px] font-medium line-clamp-2 mb-6 leading-relaxed">
                    {hotel.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                        <BedDouble className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-none mb-1">{hotel.rooms?.length || 0} Units</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">Management</p>
                      </div>
                    </div>
                    <Link href={`/manager/rooms?hotelId=${hotel.id}`}>
                      <Button variant="ghost" className="text-blue-600 hover:bg-white rounded-lg h-10 px-4 font-bold uppercase text-[8px] tracking-widest shadow-sm">
                        Configure
                      </Button>
                    </Link>
                  </div>

                  <Link href={`/hotels/${hotel.id}`} target="_blank" className="block">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50 font-bold uppercase text-[9px] tracking-[0.2em] flex items-center justify-center gap-2 shadow-sm transition-all">
                      <ExternalLink className="w-3.5 h-3.5" /> Live Experience
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
