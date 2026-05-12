import React from 'react';
import Image from 'next/image';
import { MapPin, Star, ShieldCheck, LayoutGrid, X, ChevronLeft as LeftIcon, ChevronRight as RightIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Hotel } from '@/shared/types';

interface HotelGalleryProps {
  hotel: Hotel;
}

export const HotelGallery = ({ hotel }: HotelGalleryProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  const images = hotel.images || [];

  // Fill with placeholders if less than 5 images
  const displayImages = [...images.map(img => img.url)];
  while (displayImages.length < 5) {
    displayImages.push('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070');
  }

  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Verified Luxury Property
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">{hotel.name}</h1>
          <div className="flex items-center gap-3 text-slate-500 font-bold">
            <MapPin className="w-5 h-5 text-blue-600" />
            {hotel.address}
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-xl font-black mb-0.5 text-slate-900">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              {hotel.average_rating && hotel.average_rating > 0 ? hotel.average_rating.toFixed(1) : '5.0'}
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Elite Rating</p>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="text-center">
            <div className="text-xl font-black mb-0.5 text-slate-900">{hotel.review_count || 0}</div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Reviews</p>
          </div>
        </div>
      </div>

      {/* Modern Image Grid */}
      <div className="relative h-[600px] rounded-[3rem] overflow-hidden grid grid-cols-4 grid-rows-2 gap-3 group">
        {/* Main Image */}
        <div className="col-span-2 row-span-2 relative overflow-hidden" onClick={() => { setCurrentIndex(0); setIsOpen(true); }}>
          <Image
            src={displayImages[0]}
            alt={hotel.name}
            fill
            priority
            className="object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
          />
        </div>

        {/* Sub Images */}
        <div className="relative overflow-hidden" onClick={() => { setCurrentIndex(1); setIsOpen(true); }}>
          <Image src={displayImages[1]} alt={hotel.name} fill className="object-cover hover:scale-110 transition-transform duration-700 cursor-pointer" />
        </div>
        <div className="relative overflow-hidden" onClick={() => { setCurrentIndex(2); setIsOpen(true); }}>
          <Image src={displayImages[2]} alt={hotel.name} fill className="object-cover hover:scale-110 transition-transform duration-700 cursor-pointer" />
        </div>
        <div className="relative overflow-hidden" onClick={() => { setCurrentIndex(3); setIsOpen(true); }}>
          <Image src={displayImages[3]} alt={hotel.name} fill className="object-cover hover:scale-110 transition-transform duration-700 cursor-pointer" />
        </div>
        <div className="relative overflow-hidden" onClick={() => { setCurrentIndex(4); setIsOpen(true); }}>
          <Image src={displayImages[4]} alt={hotel.name} fill className="object-cover hover:scale-110 transition-transform duration-700 cursor-pointer" />
        </div>

        <Button 
          onClick={() => setIsOpen(true)}
          className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md text-slate-900 border-none hover:bg-white rounded-2xl h-12 px-6 flex items-center gap-2 font-black text-xs uppercase tracking-widest shadow-2xl"
        >
          <LayoutGrid className="w-4 h-4" /> Show all photos
        </Button>
      </div>

      {/* Fullscreen Gallery Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
          <div className="flex items-center justify-between p-8">
            <div className="text-white font-black text-sm uppercase tracking-[0.3em]">
              {currentIndex + 1} / {displayImages.length}
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center p-4">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1))}
              className="absolute left-8 z-10 p-6 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all"
            >
              <LeftIcon className="w-8 h-8" />
            </button>

            <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
              <Image
                src={displayImages[currentIndex]}
                alt="Gallery preview"
                fill
                className="object-contain"
              />
            </div>

            <button 
              onClick={() => setCurrentIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-8 z-10 p-6 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all"
            >
              <RightIcon className="w-8 h-8" />
            </button>
          </div>

          <div className="p-8 flex justify-center gap-4 overflow-x-auto">
            {displayImages.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden cursor-pointer transition-all ${currentIndex === idx ? 'ring-2 ring-white scale-110' : 'opacity-40 hover:opacity-100'}`}
              >
                <Image src={img} alt="Thumbnail" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
