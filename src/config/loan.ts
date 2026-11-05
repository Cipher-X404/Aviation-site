/**
 * Fly Now, Pay Later configuration & calculation engine.
 * Fully decoupled pure logic for interest, amortization, and approval evaluation.
 */

export interface LoanTenureOption {
  months: number;
  label: string;
  annualInterestRate: number; // e.g. 0.12 = 12%
}

export interface LoanBreakdown {
  principal: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  financedAmount: number;
  tenureMonths: number;
  annualInterestRate: number;
  monthlyInterestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  effectiveApr: number;
}

export interface RepaymentInstallment {
  installmentNumber: number;
  dueDate: string; // ISO or human format
  paymentAmount: number;
  principalComponent: number;
  interestComponent: number;
  remainingBalance: number;
  status: 'upcoming' | 'paid' | 'overdue';
}

export interface LoanApplicationInput {
  fullName: string;
  email: string;
  phone: string;
  bvnOrNin: string;
  monthlyIncome: number;
  employmentType: 'employed' | 'self-employed' | 'business' | 'contract';
  employerName?: string;
  requestedAmount: number;
  downPaymentPercent: number;
  tenureMonths: number;
  hasExistingLoans?: boolean;
  existingLoanCommitmentsMonthly?: number;
}

export interface LoanDecisionResult {
  approved: boolean;
  tier: 'tier_1_instant' | 'tier_2_standard' | 'conditional' | 'declined';
  approvedAmount: number;
  recommendedDownPaymentPercent: number;
  recommendedTenureMonths: number;
  reasonTitle: string;
  reasonDetails: string;
  debtServiceRatio: number; // e.g. 0.28
  actionableGuidance?: string;
  validityDays: number;
}

export const LOAN_CONFIG = {
  minAmount: 150_000,
  maxAmount: 4_500_000,
  defaultAmount: 650_000,
  minDownPaymentPercent: 10,
  maxDownPaymentPercent: 50,
  defaultDownPaymentPercent: 20,
  tenures: [
    { months: 3, label: '3 Months', annualInterestRate: 0.10 },
    { months: 6, label: '6 Months', annualInterestRate: 0.12 },
    { months: 9, label: '9 Months', annualInterestRate: 0.14 },
    { months: 12, label: '12 Months', annualInterestRate: 0.16 },
  ] as LoanTenureOption[],
  minMonthlyIncomeRequired: 120_000,
  maxDebtServiceRatio: 0.38, // Monthly repayments must not exceed 38% of net income
};

/**
 * Calculate the loan breakdown for a given principal, tenure, and down payment.
 */
export function calculateLoanBreakdown(
  totalTripCost: number,
  tenureMonths: number = 6,
  downPaymentPercent: number = 20
): LoanBreakdown {
  const validPrincipal = Math.max(10_000, totalTripCost);
  const validDownPercent = Math.min(80, Math.max(10, downPaymentPercent));
  const downPaymentAmount = Math.round(validPrincipal * (validDownPercent / 100));
  const financedAmount = Math.max(0, validPrincipal - downPaymentAmount);

  const tenureConfig =
    LOAN_CONFIG.tenures.find((t) => t.months === tenureMonths) ||
    LOAN_CONFIG.tenures[1]; // default 6 months

  const annualRate = tenureConfig.annualInterestRate;
  const monthlyRate = annualRate / 12;

  // Standard amortized payment formula:
  // PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
  let monthlyPayment = 0;
  if (monthlyRate === 0 || financedAmount === 0) {
    monthlyPayment = financedAmount / tenureMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    monthlyPayment = Math.round(
      financedAmount * ((monthlyRate * factor) / (factor - 1))
    );
  }

  const totalRepayment = monthlyPayment * tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - financedAmount);

  return {
    principal: validPrincipal,
    downPaymentPercent: validDownPercent,
    downPaymentAmount,
    financedAmount,
    tenureMonths,
    annualInterestRate: annualRate,
    monthlyInterestRate: monthlyRate,
    monthlyPayment,
    totalInterest,
    totalRepayment,
    effectiveApr: Math.round(annualRate * 100 * 10) / 10,
  };
}

/**
 * Generate full monthly installment amortization schedule.
 */
