import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  X,
  Send,
  ArrowUp,
  Headphones,
  MessageSquare,
  HelpCircle,
  Phone,
  CheckCircle2,
  ChevronRight,
  Plane,
  CreditCard,
  Building2,
  ShieldCheck,
  Search,
  PhoneCall,
  Clock,
  RotateCcw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'support' | 'user';
  text: string;
  time: string;
}

interface HelpArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  icon: React.ComponentType<{ className?: string }>;
}

const HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'art-1',
    category: 'Flight Care',
    title: 'Flight Changes & Baggage Rules',
    summary: 'Complimentary changes on First Class suites and baggage allowances.',
    content: 'First Class suite passengers are entitled to 3 × 32kg checked baggage and complimentary date rebooking up to 4 hours prior to departure. Economy tickets can be changed with zero penalty fee up to 24 hours after booking.',
    icon: Plane,
  },
  {
    id: 'art-2',
    category: 'Financing',
    title: 'Fly Now Pay Later Repayment Guide',
    summary: '0% APR sovereign facility, amortization terms, and early liquidation.',
    content: 'The 0% APR travel financing facility features tenures of 3, 6, or 12 months with 25% down payment. Automated debits occur on the 12th of each month via NIBSS. No penalty is ever charged for early liquidation in full.',
    icon: CreditCard,
  },
  {
    id: 'art-3',
    category: 'Accommodation',
    title: 'Hotel Power Resilience Guarantee',
    summary: '100% dual CAT diesel generator audit and <3s ATS switchover.',
    content: 'All verified partner hotels and presidential sanctuaries are physically audited for dual Caterpillar generators with automatic transfer switches (<3s ATS failover). Suite keycodes synchronize directly with your arrival flight transponder.',
    icon: Building2,
  },
  {
    id: 'art-4',
    category: 'Ground Transit',
    title: 'Airside Tarmac Chauffeur Protocol',
    summary: 'Direct airside aircraft stairs pickup in Mercedes-Maybach S-Class.',
    content: 'Airside tarmac transfers are pre-coordinated with airport security. Your chauffeur meets you directly at the aircraft stairs upon touchdown with diplomatic fast-track luggage delivery.',
    icon: ShieldCheck,
  },
];

