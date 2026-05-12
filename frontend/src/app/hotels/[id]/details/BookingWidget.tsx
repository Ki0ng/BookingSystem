import React, { useState } from 'react';
import { Calendar, Users, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/shared/components/ui/Button';
import { EliteCalendar } from '@/shared/components/ui/EliteCalendar';
import { Hotel, Room, User } from '@/shared/types';

interface BookingWidgetProps {
  hotel: Hotel;
  selectedRoom: Room | null;
  checkIn: string;
  checkOut: string;
  flexibility: number;
  guests: number;
  onDatesChange: (inDate: string, outDate: string, flexibility: number) => void;
  onBookingClick: () => void;
  isLoading: boolean;
  user: User | null;
}

export const BookingWidget = ({
  hotel,
  selectedRoom,
  checkIn,
  checkOut,
  flexibility,
  guests,
  onDatesChange,
  onBookingClick,
  isLoading,
  user
}: BookingWidgetProps) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const isOwner = user?.id === hotel.ownerId;
  const noRooms = !hotel.rooms || hotel.rooms.length === 0;

  return (
    <div className="sticky top-10 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Price for 1 night</p>
          <div className="flex items-baseline gap-1">
            {!noRooms ? (
              <>
                <span className="text-4xl font-black text-slate-900">${selectedRoom?.base_price || hotel.rooms?.[0]?.base_price}</span>
                <span className="text-slate-500 font-bold">/night</span>
              </>
            ) : (
              <span className="text-xl font-black text-slate-900 italic">Price on request</span>
            )}
          </div>
        </div>
        {!noRooms && (
          <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
            Best Value
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Elite Date Selection Pill */}
        <div
          onClick={() => setShowCalendar(true)}
          className="p-1 bg-slate-100 rounded-[2.5rem] border border-slate-200 shadow-inner cursor-pointer hover:border-blue-200 transition-all group"
        >
          <div className="grid grid-cols-2 gap-1 relative">
            <div className="p-6 bg-white rounded-l-[2rem] rounded-r-lg shadow-sm space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                <Calendar className="w-3 h-3" /> Check-in
              </span>
              <p className="text-sm font-black text-slate-900">
                {checkIn ? format(new Date(checkIn), 'MMM dd, yyyy') : 'Select Date'}
              </p>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center z-10 shadow-sm">
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>

            <div className="p-6 bg-white rounded-r-[2rem] rounded-l-lg shadow-sm space-y-2 text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 justify-end group-hover:text-blue-600 transition-colors">
                Check-out <Calendar className="w-3 h-3" />
              </span>
              <p className="text-sm font-black text-slate-900">
                {checkOut ? format(new Date(checkOut), 'MMM dd, yyyy') : 'Select Date'}
              </p>
            </div>
          </div>
        </div>

        {/* Elite Calendar Popover */}
        {showCalendar && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-4xl relative">
              <button
                onClick={() => setShowCalendar(false)}
                className="absolute -top-16 right-0 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <EliteCalendar
                selectedCheckIn={checkIn}
                selectedCheckOut={checkOut}
                selectedFlexibility={flexibility}
                onDatesChange={(inD, outD, flex) => {
                  onDatesChange(inD, outD, flex);
                }}
                onClose={() => setShowCalendar(false)}
              />
            </div>
          </div>
        )}

        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Users className="w-3 h-3" /> Guests</span>
          <span className="text-sm font-black text-slate-900">{guests} Adults</span>
        </div>
      </div>

      <div className="pt-4 space-y-6">
        <div className="flex justify-between items-center text-lg font-black text-slate-900">
          <span>Total Amount</span>
          <span>{selectedRoom ? `$${selectedRoom.base_price}` : '---'}</span>
        </div>
        <Button
          onClick={onBookingClick}
          disabled={isLoading || isOwner || noRooms}
          className={`w-full h-16 rounded-[2rem] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
            (isOwner || noRooms)
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
          }`}
        >
          {isLoading
            ? 'Securing Room...'
            : isOwner
              ? 'This is your property'
              : noRooms
                ? 'No rooms available'
                : 'Book Reservation Now'}
        </Button>
        <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">No hidden fees • Instant Confirmation</p>
      </div>
    </div>
  );
};
