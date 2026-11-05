import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLoanBreakdown,
  evaluateLoanApplication,
  generateRepaymentSchedule,
} from './loan.ts';

test('calculateLoanBreakdown computes accurate amortization and down payment', () => {
  const principal = 1_000_000;
  const tenure = 6;
  const downPaymentPercent = 20;

  const result = calculateLoanBreakdown(principal, tenure, downPaymentPercent);

  assert.equal(result.principal, 1_000_000);
  assert.equal(result.downPaymentPercent, 20);
  assert.equal(result.downPaymentAmount, 200_000);
  assert.equal(result.financedAmount, 800_000);
  assert.equal(result.tenureMonths, 6);
  assert.ok(result.monthlyPayment > 0);
  assert.ok(result.totalRepayment > result.financedAmount);
  assert.equal(result.totalInterest, result.totalRepayment - result.financedAmount);
});

test('generateRepaymentSchedule creates correct number of installments summing to zero remaining', () => {
  const breakdown = calculateLoanBreakdown(500_000, 6, 20);
  const schedule = generateRepaymentSchedule(breakdown);

  assert.equal(schedule.length, 6);
  assert.equal(schedule[0].installmentNumber, 1);
  assert.equal(schedule[5].installmentNumber, 6);
  assert.equal(schedule[5].remainingBalance, 0);
});

test('evaluateLoanApplication approves healthy income to loan ratio', () => {
  const decision = evaluateLoanApplication({
    fullName: 'Chioma Adebayo',
    email: 'chioma@example.com',
    phone: '+2348031234567',
    bvnOrNin: '22334455667',
    monthlyIncome: 850_000,
    employmentType: 'employed',
    requestedAmount: 650_000,
    downPaymentPercent: 20,
    tenureMonths: 6,
  });

  assert.equal(decision.approved, true);
  assert.equal(decision.tier, 'tier_1_instant');
  assert.ok(decision.debtServiceRatio <= 0.38);
});

test('evaluateLoanApplication rejects when monthly income is below minimum threshold', () => {
  const decision = evaluateLoanApplication({
    fullName: 'Emeka Okafor',
    email: 'emeka@example.com',
    phone: '+2348099887766',
    bvnOrNin: '11223344556',
    monthlyIncome: 80_000, // Below 120,000 threshold
    employmentType: 'self-employed',
    requestedAmount: 500_000,
    downPaymentPercent: 20,
    tenureMonths: 6,
  });

  assert.equal(decision.approved, false);
  assert.equal(decision.tier, 'declined');
  assert.match(decision.reasonDetails, /minimum verifiable monthly income/);
});

test('evaluateLoanApplication offers conditional terms when debt ratio can be cured by longer tenure', () => {
  const decision = evaluateLoanApplication({
    fullName: 'Zainab Bello',
    email: 'zainab@example.com',
    phone: '+2348123456789',
    bvnOrNin: '99887766554',
    monthlyIncome: 300_000,
    employmentType: 'employed',
    requestedAmount: 900_000,
    downPaymentPercent: 10,
    tenureMonths: 3, // Very short tenure results in high monthly payment, but 12 months with 35% down cures it
  });

  assert.ok(decision.approved);
  assert.equal(decision.tier, 'conditional');
  assert.equal(decision.recommendedTenureMonths, 12);
  assert.equal(decision.recommendedDownPaymentPercent, 35);
});
