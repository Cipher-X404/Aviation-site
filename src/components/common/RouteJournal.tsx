import React from 'react';
import { useAppStore } from '../../store/useAppStore';

const notes: Record<string, { eyebrow: string; title: string; body: string; items: [string, string][] }> = {
  '/flights': { eyebrow: 'Before you depart', title: 'A little more certainty, before take-off.', body: 'Every itinerary is easier when the practical details are settled early. Our team can help with changes, special assistance and the small questions that rarely fit inside a search form.', items: [['Baggage', 'Allowance varies by carrier and fare family; check the fare rules before payment.'], ['At the airport', 'Arrive early for international departures and keep your booking reference close.'], ['Need a hand?', 'Use the concierge panel for help with a route or an existing reservation.']] },
  '/hotels': { eyebrow: 'The stay matters too', title: 'Choose the neighbourhood, not just the room.', body: 'A good hotel makes the hours around your flight feel considered. Compare location and arrival timing alongside the nightly rate, especially when landing late.', items: [['Late arrivals', 'Confirm reception hours and share your estimated arrival time with the property.'], ['Getting around', 'Ask about airport transfers and the likely journey time at your arrival hour.'], ['Room requests', 'Special requests are subject to availability; contact the property before travel.']] },
  '/destinations': { eyebrow: 'Field notes', title: 'Go for the place. Stay for the details.', body: 'West Africa rewards a little planning. Leave room in your itinerary for local markets, waterfronts and the slower rhythm between the headline sights.', items: [['Lagos', 'Plan journeys across the city around traffic and the time of day.'], ['Abuja', 'A broad, spread-out capital; group visits by district to save time.'], ['Port Harcourt', 'Build in time for the river city’s food, culture and changing pace.']] },
  '/fly-now-pay-later': { eyebrow: 'Read the small print', title: 'Know the full journey before you commit.', body: 'A payment plan should be clear from the first instalment to the last. Review your down payment, monthly amount, term and applicable fees before confirming a booking.', items: [['Choose a term', 'Compare the total repayment across available terms, not only the monthly figure.'], ['Keep dates in mind', 'Your travel date and repayment schedule are separate commitments.'], ['Settle early', 'Check the displayed agreement for early settlement terms before proceeding.']] },
  '/account': { eyebrow: 'Your travel desk', title: 'Keep every trip in one place.', body: 'Your account brings together passenger details and booking history. Check names carefully against travel documents before confirming any reservation.', items: [['Passenger details', 'Use the spelling shown on the document you will travel with.'], ['Booking records', 'Keep your reference available when contacting support.'], ['Privacy', 'Only provide information needed to manage your travel.']] },
};

export const RouteJournal: React.FC<{ route: string }> = ({ route }) => {
  const entry = notes[route];
  const setActiveRoute = useAppStore((state) => state.setActiveRoute);
  if (!entry) return null;
  return <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 pb-20 pt-8">
    <div className="border-t border-[#2B7574]/30 pt-10 sm:pt-14 grid lg:grid-cols-[.82fr_1.18fr] gap-8 lg:gap-20">
      <div><p className="text-[10px] tracking-[.28em] uppercase text-[#9a7727] mb-4">{entry.eyebrow}</p><h2 className="font-serif normal-case tracking-tight text-3xl sm:text-5xl leading-tight max-w-lg">{entry.title}</h2><p className="mt-5 max-w-lg text-sm leading-7 opacity-70">{entry.body}</p></div>
      <div className="divide-y divide-[#2B7574]/20 border-y border-[#2B7574]/20">{entry.items.map(([title, body], index) => <article key={title} className="grid grid-cols-[42px_1fr] gap-4 py-5 sm:py-6"><span className="font-mono text-xs text-[#9a7727] pt-1">0{index + 1}</span><div><h3 className="normal-case tracking-normal text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 opacity-65 max-w-xl">{body}</p></div></article>)}</div>
    </div>
    <button onClick={() => setActiveRoute('/')} className="mt-8 text-xs uppercase tracking-[.18em] border-b border-[#9a7727] pb-2 hover:text-[#9a7727]">Back to Aerovista home ↗</button>
  </section>;
};
