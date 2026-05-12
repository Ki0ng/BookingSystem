'use client';

import React from 'react';
import {
  Wifi,
  Wind,
  Coffee,
  Car,
} from 'lucide-react';

// Hooks
import { useHotelPage } from '@/features/hotels';

// Sub-components
import { HotelGallery } from './details/HotelGallery';
import { RoomList } from './details/RoomList';
import { BookingWidget } from './details/BookingWidget';
import { PaymentModal } from './details/PaymentModal';
import { HotelReviews } from './details/HotelReviews';
import { HotelDetailsSkeleton } from '@/shared/components/ui/HotelDetailsSkeleton';

export default function HotelDetailsPage() {
  const {
    user,
    hotel,
    hotelLoading,
    reviews,
    reviewsLoading,
    reviewSort,
    setReviewSort,
    reviewPagination,
    refreshReviews,
    selectedRoom,
    setSelectedRoom,
    bookingLoading,
    showPaymentModal,
    setShowPaymentModal,
    selectedCheckIn,
    setSelectedCheckIn,
    selectedCheckOut,
    setSelectedCheckOut,
    flexibilityParam,
    setFlexibilityParam,
    guestsParam,
    handleBookingClick,
    confirmPayment
  } = useHotelPage();

  if (hotelLoading) return <HotelDetailsSkeleton />;
  if (!hotel) return <div className="p-10 text-center font-bold text-slate-400">Hotel not found.</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-24">
      <HotelGallery hotel={hotel} />

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-5 tracking-tight">About the Property</h2>
            <p className="text-slate-500 text-base leading-relaxed font-medium">
              {hotel.description || "Experience the pinnacle of luxury and comfort."}
            </p>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Premium Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Fiber WiFi', icon: Wifi },
                { name: 'Climate Control', icon: Wind },
                { name: 'Butler Service', icon: Coffee },
                { name: 'Free Parking', icon: Car },
              ].map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-3 p-6 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{item.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight">Available Accommodations</h3>
            <RoomList 
              rooms={hotel.rooms || []} 
              selectedRoomId={selectedRoom?.id || null} 
              onSelectRoom={setSelectedRoom} 
            />
          </section>

          <section>
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight">Location</h3>
            <div className="w-full h-[400px] rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm relative group bg-slate-100">
              <iframe
                width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
                title="Hotel Location"
              ></iframe>
            </div>
          </section>

          <HotelReviews 
            hotel={hotel} 
            user={user} 
            reviews={reviews} 
            isLoading={reviewsLoading} 
            sort={reviewSort} 
            setSort={setReviewSort}
            pagination={reviewPagination}
            onRefresh={refreshReviews}
          />
        </div>

        <aside className="lg:col-span-1">
          <BookingWidget 
            hotel={hotel}
            selectedRoom={selectedRoom}
            checkIn={selectedCheckIn}
            checkOut={selectedCheckOut}
            flexibility={flexibilityParam}
            guests={guestsParam}
            onDatesChange={(inD, outD, flex) => {
              setSelectedCheckIn(inD);
              setSelectedCheckOut(outD);
              setFlexibilityParam(flex);
            }}
            onBookingClick={handleBookingClick}
            isLoading={bookingLoading}
            user={user}
          />
        </aside>
      </div>

      {showPaymentModal && (
        <PaymentModal 
          amount={selectedRoom?.base_price || 0} 
          guests={guestsParam}
          onConfirm={confirmPayment}
          onClose={() => setShowPaymentModal(false)}
          isLoading={bookingLoading}
        />
      )}
    </div>
  );
}
