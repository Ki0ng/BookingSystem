import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/shared/styles/globals.css';
import QueryProvider from '@/shared/providers/QueryProvider';
import { Navbar } from '@/shared/components/Navbar';
import { MainLayout } from '@/shared/components/MainLayout';
import { AuthProvider } from '@/shared/providers/AuthProvider';
import { SocketProvider } from '@/shared/providers/SocketProvider';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Elite Booking | Luxury Hotel Reservations',
  description: 'Book the best hotels with Elite Booking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            <SocketProvider>
              <Navbar />
              <MainLayout>
                {children}
              </MainLayout>
            </SocketProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
