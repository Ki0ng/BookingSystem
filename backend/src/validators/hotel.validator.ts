import { z } from 'zod';

export const createHotelSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Hotel name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    address: z.string().min(5, 'Address is required'),
    location_lat: z.number().optional(),
    location_lng: z.number().optional(),
    base_price: z.number().or(z.string().transform(Number)).optional(),
    adults: z.number().optional(),
    children: z.number().optional(),
    quantity: z.number().optional(),
    images: z.array(z.string().url()).optional(),
    amenities: z.array(z.string()).optional(),
  }),
});

export const updateHotelSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    address: z.string().min(5).optional(),
    location_lat: z.number().optional(),
    location_lng: z.number().optional(),
    images: z.array(z.string().url()).optional(),
    amenities: z.array(z.string()).optional(),
  }),
});

export const createRoomSchema = z.object({
  body: z.object({
    hotelId: z.string().uuid('Invalid hotel ID'),
    room_type: z.string().min(2, 'Room type is required'),
    base_price: z.number().positive('Price must be positive'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
    metadata: z.record(z.any()).optional(),
    images: z.array(z.string().url()).optional(),
  }),
});

export const updateRoomSchema = z.object({
  body: z.object({
    room_type: z.string().min(2).optional(),
    base_price: z.number().positive().optional(),
    quantity: z.number().int().positive().optional(),
    status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE']).optional(),
    metadata: z.record(z.any()).optional(),
    images: z.array(z.string().url()).optional(),
  }),
});
