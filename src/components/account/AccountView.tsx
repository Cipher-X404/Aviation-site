import React, { useState } from 'react';
import { DashboardAssistant } from '../common/DashboardAssistant';
import { useAppStore, BookingRecord } from '../../store/useAppStore';
import { MOCK_HOTELS } from '../../data/mockData';
import { formatPrice } from '../../services/currency';
import { BoardingPassModal } from '../flights/BoardingPassModal';
import {
  User,
  Plane,
  Building2,
  CreditCard,
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Download,
  QrCode,
  DollarSign,
  ChevronRight,
  Zap,
  Coffee
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    bookingHistory,
    savedHotelIds,
    currency,
    setActiveRoute,
    payLoanInstallment,
    setAuthModalOpen,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'timeline' | 'bookings' | 'loans' | 'loyalty' | 'saved'>('timeline');
  const [selectedTicket, setSelectedTicket] = useState<BookingRecord | null>(null);
  const [paySuccessMsg, setPaySuccessMsg] = useState<string | null>(null);

  const savedHotels = MOCK_HOTELS.filter((h) => savedHotelIds.includes(h.id));

  // Find active loans in booking history
  const activeLoanBookings = bookingHistory.filter((b) => b.loanDetails && b.loanDetails.remainingBalanceNgn > 0);

  const handlePayInstallment = (bookingId: string, monthlyNgn: number) => {
    payLoanInstallment(bookingId, monthlyNgn);
    setPaySuccessMsg(`Installment of ${formatPrice(monthlyNgn, currency)} recorded in this demo. The example schedule has been updated.`);
    setTimeout(() => setPaySuccessMsg(null), 4000);
  };

  return (
    <div className="pt-28 pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Payment Success Toast */}
      {paySuccessMsg && (
        <div className="fixed top-24 right-6 z-50 bg-[#12484C] text-[#F2B632] px-5 py-3 rounded-xl shadow-xl border border-[#2B7574]/40 flex items-center gap-3 font-mono text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#F2B632]" />
          <span>{paySuccessMsg}</span>
        </div>
      )}

      {/* Account Profile Monumental Header */}
      <div className="bg-[#102b30] text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-1/3 border-l border-white/10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#F2B632] text-[#0E2931] flex items-center justify-center font-bold text-2xl font-display shadow-lg shadow-black/20">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F2B632] text-[#0E2931]">
                  {currentUser.tier}
                </span>
              </div>
              <p className="text-xs text-[#A5D1E1] font-mono mt-1">
                Pass: {currentUser.passportNumber} · {currentUser.email} · National ID: {currentUser.nationalIdMasked}
              </p>
            </div>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 self-start md:self-auto">
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#A5D1E1]">Miles balance</span>
              <span className="text-lg font-bold font-mono text-[#F2B632] tabular-nums">
                {currentUser.milesBalance.toLocaleString()} PTS
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#A5D1E1]">Active PNRs</span>
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {bookingHistory.length}
              </span>
            </div>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="ml-2 text-xs font-mono text-[#F2B632] hover:underline cursor-pointer"
            >
              Switch User
            </button>
          </div>
        </div>

        {/* Tab Switcher (No borders on hover, refined luxury tabs) */}
        <div className="fixed z-40 bottom-4 left-1/2 -translate-x-1/2 w-[min(94vw,700px)] flex items-center justify-around gap-1 p-2 bg-[#102b30] border border-[#c9a955]/50 shadow-[0_18px_55px_rgba(0,0,0,.32)] rounded-[26px]">
          {[
            { id: 'timeline', label: 'Trips Timeline' },
            { id: 'bookings', label: `Boarding Passes (${bookingHistory.length})` },
            { id: 'loans', label: `Fly Now Pay Later (${activeLoanBookings.length} Active)` },
            { id: 'loyalty', label: 'Membership' },
            { id: 'saved', label: `Saved Sanctuaries (${savedHotels.length})` },
          ].map((t) => (
            <button
              key={t.id}
              aria-pressed={activeTab === t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-2 sm:px-3 py-3 rounded-2xl text-[8px] sm:text-[9px] font-mono uppercase tracking-wide transition-all duration-200 cursor-pointer max-w-[19%] leading-tight ${
                activeTab === t.id
                  ? 'bg-[#F2B632] text-[#0E2931] font-bold shadow-md'
                  : 'bg-white/10 text-[#A5D1E1] hover:text-white hover:bg-white/15'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: TRIPS TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#2B7574]/20">
            <div>
              <h2 className="font-display text-xl font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF]">
                Your trip details
              </h2>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                Real-time gate and boarding countdowns linked with airport radar.
              </p>
            </div>
            <span className="text-xs font-mono text-[#F2B632] bg-[#12484C] px-3 py-1 rounded-lg">
              Next Departure in 3h 24m
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2B7574]/30">
            {/* Timeline Item 1: Flight Departure */}
            <div className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-[#12484C] text-[#F2B632] flex items-center justify-center border-2 border-white dark:border-[#0E2931]">
                <Plane className="w-3 h-3 stroke-[2] -rotate-45" />
              </div>

              <div className="bg-white dark:bg-[#0E2931]/70 rounded-2xl p-6 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.25)] transition-all duration-300 hover:-translate-y-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#F2B632]">
                    THURSDAY, 12 NOV 2026 · 07:15 WAT (BOARDING AT 06:45)
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md font-bold">
                    Gate B4 · On Time
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                  Lagos (LOS) → Abuja (ABV) · Flight AV-304
                </h3>
                <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                  Murtala Muhammed Terminal 2 (MM2) · Seat 4A (Lie-Flat Suite) · Airbus A330-900neo
                </p>

                <div className="pt-3 border-t border-[#E2E2E0] dark:border-[#1E3E47] flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#12484C] dark:text-[#A5D1E1]">
                    <span className="flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-[#F2B632]" />
                      <span>Complimentary Lounge Access</span>
                    </span>
                    <span>·</span>
                    <span>Baggage: 2 × 32kg Checked</span>
                  </div>

                  <button
                    onClick={() => {
                      if (bookingHistory[0]) setSelectedTicket(bookingHistory[0]);
                    }}
                    className="btn-gold px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Open Gate Pass</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline Item 2: Hotel Check-in */}
            <div className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-[#12484C] text-[#F2B632] flex items-center justify-center border-2 border-white dark:border-[#0E2931]">
                <Building2 className="w-3 h-3 stroke-[2]" />
              </div>

              <div className="bg-white dark:bg-[#0E2931]/70 rounded-2xl p-6 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.25)] transition-all duration-300 hover:-translate-y-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#2B7574] dark:text-[#F2B632]">
                    THURSDAY, 12 NOV 2026 · 14:00 WAT CHECK-IN
                  </span>
                  <span className="text-xs font-mono text-[#12484C] dark:text-[#A5D1E1] bg-[#12484C]/10 dark:bg-white/5 px-2.5 py-1 rounded-md">
                    3 Nights Stay Confirmed
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                  Example stay in Abuja
                </h3>
                <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1]">
                  Example hotel details. Confirm amenities and transfers directly with the property.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS & E-TICKETS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#2B7574]/20">
            <div>
              <h2 className="font-display text-xl font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF]">
                Issued Electronic Tickets & Boarding Passes
              </h2>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                Click any flight coupon to view offline Apple Wallet / QR code.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRoute('/flights');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-gold px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              + Book Another Flight
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookingHistory.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedTicket(b)}
                className="rounded-3xl bg-white dark:bg-[#0E2931]/70 p-6 sm:p-7 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#F2B632] bg-[#12484C] px-3 py-1 rounded-lg">
                      {b.bookingRef}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                      {b.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#2B7574] dark:text-[#A5D1E1]">
                    Booked {b.bookingDate}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                    {b.flight?.airline || 'Sample carrier'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[#12484C] dark:text-[#A5D1E1] font-mono mt-1">
                    <span>{b.flight?.origin || 'LOS'} ({b.flight?.originCity || 'Lagos'})</span>
                    <span>→</span>
                    <span className="text-[#F2B632] font-bold">
                      {b.flight?.destination || 'ABV'} ({b.flight?.destinationCity || 'Abuja'})
                    </span>
                  </div>
                  <div className="text-xs text-[#12484C]/70 dark:text-[#A5D1E1]/70 font-mono mt-1">
                    Passenger: {b.passengers[0]?.firstName} {b.passengers[0]?.lastName} · Seat: {b.seat || '4A'}
                  </div>
                </div>

                <div className="border-perforated my-2" />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-[#2B7574] dark:text-[#A5D1E1]">
                      {b.paymentMethod === 'paylater' ? 'Fly Now Pay Later' : 'Settled in Full'}
                    </span>
                    <span className="text-base font-bold font-mono tabular-nums text-[#0E2931] dark:text-[#F2B632]">
                      {formatPrice(b.totalPaidNgn, currency)}
                    </span>
                  </div>

                  <span className="text-xs font-bold font-mono uppercase text-[#12484C] dark:text-[#F2B632] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <QrCode className="w-4 h-4" />
                    <span>View Pass →</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LOANS DASHBOARD */}
      {activeTab === 'loans' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#2B7574]/20">
            <div>
              <h2 className="font-display text-xl font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF]">
                Fly Now Pay Later Amortization Desk
              </h2>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                Example payment schedule only; no payment is processed.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRoute('/fly-now-pay-later');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-gold px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              + Calculate New Travel Loan
            </button>
          </div>

          {activeLoanBookings.length > 0 ? (
            <div className="space-y-6">
              {activeLoanBookings.map((b) => {
                const details = b.loanDetails!;
                return (
                  <div
                    key={b.id}
                    className="bg-white dark:bg-[#0E2931]/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300 space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E2E0] dark:border-[#1E3E47]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#F2B632] uppercase">
                            LOAN CONTRACT #{b.bookingRef}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500 font-bold uppercase">
                            Active & In Good Standing
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold uppercase text-[#0E2931] dark:text-white mt-1">
                          Itinerary: {b.flight?.origin || 'LOS'} → {b.flight?.destination || 'ABV'}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] font-mono uppercase text-[#12484C] dark:text-[#A5D1E1]">
                          Remaining Balance
                        </span>
                        <span className="text-2xl font-bold font-mono text-[#F2B632] tabular-nums">
                          {formatPrice(details.remainingBalanceNgn, currency)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1 text-[#12484C] dark:text-[#A5D1E1]">
                        <span>Amortization Progress</span>
                        <span>
                          {details.installmentsRemaining} Installments Remaining of {details.tenureMonths} mo
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-[#E2E2E0] dark:bg-[#122A32] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#2B7574] via-[#199FB1] to-[#F2B632] rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              ((b.totalPaidNgn - details.remainingBalanceNgn) / b.totalPaidNgn) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Quick Repayment Simulator */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-[#F4F6F5] dark:bg-[#0B1E24]">
                        <span className="text-[10px] font-mono uppercase text-[#12484C]/60 dark:text-[#A5D1E1]/60 block">
                          Monthly Installment
                        </span>
                        <span className="text-lg font-bold font-mono text-[#0E2931] dark:text-white tabular-nums">
                          {formatPrice(details.monthlyPaymentNgn, currency)}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F4F6F5] dark:bg-[#0B1E24]">
                        <span className="text-[10px] font-mono uppercase text-[#12484C]/60 dark:text-[#A5D1E1]/60 block">
                          Down Payment Settled
                        </span>
                        <span className="text-lg font-bold font-mono text-emerald-500 tabular-nums">
                          {formatPrice(details.downPaymentPaidNgn, currency)}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F4F6F5] dark:bg-[#0B1E24] flex flex-col justify-between">
                        <span className="text-[10px] font-mono uppercase text-[#12484C]/60 dark:text-[#A5D1E1]/60 block">
                          Next Auto-Debit Date
                        </span>
                        <span className="text-sm font-bold font-mono text-[#0E2931] dark:text-[#F2B632]">
                          12 Dec 2026 (via Direct Debit)
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handlePayInstallment(b.id, details.monthlyPaymentNgn)}
                        className="w-full sm:w-auto btn-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay Next Installment Now ({formatPrice(details.monthlyPaymentNgn, currency)})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePayInstallment(b.id, details.remainingBalanceNgn)}
                        className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#12484C] hover:bg-[#0E2931] text-[#F2B632] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Mark example balance as paid</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center rounded-3xl bg-white dark:bg-[#0E2931]/50 border border-[#2B7574]/20 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-display text-xl font-bold uppercase text-[#0E2931] dark:text-white">
                No Outstanding Loan Balances
              </h3>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] max-w-md mx-auto">
                This sample account has no live credit facility. Example balance: ₦0.
              </p>
              <button
                onClick={() => setActiveRoute('/fly-now-pay-later')}
                className="btn-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider mt-4 cursor-pointer"
              >
                Apply for New Flight Financing
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LOYALTY & TIER STATUS */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-r from-[#09171C] to-[#12484C] text-white p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#F2B632] uppercase mb-2">
              <Award className="w-4 h-4" />
              <span>AEROVISTA TRAVEL REWARDS · SAMPLE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold uppercase">
              Sample membership
            </h2>
            <p className="text-xs sm:text-sm text-[#A5D1E1] max-w-2xl mt-1">
              Example rewards and benefits for exploring the account screens. No real membership or perks are attached.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/10">
              <div className="bg-white/5 p-4 rounded-xl">
                <span className="text-xs font-mono text-[#A5D1E1] block uppercase">Miles Balance</span>
                <span className="text-2xl font-bold font-mono text-[#F2B632] tabular-nums">
                  148,250 PTS
                </span>
                <span className="text-[10px] text-white/50 block mt-1">Sufficient for 2 free return flights to Dubai</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <span className="text-xs font-mono text-[#A5D1E1] block uppercase">Chauffeur Vouchers</span>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  6 Remaining
                </span>
                <span className="text-[10px] text-white/50 block mt-1">Mercedes-Maybach airport escort</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <span className="text-xs font-mono text-[#A5D1E1] block uppercase">Lounge Access</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  Unlimited
                </span>
                <span className="text-[10px] text-white/50 block mt-1">+2 Guests allowed per departure</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SAVED HOTELS */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#2B7574]/20">
            <div>
              <h2 className="font-display text-xl font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF]">
                Saved Luxury Sanctuaries
              </h2>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                Example benefits shown for demonstration only.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRoute('/hotels');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-gold px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Browse All Hotels
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedHotels.map((h) => (
              <div
                key={h.id}
                className="rounded-3xl bg-white dark:bg-[#0E2931]/70 p-6 sm:p-7 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase text-[#F2B632] bg-[#12484C] px-2.5 py-0.5 rounded">
                      {h.city} Sector
                    </span>
                    <span className="text-xs font-mono text-emerald-500">Backup power (example)</span>
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF]">
                    {h.name}
                  </h3>
                  <p className="text-xs text-[#12484C] dark:text-[#A5D1E1] mt-1">
                    {h.district}, {h.city} · {h.tags.slice(0, 3).join(' · ')}
                  </p>
                </div>

                <div className="border-perforated my-1" />

                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-[#0E2931] dark:text-[#F2B632] tabular-nums">
                    {formatPrice(h.pricePerNightNgn, currency)}/nt
                  </span>
                  <button
                    onClick={() => {
                      setActiveRoute('/hotels');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn-gold px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Browse stays →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => { setActiveRoute('/flights'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Book a flight" className="fixed z-30 right-5 bottom-24 w-14 h-14 rounded-2xl bg-[#c9a955] text-[#102b30] shadow-xl flex items-center justify-center hover:-translate-y-1 transition-transform"><Plane size={22}/></button>
      {/* Modal View for E-Ticket */}
      {selectedTicket && (
        <BoardingPassModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
      <DashboardAssistant role="traveler" />
    </div>
  );
};
