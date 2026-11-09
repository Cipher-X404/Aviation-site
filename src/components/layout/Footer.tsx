import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  ArrowRight, ArrowUp, ArrowUpRight, Check, Clock3, Globe2, Mail, MapPin,
  Moon, Phone, Plane, ShieldCheck, Sun,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Static link data — every route here exists in App.tsx
   KNOWN_ROUTES and renders a real page.
────────────────────────────────────────────────────────────── */
interface FooterLink {
  label: string;
  route?: string;
  href?: string;
  note?: string;
}

const BOOK_LINKS: FooterLink[] = [
  { label: 'Search flights', route: '/flights', note: 'Live fares' },
  { label: 'Hotels & suites', route: '/hotels' },
  { label: 'Flight + hotel bundles', route: '/', note: 'Save 18%' },
  { label: 'Group bookings', route: '/group-bookings' },
  { label: 'Destinations', route: '/destinations' },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: 'About CJ Travels', route: '/about' },
  { label: 'Deals & promotions', route: '/deals' },
  { label: 'Travel journal', route: '/blog' },
  { label: 'Contact the desk', route: '/contact' },
  { label: 'Customer portal', route: '/account' },
];

const SUPPORT_LINKS: FooterLink[] = [
  { label: 'Visa information', route: '/visa-info' },
  { label: 'Travel insurance', route: '/insurance' },
  { label: 'Fly now, pay later', route: '/fly-now-pay-later' },
  { label: 'Manage a booking', route: '/account' },
];

const PARTNER_LINKS: FooterLink[] = [
  { label: 'IATA', href: 'https://www.iata.org' },
  { label: 'Air Peace', href: 'https://flyairpeace.com' },
  { label: 'Ibom Air', href: 'https://ibomair.com' },
  { label: 'Eko Hotels', href: 'https://ekohotels.com' },
  { label: 'Transcorp Hotels', href: 'https://transcorphotels.com' },
  { label: 'Amadeus', href: 'https://amadeus.com' },
  { label: 'Flightradar24', href: 'https://flightradar24.com' },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy', route: '/privacy' },
  { label: 'Terms', route: '/terms' },
  { label: 'Cookies', route: '/privacy' },
];

