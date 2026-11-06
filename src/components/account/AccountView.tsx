import React, { useState, useEffect } from 'react';
import { DashboardAssistant } from '../common/DashboardAssistant';
import { useAppStore, BookingRecord } from '../../store/useAppStore';
import { MOCK_HOTELS } from '../../data/mockData';
import { HOTEL_IMAGES } from '../../data/images';
import { formatPrice } from '../../services/currency';
import { BoardingPassModal } from '../flights/BoardingPassModal';
import {
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
  Coffee,
  Luggage,
  Compass,
  Wifi,
  MapPin,
  User,
  LogOut,
  Phone,
  Shield,
  Crown,
  AlertCircle,
  FileText,
  Share2,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    bookingHistory,
    savedHotelIds,
    toggleSaveHotel,
    currency,
    setActiveRoute,
    payLoanInstallment,
    setAuthModalOpen,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'timeline' | 'passes' | 'loans' | 'loyalty' | 'sanctuaries'>('timeline');
  const [selectedTicket, setSelectedTicket] = useState<BookingRecord | null>(null);
  const [paySuccessMsg, setPaySuccessMsg] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Tab 2 filter
  const [ticketFilter, setTicketFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  // Tab 3 Loan Simulator State
  const [simLoanAmount, setSimLoanAmount] = useState<number>(650_000);
  const [simTenure, setSimTenure] = useState<number>(6);
  const [simDownPercent, setSimDownPercent] = useState<number>(25);

  // Tab 4 Miles Redemption Simulator State
  const [redeemMilesInput, setRedeemMilesInput] = useState<number>(50_000);

  // Live countdown timer for the next departure
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 3,
    minutes: 24,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3800);
  };

  // Saved hotels list (fallback to top 3 if empty so the view is always vibrant)
  const savedHotels = savedHotelIds.length > 0
    ? MOCK_HOTELS.filter((h) => savedHotelIds.includes(h.id))
    : MOCK_HOTELS.slice(0, 3);

  // Active loans
  const activeLoanBookings = bookingHistory.filter(
    (b) => b.loanDetails && b.loanDetails.remainingBalanceNgn > 0
  );

  const handlePayInstallment = (bookingId: string, monthlyNgn: number) => {
    payLoanInstallment(bookingId, monthlyNgn);
    setPaySuccessMsg(`Installment of ${formatPrice(monthlyNgn, currency)} settled via Sovereign CBN Clearing. Amortization ledger updated.`);
    setTimeout(() => setPaySuccessMsg(null), 4000);
  };

  const handleLiquidateLoan = (bookingId: string, remainingNgn: number) => {
    payLoanInstallment(bookingId, remainingNgn);
    setPaySuccessMsg(`Full loan balance of ${formatPrice(remainingNgn, currency)} liquidated at 0% penalty. Certificate of settlement generated.`);
    setTimeout(() => setPaySuccessMsg(null), 4000);
  };

  // Sim loan calculation
  const simDownPayment = Math.round((simLoanAmount * simDownPercent) / 100);
  const simPrincipalToFinance = simLoanAmount - simDownPayment;
  const simMonthly = Math.round(simPrincipalToFinance / simTenure);

  return (
    <div className="min-h-screen pt-24 pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Dynamic Toast Alerts */}
      {(paySuccessMsg || toastNotice) && (
        <div className="fixed top-20 right-6 z-50 bg-[#07161B]/95 text-[#F2B632] px-5 py-3.5 rounded-2xl shadow-2xl border border-[#2B7574]/60 flex items-center gap-3 font-mono text-xs animate-in slide-in-from-top-3 backdrop-blur-xl">
          <CheckCircle2 className="w-4 h-4 text-[#F2B632] shrink-0" />
          <span>{paySuccessMsg || toastNotice}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SOVEREIGN TRAVELER PROFILE & TELEMETRY HUD HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl bg-[#07161B]/95 text-white border border-[#2B7574]/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-2xl">
        {/* Background glow & radar aesthetics */}
        <div className="bg-topo absolute inset-0 opacity-15 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#12484C]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#2B7574]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Sovereign Badge Avatar */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#F2B632] via-[#E2A622] to-[#B8861B] text-[#0E2931] flex items-center justify-center font-display font-black text-2xl sm:text-3xl shadow-xl shadow-black/40 border-2 border-[#FFE8A3]/40">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#12484C] text-[#F2B632] border-2 border-[#07161B] flex items-center justify-center shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-monument text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#F4F6F5]">
                  {currentUser.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F2B632] text-[#0E2931] shadow-[0_2px_10px_rgba(242,182,50,0.3)]">
                  {currentUser.tier}
                </span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                  BIOMETRIC FAST-TRACK ACTIVE
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#A5D1E1]/80 font-mono mt-2">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#F2B632]" />
                  <span>Passport: <strong className="text-white">{currentUser.passportNumber}</strong></span>
                </span>
                <span>·</span>
                <span>BVN: <strong className="text-white">{currentUser.nationalIdMasked}</strong> (CBN Verified)</span>
                <span>·</span>
                <span>Station: <strong className="text-[#F2B632]">MM2 Terminal Lagos</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              onClick={() => {
                setActiveRoute('/flights');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#12484C] hover:bg-[#1a5f64] text-[#F2B632] border border-[#2B7574]/60 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md"
            >
              <Plane className="w-3.5 h-3.5 -rotate-45" />
              <span>+ New Flight</span>
            </button>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#A5D1E1] hover:text-white border border-white/10 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Switch Persona
            </button>
          </div>
        </div>

        {/* 4 Operations Telemetry HUD Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-8 pt-6 border-t border-[#18363F]/80">
          {/* Card 1: Miles Rewards Vault */}
          <div className="bg-[#091F26]/60 p-4 rounded-2xl border border-[#2B7574]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[10px] font-mono uppercase mb-1">
              <span>Miles Vault</span>
              <Award className="w-3.5 h-3.5 text-[#F2B632]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#F2B632] tabular-nums">
              {currentUser.milesBalance.toLocaleString()} <span className="text-xs text-[#A5D1E1]">PTS</span>
            </div>
            <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center justify-between">
              <span>≈ ₦1,482,500 Flight Credit</span>
              <span>74% to Lifetime</span>
            </div>
          </div>

          {/* Card 2: Active Itineraries */}
          <div className="bg-[#091F26]/60 p-4 rounded-2xl border border-[#2B7574]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[10px] font-mono uppercase mb-1">
              <span>Active PNRs</span>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              {bookingHistory.length} <span className="text-xs text-[#A5D1E1]">Journeys</span>
            </div>
            <div className="mt-2 text-[10px] font-mono text-[#F2B632] flex items-center gap-1">
              <span>Takeoff in: {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Card 3: 0% FNPL Pre-Approved Limit */}
          <div className="bg-[#091F26]/60 p-4 rounded-2xl border border-[#2B7574]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[10px] font-mono uppercase mb-1">
              <span>0% FNPL Credit Facility</span>
              <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-300 tabular-nums">
              ₦3,000,000
            </div>
            <div className="mt-2 text-[10px] font-mono text-[#A5D1E1]/80">
              ₦2,520,000 Available · 0% APR
            </div>
          </div>

          {/* Card 4: Executive Privileges */}
          <div className="bg-[#091F26]/60 p-4 rounded-2xl border border-[#2B7574]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[10px] font-mono uppercase mb-1">
              <span>Presidential Privileges</span>
              <Crown className="w-3.5 h-3.5 text-[#F2B632]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              Unlimited
            </div>
            <div className="mt-2 text-[10px] font-mono text-[#A5D1E1]/80">
              SkyTeam Lounges · Maybach Tarmac
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: LIVE TRIPS TIMELINE & RADAR DISPATCH
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Active Flight Radar Banner */}
          <div className="bg-gradient-to-r from-[#0E2931] via-[#12484C] to-[#0A2027] text-white p-6 sm:p-8 rounded-3xl border border-[#2B7574]/40 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#2B7574]/20 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-[#F2B632] uppercase">
                    ACTIVE CORRIDOR RADAR // SECTOR LOS-ABV // FLIGHT AV-304
                  </span>
                </div>
                <h2 className="font-monument text-2xl sm:text-3xl font-bold uppercase text-white">
                  Lagos (MM2) → Abuja (DNAA)
                </h2>
                <p className="text-xs sm:text-sm text-[#A5D1E1] font-mono mt-1">
                  Airbus A330-900neo · Cruising Alt: FL380 · Speed: 485 kts · Lie-Flat Suite 4A
                </p>
              </div>

              {/* Countdown Dial */}
              <div className="bg-[#07161B]/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-[#2B7574]/60 text-center min-w-[220px]">
                <span className="text-[9px] font-mono uppercase text-[#A5D1E1] tracking-wider block mb-1">
                  Gate Boarding Commences In
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#F2B632] tracking-wider tabular-nums">
                  {String(countdown.hours).padStart(2, '0')}:
                  {String(countdown.minutes).padStart(2, '0')}:
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div className="mt-1 flex items-center justify-center gap-3 text-[10px] font-mono text-[#A5D1E1]/70">
                  <span>Gate B4</span>
                  <span>·</span>
                  <span className="text-emerald-400">On Time</span>
                </div>
              </div>
            </div>

            {/* Flight Route Infographic Line */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <span className="text-[10px] font-mono text-[#A5D1E1] uppercase block">Departure Airport</span>
                <span className="text-lg font-bold font-mono text-white">07:15 WAT</span>
                <p className="text-xs text-[#A5D1E1]/70 font-mono">Murtala Muhammed Int'l T2 (LOS)</p>
                <div className="mt-1 text-[10px] font-mono text-emerald-400">Weather: 29°C · Clear</div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono text-[#F2B632] uppercase mb-1">Non-Stop · 1h 15m</span>
                <div className="w-full flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F2B632] shrink-0" />
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#F2B632] via-[#2B7574] to-emerald-400 relative">
                    <Plane className="w-4 h-4 text-white absolute left-1/2 -top-2 -translate-x-1/2 -rotate-45" />
                  </div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
                </div>
                <span className="text-[10px] font-mono text-[#A5D1E1] mt-1">Airspace: Sovereign Corridor 01</span>
              </div>

              <div className="md:text-right">
                <span className="text-[10px] font-mono text-[#A5D1E1] uppercase block">Arrival Destination</span>
                <span className="text-lg font-bold font-mono text-white">08:30 WAT</span>
                <p className="text-xs text-[#A5D1E1]/70 font-mono">Nnamdi Azikiwe Presidential Wing (ABV)</p>
                <div className="mt-1 text-[10px] font-mono text-emerald-400">Weather: 32°C · Calm</div>
              </div>
            </div>
          </div>

          {/* Sequential Timeline Nodes */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#2B7574]/40">
            {/* Timeline Node 1: Fast-Track Airside Dispatch */}
            <div className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-[#12484C] text-[#F2B632] flex items-center justify-center border-2 border-white dark:border-[#07161B] shadow-md">
                <Plane className="w-3 h-3 -rotate-45" />
              </div>

              <div className="bg-white dark:bg-[#0E2931]/80 rounded-3xl p-6 sm:p-7 border border-[#2B7574]/20 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#F2B632] uppercase">
                      THU, 12 NOV 2026 · 07:15 WAT (BOARDING AT 06:45)
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                      Gate B4 · On Schedule
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#A5D1E1]">PNR: AV-7821-LOS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div className="bg-[#F4F6F5] dark:bg-[#07161B] p-4 rounded-2xl border border-black/5 dark:border-white/5">
                    <span className="text-[10px] font-mono uppercase text-[#12484C]/70 dark:text-[#A5D1E1]/70 block">
                      Cabin Suite
                    </span>
                    <span className="text-lg font-bold font-mono text-[#0E2931] dark:text-[#F2B632]">
                      Seat 4A (Lie-Flat Suite)
                    </span>
                    <p className="text-[10px] text-[#12484C]/80 dark:text-[#A5D1E1]/80 font-mono mt-0.5">
                      First Class Forward Cabin · Zone 1
                    </p>
                  </div>

                  <div className="bg-[#F4F6F5] dark:bg-[#07161B] p-4 rounded-2xl border border-black/5 dark:border-white/5">
                    <span className="text-[10px] font-mono uppercase text-[#12484C]/70 dark:text-[#A5D1E1]/70 block">
                      Baggage Allocation
                    </span>
                    <span className="text-lg font-bold font-mono text-[#0E2931] dark:text-white">
                      2 × 32kg Checked
                    </span>
                    <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                      Tag #LOS-948291 · Loaded in Cargo A3
                    </p>
                  </div>

                  <div className="bg-[#F4F6F5] dark:bg-[#07161B] p-4 rounded-2xl border border-black/5 dark:border-white/5">
                    <span className="text-[10px] font-mono uppercase text-[#12484C]/70 dark:text-[#A5D1E1]/70 block">
                      VIP Lounge Entry
                    </span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      Presidential Oasis Lounge
                    </span>
                    <p className="text-[10px] text-[#12484C]/80 dark:text-[#A5D1E1]/80 font-mono mt-0.5">
                      Terminal 2 Airside · Chef Dining Included
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E2E0] dark:border-[#1E3E47] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#12484C] dark:text-[#A5D1E1]">
                    <span className="flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-[#F2B632]" />
                      <span>Starlink In-Flight WiFi Active</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-[#F2B632]" />
                      <span>Dom Pérignon & Gourmet Dining</span>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (bookingHistory[0]) setSelectedTicket(bookingHistory[0]);
                    }}
                    className="btn-gold px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Open Biometric Gate Pass</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline Node 2: Tarmac Chauffeur & Sanctuary Check-in */}
            <div className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-[#12484C] text-[#F2B632] flex items-center justify-center border-2 border-white dark:border-[#07161B] shadow-md">
                <Building2 className="w-3 h-3" />
              </div>

              <div className="bg-white dark:bg-[#0E2931]/80 rounded-3xl p-6 sm:p-7 border border-[#2B7574]/20 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#2B7574] dark:text-[#F2B632] uppercase">
                      THU, 12 NOV 2026 · 14:00 WAT CHECK-IN
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                      Confirmed & Key Pre-Encoded
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#A5D1E1]">3 Nights · Diplomatic Suite</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#F4F6F5] dark:bg-[#07161B] p-4 rounded-2xl border border-black/5 dark:border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#12484C]/70 dark:text-[#A5D1E1]/70 block">
                      Assigned Sanctuary
                    </span>
                    <h3 className="font-display text-lg font-bold uppercase text-[#0E2931] dark:text-white">
                      Transcorp Hilton Diplomatic Tower
                    </h3>
                    <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1]/80 font-mono">
                      Maitama Diplomatic Sector, Abuja · Private Helipad & Executive Floor
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>100% Dual CAT 1,250 kVA Generator Audit (&lt;3s ATS Failover)</span>
                    </div>
                  </div>

                  <div className="bg-[#F4F6F5] dark:bg-[#07161B] p-4 rounded-2xl border border-black/5 dark:border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#12484C]/70 dark:text-[#A5D1E1]/70 block">
                      Tarmac Chauffeur Escort
                    </span>
                    <h3 className="font-display text-lg font-bold uppercase text-[#0E2931] dark:text-[#F2B632]">
                      Mercedes-Maybach S-Class 680
                    </h3>
                    <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1]/80 font-mono">
                      Chauffeur: Tunde Adeyemi · Direct Tarmac Stairs Pickup
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#A5D1E1]">
                      <span>Vehicle Tag: ABJ-01-EXP</span>
                      <button
                        onClick={() => triggerToast("Direct dispatch channel connected to Chauffeur Tunde Adeyemi (+234 803 291 0041).")}
                        className="text-[#F2B632] hover:underline cursor-pointer flex items-center gap-1 font-bold"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Chauffeur</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: ELECTRONIC TICKETS & BIOMETRIC BOARDING PASSES
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'passes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B7574]/30">
            <div>
              <h2 className="font-monument text-xl sm:text-2xl font-bold uppercase text-[#0E2931] dark:text-white">
                Issued Sovereign Boarding Passes
              </h2>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono mt-0.5">
                Biometric Apple Wallet passes and IATA compliant PNR barcodes for airside fast-track.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'upcoming', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTicketFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
                    ticketFilter === filter
                      ? 'bg-[#12484C] text-[#F2B632] border border-[#2B7574]'
                      : 'bg-white/5 text-[#A5D1E1] hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookingHistory.map((b) => (
              <div
                key={b.id}
                className="rounded-3xl bg-[#0B1E24] text-white border border-[#2B7574]/40 p-6 sm:p-7 shadow-xl hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-5 group"
              >
                {/* Perforated pass cutouts */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#09171C] border-r border-[#2B7574]/40" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#09171C] border-l border-[#2B7574]/40" />

                {/* Ticket Top Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#F2B632] bg-[#12484C] px-3 py-1 rounded-lg border border-[#2B7574]/60">
                      PNR: {b.bookingRef}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                      {b.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#A5D1E1]">
                    E-Ticket: #074-9281740124
                  </span>
                </div>

                {/* Main Route Info */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-3xl sm:text-4xl font-monument font-extrabold text-white">
                      {b.flight?.origin || 'LOS'}
                    </span>
                    <span className="block text-xs font-mono text-[#A5D1E1] mt-0.5">
                      {b.flight?.originCity || 'Lagos Murtala'}
                    </span>
                    <span className="text-sm font-mono font-bold text-[#F2B632]">
                      07:15 WAT
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-[#A5D1E1] uppercase">Flight AV-304</span>
                    <Plane className="w-5 h-5 text-[#F2B632] my-1 -rotate-45" />
                    <span className="text-[10px] font-mono text-emerald-400">Direct · 1h 15m</span>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-monument font-extrabold text-[#F2B632]">
                      {b.flight?.destination || 'ABV'}
                    </span>
                    <span className="block text-xs font-mono text-[#A5D1E1] mt-0.5">
                      {b.flight?.destinationCity || 'Abuja VIP Wing'}
                    </span>
                    <span className="text-sm font-mono font-bold text-white">
                      08:30 WAT
                    </span>
                  </div>
                </div>

                {/* Ticket Details Grid */}
                <div className="grid grid-cols-4 gap-2 pt-3 pb-2 border-y border-dashed border-[#2B7574]/40 text-center font-mono">
                  <div>
                    <span className="text-[9px] uppercase text-[#A5D1E1] block">Passenger</span>
                    <span className="text-xs font-bold text-white truncate block">
                      {b.passengers[0]?.lastName || 'Adeleke'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-[#A5D1E1] block">Seat</span>
                    <span className="text-xs font-bold text-[#F2B632] block">
                      {b.seat || '4A (Suite)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-[#A5D1E1] block">Gate</span>
                    <span className="text-xs font-bold text-emerald-400 block">
                      {b.gate || 'Gate B4'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-[#A5D1E1] block">Cabin</span>
                    <span className="text-xs font-bold text-white block">
                      First Class
                    </span>
                  </div>
                </div>

                {/* Bottom Actions & Wallet Trigger */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerToast("Added Sovereign Boarding Pass to Apple Wallet.")}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#A5D1E1] hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Apple Wallet
                    </button>
                    <button
                      onClick={() => triggerToast("PDF E-Ticket downloaded to device.")}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#A5D1E1] hover:text-white transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedTicket(b)}
                    className="btn-gold px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View Gate Barcode</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Seeded Completed Historical Coupon for Depth */}
            <div className="rounded-3xl bg-[#09181D]/60 text-white/70 border border-[#2B7574]/20 p-6 sm:p-7 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#A5D1E1] bg-white/5 px-3 py-1 rounded-lg">
                  PNR: AV-4109-DXB
                </span>
                <span className="text-[10px] font-mono uppercase bg-white/5 text-[#A5D1E1] px-2 py-0.5 rounded">
                  Completed & Flown
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 opacity-80">
                <div>
                  <span className="text-2xl font-monument font-bold text-white">LOS</span>
                  <span className="block text-xs font-mono text-[#A5D1E1]">Lagos MM2</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-mono text-[#A5D1E1]">Boeing 777-300ER</span>
                  <ArrowRight className="w-4 h-4 text-[#A5D1E1]" />
                </div>
                <div className="text-right">
                  <span className="text-2xl font-monument font-bold text-white">DXB</span>
                  <span className="block text-xs font-mono text-[#A5D1E1]">Dubai Int'l T3</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#A5D1E1]">
                <span>Traveled: 18 Oct 2026 · First Class Private Suite</span>
                <span className="text-emerald-400">+14,500 Miles Credited</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: FLY NOW PAY LATER AMORTIZATION DESK
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'loans' && (
        <div className="space-y-8">
          {/* Credit Facility HUD Card */}
          <div className="bg-[#07161B]/95 text-white border border-[#2B7574]/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#2B7574]/30">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#F2B632] uppercase tracking-widest">
                    SOVEREIGN CREDIT FACILITY // CBN FX DIRECT SETTLEMENT
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/40">
                    PRIME TIER 1
                  </span>
                </div>
                <h2 className="font-monument text-2xl sm:text-3xl font-extrabold uppercase text-[#F4F6F5]">
                  Fly Now Pay Later Amortization Desk
                </h2>
                <p className="text-xs sm:text-sm text-[#A5D1E1] font-mono mt-1">
                  Subsidized 0% interest air travel facility backed by institutional escrow. Zero hidden fees.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-[#091F26] p-4 rounded-2xl border border-[#2B7574]/40">
                <div>
                  <span className="text-[10px] font-mono text-[#A5D1E1] uppercase block">Credit Health</span>
                  <span className="text-xl font-mono font-bold text-emerald-400">810 / 850</span>
                  <span className="text-[9px] font-mono text-[#A5D1E1]/70 block">Prime AAA Bureau</span>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div>
                  <span className="text-[10px] font-mono text-[#A5D1E1] uppercase block">Debt-to-Income</span>
                  <span className="text-xl font-mono font-bold text-white">14.8%</span>
                  <span className="text-[9px] font-mono text-emerald-400 block">Optimal</span>
                </div>
              </div>
            </div>

            {/* Credit Limit Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-[#091F26]/60 p-4 rounded-2xl border border-[#2B7574]/30">
                <span className="text-[10px] font-mono text-[#A5D1E1] uppercase block">Approved Limit</span>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">₦3,000,000</span>
                <span className="text-[10px] font-mono text-emerald-400 block mt-1">100% Pre-Approved</span>
              </div>

              <div className="bg-[#091F26]/60 p-4 rounded-2xl border border-[#2B7574]/30">
                <span className="text-[10px] font-mono text-[#A5D1E1] uppercase block">Utilized Exposure</span>
                <span className="text-2xl font-bold font-mono text-[#F2B632] tabular-nums">
                  {formatPrice(
                    activeLoanBookings.reduce((acc, curr) => acc + (curr.loanDetails?.remainingBalanceNgn || 0), 0),
                    currency
                  )}
                </span>
                <span className="text-[10px] font-mono text-[#A5D1E1]/70 block mt-1">Active Loan Contracts</span>
              </div>

              <div className="bg-[#091F26]/60 p-4 rounded-2xl border border-[#2B7574]/30">
                <span className="text-[10px] font-mono text-[#A5D1E1] uppercase block">Available Credit</span>
                <span className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">
                  {formatPrice(
                    3_000_000 - activeLoanBookings.reduce((acc, curr) => acc + (curr.loanDetails?.remainingBalanceNgn || 0), 0),
                    currency
                  )}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 block mt-1">Ready for Instant Booking</span>
              </div>
            </div>
          </div>

          {/* Active Amortization Schedule */}
          {activeLoanBookings.length > 0 ? (
            <div className="space-y-6">
              {activeLoanBookings.map((b) => {
                const details = b.loanDetails!;
                return (
                  <div
                    key={b.id}
                    className="bg-white dark:bg-[#0E2931]/90 rounded-3xl p-6 sm:p-8 border border-[#2B7574]/30 shadow-lg space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E2E0] dark:border-[#1E3E47]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#F2B632] uppercase">
                            FACILITY CONTRACT #{b.bookingRef}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 font-bold uppercase">
                            Active & Nominal
                          </span>
                        </div>
                        <h3 className="font-monument text-lg sm:text-xl font-bold uppercase text-[#0E2931] dark:text-white mt-1">
                          Flight Sector: {b.flight?.origin || 'LOS'} → {b.flight?.destination || 'ABV'}
                        </h3>
                      </div>

                      <div className="sm:text-right">
                        <span className="block text-[10px] font-mono uppercase text-[#12484C] dark:text-[#A5D1E1]">
                          Remaining Balance
                        </span>
                        <span className="text-2xl sm:text-3xl font-bold font-mono text-[#F2B632] tabular-nums">
                          {formatPrice(details.remainingBalanceNgn, currency)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5 text-[#12484C] dark:text-[#A5D1E1]">
                        <span>Amortization Repayment Progress</span>
                        <span>
                          {details.installmentsRemaining} Installments Remaining of {details.tenureMonths} Months
                        </span>
                      </div>
                      <div className="h-3 w-full bg-[#E2E2E0] dark:bg-[#07161B] rounded-full overflow-hidden p-0.5 border border-[#2B7574]/30">
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

                    {/* Breakdown Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-2">
                      <div className="p-4 rounded-2xl bg-[#F4F6F5] dark:bg-[#07161B] border border-black/5 dark:border-white/5">
                        <span className="text-[10px] font-mono uppercase text-[#12484C]/70 dark:text-[#A5D1E1]/70 block">
                          Monthly Installment
                        </span>
                        <span className="text-lg font-bold font-mono text-[#0E2931] dark:text-white tabular-nums">
                          {formatPrice(details.monthlyPaymentNgn, currency)}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 block">0% Interest APR</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F4F6F5] dark:bg-[#07161B] border border-black/5 dark:border-white/5">
                        <span className="text-[10px] font-mono uppercase text-[#12484C]/70 dark:text-[#A5D1E1]/70 block">
                          Down Payment Paid
                        </span>
                        <span className="text-lg font-bold font-mono text-emerald-500 tabular-nums">
                          {formatPrice(details.downPaymentPaidNgn, currency)}
                        </span>
                        <span className="text-[10px] font-mono text-[#A5D1E1] block">25% Sovereign Seed</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F4F6F5] dark:bg-[#07161B] border border-black/5 dark:border-white/5">
                        <span className="text-[10px] font-mono uppercase text-[#12484C]/70 dark:text-[#A5D1E1]/70 block">
                          Next Debit Date
                        </span>
                        <span className="text-lg font-bold font-mono text-[#F2B632]">
                          12 Dec 2026
                        </span>
                        <span className="text-[10px] font-mono text-[#A5D1E1] block">NIBSS Auto-Debit</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F4F6F5] dark:bg-[#07161B] border border-black/5 dark:border-white/5">
                        <span className="text-[10px] font-mono uppercase text-[#12484C]/70 dark:text-[#A5D1E1]/70 block">
                          Bank Mandate
                        </span>
                        <span className="text-sm font-bold font-mono text-white">
                          Zenith Bank (••• 5901)
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 block">Active e-Mandate</span>
                      </div>
                    </div>

                    {/* Interactive Action Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handlePayInstallment(b.id, details.monthlyPaymentNgn)}
                        className="w-full sm:w-auto btn-gold px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay Next Installment ({formatPrice(details.monthlyPaymentNgn, currency)})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLiquidateLoan(b.id, details.remainingBalanceNgn)}
                        className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-[#12484C] hover:bg-[#1a5f64] text-[#F2B632] border border-[#2B7574]/60 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Liquidate Entire Balance (0% Penalty)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center rounded-3xl bg-white dark:bg-[#0E2931]/60 border border-[#2B7574]/30 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-monument text-xl font-bold uppercase text-[#0E2931] dark:text-white">
                No Outstanding Travel Debts
              </h3>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] max-w-md mx-auto font-mono">
                Your account is in pristine standing. You have ₦3,000,000 ready to deploy on any international or domestic flight.
              </p>
            </div>
          )}

          {/* Interactive Travel Loan Pre-Qualification Calculator */}
          <div className="bg-[#0B1E24] text-white border border-[#2B7574]/40 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#F2B632]" />
              <h3 className="font-monument text-lg font-bold uppercase text-white">
                Pre-Qualify Next Sovereign Journey
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slider: Ticket Amount */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#A5D1E1]">Desired Travel Budget</span>
                  <span className="text-[#F2B632] font-bold">{formatPrice(simLoanAmount, currency)}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="3000000"
                  step="50000"
                  value={simLoanAmount}
                  onChange={(e) => setSimLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#F2B632] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#A5D1E1]/60">
                  <span>₦200,000</span>
                  <span>₦3,000,000</span>
                </div>
              </div>

              {/* Selector: Tenure */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#A5D1E1] block">Amortization Tenure</span>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 6, 12].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSimTenure(m)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                        simTenure === m
                          ? 'bg-[#12484C] text-[#F2B632] border border-[#2B7574]'
                          : 'bg-white/5 text-[#A5D1E1] hover:text-white'
                      }`}
                    >
                      {m} Mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector: Down Payment */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#A5D1E1] block">Down Payment Ratio</span>
                <div className="grid grid-cols-3 gap-2">
                  {[25, 33, 50].map((p) => (
                    <button
                      key={p}
                      onClick={() => setSimDownPercent(p)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                        simDownPercent === p
                          ? 'bg-[#12484C] text-[#F2B632] border border-[#2B7574]'
                          : 'bg-white/5 text-[#A5D1E1] hover:text-white'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Calculation Output */}
            <div className="pt-4 border-t border-[#2B7574]/30 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <span className="text-[10px] font-mono text-[#A5D1E1] uppercase block">Due Today at Booking</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {formatPrice(simDownPayment, currency)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#A5D1E1] uppercase block">Monthly Installment ({simTenure} mo)</span>
                <span className="text-xl font-bold font-mono text-[#F2B632]">
                  {formatPrice(simMonthly, currency)} / mo
                </span>
              </div>

              <div className="sm:text-right">
                <button
                  onClick={() => {
                    setActiveRoute('/fly-now-pay-later');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Apply 0% Facility →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 4: SOVEREIGN LOYALTY, MILES VAULT & PRIVILEGES
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'loyalty' && (
        <div className="space-y-8">
          {/* Titanium Presidential Membership Card Visual */}
          <div className="rounded-3xl bg-gradient-to-br from-[#09171C] via-[#0E2931] to-[#12484C] text-white p-6 sm:p-10 shadow-2xl border border-[#2B7574]/40 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#F2B632]/10 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#F2B632] uppercase mb-2">
                  <Award className="w-4 h-4" />
                  <span>AEROVISTA DIPLOMATIC & SOVEREIGN VAULT</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-monument font-black uppercase tracking-tight text-white">
                  Onyx Presidential Diplomatic
                </h2>
                <p className="text-xs sm:text-sm text-[#A5D1E1] max-w-2xl mt-1 font-mono">
                  Aerovista Privileges Club #AV-99182746 · Lifetime Accreditation · Diplomatic Fast-Track
                </p>
              </div>

              <div className="bg-[#07161B]/80 backdrop-blur-md p-4 rounded-2xl border border-[#2B7574]/50 text-right min-w-[200px]">
                <span className="text-[10px] font-mono uppercase text-[#A5D1E1] block">Tier Status</span>
                <span className="text-lg font-bold font-mono text-emerald-400">Lifetime Active</span>
                <span className="text-[10px] font-mono text-[#F2B632] block mt-0.5">Exp: 12/2028</span>
              </div>
            </div>

            {/* Progression Bar */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A5D1E1]">Progress to Ambassador Lifetime Tier</span>
                <span className="text-[#F2B632] font-bold">148,250 / 200,000 Tier Points (74%)</span>
              </div>
              <div className="h-3 w-full bg-[#07161B] rounded-full overflow-hidden p-0.5 border border-[#2B7574]/30">
                <div className="h-full bg-gradient-to-r from-[#2B7574] via-[#F2B632] to-[#FFE8A3] rounded-full w-[74%] transition-all duration-500" />
              </div>
              <p className="text-[10px] text-[#A5D1E1]/70 font-mono">
                51,750 points remaining to unlock private jet charter allowances and dedicated airside liaison.
              </p>
            </div>
          </div>

          {/* 6 Sovereign Tier Privileges Grid */}
          <div className="space-y-4">
            <h3 className="font-monument text-lg font-bold uppercase text-[#0E2931] dark:text-white">
              Executive Privileges & Diplomatic Clearances
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#0E2931]/80 p-5 rounded-2xl border border-[#2B7574]/20 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#12484C] text-[#F2B632] flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </div>
                <h4 className="font-monument text-sm font-bold uppercase text-[#0E2931] dark:text-white">
                  Unlimited Lounge Access
                </h4>
                <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                  Guaranteed entry across 850+ SkyTeam and Aerovista partner lounges globally with +2 complimentary delegates.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0E2931]/80 p-5 rounded-2xl border border-[#2B7574]/20 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#12484C] text-[#F2B632] flex items-center justify-center">
                  <Plane className="w-4 h-4 -rotate-45" />
                </div>
                <h4 className="font-monument text-sm font-bold uppercase text-[#0E2931] dark:text-white">
                  Airside Maybach Escort
                </h4>
                <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                  Direct chauffeur transport across the tarmac from presidential terminal to aircraft steps at MM2 and DNAA.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0E2931]/80 p-5 rounded-2xl border border-[#2B7574]/20 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#12484C] text-[#F2B632] flex items-center justify-center">
                  <Luggage className="w-4 h-4" />
                </div>
                <h4 className="font-monument text-sm font-bold uppercase text-[#0E2931] dark:text-white">
                  3 × 32kg Baggage Allowance
                </h4>
                <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                  Complimentary triple baggage priority tag with dedicated airside cargo tracking on all continental corridors.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0E2931]/80 p-5 rounded-2xl border border-[#2B7574]/20 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#12484C] text-[#F2B632] flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-monument text-sm font-bold uppercase text-[#0E2931] dark:text-white">
                  Cabin Upgrade Guarantee
                </h4>
                <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                  Automatic complimentary upgrade to First Class Lie-Flat Suite 24 hours prior to scheduled departure.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0E2931]/80 p-5 rounded-2xl border border-[#2B7574]/20 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#12484C] text-[#F2B632] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-monument text-sm font-bold uppercase text-[#0E2931] dark:text-white">
                  24/7 Satellite Concierge
                </h4>
                <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                  Direct voice access to sovereign flight dispatchers for instant re-routing and slot modifications.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0E2931]/80 p-5 rounded-2xl border border-[#2B7574]/20 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#12484C] text-[#F2B632] flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h4 className="font-monument text-sm font-bold uppercase text-[#0E2931] dark:text-white">
                  100% Fee Waiver
                </h4>
                <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                  Zero change fees, zero cancellation penalties, and full instant escrow refunds within 60 minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Miles Activity Ledger */}
          <div className="bg-[#0B1E24] rounded-3xl p-6 sm:p-8 border border-[#2B7574]/40 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-monument text-lg font-bold uppercase text-white">
                Recent Miles Ledger & Activity
              </h3>
              <span className="text-xs font-mono text-[#F2B632]">Available: 148,250 PTS</span>
            </div>

            <div className="divide-y divide-white/10 font-mono text-xs">
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Flight AV-304: Lagos (LOS) → Abuja (ABV)</span>
                  <span className="text-[10px] text-[#A5D1E1]">12 Nov 2026 · First Class Suite Fare Accrual</span>
                </div>
                <span className="text-emerald-400 font-bold">+4,500 PTS</span>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Transcorp Hilton Abuja: 3-Night Diplomatic Stay</span>
                  <span className="text-[10px] text-[#A5D1E1]">04 Nov 2026 · Preferred Partner Accommodation</span>
                </div>
                <span className="text-emerald-400 font-bold">+8,200 PTS</span>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Suite Upgrade Redemption: AV-810 LOS → DXB</span>
                  <span className="text-[10px] text-[#A5D1E1]">24 Oct 2026 · Redeemed for Royal Suite</span>
                </div>
                <span className="text-[#F2B632] font-bold">-15,000 PTS</span>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">British Airways Concorde Club Transfer</span>
                  <span className="text-[10px] text-[#A5D1E1]">10 Oct 2026 · SkyTeam Global Partner Reciprocity</span>
                </div>
                <span className="text-emerald-400 font-bold">+22,000 PTS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 5: SAVED SANCTUARIES & PRESIDENTIAL ESTATES
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'sanctuaries' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B7574]/30">
            <div>
              <h2 className="font-monument text-xl sm:text-2xl font-bold uppercase text-[#0E2931] dark:text-white">
                Saved Luxury Sanctuaries & Residencies
              </h2>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono mt-0.5">
                Vetted presidential properties with 100% dual-generator power resilience and private airside transfers.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveRoute('/hotels');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-gold px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Browse All Hotels →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedHotels.map((h) => {
              const imgAsset = HOTEL_IMAGES[h.id] || HOTEL_IMAGES['hotel-eko-grand'];
              return (
              <div
                key={h.id}
                className="rounded-3xl bg-white dark:bg-[#0E2931]/80 border border-[#2B7574]/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image & Sector Pill */}
                <div className="relative h-48 w-full overflow-hidden bg-[#07161B]">
                  <img
                    src={imgAsset?.src || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                    alt={h.name}
                    onError={(e) => {
                      if (imgAsset?.fallback) {
                        (e.target as HTMLImageElement).src = imgAsset.fallback;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#07161B]/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#F2B632] border border-[#2B7574]/50">
                    {h.city} Sector
                  </div>
                  <button
                    onClick={() => {
                      toggleSaveHotel(h.id);
                      triggerToast(`Updated saved preferences for ${h.name}`);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-[#07161B]/80 text-[#F2B632] hover:bg-[#07161B] transition-colors cursor-pointer"
                    title="Toggle Save"
                  >
                    <Heart className="w-4 h-4 fill-[#F2B632]" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
                      <span className="flex items-center gap-1 font-bold">
                        ★ {h.starRating} ({h.reviewCount} Reviews)
                      </span>
                      <span>Power Audit Verified</span>
                    </div>

                    <h3 className="font-monument text-lg font-bold uppercase text-[#0E2931] dark:text-white group-hover:text-[#F2B632] transition-colors">
                      {h.name}
                    </h3>
                    <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono mt-1">
                      {h.district}, {h.city}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {h.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#12484C]/10 dark:bg-white/5 text-[#12484C] dark:text-[#A5D1E1]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E2E2E0] dark:border-[#1E3E47] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#12484C]/70 dark:text-[#A5D1E1]/70 block">
                        Nightly Sovereign Rate
                      </span>
                      <span className="font-mono text-lg font-bold text-[#0E2931] dark:text-[#F2B632] tabular-nums">
                        {formatPrice(h.pricePerNightNgn, currency)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveRoute('/hotels');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="btn-gold px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Book Stay →
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          RESTYLED LUXURY IOS FLOATING DOCK NAVIGATION WITH TOOLTIPS
         ═══════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Sovereign Traveler Dock"
        className="fixed z-50 bottom-6 left-1/2 -translate-x-1/2 bg-[#07161B]/90 backdrop-blur-2xl border border-[#2B7574]/50 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] rounded-full p-2 flex items-center gap-1.5 sm:gap-2 max-w-[96vw] select-none"
      >
        {/* Tab 1: Trips Timeline */}
        <button
          type="button"
          aria-pressed={activeTab === 'timeline'}
          onClick={() => setActiveTab('timeline')}
          className={`group/dock relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-[#12484C] text-[#F2B632] border border-[#F2B632]/50 shadow-[0_4px_16px_rgba(242,182,50,0.25)] -translate-y-1'
              : 'text-[#A5D1E1]/80 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
          }`}
        >
          {/* Descriptive Tooltip */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-[#07161B]/95 text-[#F2B632] border border-[#2B7574]/60 text-[10px] font-mono whitespace-nowrap shadow-2xl opacity-0 group-hover/dock:opacity-100 group-hover/dock:-translate-y-1 transition-all duration-200 pointer-events-none z-50 flex items-center gap-1.5 backdrop-blur-xl">
            <span className="font-bold">Airside Gate Radar</span>
            <span className="text-[8px] text-[#A5D1E1]">· Flight AV-304</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#07161B] rotate-45 border-b border-r border-[#2B7574]/60" />
          </div>

          <Plane className="w-4 h-4 -rotate-45" />
          <span className="hidden xs:inline">Timeline</span>
          {activeTab === 'timeline' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2B632] shadow-[0_0_8px_#F2B632]" />
          )}
        </button>

        {/* Tab 2: Boarding Passes */}
        <button
          type="button"
          aria-pressed={activeTab === 'passes'}
          onClick={() => setActiveTab('passes')}
          className={`group/dock relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'passes'
              ? 'bg-[#12484C] text-[#F2B632] border border-[#F2B632]/50 shadow-[0_4px_16px_rgba(242,182,50,0.25)] -translate-y-1'
              : 'text-[#A5D1E1]/80 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
          }`}
        >
          {/* Descriptive Tooltip */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-[#07161B]/95 text-[#F2B632] border border-[#2B7574]/60 text-[10px] font-mono whitespace-nowrap shadow-2xl opacity-0 group-hover/dock:opacity-100 group-hover/dock:-translate-y-1 transition-all duration-200 pointer-events-none z-50 flex items-center gap-1.5 backdrop-blur-xl">
            <span className="font-bold">Biometric Boarding Passes</span>
            <span className="text-[8px] text-emerald-400">· Apple Wallet Ready</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#07161B] rotate-45 border-b border-r border-[#2B7574]/60" />
          </div>

          <QrCode className="w-4 h-4" />
          <span className="hidden xs:inline">Passes</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#F2B632]/20 text-[#F2B632] border border-[#F2B632]/40">
            {bookingHistory.length}
          </span>
          {activeTab === 'passes' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2B632] shadow-[0_0_8px_#F2B632]" />
          )}
        </button>

        {/* Tab 3: Fly Now Pay Later */}
        <button
          type="button"
          aria-pressed={activeTab === 'loans'}
          onClick={() => setActiveTab('loans')}
          className={`group/dock relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'loans'
              ? 'bg-[#12484C] text-[#F2B632] border border-[#F2B632]/50 shadow-[0_4px_16px_rgba(242,182,50,0.25)] -translate-y-1'
              : 'text-[#A5D1E1]/80 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
          }`}
        >
          {/* Descriptive Tooltip */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-[#07161B]/95 text-[#F2B632] border border-[#2B7574]/60 text-[10px] font-mono whitespace-nowrap shadow-2xl opacity-0 group-hover/dock:opacity-100 group-hover/dock:-translate-y-1 transition-all duration-200 pointer-events-none z-50 flex items-center gap-1.5 backdrop-blur-xl">
            <span className="font-bold">0% APR Amortization Desk</span>
            <span className="text-[8px] text-cyan-300">· ₦3,000,000 Facility</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#07161B] rotate-45 border-b border-r border-[#2B7574]/60" />
          </div>

          <CreditCard className="w-4 h-4" />
          <span className="hidden xs:inline">Pay Later</span>
          {activeLoanBookings.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
              {activeLoanBookings.length}
            </span>
          )}
          {activeTab === 'loans' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2B632] shadow-[0_0_8px_#F2B632]" />
          )}
        </button>

        {/* Tab 4: Loyalty & Membership */}
        <button
          type="button"
          aria-pressed={activeTab === 'loyalty'}
          onClick={() => setActiveTab('loyalty')}
          className={`group/dock relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'loyalty'
              ? 'bg-[#12484C] text-[#F2B632] border border-[#F2B632]/50 shadow-[0_4px_16px_rgba(242,182,50,0.25)] -translate-y-1'
              : 'text-[#A5D1E1]/80 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
          }`}
        >
          {/* Descriptive Tooltip */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-[#07161B]/95 text-[#F2B632] border border-[#2B7574]/60 text-[10px] font-mono whitespace-nowrap shadow-2xl opacity-0 group-hover/dock:opacity-100 group-hover/dock:-translate-y-1 transition-all duration-200 pointer-events-none z-50 flex items-center gap-1.5 backdrop-blur-xl">
            <span className="font-bold">Onyx Diplomatic Vault</span>
            <span className="text-[8px] text-[#F2B632]">· 148,250 Miles</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#07161B] rotate-45 border-b border-r border-[#2B7574]/60" />
          </div>

          <Award className="w-4 h-4" />
          <span className="hidden xs:inline">Onyx Vault</span>
          {activeTab === 'loyalty' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2B632] shadow-[0_0_8px_#F2B632]" />
          )}
        </button>

        {/* Tab 5: Saved Sanctuaries */}
        <button
          type="button"
          aria-pressed={activeTab === 'sanctuaries'}
          onClick={() => setActiveTab('sanctuaries')}
          className={`group/dock relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'sanctuaries'
              ? 'bg-[#12484C] text-[#F2B632] border border-[#F2B632]/50 shadow-[0_4px_16px_rgba(242,182,50,0.25)] -translate-y-1'
              : 'text-[#A5D1E1]/80 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
          }`}
        >
          {/* Descriptive Tooltip */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-[#07161B]/95 text-[#F2B632] border border-[#2B7574]/60 text-[10px] font-mono whitespace-nowrap shadow-2xl opacity-0 group-hover/dock:opacity-100 group-hover/dock:-translate-y-1 transition-all duration-200 pointer-events-none z-50 flex items-center gap-1.5 backdrop-blur-xl">
            <span className="font-bold">Power-Audited Stays</span>
            <span className="text-[8px] text-emerald-400">· {savedHotels.length} Properties</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#07161B] rotate-45 border-b border-r border-[#2B7574]/60" />
          </div>

          <Building2 className="w-4 h-4" />
          <span className="hidden xs:inline">Sanctuaries</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#2B7574]/40 text-[#A5D1E1]">
            {savedHotels.length}
          </span>
          {activeTab === 'sanctuaries' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2B632] shadow-[0_0_8px_#F2B632]" />
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block" />

        {/* Quick Booking Shortcut */}
        <button
          type="button"
          onClick={() => {
            setActiveRoute('/flights');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-mono text-[#F2B632] hover:bg-white/10 transition-colors cursor-pointer"
          title="Browse Flights"
        >
          <span>Flights</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </nav>

      {/* Biometric E-Ticket & Boarding Pass Modal */}
      {selectedTicket && (
        <BoardingPassModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {/* Embedded Traveler Concierge Assistant */}
      <DashboardAssistant role="traveler" />
    </div>
  );
};
