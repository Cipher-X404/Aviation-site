import React, { useState } from 'react';
import { MOCK_FAQS } from '../../data/mockData';
import { ChevronDown, Plus, Minus } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase block mb-1">
          06. GOOD TO KNOW
        </span>
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
          A few common questions
        </h2>
        <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1">
          Everything you need to know before you fly.
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;

          return (
            <div
              key={idx}
              className="rounded-xl bg-white dark:bg-[#0E2931]/60 border border-[#2B7574]/20 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <span className="font-semibold text-sm sm:text-base text-[#0E2931] dark:text-[#FFFFFF]">
                  {faq.question}
                </span>
                <span className="w-6 h-6 rounded-full bg-[#12484C]/10 dark:bg-[#12484C]/50 text-[#12484C] dark:text-[#F2B632] flex items-center justify-center shrink-0">
                  {isOpen ? (
                    <Minus className="w-3.5 h-3.5 stroke-[2]" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 stroke-[2]" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#12484C]/80 dark:text-[#A5D1E1] leading-relaxed border-t border-[#E2E2E0] dark:border-[#18363F]">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
