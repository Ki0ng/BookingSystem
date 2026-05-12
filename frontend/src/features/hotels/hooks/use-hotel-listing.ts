'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '@/features/hotels/services/hotel.service';
import { Hotel } from '@/shared/types';

/**
 * Hook to handle hotel listing, filtering, and sorting logic
 */
export const useHotelListing = () => {
  const searchParams = useSearchParams();
  const [maxPrice, setMaxPrice] = useState(5000);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(5000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Best Matches');

  // Debounce price updates to prevent flicker while dragging
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMaxPrice(maxPrice);
    }, 400);
    return () => clearTimeout(timer);
  }, [maxPrice]);

  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('checkIn') || undefined;
  const checkOut = searchParams.get('checkOut') || undefined;
  const flexibility = searchParams.get('flexibility') ? Number(searchParams.get('flexibility')) : 0;
  const guests = searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined;

  const { data: hotels = [], isLoading: loading } = useQuery<Hotel[]>({
    queryKey: ['hotels', 'list', { location, checkIn, checkOut, flexibility, guests, maxPrice: debouncedMaxPrice, sortBy, selectedAmenities }],
    queryFn: async () => {
      const res = await hotelService.getHotels({
        location,
        checkIn,
        checkOut,
        guests,
        flexibility
      });

      let fetchedHotels: Hotel[] = res.data || [];

      // Filter by price on frontend if API doesn't support it fully
      fetchedHotels = fetchedHotels.filter(h => {
        if (!h.rooms || h.rooms.length === 0) return true; // Show hotels without rooms
        const minRoomPrice = Math.min(...h.rooms.map(r => r.base_price));
        return minRoomPrice <= maxPrice;
      });

      // Sorting Logic
      const sorted = [...fetchedHotels];
      if (sortBy === 'Price: Low to High') {
        sorted.sort((a, b) => (a.rooms?.[0]?.base_price || 0) - (b.rooms?.[0]?.base_price || 0));
      } else if (sortBy === 'Price: High to Low') {
        sorted.sort((a, b) => (b.rooms?.[0]?.base_price || 0) - (a.rooms?.[0]?.base_price || 0));
      } else if (sortBy === 'Top Rated') {
        sorted.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
      }

      return sorted;
    },
  });

  const clearFilters = () => {
    setMaxPrice(5000);
    setSelectedAmenities([]);
    setSortBy('Best Matches');
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const paramsForCard = Object.fromEntries(searchParams.entries());

  return {
    hotels,
    loading,
    maxPrice,
    setMaxPrice,
    selectedAmenities,
    toggleAmenity,
    sortBy,
    setSortBy,
    clearFilters,
    paramsForCard,
    location,
    searchParams
  };
};
