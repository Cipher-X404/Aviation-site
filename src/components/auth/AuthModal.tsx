import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, ShieldCheck, User, Plane, Lock, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, currentUser, login, setActiveRoute } = useAppStore();
  const [activeTab, setActiveTab] = useState<'traveler' | 'admin'>(
    currentUser.role === 'admin' ? 'admin' : 'traveler'
  );
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isAuthModalOpen) return null;

  const handleDemoLogin = (role: 'traveler' | 'admin') => {
    login(role);
    setAuthModalOpen(false);
    if (role === 'admin') {
      setActiveRoute('/admin');
    } else {
      setActiveRoute('/account');
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(activeTab, customName || undefined, customEmail || undefined);
    setAuthModalOpen(false);
    if (activeTab === 'admin') {
      setActiveRoute('/admin');
    } else {
      setActiveRoute('/account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2931]/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0B1E24] shadow-[0_25px_50px_-12px_rgba(14,41,49,0.45)] border border-[#2B7574]/20 overflow-hidden">
        {/* Header with Luxury Brand Accent */}
        <div className="p-6 bg-gradient-to-r from-[#0E2931] via-[#12484C] to-[#0D5C75] text-[#F4F6F5] relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-5 right-5 text-[#A5D1E1] hover:text-white transition-colors cursor-pointer p-1 rounded-full bg-white/10"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#F2B632] uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AEROVISTA SOVEREIGN ACCESS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wide">
            PORTAL AUTHENTICATION
          </h2>
          <p className="text-xs text-[#A5D1E1] mt-1">
            Sign in to manage real-time boarding passes, flight loans, or flight dispatch operations.
          </p>

          {/* Role Segment Toggle */}
          <div className="grid grid-cols-2 gap-2 mt-5 bg-[#09171C]/50 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('traveler')}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'traveler'
                  ? 'bg-[#F2B632] text-[#0E2931] shadow-md'
                  : 'text-[#A5D1E1] hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Traveler Portal</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#199FB1] text-white shadow-md'
                  : 'text-[#A5D1E1] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin & Dispatch</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {activeTab === 'traveler' ? (
            <div className="space-y-4">
              {/* Quick Demo Login Option */}
              <div className="p-4 rounded-xl bg-[#F4F6F5] dark:bg-[#122A32] border border-[#2B7574]/15">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase text-[#2B7574] dark:text-[#A5D1E1] tracking-wider">
                    Instant Demo Profile
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F2B632]/20 text-[#8F650D] dark:text-[#F2B632] font-semibold">
                    Onyx Presidential
                  </span>
                </div>
                <div className="font-semibold text-sm text-[#0E2931] dark:text-white">
                  Dr. Folashade Adeleke
                </div>
                <div className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                  folashade.adeleke@lagoonhealth.ng · 148,250 Miles
                </div>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('traveler')}
                  className="mt-3 w-full py-2.5 px-4 rounded-lg bg-[#F2B632] hover:bg-[#e6a827] text-[#0E2931] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Plane className="w-4 h-4" />
                  <span>Launch Traveler Dashboard (1-Click)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#E2E2E0] dark:border-[#1E3E47]"></div>
                <span className="flex-shrink mx-4 text-[10px] font-mono uppercase text-[#12484C]/60 dark:text-[#A5D1E1]/60">
                  Or enter custom identity
                </span>
                <div className="flex-grow border-t border-[#E2E2E0] dark:border-[#1E3E47]"></div>
              </div>

              <form onSubmit={handleCustomSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Chief Adeleke Johnson"
                    className="w-full px-3 py-2 rounded-lg bg-[#F4F6F5] dark:bg-[#122A32] border border-[#2B7574]/20 text-xs text-[#0E2931] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#F2B632]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="e.g. traveler@domain.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#F4F6F5] dark:bg-[#122A32] border border-[#2B7574]/20 text-xs text-[#0E2931] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#F2B632]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#12484C] dark:bg-[#199FB1] text-white text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Sign In as Traveler
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Quick Admin Demo Login */}
              <div className="p-4 rounded-xl bg-[#F4F6F5] dark:bg-[#122A32] border border-[#2B7574]/15">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase text-[#2B7574] dark:text-[#A5D1E1] tracking-wider">
                    Executive Operations & Risk Director
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#199FB1]/20 text-[#0D5C75] dark:text-[#A5D1E1] font-semibold">
                    Super Admin
                  </span>
                </div>
                <div className="font-semibold text-sm text-[#0E2931] dark:text-white">
                  Capt. Kayode Balogun
                </div>
                <div className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] font-mono">
                  dispatch.director@aerovista.aero · MM2 Flight Deck Control
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-[#12484C] dark:text-[#A5D1E1]/90 bg-white/40 dark:bg-black/20 p-2.5 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#199FB1]" />
                    <span>Live Radar & Gate Ops</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#199FB1]" />
                    <span>Loan Underwriting Queue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#199FB1]" />
                    <span>GDS Passenger Ledger</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#199FB1]" />
                    <span>VIP Sanctuary Allocation</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="mt-4 w-full py-2.5 px-4 rounded-lg bg-[#0D5C75] hover:bg-[#12484C] text-[#F2B632] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Launch Operations & Admin Portal (1-Click)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#E2E2E0] dark:border-[#1E3E47]"></div>
                <span className="flex-shrink mx-4 text-[10px] font-mono uppercase text-[#12484C]/60 dark:text-[#A5D1E1]/60">
                  Or enter credentials
                </span>
                <div className="flex-grow border-t border-[#E2E2E0] dark:border-[#1E3E47]"></div>
              </div>

              <form onSubmit={handleCustomSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Officer Call Sign / Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Capt. Kayode Balogun"
                    className="w-full px-3 py-2 rounded-lg bg-[#F4F6F5] dark:bg-[#122A32] border border-[#2B7574]/20 text-xs text-[#0E2931] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#199FB1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Dispatch Station Email
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="e.g. dispatch@aerovista.aero"
                    className="w-full px-3 py-2 rounded-lg bg-[#F4F6F5] dark:bg-[#122A32] border border-[#2B7574]/20 text-xs text-[#0E2931] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#199FB1]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#0E2931] text-[#F2B632] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#12484C] transition-colors cursor-pointer"
                >
                  Authenticate as Operations Admin
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
