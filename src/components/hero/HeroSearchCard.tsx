import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AIRPORTS } from '../../data/mockData';
import { calculateLoanBreakdown } from '../../config/loan';
import { formatPrice } from '../../services/currency';
import { ArrowRight, ArrowRightLeft, Calendar, ShieldCheck } from 'lucide-react';

interface HeroSearchCardProps {
  suggestedTab?: 'flights' | 'hotels' | 'paylater';
}

export const HeroSearchCard: React.FC<HeroSearchCardProps> = ({ suggestedTab }) => {
  const {
    setActiveRoute,
    currency,
    originCode,
    destinationCode,
    departureDate,
    returnDate,
    tripType,
    cabinClass,
    setFlightSearch,
    hotelDestinationCode,
    hotelCheckInDate,
    hotelCheckOutDate,
    setHotelSearch,
    loanDraft,
    setLoanDraft,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'paylater'>('flights');
  const [userChangedTab, setUserChangedTab] = useState(false);

  // Auto-suggest tab from scroll scene unless user explicitly clicked a tab
  useEffect(() => {
    if (suggestedTab && !userChangedTab) {
      setActiveTab(suggestedTab);
    }
  }, [suggestedTab, userChangedTab]);

  const handleTabClick = (tab: 'flights' | 'hotels' | 'paylater') => {
    setUserChangedTab(true);
    setActiveTab(tab);
  };

  // Swap origin and destination
  const handleSwapAirports = () => {
    setFlightSearch({
      originCode: destinationCode,
      destinationCode: originCode,
    });
  };

  // Loan mini calculator state
  const [calcAmount, setCalcAmount] = useState<number>(loanDraft.requestedAmount || 650_000);
  const [calcTenure, setCalcTenure] = useState<number>(loanDraft.tenureMonths || 6);
  const [calcDownPercent] = useState<number>(loanDraft.downPaymentPercent || 20);

  const loanBreakdown = calculateLoanBreakdown(calcAmount, calcTenure, calcDownPercent);

  const originAirport = AIRPORTS.find((a) => a.code === originCode) || AIRPORTS[0];
  const destAirport = AIRPORTS.find((a) => a.code === destinationCode) || AIRPORTS[1];

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0E2931]/90 dark:bg-[#061216]/95 backdrop-blur-2xl border border-[#2B7574]/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2B7574]/30 px-4 sm:px-6 py-3 bg-[#0A1D23]/60 gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#09171C]/70 rounded-xl border border-[#2B7574]/30">
          <button
            onClick={() => handleTabClick('flights')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'flights'
                ? 'bg-[#12484C] text-[#F2B632] shadow-sm border border-[#2B7574]/60'
                : 'text-[#A5D1E1] hover:text-[#FFFFFF]'
            }`}
          >
            Direct Flights
          </button>

          <button
            onClick={() => handleTabClick('hotels')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'hotels'
                ? 'bg-[#12484C] text-[#F2B632] shadow-sm border border-[#2B7574]/60'
                : 'text-[#A5D1E1] hover:text-[#FFFFFF]'
            }`}
          >
            Sanctuaries
          </button>

          <button
            onClick={() => handleTabClick('paylater')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'paylater'
                ? 'bg-[#12484C] text-[#F2B632] shadow-sm border border-[#2B7574]/60'
                : 'text-[#A5D1E1] hover:text-[#FFFFFF]'
            }`}
          >
            Fly Now, Pay Later
          </button>
        </div>

        {/* Live Status Eyebrow */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#A5D1E1]">
          <span className="w-2 h-2 rounded-full bg-[#F2B632] animate-pulse" />
          <span>LIVE FLIGHT SEARCH</span>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-4 sm:p-6">
        {/* FLIGHTS TAB */}
        {activeTab === 'flights' && (
          <div className="space-y-4">
            {/* Quick Trip Type Selector */}
            <div className="flex items-center justify-between text-xs text-[#A5D1E1]">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="heroTripType"
                    checked={tripType === 'round-trip'}
                    onChange={() => setFlightSearch({ tripType: 'round-trip' })}
                    className="accent-[#F2B632]"
                  />
                  <span>Round-Trip</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="heroTripType"
                    checked={tripType === 'one-way'}
                    onChange={() => setFlightSearch({ tripType: 'one-way' })}
                    className="accent-[#F2B632]"
                  />
                  <span>One-Way</span>
                </label>
              </div>

              <select
                value={cabinClass}
                onChange={(e) =>
                  setFlightSearch({
                    cabinClass: e.target.value as 'Economy' | 'Business' | 'First',
                  })
                }
                className="bg-[#09171C] border border-[#2B7574]/40 rounded-lg px-2.5 py-1 text-xs text-[#F4F6F5] focus:outline-none focus:border-[#F2B632]"
              >
                <option value="Economy">Economy Class</option>
                <option value="Business">Business Suites</option>
                <option value="First">First Class</option>
              </select>
            </div>

            {/* Origin & Destination Bar with Center Swap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
              {/* Origin */}
              <div className="bg-[#09171C]/80 border border-[#2B7574]/40 rounded-xl p-3 focus-within:border-[#F2B632] transition-colors">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A5D1E1]/70">
                  DEPARTURE AIRPORT
                </span>
                <select
                  value={originCode}
                  onChange={(e) => setFlightSearch({ originCode: e.target.value })}
                  className="w-full bg-transparent font-monument text-base font-bold text-[#F4F6F5] focus:outline-none cursor-pointer mt-1"
                >
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={a.code} className="bg-[#0E2931] text-[#F4F6F5]">
                      {a.city} ({a.code})
                    </option>
                  ))}
                </select>
                <span className="block text-[11px] text-[#2B7574] truncate mt-0.5">
                  {originAirport.name}
                </span>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={handleSwapAirports}
                aria-label="Swap origin and destination"
                className="hidden sm:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#12484C] text-[#F2B632] items-center justify-center border border-[#2B7574] shadow-md hover:rotate-180 transition-transform duration-300 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 stroke-[2]" />
              </button>

              {/* Destination */}
              <div className="bg-[#09171C]/80 border border-[#2B7574]/40 rounded-xl p-3 focus-within:border-[#F2B632] transition-colors">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A5D1E1]/70">
                  ARRIVAL DESTINATION
                </span>
                <select
                  value={destinationCode}
                  onChange={(e) => setFlightSearch({ destinationCode: e.target.value })}
                  className="w-full bg-transparent font-monument text-base font-bold text-[#F4F6F5] focus:outline-none cursor-pointer mt-1"
                >
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={a.code} className="bg-[#0E2931] text-[#F4F6F5]">
                      {a.city} ({a.code})
                    </option>
                  ))}
                </select>
                <span className="block text-[11px] text-[#2B7574] truncate mt-0.5">
                  {destAirport.name}
                </span>
              </div>
            </div>

            {/* Dates & Search CTA Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="bg-[#09171C]/80 border border-[#2B7574]/40 rounded-xl p-3">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A5D1E1]/70 flex items-center gap-1">
                  <Calendar className="w-3 h-3 stroke-[1.5]" />
                  <span>DEPARTURE DATE</span>
                </span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setFlightSearch({ departureDate: e.target.value })}
                  className="w-full bg-transparent text-xs font-mono font-bold text-[#F4F6F5] focus:outline-none mt-1"
                />
              </div>

              <div className="bg-[#09171C]/80 border border-[#2B7574]/40 rounded-xl p-3">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A5D1E1]/70 flex items-center gap-1">
                  <Calendar className="w-3 h-3 stroke-[1.5]" />
                  <span>RETURN DATE</span>
                </span>
                <input
                  type="date"
                  value={returnDate}
                  disabled={tripType === 'one-way'}
                  onChange={(e) => setFlightSearch({ returnDate: e.target.value })}
                  className="w-full bg-transparent text-xs font-mono font-bold text-[#F4F6F5] focus:outline-none mt-1 disabled:opacity-40"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveRoute('/flights');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-gold h-full min-h-[50px] px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg"
              >
                <span>Search Flights</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* HOTELS TAB */}
        {activeTab === 'hotels' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#12484C]/40 border border-[#2B7574]/50 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#F2B632] shrink-0 stroke-[2]" />
              <p className="text-xs text-[#F4F6F5]">
                Destinations pre-synchronized with your flight itinerary to <strong>{destAirport.city} ({destAirport.code})</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="bg-[#09171C]/80 border border-[#2B7574]/40 rounded-xl p-3">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A5D1E1]/70">
                  SANCTUARY DESTINATION
                </span>
                <select
                  value={hotelDestinationCode}
                  onChange={(e) => setHotelSearch({ hotelDestinationCode: e.target.value })}
                  className="w-full bg-transparent font-monument text-sm font-bold text-[#F4F6F5] focus:outline-none cursor-pointer mt-1"
                >
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={a.code} className="bg-[#0E2931] text-[#F4F6F5]">
                      {a.city} ({a.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#09171C]/80 border border-[#2B7574]/40 rounded-xl p-3">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A5D1E1]/70">
                  CHECK-IN DATES
                </span>
                <input
                  type="date"
                  value={hotelCheckInDate}
                  onChange={(e) => setHotelSearch({ hotelCheckInDate: e.target.value })}
                  className="w-full bg-transparent text-xs font-mono font-bold text-[#F4F6F5] focus:outline-none mt-1"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveRoute('/hotels');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-gold h-full min-h-[50px] px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg"
              >
                <span>Browse stays</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* PAY LATER TAB */}
        {activeTab === 'paylater' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#A5D1E1] gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F2B632] stroke-[2]" />
                <span>0% APR financing · CBN-licensed facility</span>
              </span>
              <span className="font-mono text-[#F2B632] font-semibold">
                Monthly: {formatPrice(loanBreakdown.monthlyPayment, currency)}
              </span>
            </div>

            {/* Slider */}
            <div className="bg-[#09171C]/80 border border-[#2B7574]/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A5D1E1]/70">
                  DESIRED TICKET EXPEDITION FARE
                </span>
                <span className="text-base font-bold tabular-nums text-[#F2B632]">
                  {formatPrice(calcAmount, currency)}
                </span>
              </div>
              <input
                type="range"
                min="150000"
                max="3000000"
                step="50000"
                value={calcAmount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCalcAmount(val);
                  setLoanDraft({ requestedAmount: val });
                }}
                className="w-full accent-[#F2B632] cursor-pointer"
              />
            </div>

            {/* Tenure & Apply CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[10px] font-mono text-[#A5D1E1] whitespace-nowrap">TENURE:</span>
                {[3, 6, 9, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setCalcTenure(m);
                      setLoanDraft({ tenureMonths: m });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                      calcTenure === m
                        ? 'bg-[#12484C] text-[#F2B632] border-[#2B7574]'
                        : 'border-[#2B7574]/30 text-[#A5D1E1] hover:text-[#FFFFFF]'
                    }`}
                  >
                    {m}M
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveRoute('/fly-now-pay-later');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-gold w-full sm:w-auto py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg"
              >
                <span>Explore payment examples</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
