// Canadian tax calculation services for Quebec
export interface TaxCalculation {
  subtotal: number;
  gstAmount: number;
  qstAmount: number;
  total: number;
}

export interface PayrollCalculation {
  grossPay: number;
  federalTax: number;
  provincialTax: number;
  cpp: number; // Canada Pension Plan
  ei: number;  // Employment Insurance
  rqap: number; // Régime québécois d'assurance parentale
  netPay: number;
}

// GST rate for Canada
const GST_RATE = 0.05; // 5%

// QST rate for Quebec
const QST_RATE = 0.09975; // 9.975%

// CPP/RRQ rates for 2024
const CPP_RATE = 0.0595;
const CPP_MAX_PENSIONABLE = 68500;
const CPP_BASIC_EXEMPTION = 3500;

// EI rates for 2024
const EI_RATE = 0.0229; // Employee rate
const EI_MAX_INSURABLE = 63300;

// RQAP rates for Quebec 2024
const RQAP_RATE = 0.00494; // Employee rate
const RQAP_MAX_INSURABLE = 94000;

/**
 * Calculate Canadian taxes (GST + QST for Quebec)
 */
export function calculateCanadianTaxes(subtotal: number): TaxCalculation {
  const gstAmount = subtotal * GST_RATE;
  const qstAmount = subtotal * QST_RATE;
  const total = subtotal + gstAmount + qstAmount;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    qstAmount: Math.round(qstAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Calculate federal income tax (simplified brackets for 2024)
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
 * Calculate Quebec provincial tax (simplified brackets for 2024)
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
export function generatePayrollCalculation(
  grossPayPeriod: number,
  payPeriodsPerYear: number = 26 // Bi-weekly
): PayrollCalculation {
  const annualGrossPay = grossPayPeriod * payPeriodsPerYear;
  
  // Calculate annual taxes and convert to pay period
  const annualFederalTax = calculateFederalTax(annualGrossPay);
  const annualProvincialTax = calculateProvincialTax(annualGrossPay);
  
  const federalTax = Math.round((annualFederalTax / payPeriodsPerYear) * 100) / 100;
  const provincialTax = Math.round((annualProvincialTax / payPeriodsPerYear) * 100) / 100;
  
  // Calculate CPP/RRQ
  const pensionableIncome = Math.min(annualGrossPay, CPP_MAX_PENSIONABLE) - CPP_BASIC_EXEMPTION;
  const annualCPP = Math.max(0, pensionableIncome * CPP_RATE);
  const cpp = Math.round((annualCPP / payPeriodsPerYear) * 100) / 100;
  
  // Calculate EI
  const insurableIncome = Math.min(annualGrossPay, EI_MAX_INSURABLE);
  const annualEI = insurableIncome * EI_RATE;
  const ei = Math.round((annualEI / payPeriodsPerYear) * 100) / 100;
  
  // Calculate RQAP (Quebec only)
  const rqapInsurableIncome = Math.min(annualGrossPay, RQAP_MAX_INSURABLE);
  const annualRQAP = rqapInsurableIncome * RQAP_RATE;
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
 * Generate T4 slip data for an employee
 */
export function generateT4SlipData(employee: any, annualGrossPay: number) {
  const payrollCalc = generatePayrollCalculation(annualGrossPay / 26, 26);
  const annualData = {
    grossPay: annualGrossPay,
    federalTax: payrollCalc.federalTax * 26,
    provincialTax: payrollCalc.provincialTax * 26,
    cpp: payrollCalc.cpp * 26,
    ei: payrollCalc.ei * 26,
    rqap: payrollCalc.rqap * 26,
  };
  
  return {
    employee: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      sin: employee.socialInsuranceNumber,
      address: employee.address,
    },
    employer: {
      name: "Dounie Cuisine Inc.",
      address: "1234 Rue Sainte-Catherine, Montréal, QC H3G 1P1",
      payrollNumber: "RP0001",
      businessNumber: "123456789RP0001",
    },
    year: new Date().getFullYear(),
    box14: annualData.grossPay, // Employment income
    box16: annualData.cpp, // CPP contributions
    box18: annualData.ei, // EI contributions
    box22: annualData.federalTax, // Income tax deducted
    boxO: annualData.rqap, // RQAP premiums (Quebec)
  };
}

/**
 * Calculate employer contributions (what employer pays on top of salary)
 */
export function calculateEmployerContributions(grossPay: number): {
  cppEmployer: number;
  eiEmployer: number;
  rqapEmployer: number;
  totalEmployerCost: number;
} {
  const cppEmployer = Math.min(grossPay, CPP_MAX_PENSIONABLE - CPP_BASIC_EXEMPTION) * CPP_RATE;
  const eiEmployer = Math.min(grossPay, EI_MAX_INSURABLE) * EI_RATE * 1.4; // Employer pays 1.4x
  const rqapEmployer = Math.min(grossPay, RQAP_MAX_INSURABLE) * RQAP_RATE * 1.4; // Employer pays 1.4x
  
  const totalEmployerCost = grossPay + cppEmployer + eiEmployer + rqapEmployer;
  
  return {
    cppEmployer: Math.round(cppEmployer * 100) / 100,
    eiEmployer: Math.round(eiEmployer * 100) / 100,
    rqapEmployer: Math.round(rqapEmployer * 100) / 100,
    totalEmployerCost: Math.round(totalEmployerCost * 100) / 100,
  };
}
