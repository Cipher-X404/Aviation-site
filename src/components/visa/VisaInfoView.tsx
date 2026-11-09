import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const VisaInfoView: React.FC = () => {
  const { setActiveRoute } = useAppStore();

  const visaData = [
    { flag: '🇦🇪', country: 'Dubai (UAE)', req: 'Visa required — apply at UAE Embassy', time: '5–7 business days', cost: '$85', link: 'https://www.uae-embassy.ng' },
    { flag: '🇬🇧', country: 'London (UK)', req: 'Visa required — apply at UK Visa Centre', time: '10–15 business days', cost: '$150', link: 'https://www.gov.uk/browse/visas-immigration' },
    { flag: '🇰🇪', country: 'Nairobi (Kenya)', req: 'e-Visa required — apply online', time: '3–5 business days', cost: '$50', link: 'https://www.ecitizen.go.ke' },
    { flag: '🇬🇭', country: 'Accra (Ghana)', req: 'Visa on arrival / e-Visa', time: '2–4 business days', cost: '$60', link: 'https://www.visa.gov.gh' },
    { flag: '🇿🇦', country: 'Johannesburg (South Africa)', req: 'Visa required — apply at SA Embassy', time: '10–14 business days', cost: '$75', link: 'https://www.dirco.gov.za' },
    { flag: '🇺🇸', country: 'New York (USA)', req: 'Visa required — apply at US Embassy', time: '15–20 business days', cost: '$160', link: 'https://www.ustraveldocs.com/ng' },
  ];

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center gap-10 py-16">
      {/* Disclaimer Banner */}
      <div className="w-full max-w-4xl bg-[#2B7574]/10 dark:bg-[#2B7574]/20 border border-[#2B7574]/30 text-[#2B7574] dark:text-[#A5D1E1] p-4 rounded-lg text-sm leading-6 text-center">
        Information is for guidance only. Always verify entry requirements with the official embassy or consulate before travelling.
      </div>

      {/* Top Section */}
      <div className="max-w-4xl w-full">
        <span className="text-[10px] font-mono tracking-[.28em] uppercase text-[#F2B632]">Visa & Entry Requirements</span>
        <h1 className="font-monument text-4xl sm:text-5xl normal-case tracking-tight text-[#0E2931] dark:text-[#EAEFEF] mt-2">Visa & Entry Requirements</h1>
        <p className="max-w-2xl mx-auto text-sm leading-7 text-[#5A6B70] dark:text-[#849CA3] mt-4">
          Requirements shown below are for reference only. Nigerian passport holders should verify with the relevant embassy or consulate before travelling.
        </p>
      </div>

      {/* Visa Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {visaData.map((v, idx) => (
          <div key={idx} className="bg-[#F4F6F5] dark:bg-[#09171C] p-6 rounded-xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm">
            <div className="text-3xl mb-3">{v.flag}</div>
            <h3 className="font-monument text-lg font-bold text-[#0E2931] dark:text-[#EAEFEF]">{v.country}</h3>
            <p className="text-sm text-[#5A6B70] dark:text-[#849CA3] mt-1">{v.req}</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <span className="text-[9px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] block">Processing</span>
                <span className="text-sm text-[#0E2931] dark:text-[#EAEFEF] font-medium">{v.time}</span>
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] block">Est. Cost</span>
                <span className="text-sm text-[#0E2931] dark:text-[#EAEFEF] font-medium">{v.cost}</span>
              </div>
            </div>
            <a
              href={v.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#F2B632] hover:text-[#EAEFEF] transition-colors"
            >
              Check official requirements →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
