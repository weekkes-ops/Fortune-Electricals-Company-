/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Invoice, InvoiceSection } from './types';

/**
 * Formats a number as currency without decimal points by default, matching the Sierra Leonean Leone style.
 */
export function formatCurrency(amount: number, symbol: string = 'Le'): string {
  if (isNaN(amount) || amount === undefined) return '-';
  const rounded = Math.round(amount);
  const formatted = rounded.toLocaleString('en-US');
  return symbol ? `${symbol} ${formatted}` : formatted;
}

/**
 * Calculates the total of an individual item
 */
export function getItemTotal(qty: number | undefined, rate: number | undefined): number {
  if (qty === undefined || rate === undefined) return 0;
  return qty * rate;
}

/**
 * Calculates the total of a section's items
 */
export function getSectionTotal(section: InvoiceSection): number {
  return section.elements.reduce((sum, el) => {
    if (el.type === 'item') {
      const itemVal = el.total !== undefined && el.isCustomTotal 
        ? el.total 
        : getItemTotal(el.qty, el.rate);
      return sum + itemVal;
    }
    return sum;
  }, 0);
}

/**
 * Aggregates all totals for an invoice
 */
export interface InvoiceAggregateTotals {
  sectionTotals: Record<string, number>; // Section ID -> Total
  buildingServicesTotal: number; // Sum of Sections 1, 2, and 3
  earthingTotal: number; // Section 4 Total
  grandTotal: number; // Building + Earthing
}

export function calculateInvoiceTotals(invoice: Invoice): InvoiceAggregateTotals {
  const sectionTotals: Record<string, number> = {};
  
  invoice.sections.forEach((sec) => {
    sectionTotals[sec.id] = getSectionTotal(sec);
  });

  // Calculate sum of first three sections for building services installation
  let buildingServicesTotal = 0;
  invoice.sections.forEach((sec) => {
    if (sec.id !== 'sec-4-earthing') {
      buildingServicesTotal += sectionTotals[sec.id] || 0;
    }
  });

  const earthingTotal = sectionTotals['sec-4-earthing'] || 0;
  const grandTotal = buildingServicesTotal + earthingTotal;

  return {
    sectionTotals,
    buildingServicesTotal,
    earthingTotal,
    grandTotal
  };
}
