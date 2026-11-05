import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  X,
  Send,
  ArrowUp,
  Volume2,
  VolumeX,
  Plane,
  ShieldCheck,
  Zap,
  CreditCard,
  Headphones,
  Sparkles,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'concierge' | 'user';
  text: string;
  time: string;
  tag?: string;
  suggestions?: string[];
}

const QUICK_DISPATCH_PROMPTS = [
  { label: 'Flight Rebooking', icon: Plane, prompt: 'I need assistance with immediate flight rebooking or corridor routing.' },
  { label: 'Power Backup', icon: Zap, prompt: 'How do you verify 24/7 heavy generator power at destination hotels?' },
  { label: 'Fly Now Pay Later', icon: CreditCard, prompt: 'Explain the Fly Now Pay Later credit facility and repayment tenures.' },
  { label: 'Tarmac Chauffeur', icon: ShieldCheck, prompt: 'What chauffeur escort services are provided upon runway arrival?' },
];

const SUGGESTIONS: Record<string, string[]> = {
  'SOVEREIGN ADVISORY': ['I need to rebook a flight', 'Verify hotel power backup', 'Explain Fly Now Pay Later'],
  'GDS CARRIER FEED': ['Arrange tarmac chauffeur', 'Verify hotel power backup', 'Explain Fly Now Pay Later'],
  'GROUND OPS': ['Check my booking status', 'Arrange tarmac chauffeur', 'Verify hotel power backup'],
  'CREDIT DESK': ["What's the credit limit?", 'Is there an early repayment penalty?', 'What documents are required?'],
  'SANCTUARY DESK': ['Arrange tarmac chauffeur', 'Rebook my flight', 'Explain Fly Now Pay Later'],
  'VIP TRANSIT': ['Verify hotel power backup', 'Rebook my flight', 'Explain Fly Now Pay Later'],
};

