'use client';

import { Zap, Clock, ArrowRight, Gift } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

export default function OffersPage() {
  const offers = [
    { 
      title: 'Summer Serenity', 
      desc: 'Get up to 30% off on all beach resorts this summer.', 
      code: 'SUMMER30', 
      expiry: 'Ends in 12 days',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
    },
    { 
      title: 'City Explorer', 
      desc: 'Complimentary breakfast and spa access for city stays.', 
      code: 'CITYVIP', 
      expiry: 'Limited time',
      img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000'
    },
    { 
      title: 'Honeymoon Special', 
      desc: 'Book 4 nights, get the 5th night free plus a private dinner.', 
      code: 'LOVEELITE', 
      expiry: 'Ongoing',
      img: 'https://images.unsplash.com/photo-1510076857177-7470076d4098'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-blue-700 to-indigo-900 py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Gift className="w-4 h-4 text-amber-400" /> Member Exclusives
          </div>
          <h1 className="text-7xl font-black text-white tracking-tighter mb-6">Exclusive Offers</h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto font-medium">Privileged access to handpicked deals and extraordinary savings.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 space-y-12">
        {offers.map((offer, i) => (
          <div key={i} className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-slate-100 group">
            <div className="w-full lg:w-2/5 h-80 lg:h-auto overflow-hidden">
              <img src={`${offer.img}?auto=format&fit=crop&q=80&w=800`} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
            <div className="flex-1 p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                    <Zap className="w-4 h-4 fill-blue-600" /> Limited Offer
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                    <Clock className="w-4 h-4" /> {offer.expiry}
                  </div>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{offer.title}</h2>
                <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">{offer.desc}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8 mt-12 pt-8 border-t border-slate-50">
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Use Promo Code</span>
                  <div className="px-6 py-3 bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl text-xl font-black text-slate-900 tracking-widest">
                    {offer.code}
                  </div>
                </div>
                <Button variant="premium" size="lg" className="h-16 px-10 rounded-2xl flex items-center gap-2 ml-auto">
                  Book with Offer <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
