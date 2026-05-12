'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { Review, ApiResponse } from '@/shared/types';
import { useSocket } from '@/shared/providers/SocketProvider';
import { useEffect } from 'react';

/**
 * Hook to fetch hotel reviews with filtering and pagination
 */
export const useHotelReviews = (hotelId: string) => {
  const [sort, setSort] = useState('newest');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery<ApiResponse<Review[]>>({
    queryKey: ['reviews', hotelId, sort, rating, page],
    queryFn: async () => {
      return await reviewService.getHotelReviews(hotelId, {
        sortBy: sort,
        rating: rating,
        limit: 5,
        page
      });
    },
    enabled: !!hotelId,
  });

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !hotelId) return;

    socket.emit('join_hotel', hotelId);

    const handleUpdate = () => {
      console.log('🔄 Real-time hotel review update triggered');
      refetch();
    };

    socket.on('review_updated', handleUpdate);
    socket.on('review_received', handleUpdate);
    socket.on('review_replied', handleUpdate);

    return () => {
      socket.off('review_updated', handleUpdate);
      socket.off('review_received', handleUpdate);
      socket.off('review_replied', handleUpdate);
    };
  }, [socket, hotelId, refetch]);

  return {
    reviews: data?.data || [],
    pagination: data?.pagination ?? null,
    isLoading,
    sort,
    setSort,
    rating,
    setRating,
    page,
    setPage,
    refetch
  };
};
