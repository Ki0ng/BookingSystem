# Elite Booking System - Backend

This is the backend API for the Elite Booking System, built with Node.js, Express, and Prisma.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   - Copy `.env.example` to `.env`.
   - Update the values in `.env` with your local configuration (Database URL, JWT Secrets, SMTP, etc.).

3. **Database Migration:**
   ```bash
   npx prisma migrate dev
   ```

4. **Run the Server:**
   - Development mode: `npm run dev`
   - Production mode: `npm run start`

## Features
- User Authentication (JWT & Google OAuth)
- Hotel & Room Management
- Booking System
- Review System
- Real-time Notifications (Socket.io)
- Email Service (SMTP)
