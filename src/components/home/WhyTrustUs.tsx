import React from 'react';
import { ShieldCheck, Zap, Award, Compass, HeartHandshake } from 'lucide-react';

export const WhyTrustUs: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E2E2E0] dark:border-[#18363F]">
      <div className="mb-12 text-left">
        <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase block mb-1">
          04. RIGOROUS STANDARDS
        </span>
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
          ENGINEERED FOR UNCOMPROMISING TRAVELERS
        </h2>
        <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1 max-w-2xl">
          Travel across Africa and overseas demands operational realism. We verify what ordinary booking engines overlook.
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
              REGIONAL MANDATE
            </span>

            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">
              100% Audited Generator & Power Continuity
            </h3>

            <p className="text-sm text-[#A5D1E1] leading-relaxed">
              In Lagos, Abuja, and Port Harcourt, grid fluctuations disrupt meetings and rest. Every hotel in our directory maintains dual heavy diesel generation systems with automatic changeover under 8 seconds. We guarantee uncompromised AC, elevator operation, and high-speed Wi-Fi throughout your stay.
            </p>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-[#2B7574]/50 flex items-center justify-between text-xs font-mono text-[#F2B632]">
            <span>Zero Blackout Guarantee</span>
            <span>24/7 Verified</span>
          </div>
        </div>

        {/* Stacked Asymmetric Column 2 (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          {/* Top Row: Direct Carrier GDS */}
          <div className="rounded-3xl bg-white dark:bg-[#0E2931]/70 border border-[#2B7574]/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300">
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2B7574] dark:text-[#F2B632]">
                <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                <span>DIRECT AMADEUS / SABRE EMISSION</span>
              </div>
              <h4 className="font-display text-xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                Instant Seat Allocation & Real-Time E-Tickets
              </h4>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] leading-relaxed">
                We do not batch ticketing through sub-agents. Your reservation connects directly to airline reservation inventories with immediate PNR generation and verifiable airline check-in codes.
              </p>
            </div>
            <div className="shrink-0 bg-[#0E2931] text-[#F2B632] px-4 py-3 rounded-xl font-mono text-center">
              <span className="block text-xl font-bold tabular-nums">&lt;45s</span>
              <span className="text-[10px] uppercase text-[#A5D1E1]">Issuance</span>
            </div>
          </div>

          {/* Middle Row: Fair Financing Ethics */}
          <div className="rounded-3xl bg-white dark:bg-[#0E2931]/70 border border-[#2B7574]/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300">
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2B7574] dark:text-[#F2B632]">
                <Award className="w-4 h-4 stroke-[1.5]" />
                <span>ETHICAL TRAVEL CREDIT</span>
              </div>
              <h4 className="font-display text-xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                Zero Prepayment Penalty & Fixed Flat Rates
              </h4>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] leading-relaxed">
                Unlike predatory digital lenders, Aerovista’s Fly Now Pay Later publishes all APR schedules upfront. If you settle early, all unaccrued interest is cancelled immediately.
              </p>
            </div>
            <div className="shrink-0 bg-[#0E2931] text-[#F2B632] px-4 py-3 rounded-xl font-mono text-center">
              <span className="block text-xl font-bold tabular-nums">0%</span>
              <span className="text-[10px] uppercase text-[#A5D1E1]">Early Fees</span>
            </div>
          </div>

          {/* Bottom Row: Human Flight Concierge */}
          <div className="rounded-3xl bg-white dark:bg-[#0E2931]/70 border border-[#2B7574]/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(18,72,76,0.3)] transition-all duration-300">
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2B7574] dark:text-[#F2B632]">
                <HeartHandshake className="w-4 h-4 stroke-[1.5]" />
                <span>GROUND RAPID RESPONSE</span>
              </div>
              <h4 className="font-display text-xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                Dedicated Airport Concierge at Major Terminals
              </h4>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] leading-relaxed">
                Stationed desks at Lagos MM2, Abuja Nnamdi Azikiwe, and Accra Kotoka ready to assist with luggage handling, priority security escort, and fast gate re-routing during delays.
              </p>
            </div>
            <div className="shrink-0 bg-[#0E2931] text-[#F2B632] px-4 py-3 rounded-xl font-mono text-center">
              <span className="block text-xl font-bold tabular-nums">24/7</span>
              <span className="text-[10px] uppercase text-[#A5D1E1]">Desk Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