const formatTime = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const SupportModal: React.FC = () => {
  const { isSupportOpen, setSupportOpen, currentUser } = useAppStore();

  const [activeTab, setActiveTab] = useState<'chat' | 'help' | 'callback'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'support',
      text: `Hello ${currentUser.name.split(' ')[0] || 'there'}, welcome to CJ Travels Owerri Customer Support Center. I'm Nkem from the guest care team. How can we help you with your journey or bookings today?`,
      time: formatTime(),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Help search
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  // Callback request state
  const [callbackPhone, setCallbackPhone] = useState(currentUser.phone || '+234 803 456 7890');
  const [callbackUrgency, setCallbackUrgency] = useState<'immediate' | '15min' | 'scheduled'>('immediate');
  const [callbackConfirmed, setCallbackConfirmed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSupportOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isTyping, isSupportOpen, activeTab]);

  const submitQuery = (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: queryText,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    const q = queryText.toLowerCase();

    setTimeout(() => {
      let reply = 'Thank you for contacting customer support. We are reviewing your record and will assist immediately.';

      if (q.includes('loan') || q.includes('pay later') || q.includes('credit') || q.includes('fnpl')) {
        reply = 'Our Fly Now Pay Later facility offers 0% interest with repayments spread over 3, 6, or 12 months. You can manage or settle installments directly from your account dashboard.';
      } else if (q.includes('hotel') || q.includes('power') || q.includes('generator') || q.includes('stay')) {
        reply = 'Every sanctuary in our collection is backed by our 100% power resilience audit with dual CAT generators and <3s automated switchover guarantee.';
      } else if (q.includes('chauffeur') || q.includes('tarmac') || q.includes('pickup') || q.includes('transfer')) {
        reply = 'Tarmac chauffeur transfers are confirmed with airport security. A Mercedes-Maybach S-Class driver will be waiting at the aircraft steps upon arrival.';
      } else if (q.includes('flight') || q.includes('booking') || q.includes('change') || q.includes('ticket')) {
        reply = 'Flight reservations can be modified with zero change fee up to 4 hours before departure for First Class suites, or managed in your Account Desk.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `s-${Date.now()}`,
          sender: 'support',
          text: reply,
          time: formatTime(),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(inputVal);
  };

  const handleRequestCallback = (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackConfirmed(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `s-call-${Date.now()}`,
          sender: 'support',
          text: `Priority callback request logged for ${callbackPhone}. A guest care officer will ring your phone within 3 minutes.`,
          time: formatTime(),
        },
      ]);
      setActiveTab('chat');
      setCallbackConfirmed(false);
    }, 1200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = HELP_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          FLOATING WIDGET: CLEAN CUSTOMER SERVICE ICON (NO RING, NO SHADOWS)
         ═══════════════════════════════════════════════════════════════ */}
      <div
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 select-none"
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem' }}
      >
        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="w-10 h-10 rounded-2xl bg-[#0E2931] hover:bg-[#12484C] text-[#A5D1E1] hover:text-white border border-[#2B7574]/40 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* Support Center Launcher Button */}
        <button
          onClick={() => setSupportOpen(!isSupportOpen)}
          aria-expanded={isSupportOpen}
          aria-label={isSupportOpen ? 'Close Support Center' : 'Open Support Center'}
          className={`relative w-12 h-12 rounded-2xl border transition-colors flex items-center justify-center cursor-pointer ${
            isSupportOpen
              ? 'bg-[#12484C] text-[#F2B632] border-[#F2B632]'
              : 'bg-[#0E2931] hover:bg-[#12484C] text-[#F2B632] border-[#2B7574]/60 hover:border-[#F2B632]'
          }`}
        >
          {isSupportOpen ? (
            <X className="w-5 h-5 stroke-[2]" />
          ) : (
            <Headphones className="w-5 h-5 stroke-[2]" />
          )}

          {/* Clean presence indicator dot (no ping, no shadow) */}
          {!isSupportOpen && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SUPPORT CENTER PANEL (PROFESSIONAL CUSTOMER CARE DESK)
         ═══════════════════════════════════════════════════════════════ */}
      {isSupportOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed bottom-20 right-6 z-50 w-[410px] max-w-[calc(100vw-28px)] h-[580px] max-h-[calc(100dvh-100px)] bg-[#07161B] text-[#EAEFEF] border border-[#2B7574]/60 rounded-3xl flex flex-col overflow-hidden animate-in fade-in duration-200 select-none"
          style={{
            position: 'fixed',
            bottom: '5.25rem',
            right: '1.5rem',
            zIndex: 60,
          }}
        >
          {/* ── Support Center Header ── */}
          <div className="px-5 py-4 bg-[#0A1F26] border-b border-[#18363F] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-[#12484C] text-[#F2B632] border border-[#2B7574]/60 flex items-center justify-center font-mono font-bold text-xs">
                  NA
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0A1F26]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    CJ Travels Support
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    24/7 LIVE
                  </span>
                </div>
                <p className="text-[10px] text-[#A5D1E1]/80 font-mono mt-0.5">
                  Guest Care &amp; Flight Operations · Under 1m wait
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSupportOpen(false)}
              className="p-1.5 rounded-xl text-[#A5D1E1]/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close support center"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Support Center Navigation Tabs ── */}
          <div className="grid grid-cols-3 bg-[#051114] border-b border-[#18363F] text-xs font-mono shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-b-2 border-[#F2B632] text-[#F2B632] font-bold bg-[#091F26]'
                  : 'text-[#A5D1E1] hover:text-white'
              }`}
            >
              <MessageSquare size={13} />
              <span>Live Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('help')}
              className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'help'
                  ? 'border-b-2 border-[#F2B632] text-[#F2B632] font-bold bg-[#091F26]'
                  : 'text-[#A5D1E1] hover:text-white'
              }`}
            >
              <HelpCircle size={13} />
              <span>Help Center</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('callback')}
              className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'callback'
                  ? 'border-b-2 border-[#F2B632] text-[#F2B632] font-bold bg-[#091F26]'
                  : 'text-[#A5D1E1] hover:text-white'
              }`}
            >
              <Phone size={13} />
              <span>Callback</span>
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              TAB 1: LIVE SUPPORT CHAT
             ───────────────────────────────────────────────────────────── */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-[#07161B]">
              {/* Quick Topic Chips */}
              <div className="px-3 py-2 bg-[#051114] border-b border-[#18363F] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                {[
                  { label: 'Flight changes', prompt: 'I need to check or modify my flight corridor.' },
                  { label: 'Baggage rules', prompt: 'What is the checked baggage allowance for my suite?' },
                  { label: 'FNPL payment', prompt: 'How do I settle my monthly travel loan installment?' },
                  { label: 'Tarmac driver', prompt: 'Confirm tarmac chauffeur details for my arrival.' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => submitQuery(chip.prompt)}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#091F26] hover:bg-[#12484C] text-[#A5D1E1] hover:text-[#F2B632] border border-[#2B7574]/40 text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Message Stream */}
              <div
                className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-mono"
                data-lenis-prevent="true"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 text-[9px] text-[#A5D1E1]/60 px-1">
                      <span>{m.sender === 'user' ? 'You' : 'Nkem A. (Guest Care)'}</span>
                      <span>·</span>
                      <span>{m.time}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#12484C] text-white rounded-tr-xs border border-[#2B7574]'
                          : 'bg-[#0A1F26] text-[#EAEFEF] rounded-tl-xs border border-[#2B7574]/40'
                      }`}
                    >
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-[10px] text-[#A5D1E1]/70 font-mono p-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F2B632] animate-bounce" />
                    <span>Nkem is typing an answer...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-3 bg-[#0A1F26] border-t border-[#18363F] flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask customer support a question..."
                  className="flex-1 bg-[#051114] border border-[#2B7574]/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#A5D1E1]/40 focus:outline-none focus:border-[#F2B632] font-mono transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isTyping}
                  className="w-10 h-10 rounded-xl bg-[#12484C] hover:bg-[#1a5f64] text-[#F2B632] border border-[#2B7574]/80 flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer shrink-0"
                  title="Send message"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 2: KNOWLEDGE BASE & HELP ARTICLES
             ───────────────────────────────────────────────────────────── */}
          {activeTab === 'help' && (
            <div className="flex-1 flex flex-col min-h-0 bg-[#07161B] p-4 space-y-3.5 overflow-y-auto">
              {/* Search Bar */}
              <div className="relative shrink-0">
                <Search className="w-4 h-4 text-[#A5D1E1] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search help articles & FAQs..."
                  className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-[#051114] border border-[#2B7574]/40 text-xs text-white font-mono placeholder-[#A5D1E1]/40 outline-none focus:border-[#F2B632]"
                />
              </div>

              {/* Articles List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {filteredArticles.map((art) => {
                  const Icon = art.icon;
                  const isExpanded = expandedArticleId === art.id;
                  return (
                    <div
                      key={art.id}
                      className="p-3.5 rounded-2xl bg-[#0A1F26] border border-[#2B7574]/40 font-mono transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedArticleId(isExpanded ? null : art.id)}
                        className="w-full text-left flex items-start gap-3 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-[#12484C] text-[#F2B632] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <span className="text-[9px] uppercase font-bold text-[#F2B632] block">
                            {art.category}
                          </span>
                          <h4 className="text-xs font-bold text-white mt-0.5">
                            {art.title}
                          </h4>
                          <p className="text-[10px] text-[#A5D1E1]/80 mt-1 leading-relaxed">
                            {art.summary}
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-[#A5D1E1] shrink-0 mt-2 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-white/90 leading-relaxed">
                          <p>{art.content}</p>
                          <button
                            type="button"
                            onClick={() => {
                              submitQuery(`Help with: ${art.title}`);
                              setActiveTab('chat');
                            }}
                            className="mt-2 text-[10px] text-[#F2B632] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Ask an agent about this →</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 3: PRIORITY PHONE CALLBACK & DIRECT HOTLINE
             ───────────────────────────────────────────────────────────── */}
          {activeTab === 'callback' && (
            <div className="flex-1 flex flex-col min-h-0 bg-[#07161B] p-5 space-y-4 overflow-y-auto font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#0A1F26] border border-[#2B7574]/50 space-y-2">
                <span className="text-[10px] text-[#F2B632] font-bold uppercase block">
                  Direct Guest Care Hotline
                </span>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">+234 (01) 800-CJTRAVELS</span>
                </div>
                <p className="text-[10px] text-[#A5D1E1]/80">
                  Toll-free 24/7 client line for flight disruptions and medical priority.
                </p>
              </div>

              {/* Request Callback Form */}
              <form onSubmit={handleRequestCallback} className="p-4 rounded-2xl bg-[#0A1F26] border border-[#2B7574]/40 space-y-3.5">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
                  <Clock className="w-4 h-4 text-[#F2B632]" />
                  <span>Request Priority Callback</span>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#A5D1E1] mb-1">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 rounded-xl bg-[#051114] border border-[#2B7574]/50 text-white font-mono text-xs outline-none focus:border-[#F2B632]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#A5D1E1] mb-1">
                    Expected Response
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCallbackUrgency('immediate')}
                      className={`py-2 rounded-xl text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                        callbackUrgency === 'immediate'
                          ? 'bg-[#12484C] text-[#F2B632] border-[#2B7574]'
                          : 'bg-[#051114] text-[#A5D1E1] border-white/5'
                      }`}
                    >
                      Within 3 Mins
                    </button>
                    <button
                      type="button"
                      onClick={() => setCallbackUrgency('15min')}
                      className={`py-2 rounded-xl text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                        callbackUrgency === '15min'
                          ? 'bg-[#12484C] text-[#F2B632] border-[#2B7574]'
                          : 'bg-[#051114] text-[#A5D1E1] border-white/5'
                      }`}
                    >
                      Within 15 Mins
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={callbackConfirmed}
                  className="w-full h-11 rounded-xl bg-[#12484C] hover:bg-[#1a5f64] text-[#F2B632] border border-[#2B7574]/70 font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <PhoneCall size={14} />
                  <span>{callbackConfirmed ? 'Request Queued...' : 'Request Instant Callback'}</span>
                </button>
              </form>
            </div>
          )}

          {/* ── Support Center Static Footer ── */}
          <div className="px-4 py-2 bg-[#051114] border-t border-[#18363F] flex items-center justify-between text-[9px] font-mono text-[#A5D1E1]/60 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              GUEST CARE DESK · MM2 LAGOS
            </span>
            <span className="text-[#F2B632]">TICKET REGISTRY ACTIVE</span>
          </div>
        </div>
      )}
    </>
  );
};
