'use client';

import { useEffect } from 'react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';

function LoginSuccessContent() {
  const { user, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      refreshProfile();
    }
  }, [searchParams, refreshProfile]);

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
      } else if (!searchParams.get('accessToken')) {
        // Only redirect to login if we don't have tokens in the URL
        router.push('/login');
      }
    }
  }, [user, loading, router, searchParams]);

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

export default function LoginSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginSuccessContent />
    </Suspense>
  );
}
