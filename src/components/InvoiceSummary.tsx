/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Invoice } from '../types';
import { formatCurrency } from '../utils';
import { Edit, Check } from 'lucide-react';
import { CorporateStamp, CorporateSignature } from './CorporateDesign';

interface InvoiceSummaryProps {
  invoice: Invoice;
  isEditing: boolean;
  buildingServicesTotal: number;
  earthingTotal: number;
  grandTotal: number;
  onUpdate: (updated: Partial<Invoice>) => void;
}

export default function InvoiceSummary({
  invoice,
  isEditing,
  buildingServicesTotal,
  earthingTotal,
  grandTotal,
  onUpdate
}: InvoiceSummaryProps) {
  const [editingSummary, setEditingSummary] = React.useState(false);
  const [summaryTitle, setSummaryTitle] = React.useState(invoice.summaryTitle);
  const [summaryBudgetTitle, setSummaryBudgetTitle] = React.useState(invoice.summaryBudgetTitle);
  const [summaryRefTitle, setSummaryRefTitle] = React.useState(invoice.summaryRefTitle);

  const stampInputRef = React.useRef<HTMLInputElement>(null);
  const sigInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setSummaryTitle(invoice.summaryTitle);
    setSummaryBudgetTitle(invoice.summaryBudgetTitle);
    setSummaryRefTitle(invoice.summaryRefTitle);
  }, [invoice]);

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ customStampUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ customSignatureUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate({
      summaryTitle,
      summaryBudgetTitle,
      summaryRefTitle
    });
    setEditingSummary(false);
  };

  return (
    <div className="mt-8 mb-6 mx-auto max-w-3xl border border-slate-200 bg-white p-6 rounded-lg select-text shadow-sm print:mt-6 print:p-4 print:border-2 print:border-slate-800 print:rounded-none" id="invoice-summary-block">
      <div className="flex justify-between items-center mb-4 border-b pb-2 print:border-none print:pb-0">
        <h4 className="text-sm font-extrabold tracking-widest text-[#1e40af] uppercase font-mono print:text-[8px] print:text-black">
          {invoice.summaryRefTitle}
        </h4>
        {isEditing && !editingSummary && (
          <button
            onClick={() => setEditingSummary(true)}
            className="flex items-center gap-1 text-[11px] text-[#1e40af] font-semibold hover:underline cursor-pointer print:hidden"
          >
            <Edit size={12} /> Edit Titles
          </button>
        )}
      </div>

      {editingSummary ? (
        <div className="space-y-3 bg-slate-50 p-3 rounded border mb-4 print:hidden">
          <div>
            <label className="block text-xs font-medium text-slate-600">Summary Section Header</label>
            <input
              type="text"
              value={summaryRefTitle}
              onChange={(e) => setSummaryRefTitle(e.target.value)}
              className="mt-1 w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Client Premise Label</label>
            <input
              type="text"
              value={summaryTitle}
              onChange={(e) => setSummaryTitle(e.target.value)}
              className="mt-1 w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Location Heading Label</label>
            <input
              type="text"
              value={summaryBudgetTitle}
              onChange={(e) => setSummaryBudgetTitle(e.target.value)}
              className="mt-1 w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-2.5 py-1 rounded cursor-pointer"
          >
            <Check size={12} /> Sync Titles
          </button>
        </div>
      ) : (
        <div className="text-center font-bold text-slate-800 mb-6 print:mb-3">
          <h3 className="text-base tracking-wider uppercase underline print:text-xs print:text-black">{summaryTitle}</h3>
          <p className="text-xs text-slate-500 font-mono italic mt-1 print:text-[9px] print:text-black">
            {summaryBudgetTitle}
          </p>
        </div>
      )}

      {/* Structured Ledger Summary Layout */}
      <table className="w-full text-sm border-collapse text-left font-sans print:text-[10px]">
        <thead>
          <tr className="border-b-2 border-slate-800 font-mono text-xs uppercase tracking-wider text-slate-700 print:text-[8px] print:text-black">
            <th className="py-2 px-3 w-16 text-center border-r border-slate-200">Item</th>
            <th className="py-2 px-4 border-r border-slate-200">Description</th>
            <th className="py-2 px-4 w-40 text-right font-bold">Budget Cost ({invoice.currency.code})</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {/* Main heading Nil row */}
          <tr className="font-semibold text-slate-800 bg-slate-50/50 print:bg-transparent print:text-black">
            <td className="py-2 px-3 text-center border-r border-slate-200 font-mono">A</td>
            <td className="py-2 px-4 border-r border-slate-200">
              {invoice.client.projectTitle} sited at {invoice.client.siteLocation}.
            </td>
            <td className="py-2 px-4 text-right font-mono text-slate-400 italic">Nil</td>
          </tr>

          {/* Core Services heading */}
          <tr className="font-bold text-slate-900 bg-slate-50/30 print:bg-transparent print:text-black">
            <td className="py-2 px-3 text-center border-r border-slate-200 font-mono">1</td>
            <td className="py-2 px-4 border-r border-slate-200 underline">M&amp;E Services Installation</td>
            <td className="py-2 px-4 text-right font-mono">-</td>
          </tr>

          {/* Sub item i: Building Wiring */}
          <tr className="hover:bg-slate-50/30 print:text-black">
            <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500 font-mono">(i)</td>
            <td className="py-2 px-4 border-r border-slate-200 text-slate-800 pl-8 print:pl-4">
              Building Electrical Services Installation (ground floor Wiring)
            </td>
            <td className="py-2 px-4 text-right font-mono font-bold text-slate-900">
              {formatCurrency(buildingServicesTotal, '')}
            </td>
          </tr>

          {/* Sub item ii: Faraday Earthing */}
          <tr className="hover:bg-slate-50/30 print:text-black">
            <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500 font-mono">(ii)</td>
            <td className="py-2 px-4 border-r border-slate-200 text-slate-800 pl-8 print:pl-4">
              Earthing &amp; Bonding (Faraday Cage)
            </td>
            <td className="py-2 px-4 text-right font-mono font-bold text-slate-900 border-b border-slate-200">
              {formatCurrency(earthingTotal, '')}
            </td>
          </tr>
        </tbody>

        {/* Dynamic Grand Summaries */}
        <tfoot>
          <tr className="border-t-2 border-b-2 border-slate-900 bg-slate-50 font-extrabold text-slate-900 print:bg-transparent print:text-black">
            <td colSpan={2} className="py-3 px-4 text-right font-mono tracking-wider text-xs uppercase print:py-1.5 print:text-[8px]">
              Total {invoice.currency.code}:
            </td>
            <td className="py-3 px-4 text-right font-mono text-base font-black text-blue-600 border-l border-slate-200 select-all print:py-1.5 print:text-[11px] print:text-black">
              {formatCurrency(grandTotal, invoice.currency.symbol)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Professional Note signature lines below summary on page 3 */}
      <div className="mt-8 border-t border-dashed border-slate-300 pt-6 flex flex-col md:flex-row justify-between gap-8 font-sans text-xs text-slate-500 print:mt-4 print:pt-3">
        {/* Prepared By container holding Signature and Stamp superimposed horizontally in traditional manner */}
        <div className="space-y-1 relative pb-2 group/prep">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 pb-1">
            <p className="font-bold text-slate-700 print:text-black">Prepared By (Fortune Electricals Ctr.):</p>
            {isEditing && (
              <div className="flex flex-wrap items-center gap-1 text-[10px] text-blue-600 font-sans print:hidden select-none">
                <span>(</span>
                <button 
                  onClick={() => sigInputRef.current?.click()} 
                  className="font-bold hover:underline cursor-pointer hover:text-blue-800 font-mono"
                  title="Upload personal signature image"
                >
                  Edit Sig
                </button>
                {invoice.customSignatureUrl && (
                  <button 
                    onClick={() => onUpdate({ customSignatureUrl: undefined })} 
                    className="text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer"
                    title="Clear custom signature and use default vector"
                  >
                    ✕
                  </button>
                )}
                <span className="text-slate-300 mx-0.5">|</span>
                <button 
                  onClick={() => stampInputRef.current?.click()} 
                  className="font-bold hover:underline cursor-pointer hover:text-blue-800 font-mono"
                  title="Upload a signature stamp image"
                >
                  Edit Stamp
                </button>
                {invoice.customStampUrl && (
                  <button 
                    onClick={() => onUpdate({ customStampUrl: undefined })} 
                    className="text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer"
                    title="Clear custom stamp and use default vector"
                  >
                    ✕
                  </button>
                )}
                <span>)</span>
              </div>
            )}
          </div>
          
          {/* Authentic traditional overlay workspace where stamp and signature sit horizontally near each other */}
          <div className="relative h-20 w-64 my-2 select-none">
            {/* 1. Signature layer - placed horizontally on the left side of the signing area */}
            <div 
              className="absolute pointer-events-none opacity-95 print:opacity-100"
              style={{
                left: '4px',
                top: '4px',
                width: '110px',
                height: '60px',
                zIndex: 20,
              }}
            >
              {invoice.customSignatureUrl ? (
                <img 
                  src={invoice.customSignatureUrl} 
                  alt="Corporate Signature" 
                  className="w-full h-full object-contain pointer-events-none" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <CorporateSignature className="w-full h-full" />
              )}
            </div>

            {/* 2. Stamp layer - placed horizontally on the right side of the signing area, with active slider offsets */}
            <div 
              id="corporate-seal-stamp"
              className="absolute pointer-events-none opacity-80 print:opacity-100 transition-transform duration-75 group/stamp"
              style={{
                left: '128px',
                top: '-12px',
                width: '84px',
                height: '84px',
                transform: `translateX(${invoice.stampOffsetX !== undefined ? invoice.stampOffsetX : 0}px) translateY(${invoice.stampOffsetY !== undefined ? invoice.stampOffsetY : 0}px) rotate(${invoice.stampRotate !== undefined ? invoice.stampRotate : -10}deg) scale(${invoice.stampScale !== undefined ? invoice.stampScale : 1})`,
                transformOrigin: 'center center',
                zIndex: 10,
              }}
            >
              {invoice.customStampUrl ? (
                <img 
                  src={invoice.customStampUrl} 
                  alt="Corporate Stamp" 
                  className="w-full h-full object-contain pointer-events-none" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <CorporateStamp className="w-full h-full" />
              )}
            </div>
          </div>

          <div className="w-56 h-px border-b border-slate-400 print:border-slate-800 mt-2" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#1e40af] print:text-black">
            Authorized Representative Signature
          </p>

          {/* Precision Alignment Position Sliders Panel (Interactive Edit Mode only, screen-only) */}
          {isEditing && (
            <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200 shadow-sm rounded-lg flex flex-col gap-2 z-30 print:hidden text-[10px] w-56 select-none">
              <div className="flex items-center justify-between font-bold text-slate-700 border-b border-slate-200 pb-1">
                <span className="uppercase tracking-wider">Stamp Position Sliders</span>
                <button 
                  onClick={() => {
                    onUpdate({
                      stampOffsetX: 0,
                      stampOffsetY: 0,
                      stampRotate: -10,
                      stampScale: 1
                    });
                  }}
                  className="text-[9px] text-[#1d4ed8] hover:underline cursor-pointer font-bold"
                >
                  Reset
                </button>
              </div>
              <div className="flex flex-col gap-1 text-slate-600">
                <div className="flex items-center justify-between gap-1">
                  <span className="w-12 text-slate-500">Horiz (X):</span>
                  <input 
                    type="range" 
                    min="-80" 
                    max="120" 
                    value={invoice.stampOffsetX !== undefined ? invoice.stampOffsetX : 0} 
                    onChange={(e) => onUpdate({ stampOffsetX: parseInt(e.target.value) })}
                    className="w-full accent-[#1d4ed8] h-1 rounded cursor-col-resize bg-slate-200"
                  />
                  <span className="w-7 text-right font-mono text-slate-700 bg-white border border-slate-200 px-1 py-0.5 rounded">{invoice.stampOffsetX !== undefined ? invoice.stampOffsetX : 0}px</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="w-12 text-slate-500">Vert (Y):</span>
                  <input 
                    type="range" 
                    min="-60" 
                    max="60" 
                    value={invoice.stampOffsetY !== undefined ? invoice.stampOffsetY : 0} 
                    onChange={(e) => onUpdate({ stampOffsetY: parseInt(e.target.value) })}
                    className="w-full accent-[#1d4ed8] h-1 rounded cursor-row-resize bg-slate-200"
                  />
                  <span className="w-7 text-right font-mono text-slate-700 bg-white border border-slate-200 px-1 py-0.5 rounded">{invoice.stampOffsetY !== undefined ? invoice.stampOffsetY : 0}px</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="w-12 text-slate-500">Rotation:</span>
                  <input 
                    type="range" 
                    min="-180" 
                    max="180" 
                    value={invoice.stampRotate !== undefined ? invoice.stampRotate : -10} 
                    onChange={(e) => onUpdate({ stampRotate: parseInt(e.target.value) })}
                    className="w-full accent-[#1d4ed8] h-1 rounded bg-slate-200"
                  />
                  <span className="w-7 text-right font-mono text-slate-700 bg-white border border-slate-200 px-1 py-0.5 rounded">{invoice.stampRotate !== undefined ? invoice.stampRotate : -10}°</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="w-12 text-slate-500">Scale:</span>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2.0" 
                    step="0.05"
                    value={invoice.stampScale !== undefined ? invoice.stampScale : 1} 
                    onChange={(e) => onUpdate({ stampScale: parseFloat(e.target.value) })}
                    className="w-full accent-[#1d4ed8] h-1 rounded bg-slate-200"
                  />
                  <span className="w-7 text-right font-mono text-slate-700 bg-white border border-slate-200 px-1 py-0.5 rounded">{invoice.stampScale !== undefined ? invoice.stampScale : 1}x</span>
                </div>
              </div>
            </div>
          )}

          {/* Invisible native file inputs */}
          <input 
            type="file" 
            ref={stampInputRef} 
            onChange={handleStampUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <input 
            type="file" 
            ref={sigInputRef} 
            onChange={handleSigUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <div className="space-y-1 text-left sm:text-right self-end">
          <p className="font-bold text-slate-700 print:text-black">Client Approval Seal:</p>
          <div className="h-20 my-1" /> {/* Matching spatial layout spacing */}
          <div className="w-48 h-px border-b border-slate-400 my-0.5 inline-block print:border-slate-800" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 print:text-black">
            Date / Authorized Signature
          </p>
        </div>
      </div>
    </div>
  );
}