/* Live dispatch clock in West Africa Time */
function useLagosClock() {
  const format = () =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Lagos',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());

  const [time, setTime] = useState(format);

  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

export const Footer: React.FC = () => {
  const {
    setActiveRoute, setSupportOpen, setCurrency, currency, theme, setTheme,
  } = useAppStore();

  const clock = useLagosClock();

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [formError, setFormError] = useState('');

  const go = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLink = (link: FooterLink) => {
    if (link.route) go(link.route);
  };

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setFormError('Enter a valid email address so we can reach you.');
      return;
    }
    setFormError('');
    setSubscribed(true);
  };

  const linkClass =
    'group inline-flex items-start gap-1.5 text-[12.5px] leading-snug text-[#5A6B70] dark:text-[#8FA9AF] hover:text-[#0E2931] dark:hover:text-[#F2B632] transition-colors duration-200 cursor-pointer text-left';

  const columnHeading =
    'text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[#0E2931]/70 dark:text-[#A5D1E1]/80 mb-4';

  const trustChips = useMemo(
    () => [
      { icon: ShieldCheck, label: 'IATA accredited agency' },
      { icon: Globe2, label: 'Fares in NGN & USD' },
      { icon: Clock3, label: '24/7 dispatch desk' },
    ],
    [],
  );

  return (
    <footer className="w-full relative overflow-hidden">

      {/* ═══════════════ BACKGROUND LANDSCAPE ═══════════════ */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 dark:opacity-0 transition-opacity duration-500"
          style={{
            background: `
              radial-gradient(ellipse 120% 60% at 50% 118%, rgba(168,178,120,0.5) 0%, transparent 65%),
              radial-gradient(ellipse 80% 50% at 18% 100%, rgba(195,188,140,0.35) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 82% 100%, rgba(140,160,110,0.3) 0%, transparent 55%),
              linear-gradient(to bottom, #F4F6F5 0%, #eceee8 38%, #dee1d5 68%, #ced2c1 100%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500"
          style={{
            background: `
              radial-gradient(ellipse 120% 60% at 50% 118%, rgba(18,72,76,0.55) 0%, transparent 65%),
              radial-gradient(ellipse 80% 50% at 18% 100%, rgba(12,52,58,0.5) 0%, transparent 60%),
              linear-gradient(to bottom, #08181D 0%, #09191f 38%, #0b2028 68%, #0c222c 100%)
            `,
          }}
        />
        <div className="absolute inset-0 bg-topo opacity-30" />
      </div>

      {/* ═══════════════ 1 · CONCIERGE CTA BAND ═══════════════ */}
      <div className="relative z-20">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-14 sm:pt-20">
          <div className="relative overflow-hidden rounded-[26px] border border-[#2B7574]/35 dark:border-[#2B7574]/45 bg-[#0E2931] text-[#F4F6F5] shadow-[0_30px_70px_-40px_rgba(14,41,49,0.85)]">
            <div className="bg-topo absolute inset-0 opacity-25 pointer-events-none" />
            <div
              className="absolute -right-16 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(242,182,50,0.35), transparent 70%)' }}
            />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.35fr_1fr] items-center p-6 sm:p-9 lg:p-11">
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.26em] text-[#F2B632]">
                  <Plane className="h-3.5 w-3.5 -rotate-45" strokeWidth={1.6} />
                  Owerri · Imo State · Nigeria
                </span>
                <h3 className="mt-4 font-serif text-3xl sm:text-[42px] leading-[1.02] tracking-tight">
                  A real desk, on the ground,
                  <br className="hidden sm:block" /> whenever your plans move.
                </h3>
                <p className="mt-4 max-w-lg text-[13px] leading-7 text-[#A5D1E1]">
                  Tickets, seat changes, hotel re-bookings and visa questions are handled by
                  people in Owerri — not a chatbot queue. Reach us before, during or after the flight.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => go('/flights')}
                  className="btn-gold inline-flex items-center justify-between gap-3 rounded-xl px-5 py-4 text-[11.5px] font-bold uppercase tracking-[0.14em] cursor-pointer"
                >
                  Book a flight
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </button>
                <button
                  onClick={() => setSupportOpen(true)}
                  className="inline-flex items-center justify-between gap-3 rounded-xl border border-[#A5D1E1]/35 bg-white/5 px-5 py-4 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#EAEFEF] hover:bg-white/10 hover:border-[#F2B632]/60 transition-colors cursor-pointer"
                >
                  Talk to a concierge
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </button>
                <div className="flex items-center gap-2 pt-1 text-[10.5px] font-mono uppercase tracking-[0.16em] text-[#A5D1E1]/80">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F2B632] opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F2B632]" />
                  </span>
                  Desk open · {clock} WAT
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ 2 · MAIN FOOTER GRID ═══════════════ */}
      <div className="relative z-20 border-t border-[#0E2931]/10 dark:border-[#EAEFEF]/10 mt-14 sm:mt-20">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-12 sm:pt-16 pb-10 sm:pb-14">
          <div className="grid gap-12 lg:gap-10 lg:grid-cols-12">

            {/* Brand column */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-[27px] font-black italic tracking-tight text-[#0E2931] dark:text-[#F2B632]"
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

              <p className="text-[14px] font-semibold leading-snug text-[#0E2931] dark:text-[#EAEFEF]">
                Flights, stays and payment plans,
                <br /> arranged by people who fly them.
              </p>

              <p className="max-w-[300px] text-[12.5px] leading-[1.75] text-[#5A6B70] dark:text-[#8FA9AF]">
                Direct carrier fares, verified hotel sanctuaries and 0% APR instalment
                plans — assembled in one desk beside your original travel ambitions.
              </p>

              {/* Contact rows */}
              <div className="flex flex-col gap-2.5 pt-1">
                <a
                  href="tel:+2348030000001"
                  className="inline-flex items-center gap-2.5 text-[12.5px] text-[#5A6B70] dark:text-[#8FA9AF] hover:text-[#0E2931] dark:hover:text-[#F2B632] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-[#2B7574] dark:text-[#A5D1E1]" strokeWidth={1.7} />
                  +234 803 000 0001
                </a>
                <a
                  href="mailto:hello@cjtravels.ng"
                  className="inline-flex items-center gap-2.5 text-[12.5px] text-[#5A6B70] dark:text-[#8FA9AF] hover:text-[#0E2931] dark:hover:text-[#F2B632] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-[#2B7574] dark:text-[#A5D1E1]" strokeWidth={1.7} />
                  hello@cjtravels.ng
                </a>
                <span className="inline-flex items-start gap-2.5 text-[12.5px] text-[#5A6B70] dark:text-[#8FA9AF]">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2B7574] dark:text-[#A5D1E1]" strokeWidth={1.7} />
                  Wing A, Plot 14 Convent Road, Owerri, Imo State
                </span>
              </div>

              {/* Trust chips */}
              <ul className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                {trustChips.map((chip) => (
                  <li
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.12em] text-[#2B7574] dark:text-[#A5D1E1]"
                  >
                    <chip.icon className="h-3 w-3" strokeWidth={1.8} />
                    {chip.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Link columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
              {[
                { title: 'Book', links: BOOK_LINKS },
                { title: 'Company', links: COMPANY_LINKS },
                { title: 'Support', links: SUPPORT_LINKS },
              ].map((column) => (
                <nav key={column.title} aria-label={`${column.title} links`}>
                  <h4 className={columnHeading}>{column.title}</h4>
                  <ul className="space-y-[11px]">
                    {column.links.map((link) => (
                      <li key={link.label} className="flex items-center gap-2">
                        <button onClick={() => handleLink(link)} className={linkClass}>
                          {link.label}
                          {link.note && (
                            <span className="mt-[1px] rounded-sm border border-[#2B7574]/35 px-1 py-[1px] text-[8px] font-mono uppercase tracking-[0.1em] text-[#2B7574] dark:border-[#F2B632]/35 dark:text-[#F2B632]">
                              {link.note}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}

              <nav aria-label="Partner links" className="col-span-2 sm:col-span-1">
                <h4 className={columnHeading}>Partners</h4>
                <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-[11px]">
                  {PARTNER_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {link.label}
                        <ArrowUpRight
                          className="mt-[2px] h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          strokeWidth={2}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* ═══════════════ 3 · FARE DIGEST SIGN-UP ═══════════════ */}
          <div className="mt-12 sm:mt-14 rounded-2xl border border-[#0E2931]/12 dark:border-[#EAEFEF]/10 bg-white/55 dark:bg-[#0E2931]/45 backdrop-blur-sm p-5 sm:p-7">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

              <div className="lg:max-w-md">
                <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#2B7574] dark:text-[#F2B632]">
                  The weekly fare digest
                </span>
                <h4 className="mt-2 font-serif text-2xl leading-tight text-[#0E2931] dark:text-[#EAEFEF]">
                  One email. The routes that actually dropped.
                </h4>
              </div>

              <div className="flex-1">
                {subscribed ? (
                  <div className="flex items-start gap-3 rounded-xl border border-[#2B7574]/40 bg-[#2B7574]/10 dark:bg-[#F2B632]/10 px-4 py-3.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2B7574] dark:text-[#F2B632]" strokeWidth={2.4} />
                    <div>
                      <p className="text-[13px] font-semibold text-[#0E2931] dark:text-[#EAEFEF]">
                        You are on the list.
                      </p>
                      <p className="mt-0.5 text-[11.5px] leading-5 text-[#5A6B70] dark:text-[#8FA9AF]">
                        We will send the first digest to {email.trim()}. No more than one email a week.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} noValidate>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <label htmlFor="footer-fare-email" className="sr-only">
                        Email address for the weekly fare digest
                      </label>
                      <input
                        id="footer-fare-email"
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (formError) setFormError('');
                        }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={Boolean(formError)}
                        aria-describedby={formError ? 'footer-fare-error' : 'footer-fare-note'}
                        className="min-w-0 flex-1 rounded-xl border border-[#0E2931]/15 dark:border-[#EAEFEF]/15 bg-white/80 dark:bg-[#061216]/60 px-4 py-3 text-[13px] text-[#0E2931] dark:text-[#EAEFEF] placeholder:text-[#8A9DA3] dark:placeholder:text-[#5E7B84] outline-none focus:border-[#2B7574] dark:focus:border-[#F2B632] transition-colors"
                      />
                      <button
                        type="submit"
                        className="btn-gold inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] cursor-pointer"
                      >
                        Subscribe
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                      </button>
                    </div>
                    {formError ? (
                      <p id="footer-fare-error" role="alert" className="mt-2 text-[11px] text-[#b4453f] dark:text-[#ff9b95]">
                        {formError}
                      </p>
                    ) : (
                      <p id="footer-fare-note" className="mt-2 text-[11px] leading-5 text-[#8A9DA3] dark:text-[#5E7B84]">
                        Route fare drops and scheduling notes only. Unsubscribe in one click.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ 4 · UTILITY BAR ═══════════════ */}
      <div className="relative z-20 border-t border-[#0E2931]/10 dark:border-[#EAEFEF]/10">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[11.5px] text-[#8A9DA3] dark:text-[#5E7B84]">
            <span>© 2026 CJ Travels Owerri · All rights reserved</span>
            <span className="hidden sm:inline h-3 w-px bg-current opacity-25" />
            <div className="flex items-center gap-3">
              {LEGAL_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLink(link)}
                  className="hover:text-[#0E2931] dark:hover:text-[#EAEFEF] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency switch */}
            <div
              role="group"
              aria-label="Display currency"
              className="flex items-center rounded-lg border border-[#0E2931]/12 dark:border-[#EAEFEF]/12 bg-white/60 dark:bg-[#0E2931]/50 p-0.5"
            >
              {(['NGN', 'USD'] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  aria-pressed={currency === code}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.1em] transition-colors cursor-pointer ${
                    currency === code
                      ? 'bg-[#0E2931] text-[#F2B632] dark:bg-[#F2B632] dark:text-[#0E2931]'
                      : 'text-[#8A9DA3] dark:text-[#8FA9AF] hover:text-[#0E2931] dark:hover:text-[#EAEFEF]'
                  }`}
                >
                  {code === 'NGN' ? '₦ NGN' : '$ USD'}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="grid h-8 w-8 place-items-center rounded-lg border border-[#0E2931]/12 dark:border-[#EAEFEF]/12 bg-white/60 dark:bg-[#0E2931]/50 text-[#5A6B70] dark:text-[#A5D1E1] hover:text-[#0E2931] dark:hover:text-[#F2B632] transition-colors cursor-pointer"
            >
              {theme === 'dark'
                ? <Sun className="h-3.5 w-3.5" strokeWidth={1.9} />
                : <Moon className="h-3.5 w-3.5" strokeWidth={1.9} />}
            </button>

            {/* Back to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#0E2931]/12 dark:border-[#EAEFEF]/12 bg-white/60 dark:bg-[#0E2931]/50 px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.1em] text-[#5A6B70] dark:text-[#A5D1E1] hover:text-[#0E2931] dark:hover:text-[#F2B632] transition-colors cursor-pointer"
            >
              Top
              <ArrowUp className="h-3 w-3" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════ 5 · WATERMARK ═══════════════ */}
      <div className="relative z-20 overflow-hidden">
        <div className="mx-auto mb-4 h-px w-full max-w-[1280px] bg-gradient-to-r from-transparent via-[#2B7574]/25 to-transparent dark:via-[#F2B632]/20" />

        <div className="pointer-events-none flex select-none justify-center leading-none overflow-hidden">
          <span
            aria-hidden="true"
            className="wm-footer font-monument font-black uppercase whitespace-nowrap text-center block select-none"
            style={{
              fontSize: 'clamp(46px, 15vw, 232px)',
              letterSpacing: '-0.045em',
              lineHeight: 0.8,
              paddingBottom: '0.06em',
            }}
          >
            CJ TRAVELS
          </span>
        </div>

        <p className="sr-only">CJ Travels Owerri — flights, hotels and travel finance.</p>
      </div>

      {/* Tail spacer so the watermark can bleed off the edge */}
      <div className="relative z-20 h-[clamp(10px,3vw,42px)]" />
    </footer>
  );
};
