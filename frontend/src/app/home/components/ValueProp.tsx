import React from 'react';
import { ShieldCheck, Zap, Star, Heart } from 'lucide-react';

const PROPS = [
  { icon: ShieldCheck, title: 'Secure Payments', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { icon: Zap, title: 'Instant Booking', color: 'text-amber-600', bg: 'bg-amber-100' },
  { icon: Star, title: 'Luxury Standard', color: 'text-blue-600', bg: 'bg-blue-100' },
  { icon: Heart, title: '24/7 Support', color: 'text-rose-600', bg: 'bg-rose-100' },
];

export const ValueProp = () => {
  return (
    <section className="py-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">Why Choose Us</span>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">Elevating Your <br /> Travel Experience</h2>
            <p className="text-base text-gray-600 max-w-lg leading-relaxed font-medium">
              Elite Booking is more than just a platform. It's a commitment to providing you with the most seamless and luxurious travel planning possible.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {PROPS.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`${item.bg} p-2.5 rounded-xl`}>
                    <item.icon className={`${item.color} w-4 h-4`} />
                  </div>
                  <p className="font-bold text-gray-900 text-sm tracking-tight">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-600/5 rounded-[2.5rem] blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000"
              alt="Luxury Pool"
              className="relative rounded-[2.5rem] shadow-2xl z-10 w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
