import { z } from 'zod';

export const createReviewSchema = z.object({
  hotelId: z.string().uuid().optional().nullable(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().max(500).optional(),
  isHidden: z.boolean().optional(),
});

export const replyReviewSchema = z.object({
  message: z.string().min(1).max(1000),
});

export const reviewQuerySchema = z.object({
  page: z.string().optional().transform(v => v ? parseInt(v) : 1),
  limit: z.string().optional().transform(v => v ? parseInt(v) : 10),
  rating: z.string().optional().transform(v => (v && v !== '') ? parseInt(v) : undefined),
  status: z.preprocess((val) => (val === '' ? undefined : val), z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional()),
  sortBy: z.enum(['newest', 'oldest', 'rating_desc', 'rating_asc']).optional().default('newest'),
  search: z.string().optional(),
});
