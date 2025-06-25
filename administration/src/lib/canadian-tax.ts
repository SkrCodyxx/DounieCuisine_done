// Canadian tax calculation utilities for Quebec

export interface TaxCalculation {
  subtotal: number;
  gstAmount: number;
  qstAmount: number;
  total: number;
}

export interface PayrollDeductions {
  grossPay: number;
  federalTax: number;
  provincialTax: number;
  cpp: number; // Canada Pension Plan
  ei: number;  // Employment Insurance
  rqap: number; // Régime québécois d'assurance parentale
  netPay: number;
}

// Tax rates for 2024
export const TAX_RATES = {
  GST: 0.05, // 5%
  QST: 0.09975, // 9.975%
  CPP: 0.0595,
  EI: 0.0229,
  RQAP: 0.00494,
} as const;

// Maximum insurable/pensionable earnings for 2024
export const MAX_EARNINGS = {
  CPP_PENSIONABLE: 68500,
  CPP_BASIC_EXEMPTION: 3500,
  EI_INSURABLE: 63300,
  RQAP_INSURABLE: 94000,
} as const;

/**
 * Calculate Canadian taxes (GST + QST for Quebec)
 */
export function calculateCanadianTaxes(subtotal: number): TaxCalculation {
  const gstAmount = subtotal * TAX_RATES.GST;
  const qstAmount = subtotal * TAX_RATES.QST;
  const total = subtotal + gstAmount + qstAmount;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    qstAmount: Math.round(qstAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Calculate federal income tax (simplified 2024 brackets)
 */
function calculateFederalTax(annualIncome: number): number {
  const brackets = [
    { min: 0, max: 55867, rate: 0.15 },
    { min: 55867, max: 111733, rate: 0.205 },
    { min: 111733, max: 173205, rate: 0.26 },
    { min: 173205, max: 246752, rate: 0.29 },
    { min: 246752, max: Infinity, rate: 0.33 },
  ];
  
  let tax = 0;
  let remainingIncome = annualIncome;
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }
  
  return tax;
}

/**
 * Calculate Quebec provincial tax (simplified 2024 brackets)
 */
function calculateProvincialTax(annualIncome: number): number {
  const brackets = [
    { min: 0, max: 51780, rate: 0.14 },
    { min: 51780, max: 103545, rate: 0.19 },
    { min: 103545, max: 126000, rate: 0.24 },
    { min: 126000, max: Infinity, rate: 0.2575 },
  ];
  
  let tax = 0;
  let remainingIncome = annualIncome;
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }
  
  return tax;
}

/**
 * Calculate payroll deductions for Quebec employee
 */
export function calculatePayrollDeductions(
  grossPayPeriod: number,
  payPeriodsPerYear: number = 26 // Bi-weekly
): PayrollDeductions {
  const annualGrossPay = grossPayPeriod * payPeriodsPerYear;
  
  // Calculate annual taxes and convert to pay period
  const annualFederalTax = calculateFederalTax(annualGrossPay);
  const annualProvincialTax = calculateProvincialTax(annualGrossPay);
  
  const federalTax = Math.round((annualFederalTax / payPeriodsPerYear) * 100) / 100;
  const provincialTax = Math.round((annualProvincialTax / payPeriodsPerYear) * 100) / 100;
  
  // Calculate CPP/RRQ
  const pensionableIncome = Math.min(annualGrossPay, MAX_EARNINGS.CPP_PENSIONABLE) - MAX_EARNINGS.CPP_BASIC_EXEMPTION;
  const annualCPP = Math.max(0, pensionableIncome * TAX_RATES.CPP);
  const cpp = Math.round((annualCPP / payPeriodsPerYear) * 100) / 100;
  
  // Calculate EI
  const insurableIncome = Math.min(annualGrossPay, MAX_EARNINGS.EI_INSURABLE);
  const annualEI = insurableIncome * TAX_RATES.EI;
  const ei = Math.round((annualEI / payPeriodsPerYear) * 100) / 100;
  
  // Calculate RQAP (Quebec only)
  const rqapInsurableIncome = Math.min(annualGrossPay, MAX_EARNINGS.RQAP_INSURABLE);
  const annualRQAP = rqapInsurableIncome * TAX_RATES.RQAP;
  const rqap = Math.round((annualRQAP / payPeriodsPerYear) * 100) / 100;
  
  const totalDeductions = federalTax + provincialTax + cpp + ei + rqap;
  const netPay = Math.round((grossPayPeriod - totalDeductions) * 100) / 100;
  
  return {
    grossPay: grossPayPeriod,
    federalTax,
    provincialTax,
    cpp,
    ei,
    rqap,
    netPay,
  };
}

/**
 * Format currency as Canadian dollars
 */
export function formatCAD(amount: number): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

/**
 * Calculate employer contributions
 */
export function calculateEmployerContributions(grossPay: number): {
  cppEmployer: number;
  eiEmployer: number;
  rqapEmployer: number;
  totalEmployerCost: number;
} {
  const cppEmployer = Math.min(grossPay, MAX_EARNINGS.CPP_PENSIONABLE - MAX_EARNINGS.CPP_BASIC_EXEMPTION) * TAX_RATES.CPP;
  const eiEmployer = Math.min(grossPay, MAX_EARNINGS.EI_INSURABLE) * TAX_RATES.EI * 1.4; // Employer pays 1.4x
  const rqapEmployer = Math.min(grossPay, MAX_EARNINGS.RQAP_INSURABLE) * TAX_RATES.RQAP * 1.4; // Employer pays 1.4x
  
  const totalEmployerCost = grossPay + cppEmployer + eiEmployer + rqapEmployer;
  
  return {
    cppEmployer: Math.round(cppEmployer * 100) / 100,
    eiEmployer: Math.round(eiEmployer * 100) / 100,
    rqapEmployer: Math.round(rqapEmployer * 100) / 100,
    totalEmployerCost: Math.round(totalEmployerCost * 100) / 100,
  };
}
