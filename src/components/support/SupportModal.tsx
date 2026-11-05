import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MessageSquare, X, Send, Bot, ShieldCheck, ArrowUp } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'concierge' | 'user';
  text: string;
  time: string;
}

export const SupportModal: React.FC = () => {
  const { isSupportOpen, setSupportOpen } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'concierge',
      text: 'Good day. Welcome to Aerovista 24/7 Ground Concierge. How may we assist your upcoming flight or Pay Later plan today?',
      time: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputVal,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputVal.toLowerCase();
    setInputVal('');

    setTimeout(() => {
      let reply =
        'Our flight concierge team has logged your inquiry. For immediate rebooking or baggage queries, our desks at MM2 Lagos and Nnamdi Azikiwe Abuja are active.';

      if (query.includes('loan') || query.includes('pay later') || query.includes('interest')) {
        reply =
          'Our Fly Now Pay Later facility offers 3, 6, 9, or 12-month amortized plans with 0% early settlement penalty. You can test your exact monthly repayment in our live calculator tab.';
      } else if (query.includes('hotel') || query.includes('power') || query.includes('generator')) {
        reply =
          'All hotels on Aerovista feature audited 24/7 heavy generator backup and guaranteed check-in sync with your flight touchdown.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: 'concierge',
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 800);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Action Buttons: Back to top + Support Chat */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top of page"
          className="w-10 h-10 rounded-full bg-[#12484C] text-[#F2B632] border border-[#2B7574]/40 flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 stroke-[2]" />
        </button>

        <button
          onClick={() => setSupportOpen(!isSupportOpen)}
          aria-label="Open 24/7 Concierge Chat"
          className="btn-gold py-2.5 px-4 rounded-full flex items-center gap-2 shadow-xl hover:scale-105 transition-transform cursor-pointer font-bold text-xs uppercase tracking-wider"
        >
          <MessageSquare className="w-4 h-4 stroke-[2]" />
          <span className="hidden sm:inline">24/7 Ground Concierge</span>
        </button>
      </div>

      {/* Chat Window Modal */}
      {isSupportOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[340px] sm:w-[380px] bg-white dark:bg-[#0E2931] border border-[#2B7574]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[460px] animate-fade-in">
          {/* Header */}
          <div className="bg-[#12484C] text-[#F4F6F5] p-4 flex items-center justify-between border-b border-[#2B7574]/40">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#0E2931] text-[#F2B632] flex items-center justify-center font-bold text-xs">
                AV
              </div>
              <div>
                <span className="font-display text-sm font-bold tracking-wider uppercase block">
                  Ground Concierge
                </span>
                <span className="text-[10px] text-[#A5D1E1] font-mono">
                  Online · Average response &lt;1m
                </span>
              </div>
            </div>

            <button
              onClick={() => setSupportOpen(false)}
              className="text-[#A5D1E1] hover:text-[#FFFFFF] cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F4F6F5]/50 dark:bg-[#08181D]/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#12484C] text-[#F4F6F5] rounded-br-none'
                      : 'bg-white dark:bg-[#0E2931] text-[#0E2931] dark:text-[#EAEFEF] border border-[#2B7574]/30 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="block text-[9px] opacity-60 mt-1 text-right font-mono">
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-[#0E2931] border-t border-[#E2E2E0] dark:border-[#18363F] flex gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about flights, hotels, or loans..."
              className="flex-1 bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-xs text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
            />
            <button
              type="submit"
              className="btn-gold p-2 rounded-lg flex items-center justify-center cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 stroke-[2]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
