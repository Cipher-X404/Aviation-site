import React, { useState } from 'react';
import { DashboardAssistant } from '../common/DashboardAssistant';
import { useAppStore, FlightOpsRecord, UnderwritingApplication } from '../../store/useAppStore';
import { formatPrice } from '../../services/currency';
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
  FileText
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

  const [activeTab, setActiveTab] = useState<'flights' | 'loans' | 'passengers' | 'sanctuary'>('flights');
  const [flightFilter, setFlightFilter] = useState<'all' | 'Airborne' | 'Boarding' | 'Delayed'>('all');
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
    if (flightFilter === 'all') return true;
    return f.status === flightFilter;
  });

  const filteredPassengers = bookingHistory.filter((b) => {
    if (!passengerSearch) return true;
    const q = passengerSearch.toLowerCase();
    const name = b.passengers[0]?.firstName.toLowerCase() + ' ' + b.passengers[0]?.lastName.toLowerCase();
    return b.bookingRef.toLowerCase().includes(q) || name.includes(q);
  });

  // Calculate live operations metrics
  const totalBookingsCount = bookingHistory.length;
  const totalRevenueNgn = bookingHistory.reduce((acc, curr) => acc + curr.totalPaidNgn, 0) + 428_500_000;
  const pendingLoansCount = underwritingQueue.filter((q) => q.status === 'Pending').length;

  return (
    <div className="min-h-screen pt-28 pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Top Notification Toast */}
      {actionNotice && (
        <div className="fixed top-24 right-6 z-50 bg-[#12484C] text-[#F2B632] px-5 py-3 rounded-xl shadow-xl border border-[#2B7574]/40 flex items-center gap-3 font-mono text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#F2B632]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Admin Executive Header Bar */}
      <div className="rounded-3xl bg-[#101f24] text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#199FB1]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono tracking-widest text-[#F2B632] uppercase">
                AEROVISTA · DEMO OPERATIONS
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold uppercase tracking-wide">
              EXECUTIVE DISPATCH & RISK PORTAL
            </h1>
            <p className="text-xs sm:text-sm text-[#A5D1E1] mt-1 max-w-2xl font-body">
              Demo operations dashboard. Flight statuses, payment applications and passenger records are sample data; actions here only update this screen.
            </p>
          </div>

          {/* Admin Identity Card & Switcher */}
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 self-start lg:self-auto">
            <div className="w-12 h-12 rounded-xl bg-[#F2B632] text-[#0E2931] flex items-center justify-center font-bold text-lg shadow-inner">
              KB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase">{currentUser.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#199FB1]/30 text-[#A5D1E1] font-semibold">
                  CHIEF DISPATCHER
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#A5D1E1]/80">
                {currentUser.jobTitle || 'Executive Operations'}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => void endAdminSession()}
                  className="text-[11px] font-mono text-[#F2B632] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Switch to Traveler View</span>
                </button>
                <span className="text-white/20">|</span>
                <button
                  type="button"
                  onClick={() => void endAdminSession()}
                  className="text-[11px] font-mono text-[#A5D1E1] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Exit to Front</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[11px] font-mono uppercase mb-1">
              <span>Gross Sales (24h)</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#F2B632]" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-[#F2B632]">
              {formatPrice(totalRevenueNgn, currency)}
            </div>
            <div className="text-[10px] text-white/50 font-mono mt-0.5">+18.4% vs trailing week</div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[11px] font-mono uppercase mb-1">
              <span>Average Load Factor</span>
              <Users className="w-3.5 h-3.5 text-[#199FB1]" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-white">
              92.8%
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Optimal capacity ceiling</div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[11px] font-mono uppercase mb-1">
              <span>Underwriting Queue</span>
              <Clock className="w-3.5 h-3.5 text-[#F2B632]" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-white">
              {pendingLoansCount} Pending
            </div>
            <div className="text-[10px] text-amber-300 font-mono mt-0.5">Average decision: 1.4 min</div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#A5D1E1] text-[11px] font-mono uppercase mb-1">
              <span>Sample bookings</span>
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-white">
              {totalBookingsCount} Active PNRs
            </div>
            <div className="text-[10px] text-white/50 font-mono mt-0.5">Example records only</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Luxury Pill-Free Editorial Bar) */}
      <div className="fixed z-40 bottom-4 left-1/2 -translate-x-1/2 w-[min(94vw,620px)] flex items-center justify-around gap-1 p-2 bg-[#e9e4d8] dark:bg-[#102b30] border border-[#9a7727]/50 shadow-[0_18px_55px_rgba(0,0,0,.32)] rounded-[26px]">
        <button
          type="button"
          aria-pressed={activeTab === 'flights'}
          onClick={() => setActiveTab('flights')}
          className={`px-2 sm:px-3 py-3 rounded-2xl text-[8px] sm:text-[9px] font-mono font-bold tracking-wide uppercase transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer max-w-[24%] leading-tight ${
            activeTab === 'flights'
              ? 'bg-[#12484C] text-[#F2B632] shadow-lg shadow-[#12484C]/25'
              : 'bg-white dark:bg-[#0E2931]/50 text-[#12484C] dark:text-[#A5D1E1] hover:bg-[#12484C]/10'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>Flight ops</span>
        </button>

        <button
          type="button"
          aria-pressed={activeTab === 'loans'}
          onClick={() => setActiveTab('loans')}
          className={`px-2 sm:px-3 py-3 rounded-2xl text-[8px] sm:text-[9px] font-mono font-bold tracking-wide uppercase transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer max-w-[24%] leading-tight relative ${
            activeTab === 'loans'
              ? 'bg-[#12484C] text-[#F2B632] shadow-lg shadow-[#12484C]/25'
              : 'bg-white dark:bg-[#0E2931]/50 text-[#12484C] dark:text-[#A5D1E1] hover:bg-[#12484C]/10'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Loan queue</span>
          {pendingLoansCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#F2B632] animate-pulse" />
          )}
        </button>

        <button
          type="button"
          aria-pressed={activeTab === 'passengers'}
          onClick={() => setActiveTab('passengers')}
          className={`px-2 sm:px-3 py-3 rounded-2xl text-[8px] sm:text-[9px] font-mono font-bold tracking-wide uppercase transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer max-w-[24%] leading-tight ${
            activeTab === 'passengers'
              ? 'bg-[#12484C] text-[#F2B632] shadow-lg shadow-[#12484C]/25'
              : 'bg-white dark:bg-[#0E2931]/50 text-[#12484C] dark:text-[#A5D1E1] hover:bg-[#12484C]/10'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Passengers</span>
        </button>

        <button
          type="button"
          aria-pressed={activeTab === 'sanctuary'}
          onClick={() => setActiveTab('sanctuary')}
          className={`px-2 sm:px-3 py-3 rounded-2xl text-[8px] sm:text-[9px] font-mono font-bold tracking-wide uppercase transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer max-w-[24%] leading-tight ${
            activeTab === 'sanctuary'
              ? 'bg-[#12484C] text-[#F2B632] shadow-lg shadow-[#12484C]/25'
              : 'bg-white dark:bg-[#0E2931]/50 text-[#12484C] dark:text-[#A5D1E1] hover:bg-[#12484C]/10'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Hotels</span>
        </button>
      </div>

      {/* Tab 1: Live Flight Operations & Gate Dispatch */}
      {activeTab === 'flights' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold uppercase text-[#0E2931] dark:text-white">
                Sample flight statuses
              </h2>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                Select a sample flight to edit its gate or status in this dashboard.
              </p>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              {(['all', 'Airborne', 'Boarding', 'Delayed'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setFlightFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors cursor-pointer ${
                    flightFilter === filter
                      ? 'bg-[#12484C] text-[#F2B632] font-bold'
                      : 'bg-white dark:bg-[#0E2931]/40 text-[#12484C] dark:text-[#A5D1E1]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Flights Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlights.map((flight) => {
              const statusColors = {
                Airborne: 'bg-cyan-500/10 text-cyan-500 dark:text-cyan-400',
                Boarding: 'bg-[#F2B632]/20 text-[#8F650D] dark:text-[#F2B632]',
                'On Time': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                Delayed: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                Landed: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
              }[flight.status];

              return (
                <div
                  key={flight.id}
                  className="rounded-2xl bg-white dark:bg-[#0E2931]/70 p-6 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm font-bold text-[#0E2931] dark:text-[#F2B632]">
                        {flight.flightNumber}
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase ${statusColors}`}>
                        {flight.status}
                      </span>
                    </div>

                    <div className="text-lg font-display font-bold uppercase text-[#0E2931] dark:text-white">
                      {flight.route}
                    </div>
                    <div className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono mt-0.5">
                      {flight.aircraft} · {flight.captain}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#E2E2E0] dark:border-[#1E3E47] text-xs font-mono">
                      <div>
                        <span className="text-[#12484C]/60 dark:text-[#A5D1E1]/60 block text-[10px] uppercase">
                          Departure
                        </span>
                        <span className="font-bold text-[#0E2931] dark:text-white">{flight.departureTime}</span>
                      </div>
                      <div>
                        <span className="text-[#12484C]/60 dark:text-[#A5D1E1]/60 block text-[10px] uppercase">
                          Gate Assignment
                        </span>
                        <span className="font-bold text-[#F2B632]">{flight.gate}</span>
                      </div>
                    </div>

                    {/* Load factor bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-[#12484C] dark:text-[#A5D1E1]">
                        <span>Load Factor</span>
                        <span className="font-bold tabular-nums">
                          {flight.passengersBooked}/{flight.capacity} ({flight.loadFactorPercent}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#E2E2E0] dark:bg-[#122A32] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#2B7574] to-[#F2B632] rounded-full transition-all duration-500"
                          style={{ width: `${flight.loadFactorPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFlightEdit(flight);
                      setNewGate(flight.gate);
                      setNewStatus(flight.status);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-[#12484C]/10 dark:bg-white/5 hover:bg-[#12484C] hover:text-[#F2B632] dark:hover:bg-[#12484C] text-xs font-mono uppercase font-bold text-[#12484C] dark:text-[#A5D1E1] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Edit sample flight details</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Edit Flight Modal */}
          {selectedFlightEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2931]/80 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0B1E24] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg uppercase text-[#0E2931] dark:text-white">
                    Edit Flight {selectedFlightEdit.flightNumber}
                  </h3>
                  <button
                    onClick={() => setSelectedFlightEdit(null)}
                    className="text-[#12484C] dark:text-[#A5D1E1] hover:text-white p-1"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Assign Gate
                  </label>
                  <input
                    type="text"
                    value={newGate}
                    onChange={(e) => setNewGate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F4F6F5] dark:bg-[#122A32] text-xs font-mono text-[#0E2931] dark:text-white border border-[#2B7574]/20 focus:outline-none"
                    placeholder="e.g. Gate B4"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Flight Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as FlightOpsRecord['status'])}
                    className="w-full px-3 py-2 rounded-lg bg-[#F4F6F5] dark:bg-[#122A32] text-xs font-mono text-[#0E2931] dark:text-white border border-[#2B7574]/20 focus:outline-none cursor-pointer"
                  >
                    <option value="On Time">On Time</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Airborne">Airborne</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Landed">Landed</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFlightEdit(null)}
                    className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-white/10 text-xs font-mono uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateFlight(selectedFlightEdit.id)}
                    className="flex-1 py-2 rounded-lg bg-[#12484C] text-[#F2B632] font-mono text-xs uppercase font-bold hover:bg-[#0E2931] cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Loan queue */}
      {activeTab === 'loans' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-display font-bold uppercase text-[#0E2931] dark:text-white">
              FLY NOW PAY LATER UNDERWRITING DESK
            </h2>
            <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
              Sample applications for interface testing. This dashboard does not connect to BVN, bank records or a live credit decision service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {underwritingQueue.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl bg-white dark:bg-[#0E2931]/70 p-6 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#2B7574] dark:text-[#F2B632]">
                      APP REF: {app.id.toUpperCase()}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase ${
                        app.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : app.status === 'Declined'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-[#F2B632]/20 text-[#8F650D] dark:text-[#F2B632]'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold uppercase text-[#0E2931] dark:text-white">
                    {app.applicantName}
                  </h3>
                  <div className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono mt-0.5">
                    BVN: {app.bvnMasked} · Itinerary: {app.flightRoute}
                  </div>

                  {/* Financial Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 p-3 rounded-xl bg-[#F4F6F5] dark:bg-[#0B1E24] text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[#12484C]/60 dark:text-[#A5D1E1]/60 block uppercase">
                        Requested
                      </span>
                      <span className="font-bold text-[#0E2931] dark:text-[#F2B632] tabular-nums">
                        {formatPrice(app.requestedNgn, currency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#12484C]/60 dark:text-[#A5D1E1]/60 block uppercase">
                        Income (sample)
                      </span>
                      <span className="font-bold text-[#0E2931] dark:text-white tabular-nums">
                        {formatPrice(app.monthlyIncomeNgn, currency)}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#12484C]/60 dark:text-[#A5D1E1]/60 block uppercase">
                        Credit Score
                      </span>
                      <span className="font-bold text-emerald-500 tabular-nums">{app.creditScore}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#12484C]/60 dark:text-[#A5D1E1]/60 block uppercase">
                        DTI Ratio
                      </span>
                      <span className="font-bold text-[#0E2931] dark:text-white tabular-nums">
                        {app.dtiRatioPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#12484C] dark:text-[#A5D1E1]">
                    <span>Risk Classification: <strong className="text-emerald-500">{app.riskTier}</strong></span>
                    <span>{app.tenureMonths} mo installment</span>
                  </div>
                </div>

                {/* Underwriting Actions */}
                {app.status === 'Pending' ? (
                  <div className="flex gap-2 pt-2 border-t border-[#E2E2E0] dark:border-[#1E3E47]">
                    <button
                      type="button"
                      onClick={() => {
                        approveUnderwriting(app.id);
                        showNotification(`Sample application ${app.id} marked approved.`);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark example approved</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        declineUnderwriting(app.id);
                        showNotification(`Sample application ${app.id} marked declined.`);
                      }}
                      className="py-2.5 px-4 rounded-xl bg-rose-600/10 hover:bg-rose-600 hover:text-white text-rose-600 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#E2E2E0] dark:border-[#1E3E47] text-xs font-mono text-center text-[#12484C]/70 dark:text-[#A5D1E1]/70">
                    Example status saved in this demo
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Passenger list */}
      {activeTab === 'passengers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold uppercase text-[#0E2931] dark:text-white">
                SAMPLE BOOKING RECORDS
              </h2>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                Real-time booking records synchronized across regional and international sectors.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2B7574] dark:text-[#A5D1E1]" />
              <input
                type="text"
                value={passengerSearch}
                onChange={(e) => setPassengerSearch(e.target.value)}
                placeholder="Search PNR or Passenger..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#0E2931]/60 text-xs font-mono text-[#0E2931] dark:text-white border border-[#2B7574]/20 focus:outline-none focus:ring-1 focus:ring-[#F2B632]"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredPassengers.map((booking) => {
              const p = booking.passengers[0];
              return (
                <div
                  key={booking.id}
                  className="rounded-2xl bg-white dark:bg-[#0E2931]/70 p-5 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#12484C] text-[#F2B632] flex items-center justify-center font-mono font-bold text-sm">
                      PNR
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#0E2931] dark:text-white">
                          {booking.bookingRef}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                          {booking.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2B7574]/15 text-[#12484C] dark:text-[#A5D1E1] font-semibold uppercase">
                          {booking.paymentMethod === 'paylater' ? 'Fly Now Pay Later' : 'Direct Card'}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-[#0E2931] dark:text-[#EAEFEF] mt-1">
                        {p?.firstName} {p?.lastName}
                      </div>
                      <div className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                        {p?.email} · Seat: <span className="text-[#F2B632] font-bold">{booking.seat || '4A'}</span> · Travel: {booking.travelDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#E2E2E0] dark:border-[#1E3E47]">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-mono uppercase text-[#12484C]/60 dark:text-[#A5D1E1]/60 block">
                        Settlement
                      </span>
                      <span className="font-mono font-bold text-sm tabular-nums text-[#0E2931] dark:text-[#F2B632]">
                        {formatPrice(booking.totalPaidNgn, currency)}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#2B7574] dark:text-[#A5D1E1] bg-[#F4F6F5] dark:bg-[#0B1E24] px-3 py-1.5 rounded-lg">
                      Seed: {booking.qrCodeSeed.slice(0, 10)}...
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Hotels */}
      {activeTab === 'sanctuary' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-display font-bold uppercase text-[#0E2931] dark:text-white">
              SANCTUARY RESIDENCES & GROUND CHAUFFEUR TELEMETRY
            </h2>
            <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
              Example hotel and transfer information. Confirm amenities and transport details with each provider.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white dark:bg-[#0E2931]/70 p-6 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#F2B632]">LAGOS SECTOR (LOS)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="font-display font-bold text-base uppercase text-[#0E2931] dark:text-white">
                The Chesney Hotels & Diplomatic Suites
              </h3>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] mt-2">
                Example property details · confirm directly with the hotel.
              </p>
              <div className="mt-4 pt-4 border-t border-[#E2E2E0] dark:border-[#1E3E47] text-xs font-mono">
                Ground Escorts: 4 Mercedes Maybach S680 on standby at MM2 Diplomatic Apron.
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#0E2931]/70 p-6 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#F2B632]">ABUJA SECTOR (ABV)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="font-display font-bold text-base uppercase text-[#0E2931] dark:text-white">
                Transcorp Hilton Presidential Wing
              </h3>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] mt-2">
                Example room allocation. Confirm property details and transfers directly.
              </p>
              <div className="mt-4 pt-4 border-t border-[#E2E2E0] dark:border-[#1E3E47] text-xs font-mono">
                Ground Escorts: 2 Armored Sentinel Range Rovers active.
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#0E2931]/70 p-6 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#F2B632]">DUBAI SECTOR (DXB)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="font-display font-bold text-base uppercase text-[#0E2931] dark:text-white">
                Bulgari Resort & Marina Oasis
              </h3>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] mt-2">
                12/12 Allocated · Private yacht harbor transfer confirmed for incoming passengers.
              </p>
              <div className="mt-4 pt-4 border-t border-[#E2E2E0] dark:border-[#1E3E47] text-xs font-mono">
                Ground Escorts: Rolls-Royce Phantom Chauffeur service synchronized with flight AV-810.
              </div>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => { setActiveRoute('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Return to site home" className="fixed z-30 right-5 bottom-24 w-14 h-14 rounded-2xl bg-[#c9a955] text-[#102b30] shadow-xl flex items-center justify-center hover:-translate-y-1 transition-transform"><Plane size={22}/></button>
      <DashboardAssistant role="admin" onAdminAction={(action) => setActiveTab(action as 'flights' | 'loans' | 'passengers' | 'sanctuary')} />
    </div>
  );
};
