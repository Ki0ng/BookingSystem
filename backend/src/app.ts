import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport.config';
import { env } from './config/env.config';
import { errorHandler } from './middlewares/errorHandler';

import authRoutes from './routes/auth.routes';
import hotelRoutes from './routes/hotel.routes';
import roomRoutes from './routes/room.routes';
import bookingRoutes from './routes/booking.routes';
import adminRoutes from './routes/admin.routes';
import notificationRoutes from './routes/notification.routes';
import reviewRoutes from './routes/review.routes';

const app = express();

// Security Middlewares
app.use(helmet());

// Improved CORS configuration
const allowedOrigins = [
  env.FRONTEND_URL,
  'https://booking-system-1l7r057l5-kinle2005-1833s-projects.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚨 CORS Blocked: Origin ${origin} not in allowedOrigins:`, allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Rate Limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api', limiter);

// Performance Middlewares
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Elite Booking API is running 🚀' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);

// Error Handler
app.use(errorHandler);

export default app;

