import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  calculateLoanBreakdown,
  generateRepaymentSchedule,
  evaluateLoanApplication,
  LOAN_CONFIG,
  LoanDecisionResult,
} from '../../config/loan';
import { formatPrice } from '../../services/currency';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Upload,
  UserCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FlyNowPayLaterView: React.FC = () => {
  const {
    loanDraft,
    setLoanDraft,
    activeLoanDecision,
    setActiveLoanDecision,
    currency,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'calculator' | 'apply' | 'dashboard'>('calculator');
  const [appStep, setAppStep] = useState<1 | 2 | 3 | 4>(1);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Form Fields
  const [amount, setAmount] = useState<number>(loanDraft.requestedAmount || 650_000);
  const [tenure, setTenure] = useState<number>(loanDraft.tenureMonths || 6);
  const [downPercent, setDownPercent] = useState<number>(loanDraft.downPaymentPercent || 20);

  const [fullName, setFullName] = useState(loanDraft.fullName || 'Folashade Adeleke');
  const [bvnOrNin, setBvnOrNin] = useState(loanDraft.bvnOrNin || '22345678901');
  const [email, setEmail] = useState(loanDraft.email || 'folashade.adeleke@email.com');
  const [phone, setPhone] = useState(loanDraft.phone || '+234 803 456 7890');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(loanDraft.monthlyIncome || 850_000);
  const [employmentType, setEmploymentType] = useState(loanDraft.employmentType || 'employed');
  const [employerName, setEmployerName] = useState(loanDraft.employerName || 'Lagoon Health Group');
  const [idUploaded, setIdUploaded] = useState(true);
  const [selfieVerified, setSelfieVerified] = useState(true);
  const [consentChecked, setConsentChecked] = useState(true);

  const breakdown = calculateLoanBreakdown(amount, tenure, downPercent);
  const schedule = generateRepaymentSchedule(breakdown);

  // Submit application
  const handleRunUnderwriting = () => {
    setIsEvaluating(true);

    setTimeout(() => {
      const decision = evaluateLoanApplication({
        fullName,
        email,
        phone,
        bvnOrNin,
        monthlyIncome,
        employmentType: employmentType as any,
        employerName,
        requestedAmount: amount,
        downPaymentPercent: downPercent,
        tenureMonths: tenure,
      });

      setActiveLoanDecision(decision);
      setIsEvaluating(false);

      if (decision.approved) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F2B632', '#12484C', '#199FB1'],
        });
      }
    }, 1400);
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-ocean-gradient text-[#F4F6F5] rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-[#2B7574]/40 shadow-xl">
        <div className="bg-topo absolute inset-0 opacity-25 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0E2931]/60 border border-[#A5D1E1]/30 text-xs font-mono text-[#F2B632]">
            <CreditCard className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>PAYMENT PLAN EXAMPLES</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight">
            FLY NOW, PAY LATER
          </h1>

          <p className="text-sm sm:text-base text-[#A5D1E1] leading-relaxed">
            Structure a 0% APR instalment plan for your next flight. Configure your down payment and tenure, submit your profile for underwriting, and receive an instant financing decision.
          </p>

          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-4">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-[#F2B632] text-[#0E2931] font-bold'
                  : 'bg-[#0E2931]/50 text-[#A5D1E1] hover:bg-[#0E2931]'
              }`}
            >
              1. Calculator & Rates
            </button>
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'apply'
                  ? 'bg-[#F2B632] text-[#0E2931] font-bold'
                  : 'bg-[#0E2931]/50 text-[#A5D1E1] hover:bg-[#0E2931]'
              }`}
            >
              2. 4-Step Application
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#F2B632] text-[#0E2931] font-bold'
                  : 'bg-[#0E2931]/50 text-[#A5D1E1] hover:bg-[#0E2931]'
              }`}
            >
              3. Repayment Schedule
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE AMORTIZATION CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (col-span-7) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0E2931]/80 rounded-2xl p-6 sm:p-8 border border-[#2B7574]/30 shadow-teal-soft space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E2E0] dark:border-[#18363F]">
              <span className="font-mono text-xs uppercase tracking-wider text-[#0E2931] dark:text-[#FFFFFF] font-bold">
                Ticket Financing Parameters
              </span>
              <span className="font-mono text-xs text-[#2B7574] dark:text-[#F2B632] bg-[#12484C]/10 dark:bg-[#12484C]/60 px-2.5 py-1 rounded">
                Effective APR: {breakdown.effectiveApr}%
              </span>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1]">
                  Requested Loan Principal
                </label>
                <span className="text-2xl font-bold font-mono tabular-nums text-[#0E2931] dark:text-[#F2B632]">
                  {formatPrice(amount, currency)}
                </span>
              </div>
              <input
                type="range"
                min={LOAN_CONFIG.minAmount}
                max={LOAN_CONFIG.maxAmount}
                step={50000}
                value={amount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAmount(val);
                  setLoanDraft({ requestedAmount: val });
                }}
                className="w-full accent-[#F2B632] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#2B7574] dark:text-[#A5D1E1]/70">
                <span>Min: {formatPrice(LOAN_CONFIG.minAmount, currency, { compact: true })}</span>
                <span>Max: {formatPrice(LOAN_CONFIG.maxAmount, currency, { compact: true })}</span>
              </div>
            </div>

            {/* Down Payment Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1]">
                  Down Payment ({downPercent}%)
                </label>
                <span className="text-sm font-semibold font-mono tabular-nums text-[#0E2931] dark:text-[#FFFFFF]">
                  {formatPrice(breakdown.downPaymentAmount, currency)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 30, 40].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => {
                      setDownPercent(pct);
                      setLoanDraft({ downPaymentPercent: pct });
                    }}
                    className={`py-2 text-xs font-mono font-medium rounded-lg border transition-colors cursor-pointer ${
                      downPercent === pct
                        ? 'bg-[#12484C] text-[#F2B632] border-[#2B7574] font-bold'
                        : 'border-[#2B7574]/30 text-[#0E2931] dark:text-[#A5D1E1] hover:bg-gray-100 dark:hover:bg-[#12484C]/40'
                    }`}
                  >
                    {pct}% Down
                  </button>
                ))}
              </div>
            </div>

            {/* Tenure Options */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1]">
                Repayment Months
              </label>
              <div className="grid grid-cols-4 gap-2">
                {LOAN_CONFIG.tenures.map((t) => (
                  <button
                    key={t.months}
                    onClick={() => {
                      setTenure(t.months);
                      setLoanDraft({ tenureMonths: t.months });
                    }}
                    className={`py-2.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      tenure === t.months
                        ? 'bg-[#12484C] text-[#F2B632] border-[#2B7574] font-bold'
                        : 'border-[#2B7574]/30 text-[#0E2931] dark:text-[#A5D1E1] hover:bg-gray-100 dark:hover:bg-[#12484C]/40'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('apply')}
              className="btn-gold w-full py-3.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Explore payment options</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {/* Results Summary Box (col-span-5) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0E2931]/80 rounded-2xl p-6 sm:p-8 border border-[#2B7574]/30 shadow-teal-soft space-y-6">
            <span className="font-mono text-xs uppercase tracking-wider text-[#0E2931] dark:text-[#FFFFFF] font-bold block pb-3 border-b border-[#E2E2E0] dark:border-[#18363F]">
              Cost Breakdown Before Application
            </span>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#12484C] dark:text-[#A5D1E1]">
                  Total Ticket Principal
                </span>
                <span className="font-mono font-bold text-sm tabular-nums text-[#0E2931] dark:text-[#FFFFFF]">
                  {formatPrice(breakdown.principal, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#12484C] dark:text-[#A5D1E1]">
                  Initial Down Payment Due Today
                </span>
                <span className="font-mono font-bold text-sm tabular-nums text-[#0E2931] dark:text-[#FFFFFF]">
                  {formatPrice(breakdown.downPaymentAmount, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#12484C] dark:text-[#A5D1E1]">
                  Financed Principal
                </span>
                <span className="font-mono font-bold text-sm tabular-nums text-[#0E2931] dark:text-[#FFFFFF]">
                  {formatPrice(breakdown.financedAmount, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#12484C] dark:text-[#A5D1E1]">
                  Total Interest Over {breakdown.tenureMonths} Months
                </span>
                <span className="font-mono font-bold text-sm tabular-nums text-[#2B7574] dark:text-[#F2B632]">
                  {formatPrice(breakdown.totalInterest, currency)}
                </span>
              </div>
            </div>

            <div className="border-perforated my-4" />

            <div className="p-4 rounded-xl bg-[#0D5C75]/15 dark:bg-[#0D5C75]/40 border border-[#2B7574]/40 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-mono uppercase text-[#12484C] dark:text-[#A5D1E1]">
                  Fixed Monthly Due
                </span>
                <span className="text-2xl font-bold font-mono tabular-nums text-[#0E2931] dark:text-[#F2B632]">
                  {formatPrice(breakdown.monthlyPayment, currency)}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#2B7574] dark:text-[#A5D1E1] text-right">
                {breakdown.tenureMonths} equal installments
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 4-STEP APPLICATION */}
      {activeTab === 'apply' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#0E2931]/80 rounded-2xl p-6 sm:p-10 border border-[#2B7574]/30 shadow-teal-soft space-y-8">
          {/* Stepper Progress */}
          <div className="flex items-center justify-between pb-6 border-b border-[#E2E2E0] dark:border-[#18363F]">
            <div>
              <span className="text-xs font-mono uppercase text-[#2B7574] dark:text-[#F2B632]">
                STEP {appStep} OF 4
              </span>
              <h2 className="font-display text-xl font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF]">
                {appStep === 1 && 'Basic Identity & Verification'}
                {appStep === 2 && 'Employment & Monthly Income'}
                {appStep === 3 && 'Biometric & Document Upload'}
                {appStep === 4 && 'Review, Terms & Underwriting'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    appStep === s
                      ? 'bg-[#F2B632] text-[#0E2931]'
                      : appStep > s
                      ? 'bg-[#12484C] text-[#F2B632]'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Basic Identity */}
          {appStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Legal Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-sm text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    BVN or National NIN
                  </label>
                  <input
                    type="text"
                    value={bvnOrNin}
                    onChange={(e) => setBvnOrNin(e.target.value)}
                    className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-sm text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-sm text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-sm text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setAppStep(2)}
                  className="btn-gold py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Save & Continue</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Employment & Income */}
          {appStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-sm text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
                  >
                    <option value="employed">Employed (Corporate / Civil)</option>
                    <option value="self-employed">Self-Employed / Freelance</option>
                    <option value="business">Business Owner / Director</option>
                    <option value="contract">Fixed Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Employer or Business Name
                  </label>
                  <input
                    type="text"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-sm text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#12484C] dark:text-[#A5D1E1] mb-1">
                    Monthly Net Income (₦)
                  </label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 rounded-lg px-3 py-2 text-sm text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none focus:border-[#F2B632]"
                  />
                  <span className="block text-[10px] text-[#2B7574] dark:text-[#A5D1E1]/70 mt-1">
                    Must exceed ₦120,000 to meet underwriting criteria.
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAppStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-[#12484C] dark:text-[#A5D1E1] cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setAppStep(3)}
                  className="btn-gold py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Save & Continue</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Biometric & Document Upload */}
          {appStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-dashed border-[#2B7574]/40 bg-[#F4F6F5]/50 dark:bg-[#08181D]/50 text-center space-y-2">
                  <Upload className="w-8 h-8 text-[#2B7574] mx-auto stroke-[1.5]" />
                  <span className="block text-xs font-bold text-[#0E2931] dark:text-[#FFFFFF]">
                    Valid Passport or NIN Slip
                  </span>
                  <span className="block text-[10px] text-[#2B7574] dark:text-[#A5D1E1]">
                    JPG or PDF · Encrypted upload · Files processed securely
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#12484C] dark:text-[#F2B632] font-semibold bg-[#F2B632]/20 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                    <span>File selected locally</span>
                  </span>
                </div>

                <div className="p-5 rounded-xl border border-dashed border-[#2B7574]/40 bg-[#F4F6F5]/50 dark:bg-[#08181D]/50 text-center space-y-2">
                  <UserCheck className="w-8 h-8 text-[#2B7574] mx-auto stroke-[1.5]" />
                  <span className="block text-xs font-bold text-[#0E2931] dark:text-[#FFFFFF]">
                    Liveness & Selfie Verification
                  </span>
                  <span className="block text-[10px] text-[#2B7574] dark:text-[#A5D1E1]">
                    Facial match against NIN database
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#12484C] dark:text-[#F2B632] font-semibold bg-[#F2B632]/20 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                    <span>No identity check is performed</span>
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAppStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-[#12484C] dark:text-[#A5D1E1] cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setAppStep(4)}
                  className="btn-gold py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Final Review</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Underwriting Trigger */}
          {appStep === 4 && (
            <div className="space-y-6">
              {isEvaluating ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-4 border-[#2B7574]/30 border-t-[#F2B632] animate-spin mx-auto" />
                  <h3 className="font-display text-lg font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                    Evaluating Credit Profile & Debt Ratio…
                  </h3>
                  <p className="text-xs text-[#12484C] dark:text-[#A5D1E1]">
                    Cross-referencing declared income against ticket repayment obligations.
                  </p>
                </div>
              ) : activeLoanDecision ? (
                /* Decision Display */
                <div className="space-y-6">
                  {activeLoanDecision.approved ? (
                    <div className="p-6 rounded-2xl bg-[#0D5C75]/20 border border-[#2B7574] space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#0E2931] dark:text-[#F2B632]">
                        <CheckCircle2 className="w-5 h-5 text-[#F2B632] stroke-[2]" />
                        <span>{activeLoanDecision.reasonTitle}</span>
                      </div>
                      <p className="text-xs text-[#12484C] dark:text-[#A5D1E1] leading-relaxed">
                        {activeLoanDecision.reasonDetails}
                      </p>
                      <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#2B7574]/30">
                        <span>Debt service ratio: {Math.round(activeLoanDecision.debtServiceRatio * 100)}%</span>
                        <span className="text-[#F2B632] font-bold">Approved principal: {formatPrice(amount, currency)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-[#861211]/10 border border-[#861211]/40 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#861211] dark:text-[#F2B632]">
                        <AlertTriangle className="w-5 h-5 text-[#861211] stroke-[2]" />
                        <span>{activeLoanDecision.reasonTitle}</span>
                      </div>
                      <p className="text-xs text-[#12484C] dark:text-[#A5D1E1] leading-relaxed">
                        {activeLoanDecision.reasonDetails}
                      </p>
                      {activeLoanDecision.actionableGuidance && (
                        <p className="text-xs text-[#2B7574] dark:text-[#A5D1E1] bg-white/50 dark:bg-[#0E2931]/60 p-3 rounded-lg border border-[#2B7574]/30">
                          {activeLoanDecision.actionableGuidance}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => {
                        setActiveLoanDecision(null);
                        setAppStep(2);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-[#12484C] dark:text-[#A5D1E1] cursor-pointer"
                    >
                      ← Adjust Details
                    </button>

                    {activeLoanDecision.approved && (
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="btn-gold py-2.5 px-6 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        View Repayment Schedule
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Pre-submission Summary */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#12484C] dark:text-[#A5D1E1]">Applicant:</span>
                      <span className="font-bold text-[#0E2931] dark:text-[#FFFFFF]">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#12484C] dark:text-[#A5D1E1]">Monthly Income:</span>
                      <span className="font-mono font-bold text-[#0E2931] dark:text-[#FFFFFF]">{formatPrice(monthlyIncome, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#12484C] dark:text-[#A5D1E1]">Requested Principal:</span>
                      <span className="font-mono font-bold text-[#0E2931] dark:text-[#FFFFFF]">{formatPrice(amount, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#12484C] dark:text-[#A5D1E1]">Tenure:</span>
                      <span className="font-bold text-[#0E2931] dark:text-[#FFFFFF]">{tenure} Months</span>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 text-xs text-[#12484C] dark:text-[#A5D1E1] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 accent-[#F2B632]"
                    />
                    <span>
                      I confirm that the information provided is accurate and I authorise Aerovista's CBN-licensed lending partner to run a soft credit check to generate my financing offer.
                    </span>
                  </label>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setAppStep(3)}
                      className="px-4 py-2 text-xs font-semibold text-[#12484C] dark:text-[#A5D1E1] cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      disabled={!consentChecked}
                      onClick={handleRunUnderwriting}
                      className="btn-gold py-3 px-8 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      <span>Run Underwriting & Get Decision</span>
                      <CheckCircle2 className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REPAYMENT DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Progress Ring Summary Card */}
          <div className="bg-white dark:bg-[#0E2931]/80 rounded-2xl p-6 sm:p-8 border border-[#2B7574]/30 shadow-teal-soft flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#2B7574] dark:text-[#F2B632]">
                ACTIVE FLIGHT FACILITY
              </span>
              <h3 className="font-display text-2xl font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF]">
                {tenure}-Month Repayment Schedule
              </h3>
              <p className="text-xs text-[#12484C] dark:text-[#A5D1E1]">
                Fixed amortisation schedule generated by our CBN-licensed lending engine. Confirm early-repayment terms and fees with your facility agreement.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab('apply');
                setAppStep(1);
              }}
              className="btn-gold py-2.5 px-5 text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
            >
              Pay Early & Save Interest
            </button>
          </div>

          {/* Schedule Table */}
          <div className="bg-white dark:bg-[#0E2931]/80 rounded-2xl border border-[#2B7574]/30 shadow-teal-soft overflow-hidden">
            <div className="p-5 border-b border-[#E2E2E0] dark:border-[#18363F] font-mono text-xs uppercase font-bold text-[#0E2931] dark:text-[#FFFFFF]">
              Monthly Installments Schedule
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F6F5] dark:bg-[#08181D] font-mono text-[10px] uppercase text-[#2B7574] dark:text-[#A5D1E1] border-b border-[#E2E2E0] dark:border-[#18363F]">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Installment</th>
                    <th className="py-3 px-4">Principal</th>
                    <th className="py-3 px-4">Interest</th>
                    <th className="py-3 px-4">Remaining</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E2E0] dark:divide-[#18363F]">
                  {schedule.map((row) => (
                    <tr key={row.installmentNumber} className="hover:bg-gray-50 dark:hover:bg-[#12484C]/20">
                      <td className="py-3 px-4 font-mono font-bold text-[#0E2931] dark:text-[#FFFFFF]">
                        {row.installmentNumber}
                      </td>
                      <td className="py-3 px-4 text-[#12484C] dark:text-[#A5D1E1]">
                        {row.dueDate}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold tabular-nums text-[#0E2931] dark:text-[#F2B632]">
                        {formatPrice(row.paymentAmount, currency)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-[#12484C] dark:text-[#A5D1E1]">
                        {formatPrice(row.principalComponent, currency)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-[#2B7574] dark:text-[#A5D1E1]">
                        {formatPrice(row.interestComponent, currency)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-[#12484C] dark:text-[#A5D1E1]">
                        {formatPrice(row.remainingBalance, currency)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] bg-[#12484C]/15 dark:bg-[#12484C]/60 text-[#12484C] dark:text-[#F2B632]">
                          Upcoming
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
