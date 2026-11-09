import React, { useState } from 'react';
import { useAppStore, BookingRecord } from '../../store/useAppStore';
import { Hotel } from '../../data/mockData';
import { formatPrice } from '../../services/currency';
import confetti from 'canvas-confetti';

export const HotelBookingFlow: React.FC = () => {
  const {
    selectedHotel,
    hotelCheckInDate,
    hotelCheckOutDate,
    hotelGuests,
    addBookingToHistory,
    setActiveRoute,
    currency,
  } = useAppStore();

  const hotel = (selectedHotel as Hotel | undefined) || {
    id: 'hotel-eko-grand',
    name: 'The Eko Grand Oasis',
    destinationCode: 'LOS',
    city: 'Lagos',
    district: 'Victoria Island',
    starRating: 5,
    reviewScore: 4.8,
    reviewCount: 342,
    pricePerNightNgn: 85000,
    distanceFromAirportKm: 32,
    distanceFromCityCenterKm: 5,
    featuredTag: 'VERIFIED',
    tags: ['Luxury', 'Oceanfront', 'Business Preferred'],
    amenities: {
      hasGeneratorBackup: true,
      hasAirportPickup: true,
      hasPool: true,
      hasHighSpeedWifi: true,
      hasSpa: true,
      hasBreakfastIncluded: true,
      hasGym: true,
    },
    overview: 'Premium sanctuary suites in Lagos.',
    rooms: [],
  };

  // Compute nights
  const checkIn = new Date(hotelCheckInDate || '2026-11-12');
  const checkOut = new Date(hotelCheckOutDate || '2026-11-18');
  const nightsCount = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));
  const pricePerNight = hotel.pricePerNightNgn;
  const totalPrice = pricePerNight * nightsCount;

  // Form state for Step 1
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!guestDetails.firstName.trim()) newErrors.firstName = 'First name required';
    if (!guestDetails.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!guestDetails.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestDetails.email)) newErrors.email = 'Valid email required';
    if (!guestDetails.phone.trim()) newErrors.phone = 'Phone required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteBooking = () => {
    const passenger: any = {
      firstName: guestDetails.firstName,
      lastName: guestDetails.lastName,
      email: guestDetails.email,
      phone: guestDetails.phone,
    };

    const bookingRef = `HT-${Math.floor(1000 + Math.random() * 9000)}-${hotel.id.substring(0, 3)}`;
    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      bookingRef,
      type: 'hotel',
      hotel,
      hotelNights: nightsCount,
      passengers: [passenger],
      totalPaidNgn: totalPrice,
      paymentMethod: 'card', // Simplified for hotel flow
      bookingDate: new Date().toISOString().split('T')[0],
      travelDate: hotelCheckInDate,
      status: 'confirmed',
      qrCodeSeed: `CJTRAVELS-${bookingRef}-HOTEL`,
    };

    addBookingToHistory(newBooking);
    setConfirmedBooking(newBooking);
    setCurrentStep(3);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F2B632', '#12484C', '#199FB1'],
    });
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center gap-10 py-16">
      {/* Step 1: Guest Details */}
      {currentStep === 1 && (
        <div className="w-full max-w-2xl bg-[#F4F6F5] dark:bg-[#09171C] p-8 rounded-2xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm">
          <h2 className="font-monument text-2xl font-bold text-[#0E2931] dark:text-[#EAEFEF] mb-6">Guest Details</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (validateStep1()) setCurrentStep(2); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">First name</label>
                <input
                  type="text"
                  value={guestDetails.firstName}
                  onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                />
                {errors.firstName && <span className="text-red-500 text-[10px] mt-1 block">{errors.firstName}</span>}
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Last name</label>
                <input
                  type="text"
                  value={guestDetails.lastName}
                  onChange={(e) => setGuestDetails({ ...guestDetails, lastName: e.target.value })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                />
                {errors.lastName && <span className="text-red-500 text-[10px] mt-1 block">{errors.lastName}</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Email address</label>
                <input
                  type="email"
                  value={guestDetails.email}
                  onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                />
                {errors.email && <span className="text-red-500 text-[10px] mt-1 block">{errors.email}</span>}
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Phone</label>
                <input
                  type="tel"
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                />
                {errors.phone && <span className="text-red-500 text-[10px] mt-1 block">{errors.phone}</span>}
              </div>
            </div>
            <button
              type="submit"
              className="btn-gold w-full py-3 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            >
              Continue to Stay Summary
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Stay Summary */}
      {currentStep === 2 && (
        <div className="w-full max-w-3xl bg-[#F4F6F5] dark:bg-[#09171C] p-8 rounded-2xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm">
          <h2 className="font-monument text-2xl font-bold text-[#0E2931] dark:text-[#EAEFEF] mb-6">Stay Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-[#12484C]/10 dark:bg-[#12484C]/30 rounded-xl border border-[#2B7574]/20">
              <div>
                <span className="text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] block">Hotel</span>
                <span className="font-monument text-lg font-bold text-[#0E2931] dark:text-[#EAEFEF]">{hotel.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] block">Check-in</span>
                <span className="font-bold text-[#0E2931] dark:text-[#EAEFEF]">{hotelCheckInDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] block">Check-out</span>
                <span className="font-bold text-[#0E2931] dark:text-[#EAEFEF]">{hotelCheckOutDate}</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#12484C]/10 dark:bg-[#12484C]/30 rounded-xl border border-[#2B7574]/20">
              <div>
                <span className="text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] block">Nights</span>
                <span className="font-bold text-[#0E2931] dark:text-[#EAEFEF]">{nightsCount}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] block">Price / Night</span>
                <span className="font-bold text-[#0E2931] dark:text-[#EAEFEF]">{formatPrice(pricePerNight, currency)}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] block">Total Price</span>
                <span className="font-monument text-xl font-bold text-[#F2B632]">{formatPrice(totalPrice, currency)}</span>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-semibold text-[#12484C] dark:text-[#A5D1E1] hover:underline cursor-pointer"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="btn-gold py-3 px-6 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 hover:scale-[1.02]"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <div className="w-full max-w-3xl bg-[#F4F6F5] dark:bg-[#09171C] p-8 rounded-2xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm">
          <h2 className="font-monument text-2xl font-bold text-[#0E2931] dark:text-[#EAEFEF] mb-6">Payment Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {['Card', 'Bank Transfer', 'Fly Now Pay Later'].map((method) => (
              <button
                key={method}
                onClick={() => {}} // In real flow, handle selection
                className="p-4 rounded-xl border border-[#2B7574]/30 hover:border-[#F2B632] hover:bg-[#12484C]/5 dark:hover:bg-white/5 transition-all cursor-pointer text-left"
              >
                <span className="block text-xs font-bold text-[#0E2931] dark:text-[#EAEFEF]">{method}</span>
                <span className="text-[10px] text-[#5A6B70] dark:text-[#849CA3] mt-1 block">Instant processing</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs font-semibold text-[#12484C] dark:text-[#A5D1E1] hover:underline cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={handleCompleteBooking}
              className="btn-gold py-3 px-6 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === 3 && confirmedBooking && (
        <div className="w-full max-w-2xl bg-[#F4F6F5] dark:bg-[#09171C] p-8 rounded-2xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm text-center">
          <div className="text-3xl mb-4">🎉</div>
          <h2 className="font-monument text-2xl font-bold text-[#0E2931] dark:text-[#EAEFEF] mb-2">Booking Confirmed</h2>
          <p className="text-sm text-[#5A6B70] dark:text-[#849CA3] mb-6">Reference: {confirmedBooking.bookingRef}</p>
          <button
            onClick={() => setActiveRoute('/account')}
            className="btn-gold py-3 px-6 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 hover:scale-[1.02]"
          >
            View Booking History
          </button>
        </div>
      )}
    </div>
  );
};
