import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    roomId: z.string().uuid('Invalid room ID'),
    hotelId: z.string().uuid('Invalid hotel ID').optional(),
    checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid check-in date",
    }),
    checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid check-out date",
    }),
    guests: z.number().min(1).optional(),
    totalPrice: z.number().optional(),
  }).refine((data) => {
    const start = new Date(data.checkIn);
    const end = new Date(data.checkOut);
    return end > start;
  }, {
    message: "Check-out must be after check-in",
    path: ['checkOut'],
  }),
});
