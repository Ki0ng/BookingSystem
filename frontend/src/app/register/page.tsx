'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useAuth, authService } from '@/features/auth';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { validators, validationMessages } from '@/shared/utils/validation';

export default function RegisterPage() {
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const { sendOTP, verifyOTP, error, loading } = useAuth();

  const handleSendOTP = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validators.isValidEmail(email)) {
      // We can use a local state or just let the backend handle it, 
      // but the user wants centralized validation.
      // Since useAuth doesn't expose setError, I'll just check it here.
      alert(validationMessages.invalidEmail);
      return;
    }

    const success = await sendOTP(email);
    if (success) {
      setStep('code');
    }
  };

  const handleVerifyOTP = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await verifyOTP(email, code);
  };

  const handleGoogleLogin = (): void => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-500">
          <div className="space-y-2 text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
              ELITE<span className="text-blue-400">BOOKING</span>
            </h1>
            <p className="text-gray-200 text-sm font-medium tracking-wide">
              {step === 'email' ? 'Join the most exclusive collection.' : 'Confirm your identity.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-100 p-4 rounded-xl text-sm mb-8 border border-red-500/30 backdrop-blur-sm flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-300 ml-1 uppercase tracking-[0.2em]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-14 pl-12 rounded-2xl focus:ring-blue-500/50 transition-all text-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={loading}>
                {loading ? 'Sending Code...' : 'Get Started'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-2 text-center mb-4">
                <p className="text-gray-300 text-sm">Verify your email</p>
                <p className="text-blue-400 font-bold">{email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-300 ml-1 uppercase tracking-[0.2em]">Verification Code</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Enter code"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-14 pl-12 rounded-2xl focus:ring-blue-500/50 transition-all text-lg tracking-[0.3em] font-mono text-center"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={loading || code.length < 6}>
                  {loading ? 'Verifying...' : 'Complete Sign Up'}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors text-sm py-2"
                >
                  <ArrowLeft size={16} /> Use another email
                </button>
              </div>
            </form>
          )}

          {step === 'email' && (
            <>
              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                  <span className="bg-transparent px-3 text-gray-400 font-bold">Or join with</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-14 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-2xl transition-all flex items-center justify-center gap-4 text-lg font-semibold"
                disabled={loading}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.16-4.53z" />
                </svg>
                Google Account
              </Button>
            </>
          )}

          <div className="mt-10 text-center">
            <p className="text-gray-200 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 font-bold hover:underline ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
