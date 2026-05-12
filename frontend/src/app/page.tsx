'use client';

import React from 'react';
import { PlatformFeedbackModal } from '@/shared/components/PlatformFeedbackModal';
import { useHomePage } from '@/features/hotels';

// 🚀 Modular Home Components
import { HeroSection } from './home/components/HeroSection';
import { StatsSection } from './home/components/StatsSection';
import { FeaturedHotels } from './home/components/FeaturedHotels';
import { Testimonials } from './home/components/Testimonials';
import { ValueProp } from './home/components/ValueProp';
import { FooterCTA } from './home/components/FooterCTA';

import { Suspense } from 'react';

function HomeContent() {
  const {
    user,
    isFeedbackOpen,
    setIsFeedbackOpen,
    hotels,
    hotelsLoading,
    platformReviews,
    reviewsLoading,
    refetchReviews
  } = useHomePage();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeroSection />

      <StatsSection />

      <FeaturedHotels hotels={hotels} loading={hotelsLoading} />

      {/* Partners Marquee */}
      <section className="py-20 border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-12">Trusted by Global Luxury Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {['Hilton', 'Marriott', 'Hyatt', 'Four Seasons', 'Aman'].map(brand => (
              <span key={brand} className="text-2xl font-serif italic font-bold text-gray-900">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      <Testimonials
        reviews={platformReviews}
        loading={reviewsLoading}
        user={user}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      <ValueProp />

      <FooterCTA />

      {/* Modals */}
      <PlatformFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSuccess={() => refetchReviews()}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>}>
      <HomeContent />
    </Suspense>
  );
}
