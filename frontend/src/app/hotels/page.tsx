'use client';

import React, { Suspense } from 'react';
import { 
  Search, 
  ChevronRight,
  Map as MapIcon,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { HotelCard } from '@/shared/components/ui/HotelCard';
import { HotelListSkeleton } from '@/shared/components/ui/HotelListSkeleton';
import { useHotelListing } from '@/features/hotels';

// New Sub-components
import { PriceFilter } from './components/PriceFilter';
import { AmenitiesFilter } from './components/AmenitiesFilter';
import { DateFlexibilityInfo } from './components/DateFlexibilityInfo';

const Dropdown = ({ label, subLabel, value, options, onChange }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center h-full" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-full px-5 bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer flex items-center gap-8 min-w-[240px] transition-all relative"
      >
        <div className="flex flex-col items-start text-left shrink-0">
          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5 leading-tight">Filter</span>
          <span className="text-[9px] font-bold text-slate-900 uppercase tracking-[0.2em] leading-tight">Sort</span>
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-blue-600 leading-none whitespace-nowrap">{value}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-blue-600 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-full min-w-[240px] bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1.5">
            {options.map((opt: any) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-left transition-all ${
                  (opt.label === value)
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function HotelsList() {
  const {
    hotels,
    loading,
    maxPrice,
    setMaxPrice,
    selectedAmenities,
    toggleAmenity,
    sortBy,
    setSortBy,
    clearFilters,
    paramsForCard,
    location,
    searchParams
  } = useHotelListing();

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-32">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 space-y-10">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Refine Search</h3>
              <Button onClick={clearFilters} variant="ghost" size="sm" className="text-blue-600 font-bold text-[9px] uppercase tracking-widest hover:bg-blue-50">
                Clear All
              </Button>
            </div>

            <div className="space-y-6">
              <DateFlexibilityInfo 
                checkIn={searchParams.get('checkIn')}
                checkOut={searchParams.get('checkOut')}
                flexibility={searchParams.get('flexibility')}
              />

              <PriceFilter 
                maxPrice={maxPrice} 
                onChange={setMaxPrice} 
              />
              
              <AmenitiesFilter 
                selectedAmenities={selectedAmenities} 
                onToggle={toggleAmenity} 
              />
            </div>
          </div>
          
          <div className="p-8 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group cursor-pointer shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/30 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000 blur-2xl" />
            <MapIcon className="w-6 h-6 text-white mb-6" />
            <h4 className="text-lg font-extrabold leading-tight tracking-tight">Switch to Map View</h4>
            <div className="mt-6 flex items-center gap-2 text-blue-400 font-bold text-[9px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
              Explore Now <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {hotels.length} Luxury {hotels.length === 1 ? 'Property' : 'Properties'} {location ? `in ${location}` : 'Found'}
            </h2>
          <div className="flex items-center gap-4 relative z-30">
            <div className="flex items-center bg-white border border-slate-100 rounded-xl px-2 h-12 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-900/5">
              <Dropdown
                label="Filter"
                subLabel="Sort"
                value={
                  sortBy === 'best' ? 'Best Matches' :
                  sortBy === 'price_asc' ? 'Price: Low to High' :
                  sortBy === 'price_desc' ? 'Price: High to Low' : 'Top Rated'
                }
                options={[
                  { label: 'Best Matches', value: 'best' },
                  { label: 'Price: Low to High', value: 'price_asc' },
                  { label: 'Price: High to Low', value: 'price_desc' },
                  { label: 'Top Rated', value: 'rating' }
                ]}
                onChange={(val: string) => setSortBy(val)}
              />
            </div>
          </div>
          </div>

          {loading && hotels.length === 0 ? (
            <div className="grid grid-cols-1 gap-8">
              {[1, 2, 3].map(i => <HotelListSkeleton key={i} />)}
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200 animate-in fade-in zoom-in duration-500">
              <Search className="w-10 h-10 text-slate-200 mx-auto mb-6" />
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">No properties match</h3>
              <Button onClick={clearFilters} variant="premium" className="mt-8 px-8 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest">Reset Filters</Button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-8 transition-all duration-500 ${loading ? 'opacity-40 blur-[1px] pointer-events-none scale-[0.99]' : 'opacity-100 blur-0'}`}>
              {hotels.map((hotel) => (
                <HotelCard 
                  key={hotel.id}
                  id={hotel.id}
                  name={hotel.name}
                  address={hotel.address}
                  images={hotel.images}
                  average_rating={hotel.average_rating}
                  rooms={hotel.rooms}
                  variant="list"
                  searchParams={paramsForCard}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const HotelsPageSkeleton = () => (
  <div className="min-h-screen bg-[#fcfcfd] pb-32 pt-10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
      {/* Filters Sidebar Skeleton */}
      <aside className="w-full lg:w-72 space-y-10">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-4 w-16 bg-slate-200 rounded-md animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-20 bg-slate-100 rounded-3xl animate-pulse" />
            <div className="h-32 bg-slate-100 rounded-3xl animate-pulse" />
            <div className="h-40 bg-slate-100 rounded-3xl animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Results Skeleton */}
      <div className="flex-1 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="h-8 w-64 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-10 w-40 bg-slate-200 rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-8">
          {[1, 2, 3].map(i => <HotelListSkeleton key={i} />)}
        </div>
      </div>
    </div>
  </div>
);

export default function HotelsPage() {
  return (
    <Suspense fallback={<HotelsPageSkeleton />}>
      <HotelsList />
    </Suspense>
  );
}
