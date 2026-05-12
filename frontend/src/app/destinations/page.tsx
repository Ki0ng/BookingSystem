'use client';

import { MapPin, ArrowRight } from 'lucide-react';


export default function DestinationsPage() {
  const destinations = [
    { name: 'Da Nang', country: 'Vietnam', img: 'https://images.unsplash.com/photo-1559592442-7e18259f63cc', count: 45 },
    { name: 'Phu Quoc', country: 'Vietnam', img: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f', count: 28 },
    { name: 'Nha Trang', country: 'Vietnam', img: 'https://images.unsplash.com/photo-1605342416194-e867499701a5', count: 62 },
    { name: 'Hanoi', country: 'Vietnam', img: 'https://images.unsplash.com/photo-1563813956493-9e102604071b', count: 34 },
    { name: 'Ho Chi Minh', country: 'Vietnam', img: 'https://images.unsplash.com/photo-1509030450996-939983c49b4d', count: 51 },
    { name: 'Hoi An', country: 'Vietnam', img: 'https://images.unsplash.com/photo-1599708153386-62e253686822', count: 42 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-slate-900 py-32 px-6 text-center">
        <h1 className="text-6xl font-black text-white tracking-tighter mb-6">Global Destinations</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Explore our curated selection of the world's most prestigious locations.</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {destinations.map((dest, i) => (
            <div key={i} className="group relative h-[500px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl">
              <img src={`${dest.img}?auto=format&fit=crop&q=80&w=800`} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400">{dest.country}</span>
                </div>
                <h3 className="text-4xl font-black tracking-tighter mb-4">{dest.name}</h3>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest">{dest.count} Properties</span>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
