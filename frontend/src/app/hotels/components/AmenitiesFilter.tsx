'use client';

import React from 'react';
import { Star, Wifi, Wind, Car, Coffee, LucideIcon } from 'lucide-react';

interface Amenity {
  name: string;
  icon: LucideIcon;
}

const AMENITIES: Amenity[] = [
  { name: 'Free WiFi', icon: Wifi },
  { name: 'Swimming Pool', icon: Wind },
  { name: 'Valet Parking', icon: Car },
  { name: 'Breakfast', icon: Coffee },
];

interface AmenitiesFilterProps {
  selectedAmenities: string[];
  onToggle: (name: string) => void;
}

export const AmenitiesFilter = ({ selectedAmenities, onToggle }: AmenitiesFilterProps) => {
  return (
    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-4 h-4 text-emerald-600" />
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Popular Amenities</p>
      </div>
      <div className="space-y-4">
        {AMENITIES.map(a => (
          <label key={a.name} className="flex items-center justify-between cursor-pointer group" onClick={() => onToggle(a.name)}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${
                selectedAmenities.includes(a.name) ? 'border-blue-600 bg-blue-600' : 'border-slate-100'
              }`}>
                {selectedAmenities.includes(a.name) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className={`text-sm font-bold ${selectedAmenities.includes(a.name) ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                {a.name}
              </span>
            </div>
            <a.icon className={`w-4 h-4 ${selectedAmenities.includes(a.name) ? 'text-blue-600' : 'text-slate-300'}`} />
          </label>
        ))}
      </div>
    </div>
  );
};
