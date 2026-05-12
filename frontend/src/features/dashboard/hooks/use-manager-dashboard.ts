'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '@features/hotels';
import { reviewService } from '@features/reviews';
import { bookingService } from '@features/bookings';
import { Hotel } from '@/shared/types';
import { ReviewStats } from '@/features/reviews/types';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';
import { useEffect } from 'react';
import { useSocket } from '@/shared/providers/SocketProvider';

/**
 * Hook to manage manager dashboard data and statistics
 */
export const useManagerDashboard = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // 🚀 Fetch Hotels
  const { data: myHotels = [], isLoading: hotelsLoading } = useQuery<Hotel[]>({
    queryKey: ['manager', 'hotels'],
    queryFn: async () => {
      const res = await hotelService.getMyHotels();
      if (!res.data) throw new Error('Failed to fetch hotels');
      return res.data;
    },
  });

  // 🚀 Fetch Review Stats
  const { data: reviewStats, isLoading: statsLoading } = useQuery<ReviewStats>({
    queryKey: ['manager', 'review-stats'],
    queryFn: async () => {
      const res = await reviewService.getStats('all');
      if (!res.data) throw new Error('Failed to fetch review statistics');
      return res.data;
    },
  });

  // 🚀 Fetch Manager Bookings
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['manager', 'bookings', 'all'],
    queryFn: async () => {
      const res = await bookingService.getManagerBookings(1, 1000); // Fetch a large enough number for analytics
      return res;
    },
  });

  // 🚀 Real-time Updates Listener
  useEffect(() => {
    if (!socket) return;

    const refreshData = () => {
      queryClient.invalidateQueries({ queryKey: ['manager'] });
    };

    socket.on('new_booking', refreshData);
    socket.on('booking_updated', refreshData);
    socket.on('new_review', refreshData);

    return () => {
      socket.off('new_booking', refreshData);
      socket.off('booking_updated', refreshData);
      socket.off('new_review', refreshData);
    };
  }, [socket, queryClient]);

  const bookings = bookingsData?.data || [];

  const loading = hotelsLoading || statsLoading || bookingsLoading;
  const myHotel = myHotels[0] || null;

  // Calculate Real Revenue & Analytics
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const totalRevenue = confirmedBookings.reduce((acc, b) => acc + b.totalPrice, 0);

  // Generate last 7 days revenue data
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const revenueData = last7Days.map(day => {
    const dayRevenue = confirmedBookings
      .filter(b => isSameDay(new Date(b.createdAt || b.checkIn), day))
      .reduce((acc, b) => acc + b.totalPrice, 0);

    return {
      day: format(day, 'EEE'),
      revenue: dayRevenue,
      percentage: totalRevenue > 0 ? (dayRevenue / (totalRevenue / 3)) * 100 : 0 // Scale for chart
    };
  });

  const stats = {
    totalHotels: myHotels.length,
    totalRooms: myHotels.reduce((acc: number, h: Hotel) => acc + (h.rooms?.length || 0), 0),
    activeBookings: confirmedBookings.length,
    revenue: totalRevenue,
    totalReviews: reviewStats?.total || 0,
    averageRating: reviewStats?.averageRating || 0,
    pendingReviews: reviewStats?.pending || 0
  };

  return {
    myHotels,
    myHotel,
    reviewStats,
    bookings,
    revenueData,
    loading,
    stats
  };
};
