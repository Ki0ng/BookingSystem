import React from 'react';
import { MapPin } from 'lucide-react';
import { Province } from '@/shared/types';

interface LocationPickerProps {
  provinces: Province[];
  onSelect: (name: string) => void;
  searchTerm: string;
}

export const LocationPicker = ({ provinces, onSelect, searchTerm }: LocationPickerProps) => {
  return (
    <div className="absolute top-[calc(100%+12px)] left-0 w-full lg:w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 py-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="px-8 mb-4">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nearby Locations</p>
      </div>
      <div className="max-h-[300px] overflow-y-auto px-4 scrollbar-none">
        {provinces.length > 0 ? (
          provinces.map((p) => (
            <button
              key={p.code}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-all text-left group"
              onClick={() => onSelect(p.name)}
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-sm">
                <MapPin className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{p.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{p.division_type}</p>
              </div>
            </button>
          ))
        ) : (
          <div className="px-6 py-10 text-center text-slate-400 font-bold italic text-sm">
            No results for "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};
