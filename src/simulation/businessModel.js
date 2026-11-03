/**
 * Business Model & Financial Simulation Engine
 * Encapsulates the startup economics of HelioAqua for the 4ème Éco-Gestion syllabus.
 */

export const BUSINESS_CONFIG = {
  PRICE_PER_INSTALL: 15000,        // DT per turnkey installation
  VARIABLE_COST_PER_INSTALL: 6600, // DT unit direct costs
  MARGIN_PER_INSTALL: 8400,        // DT unit margin (15 000 - 6 600)
  FIXED_COSTS_TOTAL: 73260,        // DT total structural fixed costs
  MAINTENANCE_REVENUE: 12000,      // DT annual maintenance revenue (20 × 600 DT)
  NET_FIXED_TO_COVER: 61260,       // DT net fixed costs to be amortized
  BREAK_EVEN_UNITS: 7.29,          // Point mort (approx 8 units)
  
  // Year 1 official plan
  YEAR_1_UNITS: 10,
  YEAR_1_REVENUE: 162000,
  YEAR_1_COSTS: 139260,
  YEAR_1_PROFIT: 22740,

  // 3-Year Outlook (in thousand DT)
  PROJECTIONS_3Y: {
    years: ['An 1', 'An 2', 'An 3'],
    revenues: [162, 230, 310],
    costs: [139, 175, 215],
    profits: [23, 55, 95],
    returnOnCapital: '38%',
    paybackPeriod: '1,7 an'
  },

  // Startup capital breakdown
  CAPITAL: {
    total: 60000,
    personal: 15000,
    bankLoan: 30000,
    solidarityLoan: 15000
  }
};

export function calculateFinancials(installationsCount) {
  const N = installationsCount;
  const revenue = (N * BUSINESS_CONFIG.PRICE_PER_INSTALL) + BUSINESS_CONFIG.MAINTENANCE_REVENUE;
  const totalCosts = BUSINESS_CONFIG.FIXED_COSTS_TOTAL + (N * BUSINESS_CONFIG.VARIABLE_COST_PER_INSTALL);
  const netResult = (N * BUSINESS_CONFIG.MARGIN_PER_INSTALL) - BUSINESS_CONFIG.NET_FIXED_TO_COVER;
  const netMarginPercent = (netResult / revenue) * 100;

  const isProfitable = N >= 8;
  const breakEvenProgress = Math.min(100, (N / 20) * 100);

  return {
    N,
    revenue,
    totalCosts,
    netResult,
    netMarginPercent,
    isProfitable,
    breakEvenProgress
  };
}