export function generateRepaymentSchedule(
  breakdown: LoanBreakdown,
  startDate: Date = new Date()
): RepaymentInstallment[] {
  const schedule: RepaymentInstallment[] = [];
  let remaining = breakdown.financedAmount;

  for (let i = 1; i <= breakdown.tenureMonths; i++) {
    const interestComponent = Math.round(remaining * breakdown.monthlyInterestRate);
    const principalComponent =
      i === breakdown.tenureMonths
        ? remaining
        : Math.min(remaining, breakdown.monthlyPayment - interestComponent);

    remaining = Math.max(0, remaining - principalComponent);

    // Compute due date (monthly step)
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      installmentNumber: i,
      dueDate: dueDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      paymentAmount: principalComponent + interestComponent,
      principalComponent,
      interestComponent,
      remainingBalance: remaining,
      status: i === 1 ? 'upcoming' : 'upcoming',
    });
  }

  return schedule;
}

/**
 * Deterministic loan application decision evaluation.
 */
export function evaluateLoanApplication(
  input: LoanApplicationInput
): LoanDecisionResult {
  const breakdown = calculateLoanBreakdown(
    input.requestedAmount,
    input.tenureMonths,
    input.downPaymentPercent
  );

  const existingCommitments = input.existingLoanCommitmentsMonthly || 0;
  const totalMonthlyCommitment = breakdown.monthlyPayment + existingCommitments;
  const debtServiceRatio =
    input.monthlyIncome > 0
      ? totalMonthlyCommitment / input.monthlyIncome
      : 1.0;

  // Check 1: Minimum Income Rule
  if (input.monthlyIncome < LOAN_CONFIG.minMonthlyIncomeRequired) {
    return {
      approved: false,
      tier: 'declined',
      approvedAmount: 0,
      recommendedDownPaymentPercent: 35,
      recommendedTenureMonths: 12,
      reasonTitle: 'Monthly Income Threshold',
      reasonDetails: `Our risk policy requires a minimum verifiable monthly income of ₦${LOAN_CONFIG.minMonthlyIncomeRequired.toLocaleString()} to qualify for this ticket bracket.`,
      debtServiceRatio: Math.round(debtServiceRatio * 100) / 100,
      actionableGuidance:
        'You may re-apply with a co-borrower or increase your initial down payment to lower the financed principal.',
      validityDays: 30,
    };
  }

  // Check 2: Debt Service Ratio Check
  if (debtServiceRatio > LOAN_CONFIG.maxDebtServiceRatio) {
    // Check if extending tenure or increasing down payment would pass
    const saferTenure = 12;
    const saferDownPayment = 35;
    const recalculated = calculateLoanBreakdown(
      input.requestedAmount,
      saferTenure,
      saferDownPayment
    );
    const revisedDsr =
      (recalculated.monthlyPayment + existingCommitments) / input.monthlyIncome;

    if (revisedDsr <= LOAN_CONFIG.maxDebtServiceRatio) {
      return {
        approved: true,
        tier: 'conditional',
        approvedAmount: input.requestedAmount,
        recommendedDownPaymentPercent: saferDownPayment,
        recommendedTenureMonths: saferTenure,
        reasonTitle: 'Approved with Tailored Terms',
        reasonDetails: `To maintain your monthly debt obligations below our 38% safety buffer, we have calibrated your terms to a ${saferDownPayment}% down payment over ${saferTenure} months.`,
        debtServiceRatio: Math.round(revisedDsr * 100) / 100,
        actionableGuidance:
          'Accept these adjusted parameters to lock in your flights immediately.',
        validityDays: 14,
      };
    }

    return {
      approved: false,
      tier: 'declined',
      approvedAmount: 0,
      recommendedDownPaymentPercent: 50,
      recommendedTenureMonths: 12,
      reasonTitle: 'Debt-to-Income Capacity',
      reasonDetails: `The calculated monthly installment of ₦${breakdown.monthlyPayment.toLocaleString()} represents ${Math.round(
        debtServiceRatio * 100
      )}% of your declared income, exceeding the prudent 38% threshold.`,
      debtServiceRatio: Math.round(debtServiceRatio * 100) / 100,
      actionableGuidance:
        'Try increasing your down payment to 50% or choosing a lower travel fare category to comfortably fit your monthly budget.',
      validityDays: 30,
    };
  }

  // Approved
  const tier =
    debtServiceRatio <= 0.22 && input.monthlyIncome >= 350_000
      ? 'tier_1_instant'
      : 'tier_2_standard';

  return {
    approved: true,
    tier,
    approvedAmount: input.requestedAmount,
    recommendedDownPaymentPercent: input.downPaymentPercent,
    recommendedTenureMonths: input.tenureMonths,
    reasonTitle: 'Instant Financing Approval',
    reasonDetails:
      tier === 'tier_1_instant'
        ? 'Excellent credit profile and healthy disposable income ratio. Your flight ticket is ready for instant issuance.'
        : 'Application verified successfully within standard underwriting parameters.',
    debtServiceRatio: Math.round(debtServiceRatio * 100) / 100,
    validityDays: 14,
  };
}
