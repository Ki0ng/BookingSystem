'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface DateFlexibilityInfoProps {
  checkIn: string | null;
  checkOut: string | null;
  flexibility: string | null;
}

export const DateFlexibilityInfo = ({ checkIn, checkOut, flexibility }: DateFlexibilityInfoProps) => {
  if (!checkIn || !checkOut) return null;

  return (
    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all animate-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-4 h-4" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Date Flexibility</p>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stay Period</p>
          <p className="text-xs font-black text-slate-900 truncate">
            {checkIn} — {checkOut}
          </p>
        </div>
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Allowance</span>
          <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black">
            ± {flexibility || '0'} DAYS
          </span>
        </div>
      </div>
    </div>
  );
};
