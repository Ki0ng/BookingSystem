import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    emailOrPhone: z.string().min(1, 'Email or phone is required'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

export const applyManagerSchema = z.object({
  body: z.object({
    hotelName: z.string().min(3, 'Hotel name must be at least 3 characters'),
    hotelAddress: z.string().min(10, 'Hotel address must be at least 10 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    businessLicense: z.string().optional(),
  }),
});

export const updateApplicationSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED']),
    adminComment: z.string().optional(),
  }),
});
