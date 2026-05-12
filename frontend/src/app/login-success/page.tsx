'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';

export default function LoginSuccessPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (user.role === 'MANAGER') {
          router.push('/manager/dashboard');
        } else {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h1 className="text-2xl font-bold text-gray-900">Login Successful!</h1>
        <p className="text-gray-500">Redirecting you to the home page...</p>
      </div>
    </div>
  );
}
