import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Moon, Sun, ArrowRight, X, ChevronDown, Search, Radio,
} from 'lucide-react';
import { SearchModal } from '../search/SearchModal';
import { DESTINATION_IMAGES, HOTEL_IMAGES } from '../../data/images';

/* ─── Tab Data Structure ─── */
interface MegaTab {
  id: string;
  label: string;
  image: string;
  featuredBadge: string;
  categoryTitle: string;
  links: {
    label: string;
    route: string;
    scrollTarget?: string;
  }[];
}

const MEGA_TABS: MegaTab[] = [
  {
    id: 'flights',
    label: 'Flights & Routes',
    categoryTitle: 'FLIGHTS & DESTINATIONS',
    image: '/hero/desktop/f_001.webp',
    featuredBadge: 'LIVE CORRIDORS',
    links: [
      { label: 'Search & compare flights', route: '/flights' },
      { label: 'Destinations & travel notes', route: '/destinations' },
      { label: 'Animated route map', route: '/', scrollTarget: 'live-radar-section' },
      { label: 'Private Fleet & Cabins', route: '/', scrollTarget: 'fleet-showcase-section' },
    ],
  },
  {
    id: 'hotels',
    label: 'Hotels & Stays',
    categoryTitle: 'PLACES TO STAY',
    image: HOTEL_IMAGES['hotel-eko-grand'].fallback,
    featuredBadge: 'VERIFIED PROPERTIES',
    links: [
      { label: 'Hotels & Sanctuary Suites', route: '/hotels' },
      { label: 'Flight + Hotel Bundles', route: '/', scrollTarget: 'bundle-showcase-section' },
      { label: 'Airport transfers', route: '/hotels' },
    ],
  },
  {
    id: 'finance',
    label: 'Payment plans',
    categoryTitle: 'PAYMENT EXAMPLES',
    image: DESTINATION_IMAGES.LOS.fallback,
    featuredBadge: 'FNPL · 0% APR',
    links: [
      { label: 'Fly Now Pay Later Console', route: '/fly-now-pay-later' },
      { label: 'Payment examples', route: '/fly-now-pay-later' },
      { label: 'My Trips & Boarding Passes', route: '/account' },
    ],
  },
];

/* ─── Mobile Menu Link Data ─── */
const MOBILE_LINKS = [
  { section: '01 // AIRWAYS', items: [
    { label: 'Flights', route: '/flights' },
    { label: 'Destinations', route: '/destinations' },
    { label: 'Route map', route: '/', scrollTarget: 'live-radar-section' },
    { label: 'Fleet & Cabins', route: '/', scrollTarget: 'fleet-showcase-section' },
  ] },
  { section: '02 // SANCTUARIES', items: [
    { label: 'Hotels', route: '/hotels' },
    { label: 'Bundles', route: '/', scrollTarget: 'bundle-showcase-section' },
  ] },
  { section: '03 // FINANCE', items: [
    { label: 'Pay Later', route: '/fly-now-pay-later' },
    { label: 'My Trips', route: '/account' },
  ] },
  { section: '04 // OPERATIONS', items: [
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' },
    { label: 'Deals & Offers', route: '/deals' },
    { label: 'Group Bookings', route: '/group-bookings' },
  ] },
];

