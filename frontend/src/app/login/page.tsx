'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useAuth, authService } from '@/features/auth';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const { sendOTP, verifyOTP, error, loading } = useAuth();

  const handleSendOTP = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image with Cinematic Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop"
          className="w-full h-full object-cover scale-110 animate-subtle-zoom opacity-60"
          alt="Luxury background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6 py-8">
        <div className="bg-white/10 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-white/20 animate-in fade-in zoom-in duration-700">
          <div className="space-y-4 text-center mb-8">
            <Link href="/" className="inline-block group">
              <div className="w-12 h-12 bg-blue-600 rounded-[1rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform duration-500 mx-auto mb-4">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-2xl">
                ELITE<span className="text-blue-400">BOOKING</span>
              </h1>
            </Link>
            <p className="text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase">
              {step === 'email' ? 'Luxury starts here.' : 'Secure Gateway'}
            </p>
          </div>
          
          {error && (
            <div className="bg-rose-500/20 text-rose-100 p-4 rounded-xl text-[10px] font-bold mb-6 border border-rose-500/30 backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.8)]"></div>
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-[9px] font-black text-white/40 ml-1 uppercase tracking-[0.3em]">Credentials</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors w-4 h-4 z-10" />
                  <Input
                    type="email"
                    placeholder="name@exclusive.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-13 pl-12 rounded-xl focus:ring-blue-500/30 transition-all text-base font-medium border-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-300 px-6 py-2 w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                disabled={loading}
              >
                {loading ? 'Sending Code...' : 'Get Started'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-1 text-center mb-4">
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Code sent to</p>
                <p className="text-blue-400 font-black text-lg tracking-tight">{email}</p>
              </div>
              <div className="space-y-2.5">
                <label className="text-[9px] font-black text-white/40 ml-1 uppercase tracking-[0.3em]">Authorization Code</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors w-4 h-4 z-10" />
                  <Input
                    type="text"
                    placeholder="••••••"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/10 h-13 pl-12 rounded-xl focus:ring-emerald-500/30 transition-all text-xl tracking-[0.8em] font-black text-center border-2"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-300 px-6 py-2 w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                  disabled={loading || code.length < 6}
                >
                  {loading ? 'Validating...' : 'Unlock Account'}
                </Button>
                <button 
                  type="button" 
                  onClick={() => setStep('email')} 
                  className="flex items-center justify-center gap-2 text-white/40 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest py-1"
                >
                  <ArrowLeft size={12} /> Back to Entry
                </button>
              </div>
            </form>
          )}

          {step === 'email' && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10"></span>
                </div>
                <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em] font-black">
                  <span className="bg-[#1e293b] px-4 text-white/30">Quick Access</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleLogin}
                className="whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 hover:border-slate-300 active:scale-95 px-6 py-2 w-full h-14 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-2xl transition-all flex items-center justify-center gap-4 text-lg font-semibold"
                disabled={loading}
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.16-4.53z" />
                </svg>
                Google Account
              </Button>
            </>
          )}

          <div className="mt-8 text-center">
            <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed">
              Access reserved for authorized members <br />
              <Link href="#" className="text-blue-400/60 hover:text-blue-400 transition-colors">Agreement</Link> & <Link href="#" className="text-blue-400/60 hover:text-blue-400 transition-colors">Privacy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
