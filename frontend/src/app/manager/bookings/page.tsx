'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { bookingService } from '@/features/bookings';
import { format } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/shared/providers/SocketProvider';
import { Booking } from '@/shared/types';

// Extend Booking type for UI state
type UIBooking = Booking & { isNew?: boolean };

export default function ManagerBookingsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: bookingsResponse, isLoading: loading } = useQuery({
    queryKey: ['manager', 'bookings', page],
    queryFn: async () => {
      const res = await bookingService.getManagerBookings(page, limit);
      return res;
    },
    staleTime: 5 * 60 * 1000,
  });

  const bookings = (bookingsResponse?.data || []) as UIBooking[];
  const pagination = bookingsResponse?.pagination;

  // Real-time Booking Listener
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleNewBooking = (booking: Booking) => {
      queryClient.setQueryData(['manager', 'bookings', 1], (old: any) => {
        if (!old || !old.data) return old;
        if (old.data.find((b: any) => b.id === booking.id)) return old;
        return {
          ...old,
          data: [{ ...booking, isNew: true }, ...old.data]
        };
      });
      queryClient.invalidateQueries({ queryKey: ['manager', 'bookings', 'all'] });
    };

    socket.on('new_booking', handleNewBooking);

    socket.on('booking_updated', (updatedBooking: Booking) => {
      queryClient.setQueryData(['manager', 'bookings', page], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((b: any) => b.id === updatedBooking.id ? { ...b, ...updatedBooking } : b)
        };
      });
      queryClient.invalidateQueries({ queryKey: ['manager', 'bookings', 'all'] });
    });

    return () => {
      socket.off('new_booking', handleNewBooking);
      socket.off('booking_updated');
    };
  }, [socket, queryClient, page]);

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'ALL' || b.status === filter;
    const matchesSearch = (b.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.room?.hotel?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalRevenue: bookings.filter(b => b.status === 'CONFIRMED').reduce((acc, b) => acc + b.totalPrice, 0),
    activeBookings: bookings.filter(b => b.status === 'CONFIRMED').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Reservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Premium Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm space-y-6 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-600/5 rounded-bl-[3rem] transition-all" />
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform duration-500">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Total Revenue</p>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">${stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm space-y-6 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/5 rounded-bl-[3rem] transition-all" />
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform duration-500">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Active Stays</p>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.activeBookings}</h3>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm space-y-6 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-bl-[3rem] transition-all" />
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-300 rounded-xl flex items-center justify-center shadow-lg shadow-amber-100 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Pending Requests</p>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{bookings.filter(b => b.status === 'PENDING').length}</h3>
          </div>
        </div>
      </div>

      {/* Control Bar - Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-[1.5rem] border border-slate-200/50 shadow-xl shadow-slate-200/20 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-30">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Identify guests or properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-6 rounded-xl bg-slate-50/50 border border-transparent focus:border-blue-100 focus:bg-white text-[10px] font-bold uppercase tracking-widest text-slate-900 outline-none transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-50/80 rounded-xl border border-slate-100">
          {(['ALL', 'CONFIRMED', 'CANCELLED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${filter === f
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                  : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List - High-end Cards */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          <>
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className={`bg-white p-6 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden ${(booking as any).isNew ? 'animate-in fade-in zoom-in-95 border-blue-200 ring-4 ring-blue-50' : 'border-slate-100'
                  } hover:shadow-xl hover:border-blue-100`}
              >
                {/* New Badge */}
                {(booking as any).isNew && (
                  <div className="absolute top-0 right-0 px-5 py-2 bg-blue-600 text-white text-[8px] font-bold uppercase tracking-[0.3em] rounded-bl-2xl shadow-xl shadow-blue-200">
                    New
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  {/* Guest Profile */}
                  <div className="flex items-center gap-5 min-w-[280px]">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-extrabold text-lg overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                      {booking.user?.avatar ? (
                        <img src={booking.user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="bg-gradient-to-br from-slate-100 to-slate-200 w-full h-full flex items-center justify-center uppercase">
                          {booking.user?.name?.[0] || 'G'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-extrabold text-slate-900 tracking-tight truncate group-hover:text-blue-600 transition-colors">{booking.user?.name || 'Guest'}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">{booking.user?.email || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 bg-blue-50 rounded-md">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-[13px] font-bold text-slate-900 tracking-tight truncate">{booking.room?.hotel?.name || 'Unknown Hotel'}</span>
                    </div>
                    <div className="flex items-center gap-2 pl-9">
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{booking.room?.room_type || 'Standard Room'}</p>
                    </div>
                  </div>

                  {/* Journey Timeline */}
                  <div className="flex items-center gap-8 bg-slate-50/50 p-5 rounded-[1.5rem] border border-slate-100">
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1.5">Check In</p>
                      <p className="text-[13px] font-extrabold text-slate-900 tracking-tight">{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-px bg-slate-200 relative">
                        <ChevronRight className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-500" />
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Elite Stay</span>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1.5">Check Out</p>
                      <p className="text-[13px] font-extrabold text-slate-900 tracking-tight">{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>

                  {/* Financials & Status */}
                  <div className="flex items-center gap-8 lg:pl-10 lg:border-l border-slate-100 w-full lg:w-auto justify-between lg:justify-start">
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1.5">Gross Revenue</p>
                      <p className="text-2xl font-extrabold text-blue-600 tracking-tight">${booking.totalPrice.toLocaleString()}</p>
                    </div>

                    <div className={`px-5 py-3 rounded-xl flex items-center gap-3 shadow-sm border ${booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                        booking.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border-rose-100/50' :
                          'bg-amber-50 text-amber-600 border-amber-100/50'
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${booking.status === 'CONFIRMED' ? 'bg-emerald-500' :
                          booking.status === 'CANCELLED' ? 'bg-rose-500' :
                            'bg-amber-500'
                        }`} />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest">{booking.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Elite Pagination Control */}
            {pagination && pagination.pages > 1 && (
              <div className="pt-10 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-all shadow-sm hover:shadow-xl group"
                >
                  <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/10">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                        page === i + 1 
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-400/20' 
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-all shadow-sm hover:shadow-xl group"
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <div className="max-w-xs mx-auto">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Reservation Silence</h3>
              <p className="text-slate-400 text-[13px] mt-2 font-medium leading-relaxed">No bookings identified. Guest trajectories will materialize here once reservations are initiated.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
