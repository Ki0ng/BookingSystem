'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useForgotPassword } from '@/features/auth';

export default function ForgotPasswordPage() {
  const {
    emailOrPhone,
    setEmailOrPhone,
    loading,
    message,
    error,
    handleSubmit
  } = useForgotPassword();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-12 duration-700">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30 backdrop-blur-sm">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 11-7.743-5.743L11 5l-1 1V5l-1 1V5l-1 1V5l-1 1V5L7 6v1H6v1H5v1H4v1a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 001-1h2a1 1 0 001-1h2z" />
              </svg>
            </div>
          </div>

          <div className="space-y-3 text-center mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">
              Forgot <span className="text-blue-400">Access?</span>
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Don't worry, it happens. Enter your details and we'll help you get back in.
            </p>
          </div>
          
          {message && (
            <div className="bg-green-500/20 text-green-100 p-4 rounded-2xl text-sm mb-8 border border-green-500/30 backdrop-blur-md animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {message}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 text-red-100 p-4 rounded-2xl text-sm mb-8 border border-red-500/30 backdrop-blur-md animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-200 ml-1 uppercase tracking-[0.2em]">Contact Method</label>
                <Input
                  type="text"
                  placeholder="Email or Phone Number"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-14 rounded-2xl focus:ring-blue-500 focus:bg-white/10 transition-all"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-95" disabled={loading}>
                {loading ? 'Processing...' : 'Recover Account'}
              </Button>
            </form>
          )}

          <div className="mt-10 text-center text-sm">
            <Link href="/login" className="text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center gap-2 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
