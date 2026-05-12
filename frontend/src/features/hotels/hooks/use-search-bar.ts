'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Province } from '@/shared/types';
import { SearchParams } from '../types';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { format, parseISO } from 'date-fns';

/**
 * Hook to manage search bar state and logic
 */
export const useSearchBar = (initialParams: Partial<SearchParams>) => {
  const [location, setLocation] = useState(initialParams.location || '');
  const [checkIn, setCheckIn] = useState(initialParams.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialParams.checkOut || '');
  const [adults, setAdults] = useState(initialParams.guests || 2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const [activePicker, setActivePicker] = useState<'location' | 'date' | 'guest' | null>(null);

  // 🚀 Fetch Provinces using React Query
  const { data: provinces = [] } = useQuery<Province[]>({
    queryKey: ['provinces'],
    queryFn: async () => {
      const res = await fetch('https://provinces.open-api.vn/api/v2/p/');
      return res.json();
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  const filteredProvinces = useMemo(() => {
    if (!location.trim()) return provinces.slice(0, 5);
    
    const search = location.toLowerCase();
    const codenameSearch = search.replace(/\s+/g, '_');
    
    return provinces.filter((p: Province) =>
      p.name.toLowerCase().includes(search) ||
      p.codename.toLowerCase().includes(codenameSearch)
    );
  }, [location, provinces]);

  const handleSearch = (onSearch?: (params: SearchParams) => void, router?: AppRouterInstance) => {
    const totalGuests = adults + children;
    const params: SearchParams = { location, checkIn, checkOut, guests: totalGuests };

    if (onSearch) {
      onSearch(params);
    } else if (router) {
      const query = new URLSearchParams({
        location,
        checkIn,
        checkOut,
        guests: totalGuests.toString()
      }).toString();
      router.push(`/hotels?${query}`);
    }
  };

  const formatDateLabel = useCallback((dateStr: string) => {
    if (!dateStr) return '';
    try {
      return format(parseISO(dateStr), 'dd MMM');
    } catch (e) {
      return '';
    }
  }, []);

  const closePickers = useCallback(() => {
    setActivePicker(null);
  }, []);

  return {
    location, setLocation,
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    adults, setAdults,
    children, setChildren,
    rooms, setRooms,
    activePicker, setActivePicker,
    filteredProvinces,
    handleSearch,
    formatDateLabel,
    closePickers
  };
};
