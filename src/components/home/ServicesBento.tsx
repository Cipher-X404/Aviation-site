import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plane, Building2, CreditCard, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const ServicesBento: React.FC = () => {
  const { setActiveRoute } = useAppStore();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10 text-left">
        <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase block mb-1">
          02. CORE INFRASTRUCTURE
        </span>
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
          ELEVATED TRAVEL SERVICES
        </h2>
        <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1 max-w-2xl">
          Three deeply integrated capabilities engineered to remove friction from continental and transatlantic journeys.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bento 1: Real-Time Flight Engine (col-span-7) */}
        <div
          onClick={() => {
            setActiveRoute('/flights');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="lg:col-span-7 bg-white dark:bg-[#0E2931]/70 border border-[#2B7574]/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-15px_rgba(18,72,76,0.3)] group cursor-pointer relative overflow-hidden"
        >
          <div className="bg-contour absolute inset-0 opacity-40 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#12484C] text-[#F2B632] flex items-center justify-center">
                <Plane className="w-5 h-5 stroke-[1.5] -rotate-45" />
              </div>
              <span className="text-[11px] font-mono text-[#2B7574] dark:text-[#F2B632] uppercase border border-[#2B7574]/30 px-2 py-0.5 rounded">
                GDS Direct Sync
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase tracking-wide">
              Real-Time Flight Booking
            </h3>
            <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-2 max-w-lg leading-relaxed">
              Instant airline seat reservation with zero intermediary markup. Live departure board times, cheapest-day calendar, dynamic fare trend monitoring, and offline-ready boarding passes with gate verification barcodes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#E2E2E0] dark:border-[#18363F]">
              <div>
                <span className="block text-[10px] font-mono uppercase text-[#2B7574] dark:text-[#A5D1E1]">
                  Carriers
                </span>
                <span className="text-sm font-semibold text-[#0E2931] dark:text-[#FFFFFF]">
                  40+ Regional & Global
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-[#2B7574] dark:text-[#A5D1E1]">
                  Fares
                </span>
                <span className="text-sm font-semibold text-[#0E2931] dark:text-[#FFFFFF]">
                  Best Price Match
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[10px] font-mono uppercase text-[#2B7574] dark:text-[#A5D1E1]">
                  Ticketing
                </span>
                <span className="text-sm font-semibold text-[#0E2931] dark:text-[#FFFFFF]">
                  Immediate Issuance
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 flex items-center justify-between text-xs font-bold text-[#12484C] dark:text-[#F2B632]">
            <span>Explore Flight Schedule</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform stroke-[2]" />
          </div>
        </div>

        {/* Bento 2: Hotel Pre-Fill Intelligence (col-span-5) */}
        <div
          onClick={() => {
            setActiveRoute('/hotels');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="lg:col-span-5 bg-white dark:bg-[#0E2931]/70 border border-[#2B7574]/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-15px_rgba(18,72,76,0.3)] group cursor-pointer relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#12484C] text-[#F2B632] flex items-center justify-center">
                <Building2 className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[11px] font-mono text-[#2B7574] dark:text-[#F2B632] uppercase border border-[#2B7574]/30 px-2 py-0.5 rounded">
                Smart Itinerary Sync
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase tracking-wide">
              Destination Hotels
            </h3>
            <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-2 leading-relaxed">
              Never re-enter city names or dates. Your hotel check-in automatically aligns with your flight touchdown, with guaranteed 24/7 power backup and chauffeured airport pickups.
            </p>

            <div className="space-y-2 mt-6 pt-6 border-t border-[#E2E2E0] dark:border-[#18363F]">
              <div className="flex items-center gap-2 text-xs text-[#12484C] dark:text-[#A5D1E1]">
                <ShieldCheck className="w-4 h-4 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                <span>Audited 24/7 dedicated heavy generator backup</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#12484C] dark:text-[#A5D1E1]">
                <Zap className="w-4 h-4 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                <span>Save up to 15% when bundled with flights</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 flex items-center justify-between text-xs font-bold text-[#12484C] dark:text-[#F2B632]">
            <span>Browse Hotel Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform stroke-[2]" />
          </div>
        </div>

        {/* Bento 3: Fly Now, Pay Later (col-span-12 full-width highlight banner) */}
        <div
          onClick={() => {
            setActiveRoute('/fly-now-pay-later');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="lg:col-span-12 bg-ocean-gradient text-[#F4F6F5] rounded-2xl p-6 sm:p-10 transition-all duration-300 hover:shadow-xl group cursor-pointer relative overflow-hidden"
        >
          <div className="bg-topo absolute inset-0 opacity-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0E2931]/60 border border-[#A5D1E1]/30 text-xs font-mono text-[#F2B632]">
                <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>FLEXIBLE FLIGHT FINANCING</span>
              </div>

              <h3 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-wide">
                Fly Now, Pay Later
              </h3>
              <p className="text-sm sm:text-base text-[#A5D1E1] leading-relaxed">
                Take off today. Split ticket costs over 3 to 12 months with as little as 10% down. Transparent APR, zero penalty for early settlement, and algorithmic approvals under 60 seconds.
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                className="btn-gold px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Launch Loan Calculator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
