import React, { useState } from 'react';
import { ArrowRight, MapPinned, Send } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const TripPlanner: React.FC = () => {
  const [brief, setBrief] = useState('');
  const [plan, setPlan] = useState('');
  const [busy, setBusy] = useState(false);
  const [providerReady, setProviderReady] = useState<boolean | null>(null);
  const setActiveRoute = useAppStore((state) => state.setActiveRoute);

  const buildPlan = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!brief.trim() || busy) return;
    setBusy(true);
    setPlan('');
    const localPlan = `A useful starting point for ${brief.trim()}:\n\nDay 1 · Arrive and get settled. Keep the first plans close to where you are staying, and leave time for the journey from the airport.\n\nDay 2 · Choose one main activity that matters to you, then leave space for a meal and a slower wander nearby.\n\nDay 3 · Keep the morning flexible. Check opening hours and your return transport before you head out.\n\nBefore you book, confirm current flight times, local transport, opening hours and hotel details. This outline is a planning aid, not live travel information.`;
    try {
      const response = await fetch('/api/assistant', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'trip-planner', message: brief.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Planner is unavailable.');
      setProviderReady(true);
      setPlan(data.answer);
    } catch {
      setProviderReady(false);
      setPlan(localPlan);
    } finally { setBusy(false); }
  };

  return <section className="relative py-20 sm:py-28 px-5 sm:px-10 overflow-hidden bg-[#e9e4d8] text-[#14292d]">
    <div className="absolute right-0 top-0 h-full w-[32%] border-l border-[#9b7c38]/20 hidden lg:block"/>
    <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-20 items-start">
      <div><p className="text-[10px] uppercase tracking-[.28em] text-[#896e31]">A better starting point</p><h2 className="mt-5 max-w-xl font-serif text-4xl sm:text-6xl leading-[.98]">Tell us what kind of trip you have in mind.</h2><p className="mt-6 max-w-md text-sm leading-7 text-[#4e5f60]">Get a first-pass itinerary shaped around your pace and interests. Add a city, dates or budget if you like, but leave out personal or payment details.</p><div className="mt-8 flex items-center gap-2 text-xs text-[#526365]"><MapPinned size={16} className="text-[#896e31]"/>Flights and stays remain sample listings.</div></div>
      <div className="bg-[#f7f5ef] border border-[#c6b98e] p-5 sm:p-8 shadow-[12px_12px_0_rgba(16,43,48,.08)]">
        <form onSubmit={buildPlan} className="space-y-4"><label htmlFor="trip-brief" className="block text-xs font-semibold tracking-wide">What would make this trip a good one?</label><textarea id="trip-brief" value={brief} onChange={(event) => setBrief(event.target.value)} maxLength={900} rows={4} placeholder="Three days in Accra, local food and art, an easy pace…" className="w-full resize-y min-h-28 p-4 bg-white border border-[#d5d2c6] text-sm leading-6 outline-none focus:border-[#896e31]"/><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><p className="text-[10px] leading-4 text-[#697677]">{providerReady === true ? 'AI itinerary planner connected.' : providerReady === false ? 'AI is not configured; a local planning outline is ready.' : 'Your prompt is sent to the configured AI provider. Leave out personal or payment details.'}</p><button disabled={busy || !brief.trim()} className="shrink-0 inline-flex justify-center items-center gap-3 px-5 py-3 bg-[#102b30] text-white text-xs hover:bg-[#1b4549] disabled:opacity-45">{busy ? 'Putting the plan together…' : 'Build my trip brief'}<Send size={15}/></button></div></form>
        {plan && <div className="mt-7 border-t border-[#d5d2c6] pt-6"><h3 className="font-serif text-2xl">Your first-pass plan</h3><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#3f5153]">{plan}</p><div className="mt-6 flex flex-wrap gap-3"><button onClick={() => { setActiveRoute('/destinations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 text-xs border-b border-[#896e31] pb-1">Browse destinations <ArrowRight size={14}/></button><button onClick={() => { setActiveRoute('/flights'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 text-xs border-b border-[#896e31] pb-1">Compare sample flights <ArrowRight size={14}/></button></div></div>}
      </div>
    </div>
  </section>;
};
