import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { calculateLoanBreakdown, LOAN_CONFIG } from '../../config/loan';
import { formatPrice } from '../../services/currency';
import { CreditCard, ArrowRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const LoanSpotlight: React.FC = () => {
  const { setActiveRoute, currency, loanDraft, setLoanDraft } = useAppStore();

  const [principal, setPrincipal] = useState<number>(loanDraft.requestedAmount || 850_000);
  const [tenure, setTenure] = useState<number>(loanDraft.tenureMonths || 6);
  const [downPercent, setDownPercent] = useState<number>(loanDraft.downPaymentPercent || 20);

  const breakdown = calculateLoanBreakdown(principal, tenure, downPercent);

  const handleApply = () => {
    setLoanDraft({
      requestedAmount: principal,
      tenureMonths: tenure,
      downPaymentPercent: downPercent,
    });
    setActiveRoute('/fly-now-pay-later');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-ocean-gradient text-[#F4F6F5] rounded-3xl p-6 sm:p-12 border border-[#2B7574]/40 relative overflow-hidden shadow-2xl">
        {/* Subtle topographic contour overlay */}
        <div className="bg-topo absolute inset-0 opacity-25 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Proposition & Guarantee */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0E2931]/60 border border-[#A5D1E1]/30 text-xs font-mono text-[#F2B632]">
              <CreditCard className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>PAYMENT PLAN EXAMPLES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight leading-[1.05]">
              PLAN YOUR TRIP.
              <br />
              <span className="text-[#F2B632]">COMPARE PAYMENT TERMS.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#A5D1E1] leading-relaxed">
              Configure a 0% APR instalment plan for your next flight. Adjust your down payment and tenure to see your exact monthly commitment.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-[#F4F6F5]">
                <CheckCircle2 className="w-4 h-4 text-[#F2B632] shrink-0 mt-0.5 stroke-[2]" />
                <span>Adjust the amount and term to preview your monthly amortization.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-[#F4F6F5]">
                <Clock className="w-4 h-4 text-[#F2B632] shrink-0 mt-0.5 stroke-[2]" />
                <span>Instant pre-qualification via soft credit check with 0% impact.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-[#F4F6F5]">
                <ShieldCheck className="w-4 h-4 text-[#F2B632] shrink-0 mt-0.5 stroke-[2]" />
                <span>Underwritten in partnership with CBN-licensed financial institutions.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Loan Calculator Card */}
          <div className="lg:col-span-7 bg-[#0E2931]/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#2B7574]/40 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#18363F]">
              <span className="text-xs font-mono uppercase tracking-widest text-[#A5D1E1]">
                FACILITY CALCULATOR
              </span>
              <span className="text-xs font-mono text-[#F2B632] bg-[#12484C] px-2 py-0.5 rounded border border-[#2B7574]/40">
                APR {breakdown.effectiveApr}%
              </span>
            </div>

            {/* Principal Amount Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#A5D1E1]">
                  Trip Cost (Flight or Bundle)
                </label>
                <span className="text-xl font-bold font-mono tabular-nums text-[#F2B632]">
                  {formatPrice(principal, currency)}
                </span>
              </div>
              <input
                type="range"
                min={LOAN_CONFIG.minAmount}
                max={LOAN_CONFIG.maxAmount}
                step={50000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-[#F2B632] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#A5D1E1]/70">
                <span>{formatPrice(LOAN_CONFIG.minAmount, currency, { compact: true })}</span>
                <span>{formatPrice(LOAN_CONFIG.maxAmount, currency, { compact: true })}</span>
              </div>
            </div>

            {/* Down Payment Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#A5D1E1]">
                  Initial Down Payment ({downPercent}%)
                </label>
                <span className="text-sm font-semibold font-mono tabular-nums text-[#F4F6F5]">
                  {formatPrice(breakdown.downPaymentAmount, currency)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 30, 40].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDownPercent(pct)}
                    className={`py-1.5 text-xs font-mono font-medium rounded border transition-colors cursor-pointer ${
                      downPercent === pct
                        ? 'bg-[#F2B632] text-[#0E2931] border-[#F2B632] font-bold'
                        : 'border-[#2B7574]/40 text-[#A5D1E1] hover:bg-[#12484C]'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Tenure Options */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A5D1E1]">
                Repayment Tenure
              </label>
              <div className="grid grid-cols-4 gap-2">
                {LOAN_CONFIG.tenures.map((t) => (
                  <button
                    key={t.months}
                    type="button"
                    onClick={() => setTenure(t.months)}
                    className={`py-2 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                      tenure === t.months
                        ? 'bg-[#12484C] text-[#F2B632] border-[#F2B632]'
                        : 'border-[#2B7574]/40 text-[#A5D1E1] hover:bg-[#12484C]/50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#08181D] border border-[#18363F]">
              <div>
                <span className="block text-[10px] font-mono uppercase text-[#A5D1E1]">
                  Monthly Due
                </span>
                <span className="text-lg font-bold font-mono tabular-nums text-[#F2B632]">
                  {formatPrice(breakdown.monthlyPayment, currency)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-[#A5D1E1]">
                  Total Interest
                </span>
                <span className="text-sm font-semibold font-mono tabular-nums text-[#F4F6F5]">
                  {formatPrice(breakdown.totalInterest, currency)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-[#A5D1E1]">
                  Total Financed
                </span>
                <span className="text-sm font-semibold font-mono tabular-nums text-[#F4F6F5]">
                  {formatPrice(breakdown.totalRepayment, currency)}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleApply}
              className="btn-gold w-full py-3.5 px-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider group cursor-pointer"
            >
              <span>See payment-plan examples</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
