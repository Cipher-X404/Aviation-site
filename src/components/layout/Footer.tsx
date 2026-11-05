import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Moon, Sun } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveRoute, theme, setTheme } = useAppStore();

  return (
    <footer className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border-t border-[#E2E2E0] dark:border-[#18363F] pt-12 sm:pt-16 relative overflow-hidden transition-colors select-none">
      {/* Top 2-Column Editorial Attribution & Controls (Exact Trove Layout) */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16 mb-12 sm:mb-16">
        {/* Left Column: Understated Editorial Attribution */}
        <div className="max-w-xl text-[12px] sm:text-[13px] text-[#7A8B90] dark:text-[#849CA3] leading-[1.65]">
          <p>
            The work on this page belongs to the people who made it: Aerovista Royal Flight Ops,
            Air Peace, Ibom Air, Eko Hotels & Suites, Transcorp Hilton, Amadeus GDS, IATA,
            and independent architectural sanctuaries found across West Africa and global transit corridors.
            Each route and sanctuary links to where it came from. If one is yours and you&apos;d like it
            off this page or modified, write to{' '}
            <a
              href="mailto:concierge@aerovista.quest"
              className="text-[#0E2931] dark:text-[#EAEFEF] underline hover:text-[#2B7574] transition-colors"
            >
              concierge@aerovista.quest
            </a>
            .
          </p>
        </div>

        {/* Right Column: Terms, Privacy, Copyright, Theme Toggle & Monogram */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-end gap-6 sm:gap-10 text-[12px] sm:text-[13px] text-[#7A8B90] dark:text-[#849CA3]">
          <div className="flex items-center gap-5">
            <button
              onClick={() => {
                setActiveRoute('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => {
                setActiveRoute('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer"
            >
              Privacy
            </button>
          </div>

          <div className="whitespace-nowrap">
            © 2026 Aerovista. All rights reserved.
          </div>

          {/* Action Glyphs (Moon/Sun Theme + Monogram X) */}
          <div className="flex items-center gap-3">
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

            <span className="font-serif font-bold text-sm tracking-tight text-[#7A8B90] dark:text-[#849CA3] hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer select-none">
              𝕏
            </span>
          </div>
        </div>
      </div>

      {/* Monumental Edge-to-Edge Debossed 3D Sculpted Wordmark (Exact Trove Match) */}
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
