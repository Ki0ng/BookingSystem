import React from 'react';

const STATS = [
  { label: 'Exclusive Hotels', value: '500+' },
  { label: 'Global Cities', value: '120+' },
  { label: 'Happy Guests', value: '10k+' },
  { label: 'Elite Awards', value: '25+' },
];

export const StatsSection = () => {
  return (
    <section className="relative z-20 mt-8 max-w-5xl mx-auto px-6 w-full">
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat, i) => (
          <div key={i} className="text-center md:border-r last:border-0 border-slate-100 px-2">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
