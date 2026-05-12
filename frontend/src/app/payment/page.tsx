'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ChevronLeft,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hotelName = "Elite Grand Palace"; // In real app, fetch from state
  const amount = searchParams.get('amount') || '499';

  const handlePay = () => {
    alert('Payment successful! Processing your booking...');
    router.push('/login-success'); // Mock landing
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Payment Form */}
        <div className="space-y-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-5 h-5" /> Back to Booking
          </button>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-slate-900">Secure Payment</h2>
              <div className="flex gap-2">
                <div className="w-10 h-6 bg-slate-100 rounded" />
                <div className="w-10 h-6 bg-slate-100 rounded" />
                <div className="w-10 h-6 bg-slate-100 rounded" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cardholder Name</label>
                <Input placeholder="JOHN DOE" className="h-14 rounded-2xl border-slate-100 font-bold" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <Input placeholder="•••• •••• •••• ••••" className="h-14 pl-12 rounded-2xl border-slate-100 font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expiry Date</label>
                  <Input placeholder="MM / YY" className="h-14 rounded-2xl border-slate-100 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">CVV</label>
                  <Input placeholder="•••" type="password" className="h-14 rounded-2xl border-slate-100 font-bold" />
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
              <Lock className="w-5 h-5 text-emerald-600 mt-1" />
              <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                Your payment is secured with 256-bit SSL encryption. We never store your card details on our servers.
              </p>
            </div>

            <Button onClick={handlePay} className="w-full h-16 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-xl shadow-xl shadow-blue-100 transition-all">
              Pay ${amount} Now
            </Button>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="space-y-8 sticky top-10">
          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl" />

            <h3 className="text-xl font-black mb-8 relative z-10 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" /> Order Summary
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-black">{hotelName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Deluxe Ocean View</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Check-in</p>
                  <p className="text-xs font-bold">15 May, 2026</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Check-out</p>
                  <p className="text-xs font-bold">16 May, 2026</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Room Subtotal</span>
                  <span className="font-bold">${amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Service Fee</span>
                  <span className="font-bold">$0.00</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-lg font-black italic text-blue-400">Total Charged</span>
                  <span className="text-3xl font-black">${amount}</span>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 py-4 bg-white/5 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Elite Secure Booking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
