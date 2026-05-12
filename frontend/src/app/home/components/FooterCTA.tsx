import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';

export const FooterCTA = () => {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">Ready for your <br /> next adventure?</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Join our community of luxury travellers and get access to exclusive deals.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-lg shadow-blue-900/40">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/hotels">
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-xl border-white/20 text-white hover:bg-white/5 backdrop-blur-sm">
                  View Destinations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
