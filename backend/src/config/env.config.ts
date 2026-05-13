import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(5),
  JWT_REFRESH_SECRET: z.string().min(5),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  REDIS_URL: z.string(),
  // Thêm các biến Google OAuth vào đây
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  MAIL_FROM: z.string().default('Elite Booking <kinle2005@gmail.com>'),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error('❌ Invalid environment variables:', envServer.error.format());
  process.exit(1);
}

export const env = envServer.data;
