import React, { useEffect, Suspense, lazy } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "./store/useAppStore";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { SupportModal } from "./components/support/SupportModal";
import { AuthModal } from "./components/auth/AuthModal";
import { InformationPage } from "./components/common/InformationPage";
import { RevealOnScroll } from "./components/common/RevealOnScroll";

const HeroCanvas = lazy(() => import("./components/hero/HeroCanvas").then(m => ({ default: m.HeroCanvas })));
const TrustMarquee = lazy(() => import("./components/home/TrustMarquee").then(m => ({ default: m.TrustMarquee })));
const PopularDestinations = lazy(() => import("./components/home/PopularDestinations").then(m => ({ default: m.PopularDestinations })));
const LiveRadarSection = lazy(() => import("./components/home/LiveRadarSection").then(m => ({ default: m.LiveRadarSection })));
const ServicesBento = lazy(() => import("./components/home/ServicesBento").then(m => ({ default: m.ServicesBento })));
const FleetCabinShowcase = lazy(() => import("./components/home/FleetCabinShowcase").then(m => ({ default: m.FleetCabinShowcase })));
const LoanSpotlight = lazy(() => import("./components/home/LoanSpotlight").then(m => ({ default: m.LoanSpotlight })));
const BundleShowcase = lazy(() => import("./components/home/BundleShowcase").then(m => ({ default: m.BundleShowcase })));
const WhyTrustUs = lazy(() => import("./components/home/WhyTrustUs").then(m => ({ default: m.WhyTrustUs })));
const TestimonialsSection = lazy(() => import("./components/home/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const FaqSection = lazy(() => import("./components/home/FaqSection").then(m => ({ default: m.FaqSection })));
const TripPlanner = lazy(() => import("./components/home/TripPlanner").then(m => ({ default: m.TripPlanner })));
const FlightsView = lazy(() => import("./components/flights/FlightsView").then(m => ({ default: m.FlightsView })));
const BookingFlow = lazy(() => import("./components/flights/BookingFlow").then(m => ({ default: m.BookingFlow })));
const HotelsView = lazy(() => import("./components/hotels/HotelsView").then(m => ({ default: m.HotelsView })));
const FlyNowPayLaterView = lazy(() => import("./components/loan/FlyNowPayLaterView").then(m => ({ default: m.FlyNowPayLaterView })));
const AccountView = lazy(() => import("./components/account/AccountView").then(m => ({ default: m.AccountView })));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const DestinationsView = lazy(() => import("./components/destinations/DestinationsView").then(m => ({ default: m.DestinationsView })));

const KNOWN_ROUTES = ["/", "/flights", "/flights/book", "/hotels", "/fly-now-pay-later", "/account", "/admin", "/destinations", "/about", "/privacy", "/terms"];

function NotFound({ onHome }: { onHome: () => void }) {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center gap-6">
      <span className="text-[10px] font-mono tracking-[.28em] uppercase text-[#F2B632]">404 · Page not found</span>
      <h1 className="font-serif text-5xl sm:text-7xl normal-case tracking-tight text-[#0E2931] dark:text-[#EAEFEF]">Lost in transit.</h1>
      <p className="max-w-sm text-sm leading-7 text-[#5A6B70] dark:text-[#849CA3]">This route does not exist on our flight map. Head back to the home terminal and try again.</p>
      <button onClick={onHome} className="btn-gold px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer">Return Home</button>
    </div>
  );
}

export default function App() {
  const { activeRoute, setActiveRoute, setAuthModalOpen, login } = useAppStore();
  const [adminSessionValid, setAdminSessionValid] = React.useState(false);

  const goHome = () => { setActiveRoute("/"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), orientation: "vertical", smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    let rafId: number;
    function raf(time: number) { lenis.raf(time); rafId = requestAnimationFrame(raf); }
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await fetch("/api/admin/session", { credentials: "same-origin", cache: "no-store" });
        const result = await response.json();
        const allowed = response.ok && result.authenticated === true;
        setAdminSessionValid(allowed);
        if (allowed) login("admin");
        else if (activeRoute === "/admin") setAuthModalOpen(true);
      } catch { setAdminSessionValid(false); if (activeRoute === "/admin") setAuthModalOpen(true); }
    };
    if (activeRoute === "/admin") void verifyAdmin();
  }, [activeRoute, login, setAuthModalOpen]);

  useEffect(() => {
    const onAdminAuth = () => {
      fetch("/api/admin/session", { credentials: "same-origin", cache: "no-store" })
        .then((r) => r.json())
        .then((result) => { const ok = result.authenticated === true; setAdminSessionValid(ok); if (ok) login("admin"); })
        .catch(() => setAdminSessionValid(false));
    };
    window.addEventListener("cjtravels-admin-authenticated", onAdminAuth);
    return () => window.removeEventListener("cjtravels-admin-authenticated", onAdminAuth);
  }, [login]);

  const is404 = !KNOWN_ROUTES.includes(activeRoute);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F5] dark:bg-[#09171C] text-[#0E2931] dark:text-[#EAEFEF] selection:bg-[#F2B632] selection:text-[#0E2931] relative">
      <Navbar />
      <main className="flex-1 w-full">
        <Suspense fallback={<div className="min-h-[60vh] grid place-items-center text-xs tracking-[.2em] uppercase text-[#9a7727]">Preparing your journey...</div>}>
          {activeRoute === "/" && (
            <div className="space-y-0">
              <HeroCanvas />
              <TrustMarquee />
              <RevealOnScroll direction="left"><TripPlanner /></RevealOnScroll>
              <RevealOnScroll direction="up"><PopularDestinations /></RevealOnScroll>
              <RevealOnScroll direction="left"><LiveRadarSection /></RevealOnScroll>
              <RevealOnScroll direction="up"><ServicesBento /></RevealOnScroll>
              <RevealOnScroll direction="right"><FleetCabinShowcase /></RevealOnScroll>
              <RevealOnScroll direction="up"><LoanSpotlight /></RevealOnScroll>
              <RevealOnScroll direction="left"><BundleShowcase /></RevealOnScroll>
              <RevealOnScroll direction="up"><WhyTrustUs /></RevealOnScroll>
              <RevealOnScroll direction="right"><TestimonialsSection /></RevealOnScroll>
              <RevealOnScroll direction="up"><FaqSection /></RevealOnScroll>
            </div>
          )}
          {activeRoute === "/flights" && <FlightsView />}
          {activeRoute === "/flights/book" && <BookingFlow />}
          {activeRoute === "/hotels" && <HotelsView />}
          {activeRoute === "/fly-now-pay-later" && <FlyNowPayLaterView />}
          {activeRoute === "/account" && <AccountView />}
          {activeRoute === "/destinations" && <DestinationsView />}
          {activeRoute === "/admin" && (adminSessionValid ? <AdminDashboard /> : (
            <div className="min-h-[70vh] grid place-content-center px-6 text-center">
              <p className="text-[10px] tracking-[.25em] uppercase text-[#9a7727]">Protected area</p>
              <h1 className="mt-3 font-serif text-4xl">Admin access required</h1>
              <p className="mt-3 max-w-md text-sm leading-6 opacity-70">Sign in with the server-configured administrator code. A client-side profile or direct URL is not enough.</p>
            </div>
          ))}
          {["/about", "/privacy", "/terms"].includes(activeRoute) && <InformationPage route={activeRoute} />}
          {is404 && <NotFound onHome={goHome} />}
        </Suspense>
      </main>
      <SupportModal />
      <AuthModal />
      {activeRoute !== "/admin" && activeRoute !== "/account" && <Footer />}
    </div>
  );
}