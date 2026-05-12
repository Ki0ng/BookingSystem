import { useQuery } from '@tanstack/react-query';
import { hotelService } from '@/features/hotels/services/hotel.service';
import { Hotel } from '@/shared/types';

/**
 * Hook to fetch hotel details using TanStack Query
 */
export const useHotelDetails = (id: string) => {
  return useQuery<Hotel>({
    queryKey: ['hotel', id],
    queryFn: async () => {
      const res = await hotelService.getHotelById(id);
      if (!res.data) throw new Error('Hotel not found');
      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