const stamp = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} WAT`;
};

export const SupportModal: React.FC = () => {
  const { isSupportOpen, setSupportOpen, currentUser } = useAppStore();

  const firstName = currentUser.name.replace(/^(Dr\.?|Capt\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, '').split(' ')[0];
  const userInitials = currentUser.name
    .replace(/^(Dr\.?|Capt\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'concierge',
      text: `Good day${firstName ? `, ${firstName}` : ''}. You are connected to the Aerovista Sovereign Flight Deck & Ground Concierge. How may we assist your corridor routing or sanctuary reservation today?`,
      time: stamp(),
      tag: 'SOVEREIGN ADVISORY',
      suggestions: SUGGESTIONS['SOVEREIGN ADVISORY'],
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isSupportOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [messages, isTyping, isSupportOpen]);

  // Cockpit chime audio synthesizer using native Web Audio API
  const playCockpitChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.04, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(880, 0, 0.12);
      playTone(1320, 0.08, 0.22);
    } catch {
      // AudioContext not allowed before user gesture
    }
  };

  const submitQuery = (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: queryText,
      time: stamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);
    playCockpitChime();

    const q = queryText.toLowerCase();

    setTimeout(() => {
      let reply =
        'Our flight operations desk has received your transmission. Desks at MM2 Lagos and Nnamdi Azikiwe Abuja are actively monitoring your corridor status.';
      let tag = 'GROUND OPS';

      if (q.includes('loan') || q.includes('pay later') || q.includes('credit') || q.includes('interest')) {
        reply =
          'The Sovereign Fly Now Pay Later facility grants instant underwriting up to ₦3,000,000 with 0% initial down payment and 3 to 12-month tenures. No penalty is ever charged for early liquidation.';
        tag = 'CREDIT DESK';
      } else if (q.includes('hotel') || q.includes('power') || q.includes('generator') || q.includes('sanctuary')) {
        reply =
          'Every hotel in our Continental Atlas undergoes dual Caterpillar-grade generator audits with automatic transfer switches (<5s failover). Your suite check-in is synchronized directly to your arrival flight transponder.';
        tag = 'SANCTUARY DESK';
      } else if (q.includes('chauffeur') || q.includes('tarmac') || q.includes('pickup') || q.includes('escort')) {
        reply =
          'Runway Chauffeur transfers are coordinated with airport airside security. An armoured Mercedes Maybach or S-Class escort meets you directly at the tarmac aircraft steps upon touchdown.';
        tag = 'VIP TRANSIT';
      } else if (q.includes('flight') || q.includes('rebook') || q.includes('route') || q.includes('corridor')) {
        reply =
          'All Aerovista flight bookings are executed via direct GDS interconnects with zero agent surcharges. Verified seats and electronic boarding passes with biometric QR barcodes issue immediately.';
        tag = 'GDS CARRIER FEED';
      } else if (q.includes('booking') || q.includes('status') || q.includes('ticket') || q.includes('reference')) {
        reply =
          'Your booking reference is live in our GDS mirror. Tap My Account to view your electronic boarding pass, gate, seat, and live transponder status for any confirmed corridor.';
        tag = 'GROUND OPS';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: 'concierge',
          text: reply,
          time: stamp(),
          tag,
          suggestions: SUGGESTIONS[tag] || SUGGESTIONS['SOVEREIGN ADVISORY'],
        },
      ]);
      setIsTyping(false);
      playCockpitChime();
    }, 900);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(inputVal);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Floating Concierge Orb & Ascent Control ── */}
      <div className="fixed bottom-6 right-5 sm:right-7 z-40 flex flex-col items-end gap-3 select-none">
        {/* Ascent to Flight Level (Back to top) */}
        <button
          onClick={scrollToTop}
          aria-label="Ascend to top of page"
          className="group w-10 h-10 rounded-full bg-[#07161B]/85 hover:bg-[#12484C] text-[#F2B632] border border-[#2B7574]/40 hover:border-[#F2B632] flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md cursor-pointer hover:scale-105"
          title="Ascend to Flight Deck (Top)"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Concierge Dispatch Orb Trigger */}
        <div className="group relative flex items-center">
          {/* Hover label */}
          <span className="absolute right-full mr-3 whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#07161B]/90 backdrop-blur-md border border-[#2B7574]/40 text-[10px] font-mono uppercase tracking-wider text-[#F2B632] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none hidden sm:block shadow-xl">
            Concierge · Online
          </span>

          <button
            onClick={() => setSupportOpen(!isSupportOpen)}
            aria-label="Open 24/7 Ground Concierge Terminal"
            className="relative animate-float-soft"
          >
            {/* Rotating gold ring */}
            <span className="chat-ring absolute -inset-[3px] rounded-full opacity-80" />
            <span className="chat-ring absolute -inset-[3px] rounded-full opacity-40 [animation-direction:reverse] [animation-duration:5s]" />

            {/* Orb body */}
            <span
              className={`relative flex items-center justify-center w-14 h-14 rounded-full border transition-all duration-300 shadow-2xl backdrop-blur-xl ${
                isSupportOpen
                  ? 'bg-[#0E2931] border-[#F2B632] text-[#F2B632] shadow-[0_0_30px_rgba(242,182,50,0.4)]'
                  : 'bg-gradient-to-br from-[#12484C] to-[#07161B] border-[#2B7574]/60 hover:border-[#F2B632]/80 text-[#F4F6F5] shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
              }`}
            >
              {isSupportOpen ? (
                <X className="w-6 h-6 stroke-[2]" />
              ) : (
                <Headphones className="w-6 h-6 text-[#F2B632] stroke-[1.8]" />
              )}
            </span>

            {/* Online status dot */}
            {!isSupportOpen && (
              <span className="absolute top-0.5 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-[#07161B]" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Flight Deck Ground Dispatch Console ── */}
      {isSupportOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-7 z-50 w-[360px] sm:w-[420px] bg-[#07161B]/97 text-[#F4F6F5] border border-[#2B7574]/60 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[540px] animate-chat-rise select-none relative"
          data-lenis-prevent="true"
        >
          {/* Top Golden Laser Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F2B632] to-transparent z-20" />

          {/* Console Header Bar */}
          <div className="bg-[#0A1F26] px-4 py-3.5 border-b border-[#18363F] flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              {/* Concierge avatar orb */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#12484C] via-[#0D5C75] to-[#199FB1] animate-orb-shift border border-[#2B7574]/60 flex items-center justify-center text-[#F2B632] shadow-sm">
                  <Headphones className="w-4 h-4 stroke-[1.8]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-[#0A1F26]" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-monument text-[13px] font-bold tracking-wider text-white">
                    Aerovista Concierge
                  </span>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                  </span>
                </div>
                <p className="text-[10px] text-[#A5D1E1]/70 font-mono mt-0.5">
                  Ground Dispatch · replies instantly
                </p>
              </div>
            </div>

            {/* Utility Toggles: Sound Chime + Close */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'text-[#F2B632] border-[#2B7574]/50 bg-[#12484C]/40'
                    : 'text-[#A5D1E1]/40 border-transparent hover:text-white'
                }`}
                title={soundEnabled ? 'Chime sound enabled' : 'Mute sound chimes'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setSupportOpen(false)}
                className="p-1.5 rounded-lg text-[#A5D1E1]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close dispatch console"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* Quick-Dispatch Interactive Action Cards */}
          <div className="p-2.5 px-3 bg-[#051114]/80 border-b border-[#18363F] overflow-x-auto no-scrollbar flex items-center gap-2">
            {QUICK_DISPATCH_PROMPTS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => submitQuery(item.prompt)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D242B] hover:bg-[#12484C] text-[#A5D1E1] hover:text-[#F2B632] border border-[#2B7574]/40 hover:border-[#F2B632]/40 text-[10px] font-mono transition-all cursor-pointer"
                >
                  <Icon className="w-3 h-3 text-[#F2B632]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Transmission Stream (Messages) */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#051114]/50 text-xs font-sans overscroll-contain"
            data-lenis-prevent="true"
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-msg-pop`}>
                {/* Avatar */}
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                    m.sender === 'user'
                      ? 'bg-[#12484C] text-[#F2B632] border-[#2B7574]/60'
                      : 'bg-gradient-to-br from-[#12484C] via-[#0D5C75] to-[#199FB1] text-[#F2B632] border-[#2B7574]/60 animate-orb-shift'
                  }`}
                >
                  {m.sender === 'user' ? (
                    userInitials || 'U'
                  ) : (
                    <Headphones className="w-3.5 h-3.5 stroke-[1.8]" />
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] ${m.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className={`rounded-2xl p-3 leading-relaxed relative ${
                      m.sender === 'user'
                        ? 'bg-[#12484C] text-[#F4F6F5] border border-[#2B7574]/60 rounded-tr-sm shadow-md'
                        : 'bg-[#091D24] text-[#EAEFEF] border border-[#2B7574]/40 rounded-tl-sm shadow-lg'
                    }`}
                  >
                    {/* Category Header Stamp for Concierge */}
                    {m.sender === 'concierge' && (
                      <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-[#18363F] text-[9px] font-mono">
                        <Sparkles className="w-2.5 h-2.5 text-[#F2B632]" />
                        <span className="text-[#F2B632] font-bold tracking-wider">
                          {m.tag || 'SOVEREIGN ADVISORY'}
                        </span>
                      </div>
                    )}

                    <p className="text-[12px] leading-relaxed font-light">{m.text}</p>

                    <span className="block text-[8px] opacity-60 mt-1.5 font-mono text-right">
                      {m.time}
                    </span>
                  </div>

                  {/* Suggested follow-up chips */}
                  {m.sender === 'concierge' && m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => submitQuery(s)}
                          className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#0D242B]/70 hover:bg-[#12484C] text-[#A5D1E1] hover:text-[#F2B632] border border-[#2B7574]/30 hover:border-[#F2B632]/40 transition-all cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Equalizer Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 animate-msg-pop">
                <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-[#12484C] via-[#0D5C75] to-[#199FB1] animate-orb-shift border border-[#2B7574]/60">
                  <Headphones className="w-3.5 h-3.5 text-[#F2B632] stroke-[1.8]" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#091D24] border border-[#2B7574]/40 rounded-tl-sm">
                  <div className="flex items-end gap-1 h-4">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className="w-1 bg-[#F2B632] rounded-full origin-bottom"
                        style={{
                          height: '100%',
                          animation: 'eq-bounce 0.9s ease-in-out infinite',
                          animationDelay: `${i * 0.12}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] tracking-wider text-[#A5D1E1] font-mono">TRANSMITTING…</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Console Input Deck */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#0A1F26] border-t border-[#18363F] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Transmit inquiry to flight operations…"
              className="flex-1 bg-[#051114] border border-[#2B7574]/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#A5D1E1]/40 focus:outline-none focus:border-[#F2B632] font-mono transition-colors"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="btn-gold p-2.5 rounded-xl flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              title="Transmit dispatch"
            >
              <Send className="w-4 h-4 stroke-[2]" />
            </button>
          </form>

          {/* Bottom Telemetry Bar */}
          <div className="px-3.5 py-1.5 bg-[#051114] border-t border-[#18363F] flex items-center justify-between text-[9px] font-mono text-[#A5D1E1]/50">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TERMINAL · MM2 LAGOS
            </span>
            <span className="text-[#F2B632]">AES-256 · IATA DIRECT</span>
          </div>
        </div>
      )}
    </>
  );
};