export const Navbar: React.FC = () => {
  const {
    activeRoute,
    setActiveRoute,
    currency,
    setCurrency,
    theme,
    setTheme,
    currentUser,
    setAuthModalOpen,
  } = useAppStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [apertureOpen, setApertureOpen] = useState(false);

  // Mega Dropdown State
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [megaAnimating, setMegaAnimating] = useState(false);
  const [tabFading, setTabFading] = useState(false);
  const dropdownLeaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Side Drawer State (for secondary items on desktop)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  /* ─── Scroll hide/show ─── */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      if (currentScrollY > 200) {
        if (currentScrollY > lastScrollY + 8 && !apertureOpen && !isMegaOpen) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY - 8) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, apertureOpen, isMegaOpen]);

  /* ─── Theme sync ─── */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  /* ─── Body scroll lock ─── */
  useEffect(() => {
    if (apertureOpen || isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [apertureOpen, isDrawerOpen]);

  /* ─── Mega dropdown hover handlers ─── */
  const handleDropdownEnter = () => {
    if (dropdownLeaveTimeout.current) {
      clearTimeout(dropdownLeaveTimeout.current);
    }
    if (!isMegaOpen) {
      setMegaAnimating(true);
      setIsMegaOpen(true);
      setTimeout(() => setMegaAnimating(false), 350);
    }
  };

  const handleDropdownLeave = () => {
    dropdownLeaveTimeout.current = setTimeout(() => {
      setIsMegaOpen(false);
    }, 280);
  };

  /* ─── Tab switch with crossfade ─── */
  const switchTab = (index: number) => {
    if (index === activeTabIndex) return;
    setTabFading(true);
    setTimeout(() => {
      setActiveTabIndex(index);
      setTabFading(false);
    }, 180);
  };

  /* ─── Navigation ─── */
  const navigateTo = (route: string, scrollTargetId?: string) => {
    setIsMegaOpen(false);
    setApertureOpen(false);
    setIsDrawerOpen(false);
    setActiveRoute(route);

    if (scrollTargetId) {
      let attempts = 0;
      const findTarget = () => {
        const el = document.getElementById(scrollTargetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else if (attempts++ < 60) requestAnimationFrame(findTarget);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      requestAnimationFrame(findTarget);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeTab = MEGA_TABS[activeTabIndex];

  return (
    <>
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* ═══════════════════════════════════════════════════════════════
          HEADER BAR
          Desktop layout: [Logo] ---- [Explore ▼] ---- [🔍] [Book Flight] [☰]
          Much more spacious and clean.
         ═══════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } ${
          isScrolled
            ? 'py-2 px-3 sm:px-6'
            : 'py-3.5 sm:py-5 px-3 sm:px-8'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 border ${
            isScrolled
              ? 'bg-[#F4F6F5]/95 dark:bg-[#08181D]/92 backdrop-blur-2xl border-[#E2E2E0] dark:border-[#18363F] shadow-lg shadow-[#0E2931]/8'
              : 'bg-[#0E2931]/75 dark:bg-[#061216]/75 backdrop-blur-xl border-[#2B7574]/25 text-[#F4F6F5] shadow-2xl'
          }`}
        >
          {/* ─── Brand Logo ─── */}
          <button
            onClick={() => navigateTo('/')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
          >
            {/* CJ Travels Owerri — Wordmark Logo */}
            <div className="flex flex-col leading-none">
              {/* Top line: "CJ" large + "Travels" */}
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`font-serif text-2xl sm:text-[26px] lg:text-[28px] font-black italic tracking-tight transition-colors ${
                    isScrolled ? 'text-[#0E2931] dark:text-[#F2B632]' : 'text-[#F2B632]'
                  }`}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  CJ
                </span>
                <span
                  className={`text-[11px] sm:text-[13px] font-bold tracking-[0.28em] uppercase transition-colors ${
                    isScrolled ? 'text-[#0E2931] dark:text-[#EAEFEF]' : 'text-[#F4F6F5]'
                  }`}
                >
                  TRAVELS
                </span>
              </div>
              {/* Bottom line: "OWERRI" — small mono tag */}
              <span
                className={`text-[7px] sm:text-[8px] font-mono tracking-[0.35em] uppercase -mt-0.5 transition-colors ${
                  isScrolled
                    ? 'text-[#2B7574] dark:text-[#A5D1E1]'
                    : 'text-[#A5D1E1]/80'
                }`}
              >
                ✦ OWERRI ✦
              </span>
            </div>
          </button>

          {/* ─── Desktop Center: Explore Mega Dropdown Trigger (Clean Transparent Nav Link) ─── */}
          <div
            className="hidden lg:flex items-center"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              onClick={() => {
                if (isMegaOpen) {
                  setIsMegaOpen(false);
                } else {
                  setMegaAnimating(true);
                  setIsMegaOpen(true);
                  setTimeout(() => setMegaAnimating(false), 350);
                }
              }}
              className={`group/nav relative py-2 px-3 rounded-lg text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer bg-transparent border-0 select-none ${
                isMegaOpen
                  ? 'text-[#F2B632]'
                  : isScrolled
                  ? 'text-[#0E2931] dark:text-[#EAEFEF] hover:text-[#F2B632]'
                  : 'text-[#F4F6F5] hover:text-[#F2B632]'
              }`}
              aria-expanded={isMegaOpen}
              aria-haspopup="true"
            >
              <span className="relative z-10 transition-colors duration-200">
                Explore
              </span>

              {/* Clear, Unambiguous Dropdown Chevron with Tactile Dip Animation */}
              <div className="relative flex items-center justify-center w-3.5 h-3.5">
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#F2B632] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isMegaOpen
                      ? 'rotate-180 -translate-y-0.5'
                      : 'group-hover/nav:translate-y-0.5'
                  }`}
                  strokeWidth={2.5}
                />
              </div>

              {/* Subtle golden indicator bar on hover */}
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#F2B632] to-transparent scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300" />
            </button>

            {/* ─── Extra Link: Promotions ─── */}
            <button
              type="button"
              onClick={() => navigateTo('/deals')}
              className={`group/nav relative py-2 px-3 rounded-lg text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer bg-transparent border-0 select-none ml-3 ${
                isScrolled
                  ? 'text-[#0E2931] dark:text-[#EAEFEF] hover:text-[#F2B632]'
                  : 'text-[#F4F6F5] hover:text-[#F2B632]'
              }`}
              aria-expanded="false"
            >
              <span className="relative z-10 transition-colors duration-200">
                Promotions
              </span>

              {/* Subtle golden indicator bar on hover */}
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#F2B632] to-transparent scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300" />
            </button>
          </div>

          {/* ─── Right Actions ─── */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Pill Button (ONLY this element is enlarged) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={`hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer border shadow-sm ${
                isScrolled
                  ? 'bg-[#12484C] text-[#F4F6F5] border-[#2B7574] hover:bg-[#0E2931] hover:border-[#F2B632] dark:bg-[#12484C]/40 dark:text-[#A5D1E1] dark:border-[#2B7574]/40 dark:hover:border-[#F2B632]'
                  : 'bg-[#12484C] text-[#F4F6F5] border-[#2B7574]/60 hover:bg-[#0E2931] hover:border-[#F2B632] dark:bg-white/5 dark:text-[#F4F6F5] dark:border-[#2B7574]/40'
              }`}
              title="Search the site (⌘K)"
            >
              <Search className="w-4 h-4 text-[#F2B632]" />
              <span className="text-xs sm:text-sm font-mono font-medium tracking-wide text-[#F4F6F5] dark:text-[#A5D1E1]">Search</span>
              <kbd className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#09171C]/70 text-[#F2B632] border border-[#2B7574]/50 dark:bg-black/30 dark:text-[#A5D1E1]/70 dark:border-white/10">⌘K</kbd>
            </button>

            {/* Book Flight CTA (Original Size) */}
            <button
              onClick={() => navigateTo('/flights')}
              className="btn-gold hidden lg:flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer group hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(242,182,50,0.4)] transition-all duration-200"
            >
              <span>Book Flight</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
            </button>

            {/* Desktop Hamburger → Side Drawer (Original Size with Light Mode Teal) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open settings menu"
              className={`hidden lg:flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 cursor-pointer shadow-sm ${
                isScrolled
                  ? 'bg-[#12484C] text-[#F4F6F5] border-[#2B7574] hover:bg-[#0E2931] hover:border-[#F2B632] dark:bg-[#12484C]/40 dark:text-[#EAEFEF] dark:border-[#2B7574]/40 dark:hover:border-[#F2B632]'
                  : 'bg-[#12484C] text-[#F4F6F5] border-[#2B7574]/60 hover:bg-[#0E2931] hover:border-[#F2B632] dark:bg-white/5 dark:text-[#F4F6F5] dark:border-[#2B7574]/40'
              }`}
            >
              <div className="flex flex-col gap-[3px] w-4 h-3 justify-center">
                <span className="w-full h-[1.5px] bg-current rounded-full" />
                <span className="w-3 h-[1.5px] bg-[#F2B632] rounded-full self-end" />
                <span className="w-full h-[1.5px] bg-current rounded-full" />
              </div>
            </button>

            {/* Mobile Search Button (Original Size with Light Mode Teal) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={`lg:hidden p-2 rounded-lg border cursor-pointer transition-colors shadow-sm ${
                isScrolled
                  ? 'bg-[#12484C] border-[#2B7574] text-[#F2B632] hover:bg-[#0E2931] dark:bg-white/5 dark:border-[#18363F] dark:text-[#A5D1E1]'
                  : 'bg-[#12484C] border-[#2B7574]/60 text-[#F2B632] hover:bg-[#0E2931] dark:bg-[#0E2931]/60 dark:border-[#2B7574]/40'
              }`}
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Aperture Menu Trigger (Original Size with Light Mode Teal) */}
            <button
              onClick={() => setApertureOpen(true)}
              aria-label="Open menu"
              className={`lg:hidden flex items-center gap-2 p-2 rounded-lg border transition-all duration-300 cursor-pointer shadow-sm ${
                isScrolled
                  ? 'bg-[#12484C] border-[#2B7574] text-[#F4F6F5] hover:bg-[#0E2931] dark:bg-white/5 dark:border-[#18363F] dark:text-[#A5D1E1]'
                  : 'bg-[#12484C] border-[#2B7574]/60 text-[#F4F6F5] hover:bg-[#0E2931] dark:bg-[#0E2931]/60 dark:border-[#2B7574]/40'
              }`}
            >
              <div className="flex flex-col gap-1 w-5 h-3.5 justify-between">
                <span className="w-full h-[1.5px] bg-current rounded-full" />
                <span className="w-3/4 h-[1.5px] bg-[#F2B632] rounded-full self-end" />
                <span className="w-full h-[1.5px] bg-current rounded-full" />
              </div>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            FULL-WIDTH MEGA DROPDOWN — Tab-based layout
            Slides down from navbar, full viewport width
           ═══════════════════════════════════════════════════════════════ */}
        {isMegaOpen && (
          <div
            className="hidden lg:block"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div
              className={`max-w-7xl mx-auto mt-2 rounded-2xl overflow-hidden border border-[#2B7574]/40 shadow-[0_30px_90px_rgba(0,0,0,0.7)] transition-all select-none ${
                megaAnimating
                  ? 'opacity-0 -translate-y-3'
                  : 'opacity-100 translate-y-0'
              }`}
              style={{
                transitionDuration: '350ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div className="bg-[#09171C]/97 backdrop-blur-2xl relative">
                {/* Golden top scanning laser edge */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F2B632] to-transparent" />

                {/* Header row with tabs + close button */}
                <div className="flex items-center justify-between px-8 pt-5 pb-0">
                  {/* Tabs */}
                  <div className="flex items-center gap-1">
                    {MEGA_TABS.map((tab, idx) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => switchTab(idx)}
                        className={`relative px-5 py-2.5 text-[11px] font-bold tracking-[0.12em] uppercase transition-all duration-300 rounded-t-lg cursor-pointer ${
                          idx === activeTabIndex
                            ? 'text-[#F2B632] bg-[#12484C]/40'
                            : 'text-[#A5D1E1] hover:text-[#EAEFEF] hover:bg-[#12484C]/20'
                        }`}
                      >
                        {tab.label}
                        {idx === activeTabIndex && (
                          <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#F2B632] rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Live status + close button */}
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#A5D1E1] tracking-widest">
                      <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                      LIVE INVENTORY
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsMegaOpen(false)}
                      className="w-7 h-7 rounded-full bg-[#12484C]/60 border border-[#2B7574]/50 text-[#A5D1E1] hover:text-[#F2B632] flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Close dropdown"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-8 h-px bg-[#18363F]" />

                {/* Tab Content — crossfade */}
                <div
                  className={`flex gap-0 p-6 px-8 transition-opacity duration-200 ${
                    tabFading ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ minHeight: '300px' }}
                >
                  {/* LEFT: Featured Image (40%) */}
                  <div className="w-[40%] shrink-0 pr-6">
                    <div className="relative h-full min-h-[260px] rounded-xl overflow-hidden border border-[#2B7574]/30 shadow-lg group/img">
                      <img
                        src={activeTab.image}
                        alt={activeTab.categoryTitle}
                        className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09171C] via-[#09171C]/50 to-transparent" />

                      {/* Featured Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#12484C]/90 text-[#F2B632] border border-[#2B7574]/50 shadow-sm backdrop-blur-sm">
                          {activeTab.featuredBadge}
                        </span>
                      </div>

                      {/* Title overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="font-monument text-sm font-bold text-white tracking-wider uppercase">
                          {activeTab.categoryTitle}
                        </h4>
                        <p className="text-[11px] text-[#A5D1E1] font-mono mt-1">
                          {activeTab.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: 2-column grid of links (60%) */}
                  <div className="w-[60%] flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {activeTab.links.map((link) => (
                        <button
                          key={link.label}
                          onClick={() => navigateTo(link.route, link.scrollTarget)}
                          className="group/link w-full text-left px-4 py-3.5 rounded-xl hover:bg-[#12484C]/40 transition-all duration-200 cursor-pointer border-l-2 border-transparent hover:border-[#F2B632] hover:translate-x-1"
                        >
                          <span className="text-sm font-bold text-[#EAEFEF] group-hover/link:text-[#F2B632] transition-colors flex items-center gap-2">
                            {link.label}
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-[#F2B632]" />
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Quick action */}
                    <div className="mt-6 pt-4 border-t border-[#18363F] flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#A5D1E1] tracking-widest">
                        <Radio className="w-3 h-3 text-[#F2B632] animate-pulse" />
                        <span>Live flight corridors</span>
                        <span>·</span>
                        <span>Check final fare rules with the airline</span>
                      </div>
                      <button
                        onClick={() => navigateTo('/flights')}
                        className="text-xs font-bold font-mono text-[#F2B632] hover:text-white flex items-center gap-1.5 cursor-pointer group"
                      >
                        <span>Flight Search</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP SIDE DRAWER — for secondary items
          (currency, theme, profile/role, admin)
         ═══════════════════════════════════════════════════════════════ */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] hidden lg:flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel (slides from right) */}
          <div
            className="absolute top-0 right-0 bottom-0 w-80 bg-[#09171C] border-l border-[#2B7574]/40 shadow-2xl flex flex-col"
            style={{
              animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#18363F]">
              <span className="text-[10px] font-mono tracking-widest text-[#F2B632] uppercase">
                Settings & Profile
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close drawer"
                className="w-8 h-8 rounded-full bg-[#12484C] border border-[#2B7574] text-[#F2B632] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* User Profile Card */}
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setIsDrawerOpen(false);
                }}
                className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-[#12484C]/30 border border-[#2B7574]/30 hover:border-[#F2B632]/40 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#F2B632] text-[#0E2931] flex items-center justify-center font-bold text-sm shrink-0">
                  {currentUser.role === 'admin' ? 'KB' : 'FA'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#EAEFEF] truncate group-hover:text-[#F2B632] transition-colors">
                    {currentUser.name}
                  </p>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#12484C] text-[#A5D1E1] uppercase inline-block mt-0.5">
                    {currentUser.role}
                  </span>
                </div>
              </button>

              {/* Currency */}
              <div>
                <span className="text-[9px] font-mono text-[#A5D1E1] uppercase tracking-widest block mb-2">
                  Currency
                </span>
                <div className="flex gap-2">
                  {(['NGN', 'USD'] as const).map((cur) => (
                    <button
                      key={cur}
                      onClick={() => setCurrency(cur)}
                      className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        currency === cur
                          ? 'bg-[#F2B632] text-[#0E2931] border-[#F2B632]'
                          : 'border-[#2B7574]/40 text-[#A5D1E1] hover:border-[#F2B632]/40'
                      }`}
                    >
                      {cur === 'NGN' ? '₦ NGN' : '$ USD'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <span className="text-[9px] font-mono text-[#A5D1E1] uppercase tracking-widest block mb-2">
                  Theme
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      theme === 'light'
                        ? 'bg-[#F2B632] text-[#0E2931] border-[#F2B632]'
                        : 'border-[#2B7574]/40 text-[#A5D1E1] hover:border-[#F2B632]/40'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#F2B632] text-[#0E2931] border-[#F2B632]'
                        : 'border-[#2B7574]/40 text-[#A5D1E1] hover:border-[#F2B632]/40'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    Dark
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <span className="text-[9px] font-mono text-[#A5D1E1] uppercase tracking-widest block mb-2">
                  Quick Access
                </span>
                <div className="space-y-1">
                  {[
                    { label: 'My Trips', route: '/account' },
                    { label: 'Fly Now Pay Later', route: '/fly-now-pay-later' },
                  ].map((link) => (
                    <button
                      key={link.route}
                      onClick={() => navigateTo(link.route)}
                      className="w-full text-left py-2.5 px-3 rounded-lg text-sm text-[#EAEFEF] hover:text-[#F2B632] hover:bg-[#12484C]/40 transition-all cursor-pointer border-l-2 border-transparent hover:border-[#F2B632] hover:translate-x-1 flex items-center justify-between group"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#F2B632]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Inline keyframe for the drawer slide-in */}
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE APERTURE MENU — Dual Shutter with more spacing
         ═══════════════════════════════════════════════════════════════ */}
      {apertureOpen && (
        <div className="fixed inset-0 z-[100] flex overflow-hidden select-none lg:hidden">
          {/* Left Shutter Panel */}
          <div
            className="w-1/2 h-full bg-[#0E2931] border-r border-[#2B7574]/40 relative overflow-y-auto flex flex-col justify-between p-5 pt-6"
            style={{ animation: 'shutterLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <div className="bg-contour absolute inset-0 opacity-15 pointer-events-none" />

            {/* Search at top of mobile menu */}
            <div className="relative z-10 space-y-4">
              <button
                onClick={() => {
                  setApertureOpen(false);
                  setTimeout(() => setIsSearchOpen(true), 200);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl bg-[#12484C]/40 border border-[#2B7574]/40 text-[#A5D1E1] hover:border-[#F2B632]/50 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#F2B632]" />
                <span className="text-xs font-mono">Search flights, stays and more</span>
              </button>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#F2B632] uppercase">
                  CJ TRAVELS OWERRI                </span>
                <p className="text-[11px] text-[#A5D1E1] font-mono mt-0.5">
                  LAT 06° 31&apos; N · MM2 LAGOS
                </p>
              </div>
            </div>

            {/* Left nav items: sections 1 & 2 */}
            <div className="relative z-10 space-y-6 my-auto py-6">
              {MOBILE_LINKS.slice(0, 2).map((section) => (
                <div key={section.section}>
                  <span className="text-[9px] font-mono text-[#F2B632] uppercase tracking-widest block mb-2">
                    {section.section}
                  </span>
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => navigateTo(item.route, item.scrollTarget)}
                      className="text-left w-full group cursor-pointer block py-3"
                    >
                      <span className="font-monument text-lg font-bold text-[#F4F6F5] uppercase group-hover:text-[#F2B632] transition-colors">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="relative z-10 text-[10px] font-mono text-[#A5D1E1]/70">
              <span>CJ TRAVELS · OWERRI</span>            </div>
          </div>

          {/* Right Shutter Panel */}
          <div
            className="w-1/2 h-full bg-[#09171C] border-l border-[#2B7574]/40 relative overflow-y-auto flex flex-col justify-between p-5 pt-6"
            style={{ animation: 'shutterRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <div className="bg-topo absolute inset-0 opacity-20 pointer-events-none" />

            {/* Close Button */}
            <div className="relative z-10 flex justify-end">
              <button
                onClick={() => setApertureOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 rounded-full bg-[#12484C] border border-[#2B7574] text-[#F2B632] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Right nav items: sections 3 & 4 */}\n            <div className="relative z-10 space-y-6 my-auto py-6">
              {MOBILE_LINKS.slice(2).map((section) => (
                <div key={section.section}>
                  <span className="text-[9px] font-mono text-[#F2B632] uppercase tracking-widest block mb-2">
                    {section.section}
                  </span>
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => navigateTo(item.route, item.scrollTarget)}
                      className="text-left w-full group cursor-pointer block py-3"
                    >
                      <span className="font-monument text-lg font-bold uppercase group-hover:text-[#F2B632] transition-colors text-[#F4F6F5]">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              ))}

              {/* Book CTA */}
              <div className="pt-3">
                <button
                  onClick={() => navigateTo('/flights')}
                  className="btn-gold w-full py-3 px-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Book Flight</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Utility Toggles */}
            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#18363F]">
              <button
                onClick={() => setCurrency(currency === 'NGN' ? 'USD' : 'NGN')}
                className="text-xs font-mono text-[#F2B632] border border-[#2B7574]/50 px-3 py-1.5 rounded bg-[#12484C]/50 cursor-pointer"
              >
                {currency === 'NGN' ? '₦ NGN' : '$ USD'}
              </button>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded text-[#A5D1E1] border border-[#2B7574]/50 bg-[#12484C]/50 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#F2B632]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#A5D1E1]" />
                )}
              </button>

              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setApertureOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#2B7574]/40 bg-[#12484C]/30 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#F2B632] text-[#0E2931] flex items-center justify-center font-bold text-[10px]">
                  {currentUser.role === 'admin' ? 'KB' : 'FA'}
                </div>
              </button>
            </div>
          </div>

          {/* Central Vertical Golden Laser Seam */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-[#F2B632] to-transparent pointer-events-none z-20 shadow-[0_0_12px_#F2B632]" />

          {/* Shutter animations */}
          <style>{`
            @keyframes shutterLeft {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
            @keyframes shutterRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};
