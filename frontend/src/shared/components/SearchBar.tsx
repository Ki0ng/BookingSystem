'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Calendar, Users, Loader2, Search } from 'lucide-react';

import { EliteCalendar } from '@/shared/components/ui/EliteCalendar';
import { LocationPicker } from './search/LocationPicker';
import { GuestPicker } from './search/GuestPicker';
import { SearchParams } from '@/features/hotels/types';
import { useSearchBar } from '@features/hotels';

interface SearchBarProps {
  onSearch?: (params: SearchParams) => void;
  loading?: boolean;
  className?: string;
}

export const SearchBar = ({ onSearch, loading, className = '' }: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    location, setLocation,
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    adults, setAdults,
    children, setChildren,
    rooms, setRooms,
    activePicker, setActivePicker,
    filteredProvinces,
    handleSearch,
    formatDateLabel,
    closePickers
  } = useSearchBar({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '2'),
  });

  // Close pickers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closePickers();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closePickers]);

  return (
    <div ref={containerRef} className={`bg-white rounded-[2.5rem] shadow-[0_30px_100px_-15px_rgba(0,0,0,0.12)] border border-slate-100 relative z-40 w-full ${className} animate-in fade-in slide-in-from-bottom-8 duration-1000`}>
      <div className="grid grid-cols-1 lg:grid-cols-[30%_27%_25%_18%] items-stretch min-h-[82px]">
        {/* Location Section */}
        <div
          className="flex items-center gap-4 px-6 py-5 border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50/50 transition-all cursor-text relative rounded-t-[2.5rem] lg:rounded-tr-none lg:rounded-l-[2.5rem] group"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-all duration-500 shadow-sm border border-slate-100/50">
            <MapPin className="text-slate-400 group-hover:text-blue-600 w-5 h-5 shrink-0 transition-colors" />
          </div>
          <div className="flex flex-col text-left flex-1 min-w-0">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 whitespace-nowrap">Destination</p>
            <input
              type="text"
              placeholder="Where are you going?"
              className="w-full focus:outline-none text-slate-900 font-extrabold text-sm bg-transparent placeholder:text-slate-400 tracking-tight"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setActivePicker('location');
              }}
              onFocus={() => setActivePicker('location')}
            />
          </div>
          {activePicker === 'location' && (
            <LocationPicker
              provinces={filteredProvinces}
              onSelect={(name) => { setLocation(name); closePickers(); }}
              searchTerm={location}
            />
          )}
        </div>

        {/* Dates Section */}
        <div
          className="flex items-center gap-4 px-6 py-5 border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50/50 transition-all cursor-pointer relative group"
          onClick={() => setActivePicker(activePicker === 'date' ? null : 'date')}
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-all duration-500 shadow-sm border border-slate-100/50">
            <Calendar className="text-slate-400 group-hover:text-blue-600 w-5 h-5 shrink-0 transition-colors" />
          </div>
          <div className="flex flex-col text-left flex-1 min-w-0">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 whitespace-nowrap">Stay Duration</p>
            <span className="text-slate-900 font-extrabold text-sm leading-tight block">
              {checkIn ? `${formatDateLabel(checkIn)} — ${formatDateLabel(checkOut) || 'Check-out'}` : 'Select Dates'}
            </span>
          </div>
          {activePicker === 'date' && (
            <div className="absolute top-[calc(100%+16px)] left-0 lg:-left-20 w-[90vw] max-w-[850px] z-50 animate-in fade-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <div className="shadow-2xl shadow-slate-200 rounded-[2rem] overflow-hidden border border-slate-100">
                <EliteCalendar
                  selectedCheckIn={checkIn}
                  selectedCheckOut={checkOut}
                  selectedFlexibility={parseInt(searchParams.get('flexibility') || '0')}
                  onDatesChange={(inDate, outDate, flex) => {
                    setCheckIn(inDate);
                    setCheckOut(outDate);
                    const params = new URLSearchParams(window.location.search);
                    params.set('flexibility', flex.toString());
                    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
                  }}
                  onClose={closePickers}
                />
              </div>
            </div>
          )}
        </div>

        {/* Guests Section */}
        <div
          className="flex items-center gap-4 px-6 py-5 border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50/50 transition-all cursor-pointer relative group"
          onClick={() => setActivePicker(activePicker === 'guest' ? null : 'guest')}
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-all duration-500 shadow-sm border border-slate-100/50">
            <Users className="text-slate-400 group-hover:text-blue-600 w-5 h-5 shrink-0 transition-colors" />
          </div>
          <div className="flex flex-col text-left flex-1 min-w-0">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 whitespace-nowrap">Guests & Rooms</p>
            <span className="text-slate-900 font-extrabold text-sm leading-tight block">
              {adults + children} guests · {rooms} room
            </span>
          </div>
          {activePicker === 'guest' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <GuestPicker
                adults={adults} setAdults={setAdults}
                children={children} setChildren={setChildren}
                rooms={rooms} setRooms={setRooms}
                onConfirm={closePickers}
              />
            </div>
          )}
        </div>

        {/* Search Button Section */}
        <div className="flex h-full py-4 lg:py-5 px-4">
          <button
            onClick={() => handleSearch(onSearch, router)}
            className="w-full h-full bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-500 flex items-center justify-center active:scale-[0.95] shadow-2xl shadow-slate-200 rounded-2xl group overflow-hidden relative"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
              <div className="flex items-center gap-2.5 relative z-10">
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline">Search</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
