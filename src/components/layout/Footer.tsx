import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Moon, Sun } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveRoute, setSupportOpen, theme, setTheme } = useAppStore();

  const go = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menuLinks = [
    { label: 'Home',             action: () => go('/') },
    { label: 'Flights',          action: () => go('/flights') },
    { label: 'Hotels',           action: () => go('/hotels') },
    { label: 'Destinations',     action: () => go('/destinations') },
    { label: 'Fly Now Pay Later',action: () => go('/fly-now-pay-later') },
  ];

  const navigationLinks = [
    { label: 'Contact',          action: () => setSupportOpen(true) },
    { label: 'My account',       action: () => go('/account') },
    { label: 'Privacy policy',   action: () => go('/') },
    { label: 'Terms of service', action: () => go('/') },
    { label: 'Customer portal',  action: () => go('/account') },
  ];

  const moreLinks = [
    { label: 'IATA.org',         href: 'https://www.iata.org' },
    { label: 'AirPeace.ng',      href: 'https://flyairpeace.com' },
    { label: 'IbomAir.com',      href: 'https://ibomair.com' },
    { label: 'EkoHotels.com',    href: 'https://ekohotels.com' },
    { label: 'Transcorp.com',    href: 'https://transcorphotels.com' },
    { label: 'Amadeus.com',      href: 'https://amadeus.com' },
    { label: 'FlightRadar24',    href: 'https://flightradar24.com' },
  ];

  return (
    <footer className="w-full relative overflow-hidden select-none">

      {/* ─────────────────────────────────────────────────────────────
          BACKGROUND — scenic sky/landscape image that the content
          and the watermark both sit on top of, just like the reference.
          Light mode: warm misty hills. Dark mode: deep teal night sky.
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {/* Light-mode scenic gradient (warm olive-cream hills) */}
        <div
          className="absolute inset-0 dark:opacity-0 transition-opacity duration-500"
          style={{
            background: `
              radial-gradient(ellipse 120% 60% at 50% 120%, rgba(168,178,120,0.55) 0%, transparent 65%),
              radial-gradient(ellipse 80% 50% at 20% 100%, rgba(195,188,140,0.4) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 100%, rgba(140,160,110,0.35) 0%, transparent 55%),
              linear-gradient(to bottom, #F4F6F5 0%, #eceee8 35%, #dde0d4 65%, #cdd1c0 100%)
            `,
          }}
        />
        {/* Dark-mode scenic gradient (deep teal night) */}
        <div
          className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500"
          style={{
            background: `
              radial-gradient(ellipse 120% 60% at 50% 120%, rgba(18,72,76,0.6) 0%, transparent 65%),
              radial-gradient(ellipse 80% 50% at 20% 100%, rgba(12,52,58,0.5) 0%, transparent 60%),
              linear-gradient(to bottom, #08181D 0%, #09191f 35%, #0b2028 65%, #0d2530 100%)
            `,
          }}
        />
        {/* Subtle topographic texture */}
        <div className="absolute inset-0 bg-topo opacity-30" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TOP CONTENT — logo + description left, 3 link columns right
          Matches the reference image layout exactly.
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-[#0E2931]/10 dark:border-[#EAEFEF]/8">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-10 sm:pt-14 pb-10 sm:pb-14">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-10 lg:gap-8">

            {/* ── LEFT: Brand block ── */}
            <div className="flex flex-col gap-3 max-w-[280px] shrink-0">

              {/* Wordmark Logo — same style as Navbar */}
              <div className="flex flex-col leading-none mb-1">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-[26px] font-black italic tracking-tight text-[#0E2931] dark:text-[#F2B632]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    CJ
                  </span>
                  <span className="text-[12px] font-bold tracking-[0.28em] uppercase text-[#0E2931] dark:text-[#EAEFEF]">
                    TRAVELS
                  </span>
                </div>
                <span className="text-[8px] font-mono tracking-[0.35em] uppercase text-[#2B7574] dark:text-[#A5D1E1] -mt-0.5">
                  ✦ OWERRI ✦
                </span>
              </div>

              {/* Tagline */}
              <p className="text-[14px] sm:text-[15px] font-semibold leading-snug text-[#0E2931] dark:text-[#EAEFEF]">
                Your sovereign flight &amp; stay platform
              </p>

              {/* Description */}
              <p className="text-[12.5px] leading-[1.75] text-[#5A6B70] dark:text-[#849CA3]">
                CJ Travels Owerri brings direct GDS flight booking, verified hotel sanctuaries, tarmac chauffeur transfers, and 0% APR Fly Now Pay Later — all in one place beside your original travel ambitions.
              </p>

              {/* Copyright — sits directly under description, no button above it */}
              <p className="text-[11.5px] text-[#8A9DA3] dark:text-[#4a6570] mt-1">
                © 2026 CJ Travels Owerri · All rights reserved
              </p>

              {/* "Built with ♥ by" row with subtle theme toggle */}
              <div className="flex items-center gap-1 text-[11.5px] text-[#8A9DA3] dark:text-[#4a6570]">
                <span>Built with</span>
                <span className="text-[#d94f4f] mx-0.5">♥</span>
                <span>by</span>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label="Toggle visual theme"
                  className="inline-flex items-center gap-1 ml-0.5 hover:opacity-75 transition-opacity cursor-pointer"
                >
                  {theme === 'dark'
                    ? <Sun className="w-3 h-3 text-[#F2B632]" />
                    : <Moon className="w-3 h-3 text-[#5A6B70]" />
                  }
                  <span className="text-[#0E2931] dark:text-[#EAEFEF] font-medium">
                    CJ Travels Team
                  </span>
                </button>
              </div>
            </div>

            {/* ── RIGHT: 3 link columns ── */}
            {/*
                Mobile  (< sm):  stack vertically, full width each
                sm–md   (sm–lg): 3-col grid
                lg+:            flex row, pushed to the right
            */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-16 xl:gap-24">

              {/* Column 1 — Menu */}
              <div>
                <h4 className="text-[12.5px] font-semibold text-[#0E2931] dark:text-[#EAEFEF] mb-4 tracking-wide">
                  Menu
                </h4>
                <ul className="space-y-[10px]">
                  {menuLinks.map((l) => (
                    <li key={l.label}>
                      <button
                        onClick={l.action}
                        className="text-[12.5px] text-[#5A6B70] dark:text-[#849CA3] hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer text-left leading-snug"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2 — Navigation */}
              <div>
                <h4 className="text-[12.5px] font-semibold text-[#0E2931] dark:text-[#EAEFEF] mb-4 tracking-wide">
                  Navigation
                </h4>
                <ul className="space-y-[10px]">
                  {navigationLinks.map((l) => (
                    <li key={l.label}>
                      <button
                        onClick={l.action}
                        className="text-[12.5px] text-[#5A6B70] dark:text-[#849CA3] hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer text-left leading-snug"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 — More products (Partners in CJ Travels context) */}
              {/* On mobile this spans both cols so it sits as a full-width row */}
              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-[12.5px] font-semibold text-[#0E2931] dark:text-[#EAEFEF] mb-4 tracking-wide">
                  More partners
                </h4>
                <ul className="space-y-[10px]">
                  {moreLinks.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12.5px] text-[#5A6B70] dark:text-[#849CA3] hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors leading-snug"
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

      {/* ─────────────────────────────────────────────────────────────
          WATERMARK — luxury stroke-only outlined wordmark.
          Hollow letters with a thin stroke — no fill, no solid mass.
          Much more refined than a debossed block.
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full overflow-hidden leading-none flex items-end justify-center pointer-events-none">

        <h2
          className="font-monument wm-footer font-black text-center w-full uppercase tracking-[-0.03em]"
          style={{
            fontSize: 'clamp(68px, 22vw, 380px)',
            lineHeight: 0.82,
            marginBottom: 'clamp(-20px, -5vw, -76px)',
          }}
        >
          CJ TRAVELS
        </h2>
      </div>

      {/* Bottom padding so the wordmark has space */}
      <div className="relative z-10 h-[clamp(14px,4vw,56px)]" />
    </footer>
  );
};
