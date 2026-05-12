'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '@/features/hotels/services/hotel.service';
import { Hotel } from '@/shared/types';

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

  const { data: rawHotels = [], isLoading: loading } = useQuery<Hotel[]>({
    queryKey: ['hotels', 'list', { location, checkIn, checkOut, flexibility, guests }],
    queryFn: async () => {
      const res = await hotelService.getHotels({
        location,
        checkIn,
        checkOut,
        guests,
        flexibility
      });
      return res.data || [];
    },
  });

  const hotels = useMemo(() => {
    let result = [...rawHotels];

    // Filter by price
    result = result.filter(h => {
      if (!h.rooms || h.rooms.length === 0) return true;
      const minRoomPrice = Math.min(...h.rooms.map(r => r.base_price));
      return minRoomPrice <= debouncedMaxPrice;
    });

    // Sorting
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => (a.rooms?.[0]?.base_price || 0) - (b.rooms?.[0]?.base_price || 0));
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => (b.rooms?.[0]?.base_price || 0) - (a.rooms?.[0]?.base_price || 0));
    } else if (sortBy === 'Top Rated') {
      result.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    }

    return result;
  }, [rawHotels, debouncedMaxPrice, sortBy]);


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
