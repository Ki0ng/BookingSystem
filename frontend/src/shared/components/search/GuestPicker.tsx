import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

interface GuestPickerProps {
  adults: number;
  setAdults: (v: number) => void;
  children: number;
  setChildren: (v: number) => void;
  rooms: number;
  setRooms: (v: number) => void;
  onConfirm: () => void;
}

export const GuestPicker = ({ 
  adults, setAdults, 
  children, setChildren, 
  rooms, setRooms, 
  onConfirm 
}: GuestPickerProps) => {
  const counters = [
    { label: 'Adults', sub: 'Ages 13 or above', val: adults, set: setAdults, min: 1 },
    { label: 'Children', sub: 'Ages 0 – 17', val: children, set: setChildren, min: 0 },
    { label: 'Rooms', sub: 'Minimum 1 room', val: rooms, set: setRooms, min: 1 },
  ];

  return (
    <div className="absolute top-[calc(100%+12px)] right-0 w-full lg:w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 z-50 animate-in fade-in slide-in-from-top-4 duration-300" onClick={e => e.stopPropagation()}>
      <div className="space-y-8">
        {counters.map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <div>
              <p className="font-black text-slate-900 text-base">{item.label}</p>
              <p className="text-xs text-slate-400 font-medium">{item.sub}</p>
            </div>
            <div className="flex items-center gap-5">
              <button 
                onClick={() => item.set(Math.max(item.min, item.val - 1))} 
                className="w-10 h-10 rounded-full border-2 border-slate-100 text-slate-400 flex items-center justify-center font-bold hover:border-blue-600 hover:text-blue-600 transition-all active:scale-90"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-4 text-center font-black text-slate-900 text-base">{item.val}</span>
              <button 
                onClick={() => item.set(item.val + 1)} 
                className="w-10 h-10 rounded-full border-2 border-slate-100 text-slate-400 flex items-center justify-center font-bold hover:border-blue-600 hover:text-blue-600 transition-all active:scale-90"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        <div className="pt-8 border-t border-slate-100">
          <Button onClick={onConfirm} variant="premium" className="w-full h-14 rounded-2xl text-base">Confirm Selection</Button>
        </div>
      </div>
    </div>
  );
};
