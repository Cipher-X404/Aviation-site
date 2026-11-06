import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Moon, Sun, Smartphone, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveRoute, setSupportOpen, theme, setTheme } = useAppStore();

  const go = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menuLinks = [
    { label: 'Home', action: () => go('/') },
    { label: 'Flights', action: () => go('/flights') },
    { label: 'Hotels', action: () => go('/hotels') },
    { label: 'Destinations', action: () => go('/destinations') },
    { label: 'Fly Now Pay Later', action: () => go('/fly-now-pay-later') },
  ];

  const navigationLinks = [
    { label: 'Contact', action: () => setSupportOpen(true) },
    { label: 'My Account', action: () => go('/account') },
    { label: 'Privacy policy', action: () => go('/') },
    { label: 'Terms of service', action: () => go('/') },
    { label: 'Customer portal', action: () => go('/account') },
  ];

  const partnerLinks = [
    { label: 'IATA.org', href: 'https://www.iata.org' },
    { label: 'AirPeace.ng', href: 'https://flyairpeace.com' },
    { label: 'IbomAir.com', href: 'https://ibomair.com' },
    { label: 'EkoHotels.com', href: 'https://ekohotels.com' },
    { label: 'Transcorp.com', href: 'https://transcorphotels.com' },
    { label: 'Amadeus.com', href: 'https://amadeus.com' },
    { label: 'FlightRadar24', href: 'https://flightradar24.com' },
  ];

  return (
    <footer className="w-full relative overflow-hidden bg-[#F4F6F5] dark:bg-[#08181D] transition-colors select-none">
      {/* ── Top content panel ── */}
      <div className="relative z-10 border-t border-[#E2E2E0] dark:border-[#18363F]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-8 sm:pb-12">

          {/* 
              Layout mirrors the reference image exactly:
              Left block (logo + tagline + description + CTA + copyright + credit)
              Right block (3 columns: Menu | Navigation | Partners)
          */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-6 xl:gap-0 justify-between">

            {/* ── LEFT BLOCK ── */}
            <div className="flex flex-col gap-4 max-w-[320px] shrink-0">
              {/* Logo row */}
              <div className="flex items-center gap-2.5">
                {/* Small plane icon badge — mirrors the app icon in reference */}
                <div className="w-8 h-8 rounded-[8px] bg-[#0E2931] dark:bg-[#EAEFEF] flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-[#F2B632]" />
                </div>
                <span className="text-[15px] font-semibold text-[#0E2931] dark:text-[#EAEFEF] tracking-tight">
                  Aerovista
                </span>
              </div>

              {/* Tagline */}
              <p className="text-[15px] sm:text-[16px] font-semibold leading-snug text-[#0E2931] dark:text-[#EAEFEF]">
                Your sovereign flight &amp; stay platform
              </p>

              {/* Description */}
              <p className="text-[13px] leading-[1.7] text-[#6B7C82] dark:text-[#849CA3]">
                Aerovista brings direct GDS flight booking, verified hotel sanctuaries, tarmac chauffeur transfers, and 0% APR Fly Now Pay Later — all in one place beside your travel ambitions.
              </p>

              {/* CTA button — "Download for Android" replaces "Download for macOS" */}
              <div className="mt-1">
                <button
                  onClick={() => go('/fly-now-pay-later')}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#0E2931] dark:bg-[#EAEFEF] text-[#F4F6F5] dark:text-[#0E2931] text-[13px] font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                  aria-label="Download Aerovista for Android"
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  Download for Android
                </button>
              </div>

              {/* Copyright */}
              <p className="text-[12px] text-[#9AAFB5] dark:text-[#5a7580] mt-1">
                © 2026 Aerovista · All rights reserved
              </p>

              {/* "Built with" credit row */}
              <div className="flex items-center gap-1.5 text-[12px] text-[#9AAFB5] dark:text-[#5a7580]">
                <span>Built with</span>
                <span className="text-[#e05252]">♥</span>
                <span>by</span>
                {/* Theme toggle lives here, subtle, like the reference */}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label="Toggle visual theme"
                  className="inline-flex items-center gap-1 ml-0.5 text-[#9AAFB5] hover:text-[#0E2931] dark:text-[#5a7580] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-[#F2B632]" />
                  ) : (
                    <Moon className="w-3.5 h-3.5" />
                  )}
                  <span className="font-medium text-[#0E2931] dark:text-[#EAEFEF]">Aerovista Team</span>
                </button>
              </div>
            </div>

            {/* ── RIGHT BLOCK: 3 link columns ── */}
            {/* On mobile: 2-col grid (Menu + Navigation) then Partners below.
                On sm: 3-col grid.
                On lg: flex row pushed right. */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-14 xl:gap-20">

              {/* Column 1 — Menu */}
              <div>
                <h4 className="text-[13px] font-semibold text-[#0E2931] dark:text-[#EAEFEF] mb-3.5 tracking-tight">
                  Menu
                </h4>
                <ul className="space-y-2.5">
                  {menuLinks.map((l) => (
                    <li key={l.label}>
                      <button
                        onClick={l.action}
                        className="text-[13px] text-[#6B7C82] dark:text-[#849CA3] hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer text-left"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2 — Navigation */}
              <div>
                <h4 className="text-[13px] font-semibold text-[#0E2931] dark:text-[#EAEFEF] mb-3.5 tracking-tight">
                  Navigation
                </h4>
                <ul className="space-y-2.5">
                  {navigationLinks.map((l) => (
                    <li key={l.label}>
                      <button
                        onClick={l.action}
                        className="text-[13px] text-[#6B7C82] dark:text-[#849CA3] hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer text-left"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 — Partners / More */}
              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-[13px] font-semibold text-[#0E2931] dark:text-[#EAEFEF] mb-3.5 tracking-tight">
                  Partners
                </h4>
                <ul className="space-y-2.5">
                  {partnerLinks.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-[#6B7C82] dark:text-[#849CA3] hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── WATERMARK — Edge-to-edge debossed wordmark, exactly as before ── */}
      {/*
          This recreates the large "Cooldock" text at the bottom of the reference image.
          The wordmark bleeds off the bottom edge, sitting on top of a scenic backdrop.
          In light mode: debossed / inset on paper.
          In dark mode: dark inset on deep navy.
      */}
      <div className="relative w-full overflow-hidden leading-none flex items-end justify-center pointer-events-none pb-0">
        {/* Scenic sky gradient behind the wordmark — mirrors the rolling hills backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(214,218,212,0.55) 40%, rgba(190,198,188,0.8) 100%)',
          }}
        />
        <div className="dark:hidden absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(214,218,212,0.55) 40%, rgba(190,198,188,0.8) 100%)',
          }}
        />
        <div className="hidden dark:block absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(8,24,29,0.55) 40%, rgba(8,24,29,0.85) 100%)',
          }}
        />

        {/* Light streak sheen overlay */}
        <div className="trove-light-streaks absolute inset-0 z-10 opacity-75 dark:opacity-40" />

        {/* The carved AEROVISTA wordmark */}
        <h2
          className="font-monument trove-debossed font-bold tracking-tight text-center w-full uppercase transition-all"
          style={{
            fontSize: 'clamp(72px, 22vw, 340px)',
            lineHeight: 0.85,
            marginBottom: 'clamp(-24px, -5.5vw, -72px)',
          }}
        >
          AEROVISTA
        </h2>
      </div>
    </footer>
  );
};
