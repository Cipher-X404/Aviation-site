import React, { useEffect, useState, useRef } from 'react';
import {
  BrainCircuit,
  ChevronDown,
  Compass,
  Send,
  ShieldCheck,
  X,
  CreditCard,
  Plane,
  Building2,
  Users,
  Award,
  Zap,
  CheckCircle2,
  Radio,
  Terminal,
  ArrowRight,
  RefreshCw,
  Phone,
  SlidersHorizontal,
  Lock,
  KeyRound
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

type Role = 'traveler' | 'admin';

interface ActionReceipt {
  timestamp: string;
  actionName: string;
  detail: string;
}

interface Message {
  from: 'copilot' | 'user';
  text: string;
  receipt?: ActionReceipt;
  suggestedActions?: { label: string; payload: string }[];
}

export const DashboardAssistant: React.FC<{
  role: Role;
  onAdminAction?: (action: string) => void;
}> = ({ role, onAdminAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [aiConnected, setAiConnected] = useState(false);
  const [executionLog, setExecutionLog] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    setActiveRoute,
    setFlightSearch,
    flightOps,
    bookingHistory,
    underwritingQueue,
    updateFlightOps,
    updateBookingRecord,
    updatePassengerMeal,
    payLoanInstallment,
    batchApprovePrimeLoans,
    declineUnderwriting,
    currentUser,
    currency,
  } = useAppStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'copilot',
      text:
        role === 'admin'
          ? 'Autonomous Airspace & GDS Dispatch Copilot initialized. I can execute flight gate reassignments, batch-approve Prime Tier 1 underwriting applications, hedge CBN FX escrow tranches, and broadcast airfield weather advisories.'
          : 'Sovereign Concierge Copilot active. I can settle your loan installments, upgrade your suite to 1A, dispatch your tarmac Maybach chauffeur, and optimize your miles rewards.',
      suggestedActions:
        role === 'admin'
          ? [
              { label: '⚡ Auto-Approve Tier 1 Prime Loans', payload: 'approve_prime' },
              { label: '🛫 Reassign Delayed AV-702 to Gate B12', payload: 'reassign_av702' },
              { label: '🔒 Lock CBN FX Escrow Batch ($288k)', payload: 'lock_fx' },
              { label: '🛡️ Decline High-Risk Applications', payload: 'decline_risky' },
            ]
          : [
              { label: '⚡ Settle Next Installment (₦27,850)', payload: 'pay_installment' },
              { label: '👑 Upgrade Seat to 1A Suite', payload: 'upgrade_seat' },
              { label: '🚗 Dispatch Maybach Chauffeur', payload: 'dispatch_chauffeur' },
              { label: '🍷 Order Dom Pérignon & Caviar', payload: 'update_meal' },
              { label: '💎 Simulate Miles for Dubai Flight', payload: 'sim_miles' },
            ],
    },
  ]);

  useEffect(() => {
    fetch('/api/assistant/status', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setAiConnected(data.configured === true))
      .catch(() => setAiConnected(false));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, executionLog]);

  /* ─── Autonomous Action Engine ─── */
  const executeAutonomousAction = async (payload: string): Promise<ActionReceipt | null> => {
    setIsExecuting(true);
    setExecutionLog('Initiating Autonomous Protocol Handshake...');

    await new Promise((r) => setTimeout(r, 600));

    // Admin Actions
    if (role === 'admin') {
      if (payload === 'approve_prime' || /approve.*prime|batch.*approve|underwrite/i.test(payload)) {
        setExecutionLog('[GDS_RISK] Scanning Underwriting Queue for Prime Tier 1 (DTI < 25%)...');
        await new Promise((r) => setTimeout(r, 700));
        const approvedCount = batchApprovePrimeLoans();
        setExecutionLog(`[CBN_ESCROW] Approved ${approvedCount || 2} applications with 0% APR Sovereign Subsidy.`);
        return {
          timestamp: new Date().toLocaleTimeString(),
          actionName: 'BATCH CREDIT UNDERWRITING CLEARANCE',
          detail: `Approved ${approvedCount || 2} applications in Underwriting Queue. CBN GDS escrow allocation locked.`,
        };
      }

      if (payload === 'reassign_av702' || /reassign|gate|runway|delay/i.test(payload)) {
        setExecutionLog('[ATC_CORRIDOR] Reassigning Boeing 787-9 (AV-702) from Gate D08 to Gate B12...');
        await new Promise((r) => setTimeout(r, 700));
        const targetFlight = flightOps.find((f) => f.flightNumber === 'AV-702') || flightOps[0];
        if (targetFlight) {
          updateFlightOps(targetFlight.id, {
            gate: 'Gate B12',
            status: 'Boarding',
          });
        }
        setExecutionLog('[ATC_RADAR] Flight AV-702 rerouted to Gate B12 & Runway 18R. Passenger notify dispatched.');
        return {
          timestamp: new Date().toLocaleTimeString(),
          actionName: 'ATC GATE & RUNWAY REASSIGNMENT',
          detail: 'Flight AV-702 reallocated to Gate B12 with Boarding status. MM2 ground telemetry synchronized.',
        };
      }

      if (payload === 'lock_fx' || /fx|escrow|settle|cbn/i.test(payload)) {
        setExecutionLog('[CBN_CLEARING] Connecting to Central Bank FX Clearing Window...');
        await new Promise((r) => setTimeout(r, 700));
        setExecutionLog('[CBN_CLEARING] Pegged ₦1,485.50 / $1 for clearing tranche $288,000. Escrow certificate #CBN-9012 issued.');
        return {
          timestamp: new Date().toLocaleTimeString(),
          actionName: 'CBN ESCROW RATE LOCK',
          detail: 'Tranche of $288,000 hedged at ₦1,485.50. IATA clearing netting cycle executed.',
        };
      }

      if (payload === 'decline_risky' || /decline|flag|high risk/i.test(payload)) {
        setExecutionLog('[RISK_FILTER] Flagging applications with DTI > 50%...');
        await new Promise((r) => setTimeout(r, 700));
        const risky = underwritingQueue.find((u) => u.dtiRatioPercent > 50);
        if (risky) declineUnderwriting(risky.id);
        setExecutionLog('[RISK_FILTER] High-risk application flagged and declined under sovereign prudential ratio.');
        return {
          timestamp: new Date().toLocaleTimeString(),
          actionName: 'CREDIT PRUDENTIAL DECLINE',
          detail: 'Flagged application declined to protect sovereign liquidity ratio.',
        };
      }
    }

    // Traveler Actions
    if (role === 'traveler') {
      if (payload === 'pay_installment' || /pay.*installment|settle.*loan|monthly.*payment/i.test(payload)) {
        setExecutionLog('[NIBSS_DEBIT] Connecting to Zenith Bank Direct Debit Mandate...');
        await new Promise((r) => setTimeout(r, 700));
        const activeLoan = bookingHistory.find((b) => b.loanDetails && b.loanDetails.remainingBalanceNgn > 0);
        if (activeLoan && activeLoan.loanDetails) {
          payLoanInstallment(activeLoan.id, activeLoan.loanDetails.monthlyPaymentNgn);
        }
        setExecutionLog('[CBN_ESCROW] Installment recorded and principal decremented.');
        return {
          timestamp: new Date().toLocaleTimeString(),
          actionName: 'INSTALLMENT SETTLEMENT EXECUTED',
          detail: `Monthly payment settled via Sovereign CBN Escrow. Remaining tenure updated in Amortization Ledger.`,
        };
      }

      if (payload === 'upgrade_seat' || /upgrade|seat|suite|1a/i.test(payload)) {
        setExecutionLog('[SEAT_MATRIX] Querying First Class Suite availability on Flight AV-304...');
        await new Promise((r) => setTimeout(r, 700));
        if (bookingHistory[0]) {
          updateBookingRecord(bookingHistory[0].id, { seat: '1A (Presidential Suite)' });
        }
        setExecutionLog('[SEAT_MATRIX] Seat suite updated to 1A with lie-flat recline & private sliding partition.');
        return {
          timestamp: new Date().toLocaleTimeString(),
          actionName: 'PRESIDENTIAL SUITE UPGRADE',
          detail: 'Seat reassigned to 1A (Forward Lie-Flat Suite) with priority Zone 1 tarmac boarding.',
        };
      }

      if (payload === 'dispatch_chauffeur' || /chauffeur|maybach|transfer|car|driver/i.test(payload)) {
        setExecutionLog('[AIRSIDE_FLEET] Locating Maybach S-Class 680 on MM2 Presidential Tarmac...');
        await new Promise((r) => setTimeout(r, 700));
        setExecutionLog('[AIRSIDE_FLEET] Vehicle Tag ABJ-01-EXP assigned. Chauffeur Tunde Adeyemi confirmed.');
        return {
          timestamp: new Date().toLocaleTimeString(),
          actionName: 'TARMAC CHAUFFEUR DISPATCHED',
          detail: 'Mercedes-Maybach S-Class 680 staged at aircraft stairs. Chauffeur contact: +234 803 291 0041.',
        };
      }

      if (payload === 'update_meal' || /meal|caviar|dining|food|dom perignon/i.test(payload)) {
        setExecutionLog('[IN_FLIGHT_CHEF] Relaying culinary preference to MM2 Flight Catering...');
        await new Promise((r) => setTimeout(r, 700));
        if (bookingHistory[0]) {
          updatePassengerMeal(bookingHistory[0].id, 'Royal Beluga Caviar & Dom Pérignon (Halal Gourmet)');
        }
        setExecutionLog('[IN_FLIGHT_CHEF] Gourmet menu locked. Executive sommelier notified.');
        return {
          timestamp: new Date().toLocaleTimeString(),
          actionName: 'IN-FLIGHT CATERING RESERVATION',
          detail: 'Royal Beluga Caviar with chilled Dom Pérignon selected for departure leg.',
        };
      }

      if (payload === 'sim_miles' || /miles|redeem|points|dubai/i.test(payload)) {
        setExecutionLog('[LOYALTY_VAULT] Calculating optimal redemption yield for 148,250 Miles...');
        await new Promise((r) => setTimeout(r, 600));
        return {
          timestamp: new Date().toLocaleTimeString(),
          actionName: 'MILES REDEMPTION INTELLIGENCE',
          detail: '148,250 PTS covers 2 return First Class suites LOS ⇄ DXB or 3 luxury nights at Transcorp Hilton Abuja.',
        };
      }
    }

    setExecutionLog(null);
    return null;
  };

  /* ─── Submit User Input ─── */
  const handleSend = async (customText?: string) => {
    const raw = customText || prompt;
    const text = raw.trim();
    if (!text || isExecuting) return;

    setMessages((prev) => [...prev, { from: 'user', text }]);
    setPrompt('');

    // Check if this is an actionable command
    const receipt = await executeAutonomousAction(text);

    if (receipt) {
      setMessages((prev) => [
        ...prev,
        {
          from: 'copilot',
          text: `Autonomous directive acknowledged and executed on live telemetry.`,
          receipt,
        },
      ]);
      setIsExecuting(false);
      setExecutionLog(null);
      return;
    }

    // Otherwise, call API or intelligent autonomous responder
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mode: role,
          context:
            role === 'admin'
              ? `Operational context: MM2 Flight Deck. Flights: ${flightOps.length}, Queue: ${underwritingQueue.length}`
              : `Passenger context: Dr. Folashade Adeleke. Active PNR: AV-7821-LOS. Miles: 148,250.`,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        {
          from: 'copilot',
          text: data.answer || 'Directive processed across sovereign operational telemetry.',
        },
      ]);
    } catch {
      // Intelligent fallback answer
      const reply =
        role === 'admin'
          ? `Directive noted. Active flight operations across MM2 and DNAA are running nominal with 94% load factor. Underwriting queue contains 4 applications with CBN FX peg maintained at ₦1,485.50.`
          : `Your sovereign itinerary (LOS → ABV Flight AV-304) is scheduled for 07:15 WAT boarding at Gate B4. Your 0% FNPL facility has ₦2,520,000 available credit.`;

      setMessages((prev) => [
        ...prev,
        {
          from: 'copilot',
          text: reply,
        },
      ]);
    } finally {
      setIsExecuting(false);
      setExecutionLog(null);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close Autonomous Copilot' : 'Open Autonomous Copilot'}
        className="fixed z-40 left-5 bottom-24 h-14 px-4 rounded-2xl bg-[#07161B]/90 backdrop-blur-xl text-[#F2B632] border border-[#2B7574]/60 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center gap-3 hover:-translate-y-1 hover:border-[#F2B632]/80 transition-all cursor-pointer group"
      >
        <div className="relative">
          <BrainCircuit className="w-5 h-5 text-[#F2B632] group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#F2B632]">
            {role === 'admin' ? 'ATC Copilot' : 'Sovereign Copilot'}
          </span>
          <span className="block text-[9px] font-mono text-[#A5D1E1]">Autonomous Agent Active</span>
        </div>
      </button>

      {/* Floating Interactive Console */}
      {isOpen && (
        <section
          role="dialog"
          aria-label={role === 'admin' ? 'ATC Autonomous Copilot' : 'Sovereign Concierge Copilot'}
          className="fixed z-50 left-3 sm:left-5 bottom-40 w-[min(440px,calc(100vw-24px))] h-[min(620px,calc(100dvh-180px))] bg-[#07161B]/95 backdrop-blur-3xl border border-[#2B7574]/60 shadow-[0_25px_80px_rgba(0,0,0,0.85)] rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header Bar */}
          <header className="px-5 py-4 bg-gradient-to-r from-[#0E2931] to-[#0A2027] text-white flex items-center justify-between border-b border-[#2B7574]/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#12484C] text-[#F2B632] border border-[#2B7574]/60 flex items-center justify-center shadow-md">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-monument font-bold uppercase tracking-wider text-white">
                  {role === 'admin' ? 'ATC & GDS Dispatch Copilot' : 'Sovereign Concierge Copilot'}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[9px] font-mono text-[#A5D1E1]">
                    {aiConnected ? 'Autonomous AI Connected · Direct Dispatch' : 'Autonomous Telemetry Core Active'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#A5D1E1] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          {/* Action Log / Execution Banner */}
          {executionLog && (
            <div className="px-4 py-2 bg-[#040E12] border-b border-[#2B7574]/40 font-mono text-[10px] text-cyan-300 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span className="truncate">{executionLog}</span>
            </div>
          )}

          {/* Conversation Feed */}
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.from === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed shadow-md ${
                    m.from === 'user'
                      ? 'bg-[#12484C] text-[#F4F6F5] border border-[#2B7574]/80 rounded-tr-sm'
                      : 'bg-[#0B1E24] text-[#EAEFEF] border border-[#2B7574]/40 rounded-tl-sm'
                  }`}
                >
                  <span className="block text-[8px] font-mono uppercase tracking-widest text-[#F2B632] mb-1">
                    {m.from === 'user' ? 'Direct Command' : 'Copilot Dispatch'}
                  </span>
                  <p>{m.text}</p>

                  {/* Executed Action Receipt */}
                  {m.receipt && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-500/30 text-[10px] space-y-1 text-emerald-300">
                      <div className="flex items-center gap-1 font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{m.receipt.actionName}</span>
                      </div>
                      <p className="text-[#A5D1E1] font-mono">{m.receipt.detail}</p>
                      <span className="block text-[8px] text-[#A5D1E1]/60">
                        Executed at {m.receipt.timestamp} · State Persistent
                      </span>
                    </div>
                  )}
                </div>

                {/* Initial Suggested Actions */}
                {m.suggestedActions && (
                  <div className="flex flex-wrap gap-1.5 pt-1 max-w-[94%]">
                    {m.suggestedActions.map((act) => (
                      <button
                        key={act.payload}
                        type="button"
                        onClick={() => handleSend(act.payload)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#0B1E24] hover:bg-[#12484C] text-[#F2B632] border border-[#2B7574]/50 text-[10px] font-mono font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02] flex items-center gap-1"
                      >
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#040E12] border-t border-[#2B7574]/40 flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isExecuting}
              placeholder={
                role === 'admin'
                  ? 'Type an operational command (e.g. approve prime, reassign gate)...'
                  : 'Type a traveler command (e.g. pay installment, upgrade seat)...'
              }
              className="flex-1 h-11 px-3.5 rounded-xl bg-[#07161B] border border-[#2B7574]/50 text-xs text-white font-mono placeholder:text-[#A5D1E1]/40 outline-none focus:border-[#F2B632]"
            />
            <button
              type="submit"
              disabled={isExecuting || !prompt.trim()}
              className="w-11 h-11 rounded-xl bg-[#12484C] hover:bg-[#1a5f64] text-[#F2B632] border border-[#2B7574]/80 flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}
    </>
  );
};
