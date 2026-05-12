'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { 
  format, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval, 
  isAfter, 
  isBefore, 
  isToday,
} from 'date-fns';
import { useCalendar } from '@/shared/hooks/useCalendar';

interface EliteCalendarProps {
  selectedCheckIn: string;
  selectedCheckOut: string;
  selectedFlexibility?: number;
  onDatesChange: (checkIn: string, checkOut: string, flexibility: number) => void;
  onClose: () => void;
}

const DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
const DATE_OPTIONS = [
  { label: 'EXACT DATES', value: 0 },
  { label: '± 1 DAY', value: 1 },
  { label: '± 2 DAYS', value: 2 },
  { label: '± 3 DAYS', value: 3 },
  { label: '± 7 DAYS', value: 7 },
];

export const EliteCalendar = ({ 
  selectedCheckIn, 
  selectedCheckOut, 
  selectedFlexibility = 0,
  onDatesChange, 
  onClose 
}: EliteCalendarProps) => {
  const [flexibility, setFlexibility] = React.useState(selectedFlexibility);

  const {
    currentMonth,
    goToNextMonth,
    goToPrevMonth,
    handleDateClick,
    checkInDate,
    checkOutDate,
    today
  } = useCalendar(selectedCheckIn, selectedCheckOut, (inD, outD) => onDatesChange(inD, outD, flexibility));

  // Sync internal flexibility back to parent when it changes
  React.useEffect(() => {
    if (checkInDate && checkOutDate) {
      onDatesChange(format(checkInDate, 'yyyy-MM-dd'), format(checkOutDate, 'yyyy-MM-dd'), flexibility);
    }
  }, [flexibility, onDatesChange]);

  const nextMonth = addMonths(currentMonth, 1);

  const renderHeader = (month: Date, showNext: boolean, showPrev: boolean) => (
    <div className="flex items-center justify-between px-6 py-4">
      {showPrev ? (
        <button onClick={goToPrevMonth} className="p-2 hover:bg-slate-50 rounded-full transition-all">
          <ChevronLeft className="w-5 h-5 text-slate-400" />
        </button>
      ) : <div className="w-9" />}
      
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
        {format(month, 'MMMM yyyy')}
      </h3>

      {showNext ? (
        <button onClick={goToNextMonth} className="p-2 hover:bg-slate-50 rounded-full transition-all">
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      ) : <div className="w-9" />}
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 mb-2">
      {DAYS.map((day, i) => (
        <div key={i} className="text-center text-[10px] font-black text-slate-300 py-2">
          {day}
        </div>
      ))}
    </div>
  );

  const renderCells = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7">
        {calendarDays.map((day, i) => {
          const isSelectedIn = checkInDate && isSameDay(day, checkInDate);
          const isSelectedOut = checkOutDate && isSameDay(day, checkOutDate);
          const isBetween = checkInDate && checkOutDate && isAfter(day, checkInDate) && isBefore(day, checkOutDate);
          const isPast = isBefore(day, today);
          const isCurrentMonth = isSameMonth(day, month);

          let cellClass = "h-12 flex items-center justify-center text-sm font-bold relative cursor-pointer transition-all ";
          
          if (!isCurrentMonth) cellClass += "text-transparent pointer-events-none ";
          else if (isPast) cellClass += "text-slate-200 cursor-not-allowed ";
          else cellClass += "text-slate-700 hover:bg-blue-50 hover:rounded-full ";

          return (
            <div 
              key={i} 
              className={`${cellClass} ${isBetween ? 'bg-blue-50/50' : ''}`}
              onClick={() => isCurrentMonth && handleDateClick(day)}
            >
              {isBetween && <div className="absolute inset-0 bg-blue-50/80" />}
              {isSelectedIn && checkOutDate && <div className="absolute right-0 top-0 bottom-0 left-1/2 bg-blue-50/80 -z-10" />}
              {isSelectedOut && checkInDate && <div className="absolute left-0 top-0 bottom-0 right-1/2 bg-blue-50/80 -z-10" />}

              <div className={`w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all ${
                isSelectedIn || isSelectedOut ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : ''
              }`}>
                {format(day, 'd')}
              </div>
              
              {isToday(day) && !isSelectedIn && !isSelectedOut && (
                <div className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300 w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row border-b border-slate-50">
        <div className="flex-1 border-r border-slate-50 pb-6">
          {renderHeader(currentMonth, false, true)}
          <div className="px-6">
            {renderDays()}
            {renderCells(currentMonth)}
          </div>
        </div>
        <div className="flex-1 pb-6">
          {renderHeader(nextMonth, true, false)}
          <div className="px-6">
            {renderDays()}
            {renderCells(nextMonth)}
          </div>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="p-6 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2">
          {DATE_OPTIONS.map((opt) => (
            <button 
              key={opt.value}
              onClick={() => setFlexibility(opt.value)}
              className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                flexibility === opt.value ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Selection</p>
            <p className="text-xs font-black text-slate-900">
              {checkInDate ? format(checkInDate, 'MMM dd') : 'Select In'} — {checkOutDate ? format(checkOutDate, 'MMM dd') : 'Select Out'}
            </p>
          </div>
          <Button 
            onClick={onClose}
            className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200"
          >
            Select Dates
          </Button>
        </div>
      </div>
    </div>
  );
};
