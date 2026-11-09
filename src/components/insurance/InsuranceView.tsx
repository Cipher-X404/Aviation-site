import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export const InsuranceView: React.FC = () => {
  const { setActiveRoute, setSupportOpen } = useAppStore();

  const plans = [
    {
      name: 'Basic',
      price: '₦15,000',
      items: ['Flight cancellation', 'Baggage loss/delay'],
    },
    {
      name: 'Standard',
      price: '₦35,000',
      items: ['Flight cancellation', 'Baggage loss/delay', 'Medical emergency (up to $50,000)'],
    },
    {
      name: 'Premium',
      price: '₦60,000',
      items: ['Flight cancellation', 'Baggage loss/delay', 'Medical emergency (up to $50,000)', 'Trip curtailment', 'Personal liability'],
    },
  ];

  const faqs = [
    { q: 'What does travel insurance cover?', a: 'It covers flight cancellations, baggage issues, medical emergencies, and more depending on the plan.' },
    { q: 'When should I buy insurance?', a: 'Ideally, purchase insurance at the time of booking to cover any pre-departure cancellations.' },
    { q: 'How do I make a claim?', a: 'Contact the underwriter directly using the reference number provided in your policy document.' },
    { q: 'Is insurance mandatory for my destination?', a: 'Requirements vary; check the visa information page for specific destination rules.' },
  ];

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center gap-10 py-16">
      {/* Hero Section */}
      <div className="max-w-4xl w-full">
        <h1 className="font-monument text-4xl sm:text-5xl normal-case tracking-tight text-[#0E2931] dark:text-[#EAEFEF]">Travel Insurance</h1>
        <p className="max-w-2xl mx-auto text-sm leading-7 text-[#5A6B70] dark:text-[#849CA3] mt-4">
          Protect your journey from cancellations, medical emergencies, and lost baggage
        </p>
        <div className="mt-6 p-4 bg-[#2B7574]/10 dark:bg-[#2B7574]/20 border border-[#2B7574]/30 text-[#2B7574] dark:text-[#A5D1E1] rounded-lg text-sm leading-6 text-center">
          Insurance products shown are provided by third-party underwriters. CJ Travels Owerri acts as an introducer only.
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan, idx) => (
          <div key={idx} className="bg-[#F4F6F5] dark:bg-[#09171C] p-8 rounded-2xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm flex flex-col">
            <h3 className="font-monument text-2xl font-bold text-[#0E2931] dark:text-[#EAEFEF]">{plan.name}</h3>
            <div className="text-3xl font-bold text-[#F2B632] mt-2">{plan.price} <span className="text-sm font-mono text-[#5A6B70] dark:text-[#849CA3]">per trip</span></div>
            <ul className="mt-6 space-y-3 flex-1">
              {plan.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#0E2931] dark:text-[#EAEFEF]">
                  <span className="text-[#F2B632] font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSupportOpen(true)}
              className="btn-gold w-full py-3 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 mt-6 hover:scale-[1.02]"
            >
              Get a Quote
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-3xl bg-[#F4F6F5] dark:bg-[#09171C] p-8 rounded-2xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm">
        <h2 className="font-monument text-2xl font-bold text-[#0E2931] dark:text-[#EAEFEF] mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#2B7574]/10 dark:border-[#2B7574]/20 pb-4 last:border-0 last:pb-0">
              <h4 className="font-bold text-[#0E2931] dark:text-[#EAEFEF] text-sm mb-1">{faq.q}</h4>
              <p className="text-sm text-[#5A6B70] dark:text-[#849CA3] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
