import React from 'react';
import { ShieldCheck, Zap, Award, Compass, HeartHandshake } from 'lucide-react';

export const WhyTrustUs: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E2E2E0] dark:border-[#18363F] relative overflow-hidden">
      {/* Ghost section watermark — stroke-only, barely visible */}
      <span aria-hidden="true" className="wm-text select-none">TRUST</span>
      <div className="relative z-10">
      <div className="mb-12 text-left">
        <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase block mb-1">
          07. A FEW THINGS TO CHECK
        </span>
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
          The details make the difference
        </h2>
        <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1 max-w-2xl">
          A good plan leaves fewer surprises. Here are a few details worth checking before you book.
        </p>
      </div>

      {/* Non-Template Asymmetric Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Large Feature Column 1 (col-span-5) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#12484C] text-[#F4F6F5] p-8 sm:p-10 flex flex-col justify-between border border-[#2B7574]/40 relative overflow-hidden">
          <div className="bg-topo absolute inset-0 opacity-20 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0E2931] text-[#F2B632] flex items-center justify-center border border-[#2B7574]/40">
              <Zap className="w-6 h-6 stroke-[1.5]" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-[#A5D1E1]">
              STAYS
            </span>

            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">
              Check the details that matter
            </h3>

            <p className="text-sm text-[#A5D1E1] leading-relaxed">
              Power, Wi-Fi, check-in and transport can make or break a stay. Compare the amenities listed for each property, then confirm what is available directly with the hotel.
            </p>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-[#2B7574]/50 flex items-center justify-between text-xs font-mono text-[#F2B632]">
            <span>Check hotel amenities</span>
            <span>Confirm with the property</span>
          </div>
        </div>

        {/* Stacked Asymmetric Column 2 (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          {/* Top Row: Direct Carrier GDS */}
          <div className="rounded-3xl bg-white dark:bg-[#0E2931]/70 border border-[#2B7574]/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300">
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2B7574] dark:text-[#F2B632]">
                <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                <span>FLIGHT OPTIONS</span>
              </div>
              <h4 className="font-display text-xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                Compare flights before you book
              </h4>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] leading-relaxed">
                CJ Travels Owerri sources fares directly from partner carrier GDS. Compare flight options across cabin classes, then confirm baggage allowance and final pricing at checkout.
              </p>
            </div>
            <div className="shrink-0 bg-[#0E2931] text-[#F2B632] px-4 py-3 rounded-xl font-mono text-center">
              <span className="block text-xl font-bold tabular-nums">Live</span>
              <span className="text-[10px] uppercase text-[#A5D1E1]">GDS Fares</span>
            </div>
          </div>

          {/* Middle Row: Fair Financing Ethics */}
          <div className="rounded-3xl bg-white dark:bg-[#0E2931]/70 border border-[#2B7574]/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300">
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2B7574] dark:text-[#F2B632]">
                <Award className="w-4 h-4 stroke-[1.5]" />
                <span>PAYMENT PLAN EXAMPLES</span>
              </div>
              <h4 className="font-display text-xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                Structure your payment plan
              </h4>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] leading-relaxed">
                Use the Fly Now Pay Later calculator to configure 0% APR instalment plans across 3–12 months. Facility terms are confirmed at checkout with our CBN-licensed lending partner.
              </p>
            </div>
            <div className="shrink-0 bg-[#0E2931] text-[#F2B632] px-4 py-3 rounded-xl font-mono text-center">
              <span className="block text-xl font-bold tabular-nums">Check</span>
              <span className="text-[10px] uppercase text-[#A5D1E1]">Provider terms</span>
            </div>
          </div>

          {/* Bottom Row: Human Flight Concierge */}
          <div className="rounded-3xl bg-white dark:bg-[#0E2931]/70 border border-[#2B7574]/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300">
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2B7574] dark:text-[#F2B632]">
                <HeartHandshake className="w-4 h-4 stroke-[1.5]" />
                <span>NEED A HAND?</span>
              </div>
              <h4 className="font-display text-xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                24/7 Concierge Support
              </h4>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] leading-relaxed">
                Our guest care team is available around the clock via live chat, email, and priority phone. For active travel emergencies, our duty concierge responds within minutes.
              </p>
            </div>
            <div className="shrink-0 bg-[#0E2931] text-[#F2B632] px-4 py-3 rounded-xl font-mono text-center">
              <span className="block text-xl font-bold tabular-nums">0%</span>
              <span className="text-[10px] uppercase text-[#A5D1E1]">APR Financing</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};
