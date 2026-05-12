'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '@/features/hotels/services/hotel.service';
import { reviewService } from '@features/reviews';
import { useAuth } from '@features/auth';
import { Hotel, PlatformReview } from '@/shared/types';

/**
 * Hook to manage home page state and data fetching
 */
export const useHomePage = () => {
  const { user } = useAuth();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // 🚀 Fetch Data using React Query
  const { data: hotels = [], isLoading: hotelsLoading } = useQuery<Hotel[]>({
    queryKey: ['hotels', 'featured'],
    queryFn: async () => {
      const res = await hotelService.getHotels();
      return res.data?.slice(0, 3) || [];
    },
  });

  const { data: platformReviews = [], isLoading: reviewsLoading, refetch: refetchReviews } = useQuery<PlatformReview[]>({
    queryKey: ['reviews', 'platform'],
    queryFn: async () => {
      const res = await reviewService.getPlatformReviews(3);
      return res.data || [];
    },
  });

  return {
    user,
    isFeedbackOpen,
    setIsFeedbackOpen,
    hotels,
    hotelsLoading,
    platformReviews,
    reviewsLoading,
    refetchReviews
  };
};
