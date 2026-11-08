import React, { useState } from 'react';
import { useAppStore, PassengerInfo, BookingRecord } from '../../store/useAppStore';
import { MOCK_FLIGHTS, AIRPORTS } from '../../data/mockData';
import { calculateLoanBreakdown } from '../../config/loan';
import { formatPrice } from '../../services/currency';
import { BoardingPassModal } from './BoardingPassModal';
import {
  Plane,
  User,
  ShieldCheck,
  CreditCard,
  Check,
  ArrowRight,
  ArrowLeft,
  Luggage,
  Utensils,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookingFlow: React.FC = () => {
  const {
    selectedFlight,
    passengers,
    setPassengers,
    selectedSeat,
    setSelectedSeat,
    addBookingToHistory,
    setActiveRoute,
    currency,
  } = useAppStore();

  const flight = selectedFlight || MOCK_FLIGHTS[0];

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState(passengers[0]?.firstName || 'Folashade');
  const [lastName, setLastName] = useState(passengers[0]?.lastName || 'Adeleke');
  const [email, setEmail] = useState(passengers[0]?.email || 'folashade.adeleke@aerovista.test');
  const [phone, setPhone] = useState(passengers[0]?.phone || '+234 803 456 7890');
  const [mealPref, setMealPref] = useState('Standard Gourmet');
  const [extraLuggage, setExtraLuggage] = useState(0);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'paylater'>('card');
  const [loanTenure, setLoanTenure] = useState<number>(6);
  const [loanDownPercent, setLoanDownPercent] = useState<number>(20);

  // Seat map configuration (6 rows, 4 seats per row: A, B [aisle] C, D)
  const SEAT_ROWS = [
    { row: 1, type: 'business', priceAdd: 50_000 },
    { row: 2, type: 'business', priceAdd: 50_000 },
    { row: 3, type: 'extra-legroom', priceAdd: 15_000 },
    { row: 4, type: 'standard', priceAdd: 0 },
    { row: 5, type: 'standard', priceAdd: 0 },
    { row: 6, type: 'standard', priceAdd: 0 },
  ];
  const OCCUPIED_SEATS = ['1B', '2C', '3D', '5A', '6B'];

  const extraLuggageCost = extraLuggage * 15_000;
  const seatExtraCost =
    selectedSeat.startsWith('1') || selectedSeat.startsWith('2')
      ? 50_000
      : selectedSeat.startsWith('3')
      ? 15_000
      : 0;

  const totalCostNgn = flight.priceNgn + extraLuggageCost + seatExtraCost;
  const loanBreakdown = calculateLoanBreakdown(totalCostNgn, loanTenure, loanDownPercent);

  const handleCompleteBooking = () => {
    const passengerData: PassengerInfo = {
      firstName,
      lastName,
      email,
      phone,
      seatNumber: selectedSeat,
      mealPreference: mealPref,
      extraBaggageKg: extraLuggage,
    };

    setPassengers([passengerData]);

    const bookingRef = `AV-${Math.floor(1000 + Math.random() * 9000)}-${flight.destination}`;
    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      bookingRef,
      type: 'flight',
      flight,
      passengers: [passengerData],
      totalPaidNgn: paymentMethod === 'paylater' ? loanBreakdown.downPaymentAmount : totalCostNgn,
      paymentMethod,
      loanDetails:
        paymentMethod === 'paylater'
          ? {
              tenureMonths: loanTenure,
              monthlyPaymentNgn: loanBreakdown.monthlyPayment,
              downPaymentPaidNgn: loanBreakdown.downPaymentAmount,
              remainingBalanceNgn: loanBreakdown.financedAmount,
              totalPaidSoFarNgn: loanBreakdown.downPaymentAmount,
              installmentsRemaining: loanTenure,
            }
          : undefined,
      bookingDate: new Date().toISOString().split('T')[0],
      travelDate: '2026-11-12',
      status: 'confirmed',
      qrCodeSeed: `CJTRAVELS-${bookingRef}-VERIFIED`,
    };

    addBookingToHistory(newBooking);
    setConfirmedBooking(newBooking);
    setCurrentStep(4);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F2B632', '#12484C', '#199FB1'],
    });
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header & Stepper Progress */}
      <div className="space-y-4">
        <button
          onClick={() => setActiveRoute('/flights')}
          className="text-xs font-mono text-[#2B7574] dark:text-[#A5D1E1] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>Back to Flights</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0E2931] dark:text-[#FFFFFF]">
              BOOKING: {flight.airline} ({flight.flightNumber})
            </h1>
            <p className="text-xs text-[#12484C] dark:text-[#A5D1E1]">
              {flight.originCity} ({flight.origin}) → {flight.destinationCity} ({flight.destination}) · Direct
            </p>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                    currentStep === step
                      ? 'bg-[#F2B632] text-[#0E2931]'
                      : currentStep > step
                      ? 'bg-[#12484C] text-[#F2B632]'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  {currentStep > step ? <Check className="w-4 h-4 stroke-[2]" /> : step}
                </div>
                {step < 3 && <div className="w-6 h-0.5 bg-[#2B7574]/30" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Form Steps (Left) + Pinned Price Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Container (col-span-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0E2931]/80 rounded-2xl p-6 sm:p-8 border border-[#2B7574]/30 shadow-teal-soft">
          {/* STEP 1: PASSENGERS */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E2E2E0] dark:border-[#18363F]">
                <User className="w-5 h-5 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                <h2 className="font-display text-lg font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF]">
                  Step 1: Passenger Particulars
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-sm text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Last / Surname
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-sm text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Email Address (For E-Ticket)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-sm text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Phone (SMS Flight Alerts)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-sm text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
                    required
                  />
                </div>
              </div>

              {/* Extras: Meals & Luggage */}
              <div className="pt-4 border-t border-[#E2E2E0] dark:border-[#18363F] space-y-4">
                <span className="text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] block">
                  Flight Extras
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-[#2B7574]/30 bg-[#F4F6F5]/50 dark:bg-[#08181D]/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                      <div>
                        <span className="block text-xs font-semibold text-[#0E2931] dark:text-[#FFFFFF]">
                          Meal Preference
                        </span>
                        <span className="text-[10px] text-[#2B7574] dark:text-[#A5D1E1]">
                          Complimentary Chef Menu
                        </span>
                      </div>
                    </div>
                    <select
                      value={mealPref}
                      onChange={(e) => setMealPref(e.target.value)}
                      className="bg-white dark:bg-[#0E2931] border border-[#2B7574]/30 rounded text-xs px-2 py-1"
                    >
                      <option>Standard Gourmet</option>
                      <option>Halal Certified</option>
                      <option>Vegetarian / Vegan</option>
                      <option>Diabetic Friendly</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-lg border border-[#2B7574]/30 bg-[#F4F6F5]/50 dark:bg-[#08181D]/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Luggage className="w-4 h-4 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                      <div>
                        <span className="block text-xs font-semibold text-[#0E2931] dark:text-[#FFFFFF]">
                          Extra Checked Bag
                        </span>
                        <span className="text-[10px] text-[#2B7574] dark:text-[#A5D1E1]">
                          +23kg Piece (+₦15,000)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExtraLuggage(Math.max(0, extraLuggage - 1))}
                        className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold font-mono">{extraLuggage}</span>
                      <button
                        type="button"
                        onClick={() => setExtraLuggage(extraLuggage + 1)}
                        className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-gold py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Seat Selection</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: INTERACTIVE CABIN SEAT MAP */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E2E0] dark:border-[#18363F]">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                  <h2 className="font-display text-lg font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF]">
                    Step 2: Select Your Seat
                  </h2>
                </div>
                <span className="text-xs font-mono text-[#F2B632] bg-[#12484C] px-2.5 py-1 rounded">
                  Selected: {selectedSeat}
                </span>
              </div>

              {/* Aircraft Cabin View */}
              <div className="bg-[#F4F6F5] dark:bg-[#08181D] rounded-2xl p-6 border border-[#2B7574]/30 max-w-md mx-auto">
                <div className="text-center font-mono text-[10px] uppercase tracking-widest text-[#2B7574] mb-4">
                  COCKPIT · FRONT OF AIRCRAFT
                </div>

                {/* Seat Rows */}
                <div className="space-y-3">
                  {SEAT_ROWS.map((rowItem) => (
                    <div key={rowItem.row} className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-[#2B7574] w-4">
                        {rowItem.row}
                      </span>

                      {/* Seats A and B */}
                      <div className="flex gap-2">
                        {['A', 'B'].map((letter) => {
                          const seatId = `${rowItem.row}${letter}`;
                          const isOccupied = OCCUPIED_SEATS.includes(seatId);
                          const isSelected = selectedSeat === seatId;

                          return (
                            <button
                              key={seatId}
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(seatId)}
                              className={`w-10 h-10 rounded-lg text-xs font-mono font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                                isOccupied
                                  ? 'bg-gray-300 dark:bg-gray-800 border-gray-400 text-gray-500 cursor-not-allowed opacity-50'
                                  : isSelected
                                  ? 'bg-[#F2B632] text-[#0E2931] border-[#F2B632] shadow-md scale-105'
                                  : 'bg-white dark:bg-[#0E2931] border-[#2B7574]/40 text-[#0E2931] dark:text-[#FFFFFF] hover:bg-[#12484C]/10 dark:hover:bg-white/10 hover:scale-105'
                              }`}
                            >
                              <span>{seatId}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Aisle */}
                      <div className="w-8 flex items-center justify-center">
                        <div className="w-0.5 h-6 bg-[#2B7574]/20" />
                      </div>

                      {/* Seats C and D */}
                      <div className="flex gap-2">
                        {['C', 'D'].map((letter) => {
                          const seatId = `${rowItem.row}${letter}`;
                          const isOccupied = OCCUPIED_SEATS.includes(seatId);
                          const isSelected = selectedSeat === seatId;

                          return (
                            <button
                              key={seatId}
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(seatId)}
                              className={`w-10 h-10 rounded-lg text-xs font-mono font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                                isOccupied
                                  ? 'bg-gray-300 dark:bg-gray-800 border-gray-400 text-gray-500 cursor-not-allowed opacity-50'
                                  : isSelected
                                  ? 'bg-[#F2B632] text-[#0E2931] border-[#F2B632] shadow-md scale-105'
                                  : 'bg-white dark:bg-[#0E2931] border-[#2B7574]/40 text-[#0E2931] dark:text-[#FFFFFF] hover:bg-[#12484C]/10 dark:hover:bg-white/10 hover:scale-105'
                              }`}
                            >
                              <span>{seatId}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-[#2B7574] mt-6 pt-4 border-t border-[#E2E2E0] dark:border-[#18363F]">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-[#F2B632]" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-white dark:bg-[#0E2931] border border-[#2B7574]/40" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gray-300 dark:bg-gray-800" />
                    <span>Occupied</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-[#12484C] dark:text-[#A5D1E1] hover:underline cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-gold py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD (INCL FLY NOW PAY LATER) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E2E2E0] dark:border-[#18363F]">
                <CreditCard className="w-5 h-5 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                <h2 className="font-display text-lg font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF]">
                  Step 3: Settlement Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#F2B632] bg-[#12484C]/10 dark:bg-[#12484C]/40 ring-1 ring-[#F2B632]'
                      : 'border-[#2B7574]/30 hover:bg-[#12484C]/5 dark:hover:bg-white/5 hover:shadow-sm'
                  }`}
                >
                  <span className="block text-xs font-bold text-[#0E2931] dark:text-[#FFFFFF]">
                    Debit / Credit Card
                  </span>
                  <span className="text-[10px] text-[#2B7574] dark:text-[#A5D1E1]">
                    Pay the full confirmed fare
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'transfer'
                      ? 'border-[#F2B632] bg-[#12484C]/10 dark:bg-[#12484C]/40 ring-1 ring-[#F2B632]'
                      : 'border-[#2B7574]/30 hover:bg-[#12484C]/5 dark:hover:bg-white/5 hover:shadow-sm'
                  }`}
                >
                  <span className="block text-xs font-bold text-[#0E2931] dark:text-[#FFFFFF]">
                    Bank Wire / NIBSS
                  </span>
                  <span className="text-[10px] text-[#2B7574] dark:text-[#A5D1E1]">
                    Direct bank checkout
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paylater')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    paymentMethod === 'paylater'
                      ? 'border-[#F2B632] bg-ocean-gradient text-[#F4F6F5] ring-2 ring-[#F2B632]'
                      : 'border-[#2B7574]/30 hover:bg-[#12484C]/5 dark:hover:bg-white/5 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-bold">Fly Now, Pay Later</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F2B632] stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] opacity-80 block mt-1">
                    Pay {loanDownPercent}% today, rest monthly
                  </span>
                </button>
              </div>

              {/* Fly Now Pay Later Mini Configuration if selected */}
              {paymentMethod === 'paylater' && (
                <div className="bg-[#0D5C75]/15 dark:bg-[#0D5C75]/40 border border-[#2B7574]/40 rounded-xl p-5 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#0E2931] dark:text-[#F2B632] font-semibold">
                      Configure Flight Financing
                    </span>
                    <span className="text-xs font-mono text-[#2B7574] dark:text-[#A5D1E1]">
                      Fly Now, Pay Later (0% APR)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                        Tenure
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[3, 6, 9, 12].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setLoanTenure(m)}
                            className={`py-1 text-xs font-mono font-bold rounded border ${
                              loanTenure === m
                                ? 'bg-[#12484C] text-[#F2B632] border-[#2B7574]'
                                : 'border-[#2B7574]/30'
                            }`}
                          >
                            {m}m
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                        Down Payment Today ({loanDownPercent}%)
                      </label>
                      <span className="font-mono text-base font-bold tabular-nums text-[#0E2931] dark:text-[#F2B632]">
                        {formatPrice(loanBreakdown.downPaymentAmount, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0E2931] text-[#F4F6F5] flex items-center justify-between text-xs">
                    <span>Monthly Instalment ({loanTenure} months):</span>
                    <span className="font-bold font-mono text-sm text-[#F2B632]">
                      {formatPrice(loanBreakdown.monthlyPayment, currency)} / mo
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-[#12484C] dark:text-[#A5D1E1] hover:underline cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleCompleteBooking}
                  className="btn-gold py-3 px-8 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>
                    {paymentMethod === 'paylater'
                      ? `Pay ${formatPrice(loanBreakdown.downPaymentAmount, currency)} & Issue Ticket`
                      : `Authorize ${formatPrice(totalCostNgn, currency)}`}
                  </span>
                  <Check className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {currentStep === 4 && confirmedBooking && (
            <div className="space-y-6 text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#12484C] text-[#F2B632] flex items-center justify-center mx-auto shadow-md">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#2B7574] dark:text-[#F2B632]">
                  BOOKING CONFIRMED & TICKET ISSUED
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF] mt-1">
                  Ready for Departure
                </h2>
                <p className="text-xs text-[#12484C] dark:text-[#A5D1E1] max-w-md mx-auto mt-2">
                  Your sovereign itinerary is confirmed and registered. Biometric gate pass and e-ticket are ready.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsBoardingPassOpen(true)}
                  className="btn-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  View Issued Boarding Pass
                </button>

                <button
                  onClick={() => {
                    setActiveRoute('/account');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-lg border border-[#2B7574]/40 hover:bg-gray-100 dark:hover:bg-[#12484C] text-xs font-semibold text-[#0E2931] dark:text-[#FFFFFF] cursor-pointer"
                >
                  Go to Trips Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pinned Price Summary (col-span-4) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0E2931]/80 rounded-2xl p-6 border border-[#2B7574]/30 shadow-teal-soft space-y-5 sticky top-24">
          <span className="font-mono text-xs uppercase tracking-wider text-[#0E2931] dark:text-[#FFFFFF] font-bold block pb-3 border-b border-[#E2E2E0] dark:border-[#18363F]">
            Flight Fare Breakdown
          </span>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#12484C] dark:text-[#A5D1E1]">
                Base Fare ({flight.cabinClass})
              </span>
              <span className="font-mono font-semibold tabular-nums text-[#0E2931] dark:text-[#FFFFFF]">
                {formatPrice(flight.priceNgn, currency)}
              </span>
            </div>

            {seatExtraCost > 0 && (
              <div className="flex justify-between">
                <span className="text-[#12484C] dark:text-[#A5D1E1]">
                  Seat Upgrade ({selectedSeat})
                </span>
                <span className="font-mono font-semibold tabular-nums text-[#0E2931] dark:text-[#FFFFFF]">
                  +{formatPrice(seatExtraCost, currency)}
                </span>
              </div>
            )}

            {extraLuggageCost > 0 && (
              <div className="flex justify-between">
                <span className="text-[#12484C] dark:text-[#A5D1E1]">
                  Extra Baggage ({extraLuggage}x 23kg)
                </span>
                <span className="font-mono font-semibold tabular-nums text-[#0E2931] dark:text-[#FFFFFF]">
                  +{formatPrice(extraLuggageCost, currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-[#2B7574] dark:text-[#A5D1E1]/80 text-[11px]">
              <span>Taxes & Airport Surcharges</span>
              <span>Included</span>
            </div>
          </div>

          <div className="border-perforated my-3" />

          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold text-[#0E2931] dark:text-[#FFFFFF]">
              Total Due
            </span>
            <div className="text-right">
              <span className="font-mono text-2xl font-bold tabular-nums text-[#0E2931] dark:text-[#F2B632]">
                {formatPrice(totalCostNgn, currency)}
              </span>
              {paymentMethod === 'paylater' && (
                <span className="block text-[10px] text-[#2B7574] dark:text-[#A5D1E1]">
                  or {formatPrice(loanBreakdown.downPaymentAmount, currency)} down + {formatPrice(loanBreakdown.monthlyPayment, currency)}/mo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render Boarding Pass Modal when confirmed */}
      {confirmedBooking && isBoardingPassOpen && (
        <BoardingPassModal
          booking={confirmedBooking}
          onClose={() => setIsBoardingPassOpen(false)}
        />
      )}
    </div>
  );
};
