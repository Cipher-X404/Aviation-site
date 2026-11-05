import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroCanvas } from './components/hero/HeroCanvas';
import { TrustMarquee } from './components/home/TrustMarquee';
import { PopularDestinations } from './components/home/PopularDestinations';
import { LiveRadarSection } from './components/home/LiveRadarSection';
import { ServicesBento } from './components/home/ServicesBento';
import { FleetCabinShowcase } from './components/home/FleetCabinShowcase';
import { LoanSpotlight } from './components/home/LoanSpotlight';
import { BundleShowcase } from './components/home/BundleShowcase';
import { WhyTrustUs } from './components/home/WhyTrustUs';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { FaqSection } from './components/home/FaqSection';

import { FlightsView } from './components/flights/FlightsView';
import { BookingFlow } from './components/flights/BookingFlow';
import { HotelsView } from './components/hotels/HotelsView';
import { FlyNowPayLaterView } from './components/loan/FlyNowPayLaterView';
import { AccountView } from './components/account/AccountView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DestinationsView } from './components/destinations/DestinationsView';
import { SupportModal } from './components/support/SupportModal';
import { AuthModal } from './components/auth/AuthModal';
import { RevealOnScroll } from './components/common/RevealOnScroll';

export default function App() {
  const { activeRoute, setActiveRoute } = useAppStore();

  // Initialize Lenis smooth scroll and synchronize with GSAP ScrollTrigger
  useEffect(() => {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F5] dark:bg-[#09171C] text-[#0E2931] dark:text-[#EAEFEF] selection:bg-[#F2B632] selection:text-[#0E2931] relative">
      {/* Persistent Navigation */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1 w-full">
        {activeRoute === '/' && (
          <div className="space-y-0">
            {/* Scroll-controlled Hero Canvas with Resilient Video Display */}
            <HeroCanvas />

            {/* Sovereign Flight Dispatch Exchange & Telemetry Strip */}
            <TrustMarquee />

            {/* Popular Flight Routes with Reveal Animation */}
            <RevealOnScroll direction="up" delayMs={50}>
              <PopularDestinations />
            </RevealOnScroll>

            {/* Active Live Radar Telemetry & Vector Corridors */}
            <RevealOnScroll direction="up" delayMs={50}>
              <LiveRadarSection />
            </RevealOnScroll>

            {/* Services Bento */}
            <RevealOnScroll direction="up" delayMs={50}>
              <ServicesBento />
            </RevealOnScroll>

            {/* Private Fleet & Cabin Architecture */}
            <RevealOnScroll direction="up" delayMs={50}>
              <FleetCabinShowcase />
            </RevealOnScroll>

            {/* Loan Spotlight on Ocean Gradient */}
            <RevealOnScroll direction="up" delayMs={50}>
              <LoanSpotlight />
            </RevealOnScroll>

            {/* Flight + Hotel Bundle Showcase */}
            <RevealOnScroll direction="up" delayMs={50}>
              <BundleShowcase />
            </RevealOnScroll>

            {/* Why Travelers Trust Us */}
            <RevealOnScroll direction="up" delayMs={50}>
              <WhyTrustUs />
            </RevealOnScroll>

            {/* Passenger Black Box / Acoustic Logbook */}
            <RevealOnScroll direction="up" delayMs={50}>
              <TestimonialsSection />
            </RevealOnScroll>

            {/* Frequently Asked Questions */}
            <RevealOnScroll direction="up" delayMs={50}>
              <FaqSection />
            </RevealOnScroll>
          </div>
        )}

        {activeRoute === '/flights' && <FlightsView />}
        {activeRoute === '/flights/book' && <BookingFlow />}
        {activeRoute === '/hotels' && <HotelsView />}
        {activeRoute === '/fly-now-pay-later' && <FlyNowPayLaterView />}
        {activeRoute === '/account' && <AccountView />}
        {activeRoute === '/admin' && <AdminDashboard />}
        {activeRoute === '/destinations' && <DestinationsView />}
      </main>

      {/* Floating Ground Concierge & Back to Top */}
      <SupportModal />

      {/* Sovereign Auth & Role Switcher Modal */}
      <AuthModal />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
