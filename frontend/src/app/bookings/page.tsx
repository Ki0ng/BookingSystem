'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/features/bookings/services/booking.service';
import { Button } from '@/shared/components/ui/Button';
import {
  Calendar,
  MapPin,
  Building2,
  ChevronRight,
  XCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function MyBookingsPage() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading: loading } = useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: async () => {
      const res = await bookingService.getMyBookings();
      return res.data || [];
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingService.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'my'] });
    },
    onError: () => {
      alert('Failed to cancel booking. Please contact support.');
    }
  });

  const handleCancel = (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    cancelMutation.mutate(id);
  };


  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Reservation Archives...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-32">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/profile" className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:shadow-md transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Elite Stays</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Managed Reservations & Journey History</p>
          </div>
        </div>

        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Bookings Found</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't made any reservations yet. Start your elite journey today.</p>
              <Link href="/hotels">
                <Button className="rounded-2xl h-14 px-10 font-bold">Explore Elite Hotels</Button>
              </Link>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden flex flex-col md:flex-row"
              >
                {/* Hotel Thumbnail */}
                <div className="w-full md:w-72 h-48 md:h-auto bg-slate-100 relative overflow-hidden group">
                  <img
                    src={booking.room?.hotel?.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'}
                    alt={booking.room?.hotel?.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${booking.status === 'CONFIRMED' ? 'bg-emerald-500 text-white' :
                      booking.status === 'CANCELLED' ? 'bg-rose-500 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                          {booking.room?.hotel?.name}
                        </h3>
                        <p className="text-slate-400 font-bold text-sm flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-blue-500" /> {booking.room?.hotel?.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                        <p className="text-2xl font-black text-blue-600">${booking.totalPrice}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-50 mb-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check In</p>
                        <p className="font-bold text-slate-900">{new Date(booking.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div className="space-y-1 border-l border-slate-200 pl-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check Out</p>
                        <p className="font-bold text-slate-900">{new Date(booking.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> {booking.room?.room_type}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Instant Confirmation
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <Link href={`/hotels/${booking.room?.hotel?.id}`} className="text-blue-600 font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-transform flex items-center gap-2">
                      View Hotel Details <ChevronRight className="w-4 h-4" />
                    </Link>

                    {booking.status === 'CONFIRMED' && (
                      <Button
                        variant="ghost"
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancelMutation.isPending}
                        className="text-rose-500 hover:bg-rose-50 rounded-xl h-11 px-6 font-black text-[10px] uppercase tracking-widest"
                      >
                        {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Reservation'}
                      </Button>
                    )}
                    {booking.status === 'CANCELLED' && (
                      <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest">
                        <XCircle className="w-4 h-4" /> Reservation Cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
