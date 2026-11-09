import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export const DealsView: React.FC = () => {
  const { setActiveRoute } = useAppStore();
  const [filter, setFilter] = useState('All');

  const deals = [
    {
      id: 1,
      badge: 'FLASH SALE',
      title: 'Lagos → Dubai from ₦850,000',
      desc: 'Limited seats available for December departures. Book now to secure the lowest fare.',
      price: '₦850,000',
      expiry: new Date(Date.now() + 3600000 * 48), // 48 hours
      route: '/flights',
      type: 'Flights',
    },
    {
      id: 2,
      badge: 'BUNDLE',
      title: 'Abuja Escape: Flight + 3 nights from ₦420,000',
      desc: 'Stay at verified sanctuaries and fly round-trip. All taxes included.',
      price: '₦420,000',
      expiry: new Date(Date.now() + 3600000 * 72),
      route: '/hotels',
      type: 'Bundles',
    },
    {
      id: 3,
      badge: 'PAY LATER',
      title: '0% APR on all bookings this month',
      desc: 'Fly Now Pay Later with zero interest for the first 6 months.',
      price: '0% APR',
      expiry: new Date(Date.now() + 3600000 * 120),
      route: '/fly-now-pay-later',
      type: 'Pay Later',
    },
    {
      id: 4,
      badge: 'FLASH SALE',
      title: 'Port Harcourt → Accra from ₦310,000',
      desc: 'Direct flights to Ghana with flexible dates. Limited time offer.',
      price: '₦310,000',
      expiry: new Date(Date.now() + 3600000 * 24),
      route: '/flights',
      type: 'Flights',
    },
    {
      id: 5,
      badge: 'BUNDLE',
      title: 'Lagos Staycation: Flight + 2 nights from ₦290,000',
      desc: 'Experience the best of Lagos with our exclusive sanctuary partners.',
      price: '₦290,000',
      expiry: new Date(Date.now() + 3600000 * 36),
      route: '/hotels',
      type: 'Bundles',
    },
    {
      id: 6,
      badge: 'PAY LATER',
      title: 'Travel Insurance 0% Financing',
      desc: 'Protect your journey with zero-interest monthly payments.',
      price: '0% APR',
      expiry: new Date(Date.now() + 3600000 * 200),
      route: '/insurance',
      type: 'Pay Later',
    },
  ];

  const filteredDeals = filter === 'All' ? deals : deals.filter(d => d.type === filter);

  const [timers, setTimers] = useState<Record<number, string>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next: Record<number, string> = {};
        deals.forEach((deal) => {
          const diff = Math.max(0, deal.expiry.getTime() - Date.now());
          const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
          const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
          const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
          next[deal.id] = `${h}:${m}:${s}`;
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center gap-10 py-16">
      {/* Hero Banner */}
      <div className="w-full max-w-6xl bg-ocean-gradient text-white rounded-2xl p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/hero/desktop/f_001.webp')] bg-cover bg-center"></div>
        <div className="relative z-10">
          <span className="text-[10px] font-mono tracking-[.28em] uppercase text-[#F2B632]">Limited Time Offers</span>
          <h1 className="font-monument text-4xl sm:text-5xl normal-case tracking-tight text-white mt-2">Deals & Promotions</h1>
          <p className="max-w-2xl mx-auto text-sm leading-7 text-[#EAEFEF] mt-4">
            Exclusive fares and bundle savings for CJ Travels Owerri guests
          </p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3 justify-center">
        {['All', 'Flights', 'Hotels', 'Bundles', 'Pay Later'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              filter === f
                ? 'bg-[#F2B632] text-[#0E2931] border border-[#F2B632]'
                : 'bg-[#F4F6F5] dark:bg-[#09171C] border border-[#2B7574]/30 dark:border-[#2B7574]/50 text-[#0E2931] dark:text-[#EAEFEF] hover:border-[#F2B632]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Deal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {filteredDeals.map(deal => (
          <div key={deal.id} className="bg-[#F4F6F5] dark:bg-[#09171C] rounded-xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm overflow-hidden group">
            <div className="p-6">
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#12484C]/90 text-[#F2B632] border border-[#2B7574]/50 shadow-sm backdrop-blur-sm">
                {deal.badge}
              </span>
              <h3 className="font-monument text-xl font-bold text-[#0E2931] dark:text-[#EAEFEF] mt-3">{deal.title}</h3>
              <p className="text-sm text-[#5A6B70] dark:text-[#849CA3] mt-2 leading-relaxed">{deal.desc}</p>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] block">Price / Saving</span>
                  <span className="text-lg font-bold text-[#F2B632]">{deal.price}</span>
                </div>
                {deal.id === 1 || deal.id === 4 ? (
                  <div className="text-[10px] font-mono text-[#F2B632] tracking-widest">
                    Expires in {timers[deal.id] || '00:00:00'}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="p-6 border-t border-[#2B7574]/10 dark:border-[#2B7574]/20">
              <button
                onClick={() => setActiveRoute(deal.route)}
                className="btn-gold w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 hover:scale-[1.02] group-hover:shadow-[0_8px_24px_rgba(242,182,50,0.4)]"
              >
                Claim Offer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
