import React from 'react';
import { ShieldCheck, Zap, Globe, CreditCard, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface TrustPillar {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge: string;
  routeTarget?: string;
}

const TRUST_PILLARS: TrustPillar[] = [
  {
    icon: ShieldCheck,
    title: 'Compare flight options',
    subtitle: 'Browse sample routes and compare the details shown for each option.',
    badge: 'IATA DIRECT',
    routeTarget: '/flights',
  },
  {
    icon: Globe,
    title: 'Explore destinations',
    subtitle: 'Browse destination ideas, from nearby city breaks to longer journeys.',
    badge: 'DESTINATION IDEAS',
    routeTarget: '/destinations',
  },
  {
    icon: Zap,
    title: 'Find a place to stay',
    subtitle: 'Compare example properties, locations and listed amenities. Confirm details with each hotel.',
    badge: 'PROPERTY DETAILS VARY',
    routeTarget: '/hotels',
  },
  {
    icon: CreditCard,
    title: 'See payment examples',
    subtitle: 'Try the sample calculator to see how a trip cost changes across different terms.',
    badge: 'EXAMPLE CALCULATOR',
    routeTarget: '/fly-now-pay-later',
  },
];

export const TrustMarquee: React.FC = () => {
  const { setActiveRoute } = useAppStore();

  return (
    <section className="relative w-full bg-[#09171C] text-[#F4F6F5] py-12 sm:py-16 border-y border-[#18363F] overflow-hidden">
      {/* Ambient background glow & topography */}
      <div className="bg-topo absolute inset-0 opacity-15 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#12484C]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2B7574]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean, spacious header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12484C]/60 border border-[#2B7574]/40 text-[10px] font-mono text-[#F2B632] uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>TRAVEL PLANNING · SAMPLE LISTINGS</span>
          </div>

          <h3 className="font-monument text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-[#F4F6F5]">
            A clearer way to plan a trip
          </h3>
          <p className="text-xs sm:text-sm text-[#A5D1E1]/80 font-light leading-relaxed">
            Explore sample flights, stays and payment options. Check with providers before making travel or financial decisions.
          </p>
        </div>

        {/* 4 Spacious, Elegant Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                role="link"
                tabIndex={0}
                onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && pillar.routeTarget) { event.preventDefault(); setActiveRoute(pillar.routeTarget); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
                onClick={() => { if (pillar.routeTarget) { setActiveRoute(pillar.routeTarget); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
                className="group relative p-6 rounded-2xl bg-[#0E2931]/60 hover:bg-[#12484C]/50 border border-[#2B7574]/30 hover:border-[#F2B632]/50 transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#12484C] group-hover:bg-[#F2B632] text-[#F2B632] group-hover:text-[#0E2931] flex items-center justify-center transition-colors duration-300 border border-[#2B7574]/40">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-[#F2B632] px-2 py-0.5 rounded bg-black/40 border border-[#2B7574]/30">
                    {pillar.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h4 className="font-monument text-sm font-bold text-[#F4F6F5] uppercase group-hover:text-[#F2B632] transition-colors mb-2">
                  {pillar.title}
                </h4>
                <p className="text-xs text-[#A5D1E1]/70 leading-relaxed font-light">
                  {pillar.subtitle}
                </p>

                {/* Subtle hover indicator beam */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#F2B632] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            );
          })}
        </div>

        {/* Bottom subtle trust metrics strip */}
        <div className="mt-10 pt-6 border-t border-[#18363F]/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#A5D1E1]/70">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Example flight listings</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#F2B632]" />
            <span>Payment examples only</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Help exploring this demo</span>
          </div>
        </div>
      </div>
    </section>
  );
};
