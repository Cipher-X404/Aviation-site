import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Moon,
  Sun,
  Plane,
  Hotel,
  MapPin,
  CreditCard,
  User,
  LifeBuoy,
  Send,
  Check,
  ArrowUp,
} from 'lucide-react';

interface FooterLink {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route?: string;
  action?: () => void;
}

export const Footer: React.FC = () => {
  const { setActiveRoute, setSupportOpen, theme, setTheme } = useAppStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const go = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exploreLinks: FooterLink[] = [
    { label: 'Flight Corridors', route: '/flights', icon: Plane },
    { label: 'Sanctuary Suites', route: '/hotels', icon: Hotel },
    { label: 'Destinations Atlas', route: '/destinations', icon: MapPin },
    { label: 'Fly Now Pay Later', route: '/fly-now-pay-later', icon: CreditCard },
  ];

  const conciergeLinks: FooterLink[] = [
    { label: 'My Account', route: '/account', icon: User },
    { label: '24/7 Ground Concierge', action: () => setSupportOpen(true), icon: LifeBuoy },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4500);
  };

  return (
    <footer className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border-t border-[#E2E2E0] dark:border-[#18363F] relative overflow-hidden transition-colors select-none">
      {/* Top golden laser accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#F2B632]/70 to-transparent" />

      {/* Main Footer Grid */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 pt-12 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="font-monument font-bold text-2xl tracking-tight text-[#0E2931] dark:text-[#EAEFEF]">
                𝕏
              </span>
              <span className="font-display text-lg font-semibold tracking-wide text-[#0E2931] dark:text-[#EAEFEF] uppercase">
                Aerovista
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-[#7A8B90] dark:text-[#849CA3] max-w-sm mb-5">
              Sovereign air corridors and sanctuary expeditions across West Africa and global transit hubs.
              Direct GDS interconnects, zero agent surcharges, runway-to-suite choreography.
            </p>
            {/* Social Monograms */}
            <div className="flex items-center gap-2.5">
              {['𝕏', '◉', '✦'].map((g, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={`Aerovista social link ${i + 1}`}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-[#2B7574]/30 dark:border-[#18363F] text-[#7A8B90] dark:text-[#849CA3] hover:text-[#F2B632] hover:border-[#F2B632]/60 transition-all duration-300 text-sm cursor-pointer"
                >
                  {g}
                </a>
              ))}
            </div>
          </div>

          {/* Explore Column */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2B7574] dark:text-[#3BA09E] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <button
                      onClick={() => link.route && go(link.route)}
                      className="group flex items-center gap-2 text-[13px] text-[#5A6B70] dark:text-[#9AAFB5] hover:text-[#0E2931] dark:hover:text-[#F2B632] transition-colors cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#2B7574] dark:text-[#3BA09E] group-hover:text-[#F2B632] transition-colors" />
                      <span>{link.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Concierge Column */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2B7574] dark:text-[#3BA09E] mb-4">
              Concierge
            </h4>
            <ul className="space-y-2.5">
              {conciergeLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <button
                      onClick={() => (link.action ? link.action() : link.route && go(link.route))}
                      className="group flex items-center gap-2 text-[13px] text-[#5A6B70] dark:text-[#9AAFB5] hover:text-[#0E2931] dark:hover:text-[#F2B632] transition-colors cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#2B7574] dark:text-[#3BA09E] group-hover:text-[#F2B632] transition-colors" />
                      <span>{link.label}</span>
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() => go('/')}
                  className="group flex items-center gap-2 text-[13px] text-[#5A6B70] dark:text-[#9AAFB5] hover:text-[#0E2931] dark:hover:text-[#F2B632] transition-colors cursor-pointer"
                >
                  <span className="w-3.5 h-3.5" />
                  <span>Terms &amp; Privacy</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Flight Log Newsletter Column */}
          <div className="lg:col-span-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2B7574] dark:text-[#3BA09E] mb-4">
              Flight Log Dispatch
            </h4>
            <p className="text-[13px] leading-relaxed text-[#7A8B90] dark:text-[#849CA3] mb-4 max-w-sm">
              Priority corridor openings, fare advisories, and sanctuary releases — delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@dispatch.email"
                className="w-full bg-[#ECEEEB] dark:bg-[#051114] border border-[#E2E2E0] dark:border-[#18363F] rounded-xl pl-4 pr-12 py-3 text-[13px] text-[#0E2931] dark:text-[#EAEFEF] placeholder-[#9AAFB5]/50 dark:placeholder-[#A5D1E1]/30 focus:outline-none focus:border-[#F2B632] transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe to flight log"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-gold p-2 rounded-lg flex items-center justify-center cursor-pointer"
              >
                {subscribed ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Send className="w-4 h-4 stroke-[2]" />}
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-[11px] font-mono text-[#2B7574] dark:text-[#3BA09E] flex items-center gap-1.5">
                <Check className="w-3 h-3" /> Cleared for dispatch. Welcome aboard.
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#E2E2E0] dark:bg-[#18363F] my-8" />

        {/* Attribution + Controls Bottom Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-10">
          {/* Editorial Attribution */}
          <p className="max-w-xl text-[11px] sm:text-[12px] text-[#7A8B90] dark:text-[#849CA3] leading-[1.65]">
            The work on this page belongs to the people who made it: Aerovista Royal Flight Ops,
            Air Peace, Ibom Air, Eko Hotels &amp; Suites, Transcorp Hilton, Amadeus GDS, IATA,
            and independent architectural sanctuaries found across West Africa and global transit corridors.
            Each route and sanctuary links to where it came from. If one is yours and you&apos;d like it
            off this page or modified, write to{' '}
            <a
              href="mailto:concierge@aerovista.quest"
              className="text-[#0E2931] dark:text-[#EAEFEF] underline hover:text-[#2B7574] dark:hover:text-[#F2B632] transition-colors"
            >
              concierge@aerovista.quest
            </a>
            .
          </p>

          {/* Right Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-[12px] text-[#7A8B90] dark:text-[#849CA3] shrink-0">
            <div className="flex items-center gap-5">
              <button
                onClick={() => go('/')}
                className="hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer"
              >
                Terms
              </button>
              <button
                onClick={() => go('/')}
                className="hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer"
              >
                Privacy
              </button>
            </div>
            <div className="whitespace-nowrap">© 2026 Aerovista</div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle visual theme"
              className="p-1 rounded text-[#7A8B90] hover:text-[#0E2931] dark:text-[#849CA3] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F2B632] stroke-[1.8]" />
              ) : (
                <Moon className="w-4 h-4 stroke-[1.8] fill-current" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Monumental Edge-to-Edge Debossed 3D Sculpted Wordmark (WATERMARK — PRESERVED) ── */}
      <div className="relative w-full overflow-hidden leading-none flex items-end justify-center pointer-events-none pb-0">
        {/* Diagonal Light Streak Rays Sheen */}
        <div className="trove-light-streaks absolute inset-0 z-10 opacity-75 dark:opacity-40" />

        {/* The Carved Wordmark: Scaled to span full width and cut off at baseline */}
        <h2 className="font-monument trove-debossed text-[18vw] sm:text-[20vw] lg:text-[22vw] font-bold tracking-tight text-center w-full uppercase -mb-[5vw] sm:-mb-[6vw] transition-all">
          AEROVISTA
        </h2>
      </div>
    </footer>
  );
};
