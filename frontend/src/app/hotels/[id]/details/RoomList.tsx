import React from 'react';
import Image from 'next/image';
import { Users, CheckCircle2, Hotel as HotelIcon } from 'lucide-react';
import { Room } from '@/shared/types';

interface RoomListProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelectRoom: (room: Room) => void;
}

export const RoomList = ({ rooms, selectedRoomId, onSelectRoom }: RoomListProps) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="p-12 rounded-[3rem] bg-slate-50 border border-dashed border-slate-200 text-center space-y-4">
        <HotelIcon className="w-12 h-12 text-slate-300 mx-auto" />
        <div>
          <p className="text-lg font-black text-slate-900">No rooms currently listed</p>
          <p className="text-sm text-slate-500 font-medium">This property is still setting up their inventory. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {rooms.map((room) => (
        <div
          key={room.id}
          onClick={() => onSelectRoom(room)}
          className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer flex flex-col md:flex-row justify-between items-center gap-8 ${
            selectedRoomId === room.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-blue-200'
          }`}
        >
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 shadow-inner relative group">
              {room.images && room.images.length > 0 ? (
                <Image 
                  src={room.images[0].url} 
                  alt={room.room_type} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 p-4 text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent" />
                  <HotelIcon className="w-7 h-7 text-slate-200 relative z-10" />
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] relative z-10 leading-none">Pending</span>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900">{room.room_type}</h4>
              <div className="flex items-center gap-4 mt-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> Up to {room.capacity} Guests</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Instant Confirm</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Per Night</p>
              <p className="text-2xl font-black text-slate-900">${room.base_price}</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
              selectedRoomId === room.id ? 'bg-blue-600 border-blue-600' : 'border-slate-200'
            }`}>
              {selectedRoomId === room.id && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
