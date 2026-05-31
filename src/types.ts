/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LedgerElementType = 'item' | 'note' | 'subheading' | 'spacer';

export interface LedgerElement {
  id: string;
  type: LedgerElementType;
  code?: string; // e.g. "A", "B", "1"
  description: string;
  unit?: string; // e.g. "Nr.", "M", "M³", "Bags", "Item"
  qty?: number;
  rate?: number;
  total?: number; // Auto-calculated or custom override
  isCustomTotal?: boolean; // Whether the user edited the total manually
}

export interface InvoiceSection {
  id: string;
  title: string; // e.g. "1 Electrical (First Fix)- Ground Floor"
  elements: LedgerElement[];
}

export interface SummaryItem {
  id: string;
  description: string;
  amount: number;
  referenceSectionId?: string; // Links to a section total e.g. Sect 1, 2, 3
}

export interface ClientPremiseInfo {
  clientName: string; // e.g. "Mr & Mrs Partrick Murray's"
  projectTitle: string; // e.g. "The proposed building"
  siteLocation: string; // e.g. "Mambo Village"
  summaryBuildingLocation?: string; // e.g. "LAKKA Village Freetown"
}

export interface CompanyInfo {
  name: string; // FORTUNE ELECTRICALS
  licenseTitle: string; // Licensed Electrical Engineering Contractor
  mobiles: string[]; // ["+232 76 612054", "+232 77 612054"]
  email: string; // fortune.electricals@yahoo.com
}

export interface Invoice {
  id: string;
  invoiceNo: string; // e.g. "FE/2026/042"
  title: string; // e.g. "Electrical estimate for Mr & Mrs Patrick Murray"
  date: string; // Date of estimate
  company: CompanyInfo;
  client: ClientPremiseInfo;
  currency: {
    symbol: string; // e.g. "SLL" or "SLE" or "Le"
    code: string; // e.g. "Le"
  };
  sections: InvoiceSection[];
  summaryRefTitle: string; // e.g. "M&E BUDGET COST FOR THE Client premise"
  summaryTitle: string; // e.g. "PROPOSED Client premise"
  summaryBudgetTitle: string; // e.g. "Proposed Client Building sited at LAKKA Village Freetown."
  notes?: string; // Footer notes
  customLogoUrl?: string;
  customStampUrl?: string;
  customSignatureUrl?: string;
  stampOffsetX?: number;
  stampOffsetY?: number;
  stampRotate?: number;
  stampScale?: number;
}
