import React, { useEffect, useState } from 'react';
import { Bot, ChevronDown, Compass, Send, ShieldCheck, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AIRPORTS } from '../../data/mockData';

type Role = 'traveler' | 'admin';
type Message = { from: 'assistant' | 'you'; text: string };

export const DashboardAssistant: React.FC<{ role: Role; onAdminAction?: (action: string) => void }> = ({ role, onAdminAction }) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [aiReady, setAiReady] = useState(false);
  const [pendingAdminChange, setPendingAdminChange] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ from: 'assistant', text: role === 'admin' ? 'I can help you move through the sample operations dashboard. Flight records and applications here are examples.' : 'Tell me what you are planning. I can help you find the right section and shape a useful trip brief.' }]);
  const { setActiveRoute, setFlightSearch, flightOps, bookingHistory, underwritingQueue, updateFlightOps } = useAppStore();

  useEffect(() => {
    fetch('/api/assistant/status', { cache: 'no-store' }).then((res) => res.json()).then((data) => setAiReady(data.configured === true)).catch(() => setAiReady(false));
  }, []);

  const goTo = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actOnRequest = (text: string) => {
    const q = text.toLowerCase();
    if (role === 'admin') {
      if (/flight|gate|delay|status/.test(q)) onAdminAction?.('flights');
      else if (/loan|application|credit/.test(q)) onAdminAction?.('loans');
      else if (/passenger|booking|traveler/.test(q)) onAdminAction?.('passengers');
      else if (/hotel|stay|property/.test(q)) onAdminAction?.('sanctuary');
      return;
    }
    const airports = AIRPORTS.filter((airport) => q.includes(airport.city.toLowerCase()) || q.includes(airport.code.toLowerCase())).sort((a, b) => {
      const position = (item: typeof a) => {
        const city = q.indexOf(item.city.toLowerCase());
        const code = q.indexOf(item.code.toLowerCase());
        return city < 0 ? code : code < 0 ? city : Math.min(city, code);
      };
      return position(a) - position(b);
    });
    if (airports.length >= 2 && /from|to|→|->/.test(q)) {
      setFlightSearch({ originCode: airports[0].code, destinationCode: airports[1].code });
      goTo('/flights');
    } else if (/hotel|stay|room|check.?in/.test(q)) goTo('/hotels');
    else if (/pay|payment|instalment|installment|loan|budget/.test(q)) goTo('/fly-now-pay-later');
    else if (/trip|booking|boarding pass|reservation/.test(q)) goTo('/account');
    else if (/flight|route|fly|airport/.test(q)) goTo('/flights');
  };

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setMessages((items) => [...items, { from: 'you', text }]);
    setPrompt('');
    setBusy(true);
    actOnRequest(text);
    if (role === 'admin' && /delay|mark.*delayed|set.*gate/.test(text.toLowerCase())) {
      setPendingAdminChange(true);
      setMessages((items) => [...items, { from: 'assistant', text: 'I can update the first sample flight status in this dashboard. Please confirm; this does not affect a real flight.' }]);
      setBusy(false);
      return;
    }
    const context = role === 'admin'
      ? `Screen: admin dashboard. Sample flights: ${flightOps.length}; sample bookings: ${bookingHistory.length}; sample applications: ${underwritingQueue.length}.`
      : 'Screen: traveler dashboard. This is a sample travel-planning prototype.';
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, mode: role, context }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI service unavailable.');
      setMessages((items) => [...items, { from: 'assistant', text: data.answer }]);
    } catch {
      const q = text.toLowerCase();
      const reply = role === 'admin'
        ? /flight|gate|delay|status/.test(q) ? `There are ${flightOps.length} sample flights. I opened Flight ops so you can review their statuses.` : /loan|application|credit/.test(q) ? `There are ${underwritingQueue.length} sample applications. I opened the example queue for you.` : /passenger|booking|traveler/.test(q) ? `I opened the sample passenger list. It contains ${bookingHistory.length} demo bookings.` : 'I can open sample flight records, payment applications, passenger lists or hotel records. No real operation is changed.'
        : /hotel|stay|room/.test(q) ? 'I opened the hotel examples. Amenities and prices are illustrative; confirm details with the property.' : /pay|installment|instalment|loan|budget/.test(q) ? 'I opened the payment examples. The calculator is illustrative and is not a credit offer.' : /flight|route|fly|airport/.test(q) ? 'I opened the sample flight search. Check live fares and availability with the airline before booking.' : 'I can help plan a route, compare hotel details, explain the payment examples or find your saved demo trips. Try a specific city or question.';
      setMessages((items) => [...items, { from: 'assistant', text: `${reply}${aiReady ? ' The AI service did not respond this time.' : ' The AI provider is not configured, so these guided suggestions are running locally.'}` }]);
    } finally { setBusy(false); }
  };

  const quickActions = role === 'admin'
    ? [{ label: 'Review sample flights', text: 'Show me the sample flight statuses' }, { label: 'Open applications', text: 'Open the example payment applications' }, { label: 'Passenger list', text: 'Show the sample passenger bookings' }]
    : [{ label: 'Plan a Lagos–Accra flight', text: 'Find a flight from Lagos to Accra' }, { label: 'Compare stays', text: 'Show hotel stays for my trip' }, { label: 'My demo trips', text: 'Show my bookings' }];

  return <>
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close personal assistant' : 'Open personal assistant'} className="fixed z-40 left-5 bottom-24 w-14 h-14 rounded-2xl bg-[#102b30] text-[#f1d58c] border border-[#c9a955]/60 shadow-xl grid place-items-center hover:-translate-y-1 transition-transform">
      {open ? <X size={20}/> : role === 'admin' ? <ShieldCheck size={20}/> : <Compass size={21}/>}
    </button>
    {open && <section role="dialog" aria-label={role === 'admin' ? 'Admin operations assistant' : 'Personal travel assistant'} className="fixed z-50 left-3 sm:left-5 bottom-40 w-[min(390px,calc(100vw-24px))] h-[min(570px,calc(100dvh-190px))] bg-[#f7f5ef] dark:bg-[#102328] border border-[#b99a52]/50 shadow-[0_25px_75px_rgba(0,0,0,.38)] flex flex-col">
      <header className="px-4 py-4 bg-[#102b30] text-white flex items-center gap-3 border-b border-[#c9a955]/40">
        <div className="w-9 h-9 border border-[#c9a955]/60 text-[#e0c779] grid place-items-center"><Bot size={18}/></div>
        <div className="flex-1"><h2 className="text-sm font-semibold normal-case tracking-normal">{role === 'admin' ? 'Operations assistant' : 'Trip assistant'}</h2><p className="text-[10px] text-white/60">{aiReady ? 'AI connected · actions stay in this demo' : 'Guided mode · AI key not configured'}</p></div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant"><ChevronDown size={19}/></button>
      </header>
      <div className="px-4 py-2 text-[10px] leading-4 bg-[#eee8d8] text-[#5a4e31]">{role === 'admin' ? 'Only sample records can be changed here. External systems are not connected.' : 'Don’t enter passport, payment or other sensitive information. Sample data only.'}</div>
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3" aria-live="polite">
        {messages.map((message, index) => <div key={index} className={`max-w-[88%] px-3 py-2.5 text-xs leading-5 ${message.from === 'you' ? 'ml-auto bg-[#d9c47f] text-[#1d2a28]' : 'mr-auto bg-white dark:bg-[#183239] border border-black/5 dark:border-white/10'}`}><span className="block text-[9px] uppercase tracking-wider opacity-55 mb-1">{message.from === 'you' ? 'You' : 'Assistant'}</span>{message.text}</div>)}
        {pendingAdminChange && <button type="button" onClick={() => { const flight = flightOps[0]; if (flight) updateFlightOps(flight.id, { status: 'Delayed' }); setPendingAdminChange(false); setMessages((items) => [...items, { from: 'assistant', text: flightOps[0] ? `${flightOps[0].flightNumber} marked delayed in the sample dashboard.` : 'No sample flight is available to update.' }]); }} className="px-3 py-2 border border-[#8f7738] text-xs hover:bg-[#e8dfc5] dark:hover:bg-[#1b393f]">Confirm sample change</button>}
        {busy && <p className="text-xs opacity-60">Putting that together…</p>}
      </div>
      <div className="px-3 pb-2 flex gap-2 overflow-x-auto">{quickActions.map((item) => <button key={item.label} type="button" onClick={() => void send(item.text)} className="shrink-0 px-2.5 py-1.5 border border-[#8f7738]/40 text-[10px] hover:bg-[#e8dfc5] dark:hover:bg-[#1b393f]">{item.label}</button>)}</div>
      <form onSubmit={(event) => { event.preventDefault(); void send(prompt); }} className="p-3 border-t border-black/10 dark:border-white/10 flex gap-2">
        <input value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label="Ask the assistant" placeholder={role === 'admin' ? 'Ask about sample operations…' : 'Where would you like to go?'} className="min-w-0 flex-1 h-11 px-3 text-xs bg-white dark:bg-[#0b1c20] border border-black/10 dark:border-white/10 outline-none focus:border-[#b99a52]"/>
        <button disabled={busy || !prompt.trim()} aria-label="Send message" className="w-11 h-11 grid place-items-center bg-[#102b30] text-[#e0c779] disabled:opacity-40"><Send size={16}/></button>
      </form>
    </section>}
  </>;
};
