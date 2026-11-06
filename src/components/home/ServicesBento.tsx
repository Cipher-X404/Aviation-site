import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plane, Building2, CreditCard, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const ServicesBento: React.FC = () => {
  const { setActiveRoute } = useAppStore();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10 text-left">
        <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase block mb-1">
          WHAT YOU CAN DO HERE
        </span>
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
          Plan a trip, your way
        </h2>
        <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1 max-w-2xl">
          Direct access to sovereign air corridors, verified luxury sanctuaries, and 0% APR flight financing.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bento 1: Real-Time Flight Engine (col-span-7) */}
        <div
          role="link"
          tabIndex={0}
          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveRoute('/flights'); } }}
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
                Live GDS Corridors
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase tracking-wide">
              Explore flight options
            </h3>
            <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-2 max-w-lg leading-relaxed">
              Direct connectivity to major West African and global carriers with live seat inventory, transparent fare classes, and instant e-ticketing.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#E2E2E0] dark:border-[#18363F]">
              <div>
                <span className="block text-[10px] font-mono uppercase text-[#2B7574] dark:text-[#A5D1E1]">
                  Carriers
                </span>
                <span className="text-sm font-semibold text-[#0E2931] dark:text-[#FFFFFF]">
                  Direct Corridors
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-[#2B7574] dark:text-[#A5D1E1]">
                  Fares
                </span>
                <span className="text-sm font-semibold text-[#0E2931] dark:text-[#FFFFFF]">
                  Compare listed fares
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[10px] font-mono uppercase text-[#2B7574] dark:text-[#A5D1E1]">
                  Ticketing
                </span>
                <span className="text-sm font-semibold text-[#0E2931] dark:text-[#FFFFFF]">
                  Instant E-Ticket
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
          role="link"
          tabIndex={0}
          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveRoute('/hotels'); } }}
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
                Power-Verified
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase tracking-wide">
              Destination Hotels
            </h3>
            <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-2 leading-relaxed">
              Curated sanctuaries with audited generator backup, enterprise Wi-Fi, and coordinated tarmac-to-suite chauffeur transfers.
            </p>

            <div className="space-y-2 mt-6 pt-6 border-t border-[#E2E2E0] dark:border-[#18363F]">
              <div className="flex items-center gap-2 text-xs text-[#12484C] dark:text-[#A5D1E1]">
                <ShieldCheck className="w-4 h-4 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                <span>100% Verified backup power systems</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#12484C] dark:text-[#A5D1E1]">
                <Zap className="w-4 h-4 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                <span>Synchronized flight and hotel arrangements</span>
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
                <Zap className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>0% APR FINANCING</span>
              </div>

              <h3 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-wide">
                Fly Now, Pay Later
              </h3>
              <p className="text-sm sm:text-base text-[#A5D1E1] leading-relaxed">
                Spread your travel investment over 3, 6, 9, or 12 months with zero hidden interest. Backed by CBN-licensed financial infrastructure.
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                className="btn-gold px-6 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Configure Payment Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
