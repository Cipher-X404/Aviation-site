import React, { useEffect, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
const HeroCanvas = lazy(() => import('./components/hero/HeroCanvas').then(m => ({ default: m.HeroCanvas })));
const TrustMarquee = lazy(() => import('./components/home/TrustMarquee').then(m => ({ default: m.TrustMarquee })));
const PopularDestinations = lazy(() => import('./components/home/PopularDestinations').then(m => ({ default: m.PopularDestinations })));
const LiveRadarSection = lazy(() => import('./components/home/LiveRadarSection').then(m => ({ default: m.LiveRadarSection })));
const ServicesBento = lazy(() => import('./components/home/ServicesBento').then(m => ({ default: m.ServicesBento })));
const FleetCabinShowcase = lazy(() => import('./components/home/FleetCabinShowcase').then(m => ({ default: m.FleetCabinShowcase })));
const LoanSpotlight = lazy(() => import('./components/home/LoanSpotlight').then(m => ({ default: m.LoanSpotlight })));
const BundleShowcase = lazy(() => import('./components/home/BundleShowcase').then(m => ({ default: m.BundleShowcase })));
const WhyTrustUs = lazy(() => import('./components/home/WhyTrustUs').then(m => ({ default: m.WhyTrustUs })));
const TestimonialsSection = lazy(() => import('./components/home/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const FaqSection = lazy(() => import('./components/home/FaqSection').then(m => ({ default: m.FaqSection })));
const TripPlanner = lazy(() => import('./components/home/TripPlanner').then(m => ({ default: m.TripPlanner })));

const FlightsView = lazy(() => import('./components/flights/FlightsView').then(m => ({ default: m.FlightsView })));
const BookingFlow = lazy(() => import('./components/flights/BookingFlow').then(m => ({ default: m.BookingFlow })));
const HotelsView = lazy(() => import('./components/hotels/HotelsView').then(m => ({ default: m.HotelsView })));
const FlyNowPayLaterView = lazy(() => import('./components/loan/FlyNowPayLaterView').then(m => ({ default: m.FlyNowPayLaterView })));
const AccountView = lazy(() => import('./components/account/AccountView').then(m => ({ default: m.AccountView })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const DestinationsView = lazy(() => import('./components/destinations/DestinationsView').then(m => ({ default: m.DestinationsView })));
import { SupportModal } from './components/support/SupportModal';
import { AuthModal } from './components/auth/AuthModal';
import { RouteJournal } from './components/common/RouteJournal';
import { InformationPage } from './components/common/InformationPage';
import { RevealOnScroll } from './components/common/RevealOnScroll';

export default function App() {
  const { activeRoute, setActiveRoute, setAuthModalOpen, login } = useAppStore();
  const [adminSessionValid, setAdminSessionValid] = React.useState(false);

  // Initialize Lenis smooth scroll and synchronize with GSAP ScrollTrigger
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await fetch('/api/admin/session', { credentials: 'same-origin', cache: 'no-store' });
        const result = await response.json();
        const allowed = response.ok && result.authenticated === true;
        setAdminSessionValid(allowed);
        if (allowed) login('admin');
        else if (activeRoute === '/admin') setAuthModalOpen(true);
      } catch {
        setAdminSessionValid(false);
        if (activeRoute === '/admin') setAuthModalOpen(true);
      }
    };
    if (activeRoute === '/admin') void verifyAdmin();
  }, [activeRoute, login, setAuthModalOpen]);

  useEffect(() => {
    const onAdminAuthenticated = () => {
      fetch('/api/admin/session', { credentials: 'same-origin', cache: 'no-store' })
        .then((response) => response.json())
        .then((result) => {
          const allowed = result.authenticated === true;
          setAdminSessionValid(allowed);
          if (allowed) login('admin');
        })
        .catch(() => setAdminSessionValid(false));
    };
    window.addEventListener('cjtravels-admin-authenticated', onAdminAuthenticated);
    return () => window.removeEventListener('cjtravels-admin-authenticated', onAdminAuthenticated);
  }, [login]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F5] dark:bg-[#09171C] text-[#0E2931] dark:text-[#EAEFEF] selection:bg-[#F2B632] selection:text-[#0E2931] relative">
      {/* Persistent Navigation */}
      <Navbar />
      

      {/* Main Content Router */}
      <main className="flex-1 w-full">
        <Suspense fallback={<div className="min-h-[60vh] grid place-items-center text-xs tracking-[.2em] uppercase text-[#9a7727]">Preparing your journey…</div>}>
        {activeRoute === '/' && (
          <div className="space-y-0">
            {/* Scroll-controlled Hero Canvas with Resilient Video Display */}
            <HeroCanvas />

            {/* Sovereign Flight Dispatch Exchange & Telemetry Strip */}
            <TrustMarquee />

            {/* Natural-language itinerary planner, below the untouched hero. */}
            <RevealOnScroll direction="left"><TripPlanner /></RevealOnScroll>

            {/* Popular Flight Routes with Reveal Animation */}
            <RevealOnScroll direction="up"><PopularDestinations /></RevealOnScroll>

            {/* Active Live Radar Telemetry & Vector Corridors */}
            <RevealOnScroll direction="left"><LiveRadarSection /></RevealOnScroll>

            {/* Services Bento */}
            <RevealOnScroll direction="up"><ServicesBento /></RevealOnScroll>

            {/* Private Fleet & Cabin Architecture */}
            <RevealOnScroll direction="right"><FleetCabinShowcase /></RevealOnScroll>

            {/* Loan Spotlight on Ocean Gradient */}
            <RevealOnScroll direction="up"><LoanSpotlight /></RevealOnScroll>

            {/* Flight + Hotel Bundle Showcase */}
            <RevealOnScroll direction="left"><BundleShowcase /></RevealOnScroll>

            {/* Why Travelers Trust Us */}
            <RevealOnScroll direction="up"><WhyTrustUs /></RevealOnScroll>

            {/* Passenger Black Box / Acoustic Logbook */}
            <RevealOnScroll direction="right"><TestimonialsSection /></RevealOnScroll>

            {/* Frequently Asked Questions */}
            <RevealOnScroll direction="up"><FaqSection /></RevealOnScroll>
          </div>
        )}

        {activeRoute === '/flights' && <FlightsView />}
        {activeRoute === '/flights/book' && <BookingFlow />}
        {activeRoute === '/hotels' && <HotelsView />}
        {activeRoute === '/fly-now-pay-later' && <FlyNowPayLaterView />}
        {activeRoute === '/account' && <AccountView />}
        {activeRoute === '/admin' && (adminSessionValid ? <AdminDashboard /> : <div className="min-h-[70vh] grid place-content-center px-6 text-center"><p className="text-[10px] tracking-[.25em] uppercase text-[#9a7727]">Protected area</p><h1 className="mt-3 font-serif text-4xl">Admin access required</h1><p className="mt-3 max-w-md text-sm leading-6 opacity-70">Sign in with the server-configured administrator code. A client-side profile or direct URL is not enough.</p></div>)}
        {activeRoute === '/destinations' && <DestinationsView />}
        {['/about', '/privacy', '/terms'].includes(activeRoute) && <InformationPage route={activeRoute} />}
        {activeRoute !== '/' && activeRoute !== '/flights/book' && activeRoute !== '/admin' && activeRoute !== '/account' && !['/about', '/privacy', '/terms'].includes(activeRoute) && <RouteJournal route={activeRoute} />}
        </Suspense>
      </main>

      {/* Floating Ground Concierge & Back to Top */}
      <SupportModal />

      {/* Sovereign Auth & Role Switcher Modal */}
      <AuthModal />

      {/* Site Footer - Hidden on Dashboards for Clean Native Interface */}
      {activeRoute !== '/admin' && activeRoute !== '/account' && <Footer />}
    </div>
  );
}
