import React from 'react';
import Image from 'next/image';
import { SearchBar } from '@/shared/components/SearchBar';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-start justify-center">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Hotel"
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105 animate-subtle-zoom"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white" />
      </div>
      <div className="relative z-40 w-full max-w-7xl px-6 flex flex-col items-center text-center pt-32 pb-20">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 uppercase">
          Discover the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200">Unimaginable</span>
        </h1>

        <p className="text-base md:text-lg text-white/80 font-medium max-w-2xl mx-auto mb-16 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Curating the most extraordinary properties across the globe for those who seek more than just a stay.
        </p>


        <div className="w-full max-w-3xl animate-in fade-in zoom-in duration-1000 delay-500">
          <div className="p-1.5 bg-white/10 backdrop-blur-2xl rounded-[2rem] border border-white/20 shadow-2xl">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  );
};
