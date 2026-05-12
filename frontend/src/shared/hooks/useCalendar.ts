import { useState } from 'react';
import {
  addMonths, subMonths, format, parseISO, isBefore
} from 'date-fns';

export const useCalendar = (
  selectedCheckIn: string,
  selectedCheckOut: string,
  onDatesChange: (inDate: string, outDate: string) => void
) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selecting, setSelecting] = useState<'IN' | 'OUT'>('IN');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkInDate = selectedCheckIn ? parseISO(selectedCheckIn) : null;
  const checkOutDate = selectedCheckOut ? parseISO(selectedCheckOut) : null;

  const handleDateClick = (day: Date) => {
    if (isBefore(day, today)) return;

    if (selecting === 'IN') {
      onDatesChange(format(day, 'yyyy-MM-dd'), '');
      setSelecting('OUT');
    } else {
      if (checkInDate && isBefore(day, checkInDate)) {
        onDatesChange(format(day, 'yyyy-MM-dd'), '');
      } else {
        onDatesChange(selectedCheckIn, format(day, 'yyyy-MM-dd'));
      }
    }
  };

  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return {
    currentMonth,
    goToNextMonth,
    goToPrevMonth,
    handleDateClick,
    selecting,
    setSelecting,
    checkInDate,
    checkOutDate,
    today
  };
};
