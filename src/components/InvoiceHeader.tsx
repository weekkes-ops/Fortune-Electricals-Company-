/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Invoice } from '../types';
import { Mail, Phone, Edit2, Check } from 'lucide-react';
import { CorporateLogo } from './CorporateDesign';

interface InvoiceHeaderProps {
  invoice: Invoice;
  isEditing: boolean;
  onUpdate: (updated: Partial<Invoice>) => void;
}

export default function InvoiceHeader({ invoice, isEditing, onUpdate }: InvoiceHeaderProps) {
  const [inlineEdit, setInlineEdit] = React.useState(false);
  const [clientName, setClientName] = React.useState(invoice.client.clientName);
  const [projectTitle, setProjectTitle] = React.useState(invoice.client.projectTitle);
  const [siteLocation, setSiteLocation] = React.useState(invoice.client.siteLocation);
  const [invoiceNo, setInvoiceNo] = React.useState(invoice.invoiceNo);
  const [date, setDate] = React.useState(invoice.date);

  // Sync state if invoice changes
  React.useEffect(() => {
    setClientName(invoice.client.clientName);
    setProjectTitle(invoice.client.projectTitle);
    setSiteLocation(invoice.client.siteLocation);
    setInvoiceNo(invoice.invoiceNo);
    setDate(invoice.date);
  }, [invoice]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ customLogoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ customLogoUrl: undefined });
  };

  const handleSave = () => {
    onUpdate({
      invoiceNo,
      date,
      client: {
        ...invoice.client,
        clientName,
        projectTitle,
        siteLocation,
      }
    });
    setInlineEdit(false);
  };

  return (
    <div className="relative border-b-2 border-slate-900 pb-6 print:border-none print:pb-3" id="invoice-header">
      {/* Blueprint Grid Watermark background for visual authenticity - Only shown on screen */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0e7ff_1px,transparent_1px),linear-gradient(to_bottom,#e0e7ff_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 -z-10 rounded-xl print:hidden pointer-events-none" />

      {/* Main Letterhead Layout */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 px-4 pt-4">
        
        {/* Vector Electrical Logo (Replica of physical M B symbol in blue) or Custom Logo */}
        <div className="flex items-center gap-4">
          <div className="relative group/logo shrink-0 select-none">
            {invoice.customLogoUrl ? (
              <img
                src={invoice.customLogoUrl}
                alt="Corporate Logo"
                className="w-20 h-20 print:w-16 print:h-16 shrink-0 object-contain rounded-lg border border-slate-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <CorporateLogo className="w-20 h-20 print:w-16 print:h-16 shrink-0" />
            )}

            {isEditing && (
              <div 
                className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover/logo:opacity-100 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer print:hidden select-none p-1 border border-blue-500"
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload custom logo"
              >
                <span className="text-[8px] text-white font-bold uppercase tracking-wider text-center leading-none">Upload Logo</span>
                {invoice.customLogoUrl && (
                  <button
                    onClick={handleResetLogo}
                    className="text-[8px] bg-red-650 hover:bg-red-750 text-white font-extrabold px-1.5 py-0.5 rounded transition mt-1"
                    title="Restore default vector emblem"
                  >
                    Restore
                  </button>
                )}
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1d4ed8] tracking-tight font-sans text-center md:text-left print:text-2xl">
              FORTUNE ELECTRICALS
            </h1>
            <p className="text-sm md:text-base italic font-medium text-slate-600 tracking-wide font-serif text-center md:text-left print:text-xs">
              Licensed Electrical Engineering Contractor
            </p>
            
            {/* Mobile / Email Contacts block */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 font-mono justify-center md:justify-start">
              <div className="flex items-center justify-center sm:justify-start gap-1">
                <Phone size={13} className="text-[#1e40af]" />
                <span>+232 76 612054 / 77 612054</span>
              </div>
              <div className="hidden sm:block text-slate-400">|</div>
              <div className="flex items-center justify-center sm:justify-start gap-1">
                <Mail size={13} className="text-[#1e40af]" />
                <span className="underline hover:text-[#1d4ed8]">fortune.electricals@yahoo.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Meta Table on Right */}
        <div className="w-full md:w-auto flex flex-col items-end gap-1 font-mono text-xs text-slate-600 print:text-[10px] shrink-0">
          <div className="border border-slate-300 rounded px-3 py-2 bg-slate-50/80 backdrop-blur-sm print:bg-transparent print:p-0 print:border-none">
            <table className="min-w-[190px]">
              <tbody>
                <tr>
                  <td className="text-slate-400 py-0.5 pr-2 text-right">No:</td>
                  <td className="font-bold text-slate-800 py-0.5">{invoice.invoiceNo}</td>
                </tr>
                <tr>
                  <td className="text-slate-400 py-0.5 pr-2 text-right">Date:</td>
                  <td className="py-0.5">{invoice.date}</td>
                </tr>
                <tr>
                  <td className="text-slate-400 py-0.5 pr-2 text-right">Status:</td>
                  <td className="py-0.5 text-blue-600 font-bold tracking-wider print:text-slate-900">ESTIMATE</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Quick Edit Invoice Details Trigger */}
          {isEditing && !inlineEdit && (
            <button
              onClick={() => setInlineEdit(true)}
              className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 transition mt-1 font-sans font-medium cursor-pointer print:hidden"
            >
              <Edit2 size={11} /> Modify Title &amp; Meta
            </button>
          )}
        </div>
      </div>

      {/* Main Colored Band & Client Premise Block */}
      <div className="mt-8 px-4 print:mt-4">
        {inlineEdit ? (
          <div className="bg-blue-50/90 border-2 border-blue-200 rounded-lg p-4 font-sans space-y-3 print:hidden">
            <h4 className="text-xs font-bold uppercase text-blue-700 tracking-wider">Edit Header Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-1 w-full text-sm bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none"
                  placeholder="Mr & Mrs Partrick Murray's"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Project / Description</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="mt-1 w-full text-sm bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none"
                  placeholder="The proposed building"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Sited At (Site Location)</label>
                <input
                  type="text"
                  value={siteLocation}
                  onChange={(e) => setSiteLocation(e.target.value)}
                  className="mt-1 w-full text-sm bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none"
                  placeholder="Mambo Village"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full text-sm bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Estimate Reference No.</label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="mt-1 w-full text-sm bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setInlineEdit(false)}
                className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 border border-slate-300 rounded transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded transition cursor-pointer font-medium"
              >
                <Check size={13} /> Save Header
              </button>
            </div>
          </div>
        ) : (
          /* High-Fidelity Ledger Description Band */
          <div className="relative border-y-2 border-slate-900 bg-slate-50/50 py-3.5 px-4 text-center select-none print:py-2 print:border-y">
            {/* Lined Grid pattern within the banner just like original ledger paper */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(203,213,225,0.15)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

            <h2 className="relative text-base md:text-lg font-bold text-slate-800 font-sans tracking-normal leading-relaxed print:text-sm">
              Electrical estimate for <span className="font-extrabold text-blue-900 underline decoration-indigo-300 decoration-2 underline-offset-4">{invoice.client.projectTitle}</span> for <span className="font-extrabold text-blue-900 underline decoration-indigo-300 decoration-2 underline-offset-4">{invoice.client.clientName}</span> sited at <span className="font-extrabold text-[#111827]">{invoice.client.siteLocation}</span>
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
