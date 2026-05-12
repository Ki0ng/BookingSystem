'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface PriceFilterProps {
  maxPrice: number;
  onChange: (price: number) => void;
}

export const PriceFilter = ({ maxPrice, onChange }: PriceFilterProps) => {
  return (
    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Filter className="w-4 h-4" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          Price Range (up to ${maxPrice})
        </p>
      </div>
      <input 
        type="range" 
        min="0" 
        max="5000" 
        step="100" 
        value={maxPrice}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" 
      />
    </div>
  );
};
