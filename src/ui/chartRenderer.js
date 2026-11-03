import { BUSINESS_CONFIG } from '../simulation/businessModel.js';

/**
 * ChartRenderer
 * Generates an SVG chart in the bottom business card illustrating:
 * - Revenues vs Total Costs with the Break-even point (Point Mort)
 * - 3-Year growth projections
 */
export class ChartRenderer {
  constructor(svgElement) {
    this.svg = svgElement;
  }

  renderBreakEvenChart(currentN, revenue, costs) {
    // Width 380, Height 90
    const w = 380;
    const h = 90;
    const padL = 35;
    const padR = 20;
    const padT = 15;
    const padB = 22;

    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    // Max values for scale: N from 0 to 20, Amount from 0 to 320 000 DT
    const maxAmount = 320000;
    const getY = (val) => padT + plotH - (val / maxAmount) * plotH;
    const getX = (n) => padL + (n / 20) * plotW;

    // Points for Cost Line: (0, 73 260) to (20, 205 260)
    const costY0 = getY(BUSINESS_CONFIG.FIXED_COSTS_TOTAL);
    const costY20 = getY(BUSINESS_CONFIG.FIXED_COSTS_TOTAL + 20 * BUSINESS_CONFIG.VARIABLE_COST_PER_INSTALL);

    // Points for Revenue Line: (0, 12 000) to (20, 312 000)
    const revY0 = getY(BUSINESS_CONFIG.MAINTENANCE_REVENUE);
    const revY20 = getY(20 * BUSINESS_CONFIG.PRICE_PER_INSTALL + BUSINESS_CONFIG.MAINTENANCE_REVENUE);

    // Break-even intersection at N = 7.29
    const beX = getX(BUSINESS_CONFIG.BREAK_EVEN_UNITS);
    const beY = getY(BUSINESS_CONFIG.BREAK_EVEN_UNITS * BUSINESS_CONFIG.PRICE_PER_INSTALL + BUSINESS_CONFIG.MAINTENANCE_REVENUE);

    // Current slider position
    const curX = getX(currentN);
    const curRevY = getY(revenue);

    this.svg.innerHTML = `
      <!-- Axes -->
      <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#cbd5e1" stroke-width="1.2" />
      <line x1="${padL}" y1="${padT + plotH}" x2="${w - padR}" y2="${padT + plotH}" stroke="#cbd5e1" stroke-width="1.2" />

      <!-- Y Axis Labels -->
      <text x="${padL - 4}" y="${padT + 8}" font-size="8" fill="#64748b" text-anchor="end">320k</text>
      <text x="${padL - 4}" y="${padT + plotH}" font-size="8" fill="#64748b" text-anchor="end">0 DT</text>

      <!-- Break-Even Vertical Guideline -->
      <line x1="${beX}" y1="${padT}" x2="${beX}" y2="${padT + plotH}" stroke="#0f172a" stroke-width="1.2" stroke-dasharray="3,3" />
      <text x="${beX}" y="${h - 6}" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">Seuil (8)</text>

      <!-- Total Cost Line (Red) -->
      <line x1="${padL}" y1="${costY0}" x2="${w - padR}" y2="${costY20}" stroke="#ef4444" stroke-width="2.2" />

      <!-- Revenue Line (Blue) -->
      <line x1="${padL}" y1="${revY0}" x2="${w - padR}" y2="${revY20}" stroke="#0284c7" stroke-width="2.2" />

      <!-- Break-Even Intersection Dot -->
      <circle cx="${beX}" cy="${beY}" r="4" fill="#f59e0b" stroke="#0f172a" stroke-width="1.5" />

      <!-- Dynamic Current Cursor -->
      <line x1="${curX}" y1="${padT}" x2="${curX}" y2="${padT + plotH}" stroke="#10b981" stroke-width="1.5" stroke-dasharray="2,2" />
      <circle cx="${curX}" cy="${curRevY}" r="4.5" fill="${currentN >= 8 ? '#10b981' : '#ef4444'}" stroke="#ffffff" stroke-width="1.5" />

      <!-- Legend -->
      <g transform="translate(${padL + 10}, ${padT + 4})">
        <circle cx="0" cy="0" r="3" fill="#0284c7" />
        <text x="6" y="3" font-size="8" font-weight="bold" fill="#0284c7">CA</text>
        <circle cx="30" cy="0" r="3" fill="#ef4444" />
        <text x="36" y="3" font-size="8" font-weight="bold" fill="#ef4444">Charges</text>
      </g>
    `;
  }
}
