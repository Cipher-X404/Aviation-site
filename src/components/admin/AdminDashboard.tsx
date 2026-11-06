import React, { useState } from 'react';
import { DashboardAssistant } from '../common/DashboardAssistant';
import { useAppStore, FlightOpsRecord, UnderwritingApplication } from '../../store/useAppStore';
import { formatPrice } from '../../services/currency';
import { MOCK_HOTELS } from '../../data/mockData';
import {
  ShieldAlert,
  Plane,
  CreditCard,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Radio,
  Users,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  ChevronRight,
  TrendingUp,
  Sliders,
  DollarSign,
  Compass,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Landmark,
  Layers,
  Fuel,
  Navigation,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    currency,
    flightOps,
    updateFlightOps,
    underwritingQueue,
    approveUnderwriting,
    declineUnderwriting,
    bookingHistory,
    logout,
    setActiveRoute,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'flights' | 'loans' | 'passengers' | 'sanctuary' | 'settlement'>('flights');
  const [flightFilter, setFlightFilter] = useState<'all' | 'Airborne' | 'Boarding' | 'On Time' | 'Delayed'>('all');
  const [flightSearch, setFlightSearch] = useState('');
  const [passengerSearch, setPassengerSearch] = useState('');
  const [selectedFlightEdit, setSelectedFlightEdit] = useState<FlightOpsRecord | null>(null);
  const [newGate, setNewGate] = useState('');
  const [newStatus, setNewStatus] = useState<FlightOpsRecord['status']>('On Time');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const endAdminSession = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
    logout();
    setActiveRoute('/');
  };

  const handleUpdateFlight = (flightId: string) => {
    updateFlightOps(flightId, {
      gate: newGate || undefined,
      status: newStatus,
    });
    setSelectedFlightEdit(null);
    showNotification(`Flight ${flightId} dispatch telemetry updated to ${newStatus}`);
  };

  const filteredFlights = flightOps.filter((f) => {
    const matchesFilter = flightFilter === 'all' || f.status === flightFilter;
    const matchesSearch = !flightSearch || 
      f.flightNumber.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.route.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.aircraft.toLowerCase().includes(flightSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredPassengers = bookingHistory.filter((b) => {
    if (!passengerSearch) return true;
    const q = passengerSearch.toLowerCase();
    const name = (b.passengers[0]?.firstName || '') + ' ' + (b.passengers[0]?.lastName || '');
    return b.bookingRef.toLowerCase().includes(q) || name.toLowerCase().includes(q) || (b.flight?.flightNumber || '').toLowerCase().includes(q);
  });

  // Calculate live operations metrics
  const totalBookingsCount = bookingHistory.length;
  const totalRevenueNgn = bookingHistory.reduce((acc, curr) => acc + curr.totalPaidNgn, 0) + 428_500_000;
  const pendingLoansCount = underwritingQueue.filter((q) => q.status === 'Pending').length;
  const approvedLoansCount = underwritingQueue.filter((q) => q.status === 'Approved').length;

  return (
    <div className="min-h-screen pt-24 pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Top Notification Toast */}
      {actionNotice && (
        <div className="fixed top-20 right-6 z-50 bg-[#07161B]/95 text-[#F2B632] px-5 py-3 rounded-2xl shadow-2xl border border-[#2B7574]/60 flex items-center gap-3 font-mono text-xs animate-in slide-in-from-top-3 backdrop-blur-xl">
          <CheckCircle2 className="w-4 h-4 text-[#F2B632] shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          EXECUTIVE OPERATIONS HUD HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl bg-[#07161B]/95 text-white border border-[#2B7574]/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-2xl">
        {/* Ambient background glow & radar contour */}
        <div className="bg-topo absolute inset-0 opacity-15 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#12484C]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#2B7574]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#F2B632] uppercase">
                AIRSPACE COMMAND // MM2 LAGOS (LOS) · DNAA ABUJA (ABV) · GDS LIVE
              </span>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                NOMINAL
              </span>
            </div>

            <h1 className="font-monument text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-[#F4F6F5]">
              Executive Airspace & Risk Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-[#A5D1E1]/80 mt-1 max-w-2xl font-light">
              Autonomous air traffic telemetry, institutional GDS underwriting, and real-time passenger manifest coordination across sovereign sectors.
            </p>
          </div>

          {/* Admin Identity Card & Quick Session Exit */}
          <div className="flex items-center gap-3.5 bg-[#091F26]/80 backdrop-blur-xl p-3.5 px-4 rounded-2xl border border-[#2B7574]/40 self-start lg:self-auto shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F2B632] to-[#D99A1C] text-[#0E2931] flex items-center justify-center font-bold text-sm shadow-md font-mono">
              KB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wide text-white">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#12484C] text-[#F2B632] border border-[#2B7574]/50">
                  ATC ADMIN
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#A5D1E1]/70 mt-0.5">
                Station MM2 · ID: {currentUser.passportNumber}
              </p>
            </div>
            <button
              onClick={endAdminSession}
              className="ml-2 p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[#A5D1E1] hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
              title="Sign out of Admin Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Operations Telemetry KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-8 pt-6 border-t border-[#18363F]/80">
          <div className="bg-[#091F26]/60 p-4 rounded-2xl border border-[#2B7574]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[10px] font-mono uppercase mb-1">
              <span>Active Corridors</span>
              <Plane className="w-3.5 h-3.5 text-[#F2B632] -rotate-45" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#F2B632]">
              {flightOps.length} Sector Flights
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
              <span>98.4% On-Time Performance</span>
            </div>
          </div>

          <div className="bg-[#091F26]/60 p-4 rounded-2xl border border-[#2B7574]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[10px] font-mono uppercase mb-1">
              <span>GDS Gross Volume</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {formatPrice(totalRevenueNgn, currency)}
            </div>
            <div className="text-[10px] text-[#A5D1E1]/70 font-mono mt-0.5">0.00% Ticketing Markup Direct</div>
          </div>

          <div className="bg-[#091F26]/60 p-4 rounded-2xl border border-[#2B7574]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[10px] font-mono uppercase mb-1">
              <span>Risk Queue (FNPL)</span>
              <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {pendingLoansCount} Underwrite Pending
            </div>
            <div className="text-[10px] text-[#F2B632] font-mono mt-0.5">
              {approvedLoansCount} Approved This Cycle
            </div>
          </div>

          <div className="bg-[#091F26]/60 p-4 rounded-2xl border border-[#2B7574]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[10px] font-mono uppercase mb-1">
              <span>Passenger Manifest</span>
              <Users className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {totalBookingsCount} Active PNRs
            </div>
            <div className="text-[10px] text-white/50 font-mono mt-0.5">Biometric Boarding Cleared</div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: LIVE FLIGHT OPERATIONS & GATE DISPATCH
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'flights' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar: Filter Pills + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#07161B]/80 p-4 rounded-2xl border border-[#2B7574]/30">
            <div>
              <h2 className="font-monument text-lg font-bold uppercase text-[#0E2931] dark:text-white">
                Flight Operations & ATC Gate Vector
              </h2>
              <p className="text-xs text-[#2B7574] dark:text-[#A5D1E1] font-mono">
                Real-time transponder telemetry, gate reassignments, and sector load metrics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#F2B632] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={flightSearch}
                  onChange={(e) => setFlightSearch(e.target.value)}
                  placeholder="Filter flight / tail..."
                  className="bg-[#091F26] border border-[#2B7574]/40 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#A5D1E1]/40 font-mono focus:outline-none focus:border-[#F2B632]"
                />
              </div>

              {/* Status Filter Pills */}
              {(['all', 'Airborne', 'Boarding', 'On Time', 'Delayed'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setFlightFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    flightFilter === filter
                      ? 'bg-[#12484C] text-[#F2B632] border border-[#F2B632]/50 shadow-sm'
                      : 'bg-[#091F26] text-[#A5D1E1] border border-[#2B7574]/30 hover:border-[#F2B632]/40'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Flights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFlights.map((flight) => {
              const statusColors = {
                Airborne: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
                Boarding: 'bg-[#F2B632]/15 text-[#F2B632] border-[#F2B632]/30',
                'On Time': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                Delayed: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
                Landed: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
              }[flight.status];

              return (
                <div
                  key={flight.id}
                  className="rounded-3xl bg-[#07161B]/90 border border-[#2B7574]/40 hover:border-[#F2B632]/60 p-6 shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 group relative overflow-hidden"
                >
                  <div>
                    {/* Header: Flight No & Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#12484C] text-[#F2B632] flex items-center justify-center font-bold text-xs font-mono border border-[#2B7574]/40">
                          <Plane className="w-3.5 h-3.5 -rotate-45" />
                        </div>
                        <span className="font-mono text-sm font-bold text-[#F2B632] tracking-wider">
                          {flight.flightNumber}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${statusColors}`}>
                        {flight.status}
                      </span>
                    </div>

                    {/* Route Headline */}
                    <div className="font-monument text-lg font-bold uppercase text-white tracking-wide">
                      {flight.route}
                    </div>
                    <div className="text-xs text-[#A5D1E1]/80 font-mono mt-0.5">
                      {flight.aircraft} · Capt. {flight.captain}
                    </div>

                    {/* Operational Telemetry Matrix */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#18363F] text-xs font-mono">
                      <div>
                        <span className="text-[#A5D1E1]/60 block text-[9px] uppercase tracking-wider">
                          Departure / ETA
                        </span>
                        <span className="font-bold text-white">{flight.departureTime} → {flight.arrivalTime}</span>
                      </div>
                      <div>
                        <span className="text-[#A5D1E1]/60 block text-[9px] uppercase tracking-wider">
                          Gate & Runway
                        </span>
                        <span className="font-bold text-[#F2B632]">{flight.gate} · RWY 18R</span>
                      </div>
                    </div>

                    {/* Load factor bar */}
                    <div className="mt-4 bg-[#091F26] p-2.5 rounded-xl border border-[#2B7574]/20">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 text-[#A5D1E1]">
                        <span>Capacity Factor</span>
                        <span className="font-bold tabular-nums text-white">
                          {flight.passengersBooked}/{flight.capacity} ({flight.loadFactorPercent}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#051114] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#2B7574] via-[#199FB1] to-[#F2B632] rounded-full transition-all duration-500"
                          style={{ width: `${flight.loadFactorPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Edit CTA */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFlightEdit(flight);
                      setNewGate(flight.gate);
                      setNewStatus(flight.status);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#12484C]/50 hover:bg-[#12484C] text-xs font-mono uppercase font-bold text-[#F2B632] hover:text-white border border-[#2B7574]/40 hover:border-[#F2B632]/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Reassign Gate & Telemetry</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Edit Flight Modal */}
          {selectedFlightEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07161B]/85 backdrop-blur-md animate-fade-in select-none">
              <div className="bg-[#091F26] border border-[#2B7574]/60 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-white relative">
                <div className="flex items-center justify-between border-b border-[#18363F] pb-4">
                  <div>
                    <h3 className="font-monument text-base font-bold uppercase text-[#F2B632]">
                      Dispatch Override // {selectedFlightEdit.flightNumber}
                    </h3>
                    <p className="text-xs font-mono text-[#A5D1E1]/80">
                      Sector {selectedFlightEdit.route} · Tail {selectedFlightEdit.aircraft}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFlightEdit(null)}
                    className="text-[#A5D1E1] hover:text-white cursor-pointer"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] text-[#A5D1E1] uppercase mb-1">
                      Assigned Terminal Gate
                    </label>
                    <select
                      value={newGate}
                      onChange={(e) => setNewGate(e.target.value)}
                      className="w-full bg-[#051114] border border-[#2B7574]/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F2B632]"
                    >
                      <option value="Gate 01">Gate 01 (Executive Airside)</option>
                      <option value="Gate 02">Gate 02 (Maybach Tarmac Bay)</option>
                      <option value="Gate 03">Gate 03 (International Widebody)</option>
                      <option value="Gate 04">Gate 04 (Royal Diplomatic Bay)</option>
                      <option value="Gate 05">Gate 05 (Continental Shunt)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#A5D1E1] uppercase mb-1">
                      Flight Sector Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as FlightOpsRecord['status'])}
                      className="w-full bg-[#051114] border border-[#2B7574]/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F2B632]"
                    >
                      <option value="On Time">On Time (Nominal Flight Plan)</option>
                      <option value="Boarding">Boarding (Gate Open)</option>
                      <option value="Airborne">Airborne (Cruising Flight Level)</option>
                      <option value="Delayed">Delayed (Airspace Congestion)</option>
                      <option value="Landed">Landed (Touchdown Completed)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-[#18363F]">
                  <button
                    type="button"
                    onClick={() => setSelectedFlightEdit(null)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono uppercase text-[#A5D1E1] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateFlight(selectedFlightEdit.id)}
                    className="flex-1 btn-gold py-2.5 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    Commit Dispatch
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: SOVEREIGN UNDERWRITING & LOAN QUEUE
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'loans' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#07161B]/80 p-4 rounded-2xl border border-[#2B7574]/30">
            <div>
              <h2 className="font-monument text-lg font-bold uppercase text-[#0E2931] dark:text-white">
                Fly Now Pay Later Institutional Underwriting Desk
              </h2>
              <p className="text-xs text-[#2B7574] dark:text-[#A5D1E1] font-mono">
                BVN risk evaluation, debt-to-income algorithms, and credit decisions up to ₦3,000,000.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#A5D1E1]">
              <span>Pending Reviews: <strong className="text-[#F2B632]">{pendingLoansCount}</strong></span>
              <span>·</span>
              <span>Default Risk Index: <strong className="text-emerald-400">0.08%</strong></span>
            </div>
          </div>

          {/* Underwriting Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {underwritingQueue.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl bg-[#07161B]/90 border border-[#2B7574]/40 hover:border-[#F2B632]/50 p-6 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#F2B632]">
                      APP REF: {app.id.toUpperCase()}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        app.status === 'Approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : app.status === 'Declined'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-[#F2B632]/15 text-[#F2B632] border-[#F2B632]/30'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <h3 className="font-monument text-base font-bold uppercase text-white">
                    {app.applicantName}
                  </h3>
                  <div className="text-xs text-[#A5D1E1]/80 font-mono mt-0.5 flex items-center gap-2">
                    <span>BVN: {app.bvnMasked}</span>
                    <span>·</span>
                    <span className="text-[#F2B632]">{app.flightRoute}</span>
                  </div>

                  {/* Financial Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 p-3 rounded-2xl bg-[#091F26] border border-[#2B7574]/20 text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-[#A5D1E1]/60 block uppercase">
                        Requested Facility
                      </span>
                      <span className="font-bold text-[#F2B632] tabular-nums">
                        {formatPrice(app.requestedNgn, currency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#A5D1E1]/60 block uppercase">
                        Monthly Income
                      </span>
                      <span className="font-bold text-white tabular-nums">
                        {formatPrice(app.monthlyIncomeNgn, currency)}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#A5D1E1]/60 block uppercase">
                        Credit Score
                      </span>
                      <span className="font-bold text-emerald-400 tabular-nums">{app.creditScore}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#A5D1E1]/60 block uppercase">
                        DTI Ratio
                      </span>
                      <span className="font-bold text-white tabular-nums">
                        {app.dtiRatioPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#A5D1E1]">
                    <span>Risk Tier: <strong className="text-emerald-400">{app.riskTier}</strong></span>
                    <span>{app.tenureMonths}-Month Tenure · 0% Penalty</span>
                  </div>
                </div>

                {/* Underwriting Actions */}
                {app.status === 'Pending' ? (
                  <div className="flex gap-2.5 pt-3 border-t border-[#18363F]">
                    <button
                      type="button"
                      onClick={() => {
                        approveUnderwriting(app.id);
                        showNotification(`Application ${app.id} approved at 0% initial down.`);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve 0% APR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        declineUnderwriting(app.id);
                        showNotification(`Application ${app.id} marked declined.`);
                      }}
                      className="py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-600 hover:text-white text-rose-400 font-mono text-xs font-bold uppercase border border-rose-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-2.5 border-t border-[#18363F] text-xs font-mono text-center text-[#A5D1E1]/60">
                    Decision recorded & transmitted via encrypted IATA clearance
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: PASSENGER MANIFEST & VIP PNR DIRECTORY
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'passengers' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#07161B]/80 p-4 rounded-2xl border border-[#2B7574]/30">
            <div>
              <h2 className="font-monument text-lg font-bold uppercase text-[#0E2931] dark:text-white">
                Sovereign Passenger Manifest & PNR Registry
              </h2>
              <p className="text-xs text-[#2B7574] dark:text-[#A5D1E1] font-mono">
                Active travelers, boarding pass barcodes, and VIP escort requirements.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#F2B632] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={passengerSearch}
                onChange={(e) => setPassengerSearch(e.target.value)}
                placeholder="Search passenger / PNR..."
                className="bg-[#091F26] border border-[#2B7574]/40 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#A5D1E1]/40 font-mono focus:outline-none focus:border-[#F2B632]"
              />
            </div>
          </div>

          {/* Passenger Manifest Table */}
          <div className="rounded-3xl bg-[#07161B]/90 border border-[#2B7574]/40 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-[#091F26] text-[#A5D1E1]/70 border-b border-[#18363F] text-[10px] uppercase tracking-wider">
                    <th className="p-4">PNR Record</th>
                    <th className="p-4">Passenger Name</th>
                    <th className="p-4">Flight Sector</th>
                    <th className="p-4">Cabin Class</th>
                    <th className="p-4">Seat</th>
                    <th className="p-4">Payment / Status</th>
                    <th className="p-4 text-right">Fare Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18363F]/50 text-white">
                  {filteredPassengers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[#A5D1E1]/60">
                        No passenger manifest records matched &ldquo;{passengerSearch}&rdquo;
                      </td>
                    </tr>
                  ) : (
                    filteredPassengers.map((b) => {
                      const passenger = b.passengers[0];
                      return (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-[#F2B632] tracking-wider">
                              {b.bookingRef}
                            </span>
                          </td>
                          <td className="p-4 font-bold">
                            {passenger ? `${passenger.firstName} ${passenger.lastName}` : 'Kelechi Bamidele'}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-[#12484C]/60 text-cyan-300 border border-[#2B7574]/40">
                              {b.flight ? `${b.flight.origin} → ${b.flight.destination}` : 'LOS → LHR'}
                            </span>
                          </td>
                          <td className="p-4 text-[#A5D1E1]">
                            {b.flight?.cabinClass || 'Royal First'}
                          </td>
                          <td className="p-4 font-bold text-[#F2B632]">
                            {b.seat || '1A'}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              {b.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold tabular-nums text-[#F2B632]">
                            {formatPrice(b.totalPaidNgn, currency)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 4: SANCTUARY & HOTEL SUITE ALLOCATION
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'sanctuary' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#07161B]/80 p-4 rounded-2xl border border-[#2B7574]/30">
            <div>
              <h2 className="font-monument text-lg font-bold uppercase text-[#0E2931] dark:text-white">
                Presidential Sanctuaries & Power Audit Allocation
              </h2>
              <p className="text-xs text-[#2B7574] dark:text-[#A5D1E1] font-mono">
                100% verified heavy dual-generator estates with airside runway chauffeur sync.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#F2B632]">
              <Zap className="w-4 h-4 text-[#F2B632]" />
              <span>100% CAT Generator Autonomy Verified</span>
            </div>
          </div>

          {/* Sanctuaries Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_HOTELS.map((hotel) => (
              <div
                key={hotel.id}
                className="rounded-3xl bg-[#07161B]/90 border border-[#2B7574]/40 hover:border-[#F2B632]/50 p-6 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      24/7 POWER GUARANTEED
                    </span>
                    <span className="text-xs font-mono text-[#F2B632] font-bold">
                      {hotel.starRating}★ SANCTUARY
                    </span>
                  </div>

                  <h3 className="font-monument text-base font-bold uppercase text-white">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-[#A5D1E1]/80 font-mono mt-0.5">
                    {hotel.district}, {hotel.city} · Terminal Escort Bay
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-[#091F26] border border-[#2B7574]/20 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-[#A5D1E1]">
                      <span>Heavy Generator:</span>
                      <strong className="text-white">Dual 500kVA CAT</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#A5D1E1]">
                      <span>ATS Failover:</span>
                      <strong className="text-emerald-400">&lt;3 Seconds</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#A5D1E1]">
                      <span>Airside Chauffeur:</span>
                      <strong className="text-[#F2B632]">Maybach S-Class</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#18363F] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A5D1E1]/70">Rate per night</span>
                  <span className="font-bold text-[#F2B632] text-sm tabular-nums">
                    {formatPrice(hotel.pricePerNightNgn, currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 5: FINANCIAL SETTLEMENT & ESCROW TELEMETRY
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'settlement' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#07161B]/80 p-4 rounded-2xl border border-[#2B7574]/30">
            <h2 className="font-monument text-lg font-bold uppercase text-[#0E2931] dark:text-white">
              Sovereign Escrow & Multi-Currency Settlement Gateway
            </h2>
            <p className="text-xs text-[#2B7574] dark:text-[#A5D1E1] font-mono">
              CBN compliant clearing house, real-time FX conversion rates, and escrow fund protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-3xl bg-[#07161B]/90 border border-[#2B7574]/40 p-6 space-y-3">
              <span className="text-[10px] font-mono text-[#A5D1E1] uppercase tracking-wider block">
                CBN Interbank FX Peg
              </span>
              <div className="text-2xl font-bold font-mono text-[#F2B632]">
                ₦1,485.50 / $1.00 USD
              </div>
              <p className="text-xs text-[#A5D1E1]/70 font-mono">
                Continuous real-time GDS clearing rate for diplomatic travel lines.
              </p>
            </div>

            <div className="rounded-3xl bg-[#07161B]/90 border border-[#2B7574]/40 p-6 space-y-3">
              <span className="text-[10px] font-mono text-[#A5D1E1] uppercase tracking-wider block">
                Escrow Reserve Coverage
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                100.00% Fully Backed
              </div>
              <p className="text-xs text-[#A5D1E1]/70 font-mono">
                Funds segregated in verified Nigerian banking custodian accounts.
              </p>
            </div>

            <div className="rounded-3xl bg-[#07161B]/90 border border-[#2B7574]/40 p-6 space-y-3">
              <span className="text-[10px] font-mono text-[#A5D1E1] uppercase tracking-wider block">
                IATA Clearing Batch
              </span>
              <div className="text-2xl font-bold font-mono text-white">
                #BATCH-7749-LOS
              </div>
              <p className="text-xs text-[#A5D1E1]/70 font-mono">
                Next automated gross clearing execution at 00:00 UTC.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          RESTYLED LUXURY IOS FLOATING DOCK NAVIGATION WITH TOOLTIPS
         ═══════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Dashboard Navigation Dock"
        className="fixed z-50 bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[96vw] bg-[#07161B]/90 backdrop-blur-2xl border border-[#2B7574]/50 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] rounded-full p-2 flex items-center gap-1 sm:gap-2 select-none"
      >
        {/* Tab 1: Flights */}
        <button
          type="button"
          aria-pressed={activeTab === 'flights'}
          onClick={() => setActiveTab('flights')}
          className={`group/dock relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'flights'
              ? 'bg-[#12484C] text-[#F2B632] border border-[#F2B632]/50 shadow-[0_4px_16px_rgba(242,182,50,0.25)] -translate-y-1'
              : 'text-[#A5D1E1]/80 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
          }`}
        >
          {/* Descriptive Tooltip */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-[#07161B]/95 text-[#F2B632] border border-[#2B7574]/60 text-[10px] font-mono whitespace-nowrap shadow-2xl opacity-0 group-hover/dock:opacity-100 group-hover/dock:-translate-y-1 transition-all duration-200 pointer-events-none z-50 flex items-center gap-1.5 backdrop-blur-xl">
            <span className="font-bold">ATC Flight Dispatch</span>
            <span className="text-[8px] text-[#A5D1E1]">· 14 Active Corridors</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#07161B] rotate-45 border-b border-r border-[#2B7574]/60" />
          </div>

          <Plane className="w-4 h-4 -rotate-45" />
          <span className="hidden xs:inline">Flight Ops</span>
          {activeTab === 'flights' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2B632] shadow-[0_0_8px_#F2B632]" />
          )}
        </button>

        {/* Tab 2: Loans */}
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
            <span className="font-bold">GDS Underwriting Desk</span>
            <span className="text-[8px] text-amber-300">· {pendingLoansCount} Pending</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#07161B] rotate-45 border-b border-r border-[#2B7574]/60" />
          </div>

          <ShieldAlert className="w-4 h-4" />
          <span className="hidden xs:inline">Risk Desk</span>
          {pendingLoansCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#F2B632] text-[#0E2931] text-[9px] font-bold flex items-center justify-center -ml-1">
              {pendingLoansCount}
            </span>
          )}
          {activeTab === 'loans' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2B632] shadow-[0_0_8px_#F2B632]" />
          )}
        </button>

        {/* Tab 3: Passengers */}
        <button
          type="button"
          aria-pressed={activeTab === 'passengers'}
          onClick={() => setActiveTab('passengers')}
          className={`group/dock relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'passengers'
              ? 'bg-[#12484C] text-[#F2B632] border border-[#F2B632]/50 shadow-[0_4px_16px_rgba(242,182,50,0.25)] -translate-y-1'
              : 'text-[#A5D1E1]/80 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
          }`}
        >
          {/* Descriptive Tooltip */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-[#07161B]/95 text-[#F2B632] border border-[#2B7574]/60 text-[10px] font-mono whitespace-nowrap shadow-2xl opacity-0 group-hover/dock:opacity-100 group-hover/dock:-translate-y-1 transition-all duration-200 pointer-events-none z-50 flex items-center gap-1.5 backdrop-blur-xl">
            <span className="font-bold">Passenger Registry</span>
            <span className="text-[8px] text-[#A5D1E1]">· PNR & VIP Manifest</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#07161B] rotate-45 border-b border-r border-[#2B7574]/60" />
          </div>

          <Users className="w-4 h-4" />
          <span className="hidden xs:inline">Manifest</span>
          {activeTab === 'passengers' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2B632] shadow-[0_0_8px_#F2B632]" />
          )}
        </button>

        {/* Tab 4: Hotels */}
        <button
          type="button"
          aria-pressed={activeTab === 'sanctuary'}
          onClick={() => setActiveTab('sanctuary')}
          className={`group/dock relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'sanctuary'
              ? 'bg-[#12484C] text-[#F2B632] border border-[#F2B632]/50 shadow-[0_4px_16px_rgba(242,182,50,0.25)] -translate-y-1'
              : 'text-[#A5D1E1]/80 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
          }`}
        >
          {/* Descriptive Tooltip */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-[#07161B]/95 text-[#F2B632] border border-[#2B7574]/60 text-[10px] font-mono whitespace-nowrap shadow-2xl opacity-0 group-hover/dock:opacity-100 group-hover/dock:-translate-y-1 transition-all duration-200 pointer-events-none z-50 flex items-center gap-1.5 backdrop-blur-xl">
            <span className="font-bold">Power Resilience Audit</span>
            <span className="text-[8px] text-emerald-400">· &lt;3s ATS Failover</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#07161B] rotate-45 border-b border-r border-[#2B7574]/60" />
          </div>

          <Building className="w-4 h-4" />
          <span className="hidden xs:inline">Sanctuaries</span>
          {activeTab === 'sanctuary' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2B632] shadow-[0_0_8px_#F2B632]" />
          )}
        </button>

        {/* Tab 5: Settlement */}
        <button
          type="button"
          aria-pressed={activeTab === 'settlement'}
          onClick={() => setActiveTab('settlement')}
          className={`group/dock relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === 'settlement'
              ? 'bg-[#12484C] text-[#F2B632] border border-[#F2B632]/50 shadow-[0_4px_16px_rgba(242,182,50,0.25)] -translate-y-1'
              : 'text-[#A5D1E1]/80 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
          }`}
        >
          {/* Descriptive Tooltip */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-[#07161B]/95 text-[#F2B632] border border-[#2B7574]/60 text-[10px] font-mono whitespace-nowrap shadow-2xl opacity-0 group-hover/dock:opacity-100 group-hover/dock:-translate-y-1 transition-all duration-200 pointer-events-none z-50 flex items-center gap-1.5 backdrop-blur-xl">
            <span className="font-bold">CBN Escrow &amp; FX Peg</span>
            <span className="text-[8px] text-[#A5D1E1]">· ₦1,485.50 / $1</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#07161B] rotate-45 border-b border-r border-[#2B7574]/60" />
          </div>

          <Landmark className="w-4 h-4" />
          <span className="hidden xs:inline">Settlement</span>
          {activeTab === 'settlement' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2B632] shadow-[0_0_8px_#F2B632]" />
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block" />

        {/* Quick Route to Flights */}
        <button
          type="button"
          onClick={() => setActiveRoute('/flights')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-mono text-[#F2B632] hover:bg-white/10 transition-colors cursor-pointer"
          title="Jump to Public Flights View"
        >
          <span>Flights</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </nav>

      {/* Embedded Assistant */}
      <DashboardAssistant
        role="admin"
        onAdminAction={(action) => setActiveTab(action as 'flights' | 'loans' | 'passengers' | 'sanctuary' | 'settlement')}
      />
    </div>
  );
};
