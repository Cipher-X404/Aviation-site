import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ArrowUpRight, Moon, Sun, Compass, Plane, Hotel, CircleDollarSign, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveRoute, theme, setTheme } = useAppStore();
  const navigate = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const links = [
    { label: 'Find a flight', route: '/flights', icon: Plane },
    { label: 'Stay somewhere memorable', route: '/hotels', icon: Hotel },
    { label: 'Explore destinations', route: '/destinations', icon: Compass },
    { label: 'Fly now, pay later', route: '/fly-now-pay-later', icon: CircleDollarSign },
  ];
  return (
    <footer className="relative overflow-hidden bg-[#07191e] text-[#e9eeeb]">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(ellipse at 78% 12%, #327b76 0, transparent 35%), repeating-linear-gradient(135deg, transparent 0 79px, rgba(242,182,50,.13) 80px, transparent 81px)' }} />
      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pt-16 sm:pt-24">
        <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-14 lg:gap-20 pb-16 border-b border-white/15">
          <div>
            <p className="text-[10px] uppercase tracking-[.32em] text-[#e6b84c] mb-7">Aerovista · Travel-planning demo</p>
            <h2 className="font-serif normal-case tracking-[-.04em] text-5xl sm:text-7xl lg:text-[6.5rem] leading-[.88] max-w-3xl">Plan the trip.<br/><span className="italic text-[#d7b966]">Mind the details.</span></h2>
            <p className="mt-8 max-w-md text-sm leading-7 text-white/65">Explore sample flights, stays and payment examples in one place. Nothing here books travel or connects you to live customer support.</p>
            <button onClick={() => navigate('/about')} className="inline-flex items-center gap-3 mt-8 border-b border-[#d7b966]/70 pb-2 text-sm hover:text-[#e6b84c] transition-colors">About this demo <ArrowUpRight size={16}/></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 content-start">
            <p className="col-span-full text-[10px] uppercase tracking-[.26em] text-white/40 mb-1">Plan your next departure</p>
            {links.map(({label, route, icon: Icon}) => <button key={route} onClick={() => navigate(route)} className="group text-left flex items-center gap-4 py-4 border-b border-white/15 hover:border-[#d7b966]/70 transition-colors"><span className="text-[#d7b966]"><Icon size={18} strokeWidth={1.5}/></span><span className="flex-1 text-sm text-white/80 group-hover:text-white">{label}</span><ArrowUpRight size={14} className="text-white/35 group-hover:text-[#e6b84c]"/></button>)}
            <button onClick={() => navigate('/about')} className="group text-left flex items-center gap-4 py-4 border-b border-white/15"><span className="text-[#d7b966]"><Info size={18} strokeWidth={1.5}/></span><span className="flex-1 text-sm text-white/80">About Aerovista</span><ArrowUpRight size={14} className="text-white/35"/></button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 py-6 text-[11px] text-white/45">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2"><span>© 2026 Aerovista</span><button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button><button onClick={() => navigate('/terms')} className="hover:text-white">Terms</button><button onClick={() => navigate('/about')} className="hover:text-white">About this demo</button></div>
          <div className="flex items-center gap-5"><button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle visual theme" className="hover:text-white">{theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}</button><span className="font-serif text-lg tracking-widest text-[#d7b966]">AV / 01</span></div>
        </div>
      </div>
    </footer>
  );
};
