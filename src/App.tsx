/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Invoice, InvoiceSection, LedgerElement } from './types';
import { DEFAULT_INVOICES, createEmptyInvoice } from './initialData';
import { calculateInvoiceTotals, formatCurrency } from './utils';
import InvoiceHeader from './components/InvoiceHeader';
import InvoiceTable from './components/InvoiceTable';
import InvoiceSummary from './components/InvoiceSummary';
import InvoiceControlPanel from './components/InvoiceControlPanel';
import { 
  FileSpreadsheet, ArrowLeftRight, HelpCircle, 
  Activity, Sparkles, Building2, ShieldCheck, Printer, CheckSquare, RefreshCw, Plus,
  ExternalLink, AlertCircle
} from 'lucide-react';

export default function App() {
  // --- Active Invoices State ---
  const [invoices, setInvoices] = React.useState<Invoice[]>(() => {
    const saved = localStorage.getItem('fortune_electricals_invoices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading saved invoices, resetting to original:", e);
      }
    }
    return DEFAULT_INVOICES;
  });

  const [activeInvoiceId, setActiveInvoiceId] = React.useState<string>(() => {
    return invoices[0]?.id || DEFAULT_INVOICES[0].id;
  });

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [showPrintHint, setShowPrintHint] = React.useState<boolean>(true);
  const [showPrintModal, setShowPrintModal] = React.useState<boolean>(false);

  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const isFirstMount = React.useRef(true);
  const saveTimerRef = React.useRef<any>(null);

  const forceSave = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    localStorage.setItem('fortune_electricals_invoices', JSON.stringify(invoices));
    setSaveStatus('saved');
    const t = setTimeout(() => {
      setSaveStatus('idle');
    }, 2000);
    return () => clearTimeout(t);
  };

  // --- Sync with localStorage (Debounced auto-save) ---
  React.useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    setSaveStatus('saving');

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem('fortune_electricals_invoices', JSON.stringify(invoices));
      setSaveStatus('saved');
      
      const idleTimer = setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
      
      return () => clearTimeout(idleTimer);
    }, 5000);

    const handleBeforeUnload = () => {
      localStorage.setItem('fortune_electricals_invoices', JSON.stringify(invoices));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [invoices]);

  // Find active invoice object
  const activeInvoice = React.useMemo(() => {
    return invoices.find(inv => inv.id === activeInvoiceId) || invoices[0];
  }, [invoices, activeInvoiceId]);

  // --- Dynamic Math Computations (useMemo for reactive performance) ---
  const totals = React.useMemo(() => {
    if (!activeInvoice) {
      return {
        sectionTotals: {},
        buildingServicesTotal: 0,
        earthingTotal: 0,
        grandTotal: 0
      };
    }
    return calculateInvoiceTotals(activeInvoice);
  }, [activeInvoice]);

  // Helper to compute cumulative carried forward balance up to a given index
  const getCumulativeCarriedTotal = (sectionIndex: number): number => {
    let sum = 0;
    for (let i = 0; i <= sectionIndex; i++) {
      const sec = activeInvoice.sections[i];
      if (sec) {
        sum += totals.sectionTotals[sec.id] || 0;
      }
    }
    return sum;
  };

  // --- State Modifiers ---
  const handleSelectInvoice = (id: string) => {
    setActiveInvoiceId(id);
    setIsEditing(false); // Default to clean view when switching
  };

  const handleAddInvoice = (newInvoice: Invoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
    setActiveInvoiceId(newInvoice.id);
    setIsEditing(true); // Edit right away for new creations
  };

  const handleDeleteInvoice = (id: string) => {
    const nextInvoices = invoices.filter(inv => inv.id !== id);
    if (nextInvoices.length === 0) {
      const newBlank = createEmptyInvoice();
      setInvoices([newBlank]);
      setActiveInvoiceId(newBlank.id);
    } else {
      setInvoices(nextInvoices);
      if (activeInvoiceId === id) {
        setActiveInvoiceId(nextInvoices[0].id);
      }
    }
  };

  const handleUpdateInvoice = (id: string, updatedFields: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return { ...inv, ...updatedFields };
      }
      return inv;
    }));
  };

  // Direct section update inside active invoice
  const handleUpdateSectionElements = (sectionId: string, updatedElements: LedgerElement[]) => {
    if (!activeInvoice) return;
    const updatedSections = activeInvoice.sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, elements: updatedElements };
      }
      return sec;
    });

    handleUpdateInvoice(activeInvoice.id, { sections: updatedSections });
  };

  const handleUpdateSectionTitle = (sectionId: string, newTitle: string) => {
    if (!activeInvoice) return;
    const updatedSections = activeInvoice.sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, title: newTitle };
      }
      return sec;
    });

    handleUpdateInvoice(activeInvoice.id, { sections: updatedSections });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!activeInvoice) return;
    const filteredSections = activeInvoice.sections.filter(sec => sec.id !== sectionId);
    handleUpdateInvoice(activeInvoice.id, { sections: filteredSections });
  };

  const handleResetToDefaults = () => {
    setInvoices(DEFAULT_INVOICES);
    setActiveInvoiceId(DEFAULT_INVOICES[0].id);
    setIsEditing(false);
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn("Print triggered, potentially sandboxed:", e);
    }

    // Since many browsers block window.print() inside iframes,
    // we detect if the current window is sandboxed inside an iframe
    // and display our beautiful Print Sandbox Guide Modal.
    const inIframe = window.self !== window.top;
    if (inIframe) {
      setShowPrintModal(true);
    }
  };

  // Fallback if no active invoice exists
  if (!activeInvoice) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded-xl shadow text-center max-w-sm">
          <HelpCircle className="mx-auto text-slate-400 mb-2" size={40} />
          <p className="text-slate-600 mb-4">No estimates found in your local registry.</p>
          <button
            onClick={handleResetToDefaults}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded transition cursor-pointer"
          >
            Load Patrick Murray Estimate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans print:bg-white print:text-black">
      
      {/* 1. TOP NAV WORKSPACE BAR (Screen Only - Hidden on Print) */}
      <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between gap-4 select-none print:hidden shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black text-sm">F</div>
            <span className="font-bold text-slate-900 tracking-tight leading-none text-sm">FORTUNE ELECTRICALS Management System</span>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <span className="text-xs text-slate-500 hidden sm:inline">Displaying {invoices.length} active records</span>
          
          <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
          <div className="hidden md:flex items-center">
            {saveStatus === 'saving' && (
              <button
                onClick={forceSave}
                className="text-[10px] text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse select-none cursor-pointer font-sans transition-all"
                title="Saves automatically in 5 seconds. Click to save now."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Saving in 5s...</span>
              </button>
            )}
            {saveStatus === 'saved' && (
              <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1.5 select-none font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>All changes saved</span>
              </span>
            )}
            {saveStatus === 'idle' && (
              <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded flex items-center gap-1.5 select-none font-sans font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                <span>Synced</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Bento Stats Overview - Styled high-density */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded flex items-center gap-1.5">
              <Building2 size={12} className="text-blue-500" />
              <span className="text-slate-500 font-medium">Wiring:</span>
              <span className="font-mono font-bold text-slate-800">
                {formatCurrency(totals.buildingServicesTotal, '')}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-teal-600" />
              <span className="text-slate-500 font-medium">Earthing:</span>
              <span className="font-mono font-bold text-slate-800">
                {formatCurrency(totals.earthingTotal, '')}
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-100 px-3 py-1 rounded flex items-center gap-1.5">
              <Sparkles size={12} className="text-blue-600" />
              <span className="text-blue-700 font-bold hidden md:inline">Total:</span>
              <span className="font-mono font-black text-[#1d4ed8] animate-pulse-subtle">
                {formatCurrency(totals.grandTotal, activeInvoice.currency.symbol)}
              </span>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-sm transition duration-150 flex items-center gap-1.5 cursor-pointer"
            title="Launch print engine"
          >
            <Printer size={12} />
            <span>Print Ledger</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN APPLICATION WORKSPACE VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:px-6 grid grid-cols-1 lg:grid-cols-4 gap-6 print:p-0 print:m-0 print:block">
        
        {/* LEFT COLUMN: CONTROL COMPANION SIDEBAR (Screen-only, hidden on Printer) */}
        <aside className="lg:col-span-1 print:hidden select-none">
          <InvoiceControlPanel
            invoices={invoices}
            activeInvoiceId={activeInvoice.id}
            isEditing={isEditing}
            onSelectInvoice={handleSelectInvoice}
            onAddInvoice={handleAddInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onUpdateInvoice={handleUpdateInvoice}
            onResetToDefaults={handleResetToDefaults}
            onToggleEditMode={() => setIsEditing(!isEditing)}
            onPrint={handlePrint}
          />

          {/* Quick Helpful Tutorial Badge */}
          <div className="mt-4 bg-slate-800/5 hover:bg-slate-800/10 transition p-4 rounded-xl border border-dashed border-slate-300 font-sans text-xs text-slate-500 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold uppercase tracking-wider">
              <CheckSquare size={13} className="text-blue-600" />
              <span>Interactive Guide</span>
            </div>
            <p className="leading-relaxed">
              This system mimics official electrical ledger journals. Simply toggle <b>Edit Ledger</b> to update cells in real-time. Use <b>Print Ledger</b> to output a professional client copy.
            </p>
          </div>
        </aside>

        {/* RIGHT COLUMN: MAJESTIC DOCUMENT LEDGER PAPER (Centered on screen with realistic shadows, solo printable element) */}
        <div className="lg:col-span-3 space-y-6 print:space-y-4 print:p-0 print:m-0 print:block">
          
          {/* Printing Tip notification element - screen-only, dismissible */}
          {showPrintHint && (
            <div className="bg-sky-50 border border-sky-100 text-sky-850 px-4 py-3 rounded-lg flex items-center justify-between gap-3 text-xs shadow-sm shadow-sky-100/50 select-none print:hidden">
              <div className="flex items-center gap-2">
                <Printer size={15} className="text-[#10b981] animate-pulse" />
                <p>
                  <b>💡 Professional tip:</b> Always ensure <b>"Background Graphics"</b> is checked in Chrome's Print Settings to preserve the beautiful light grid-guides on your printed A4/Letter estimate sheets!
                </p>
              </div>
              <button 
                onClick={() => setShowPrintHint(false)} 
                className="text-sky-400 hover:text-sky-600 cursor-pointer font-bold px-1.5"
              >
                ✕
              </button>
            </div>
          )}

          {/* THE LEDGER SHEET COMPONENT WRAPPER */}
          <section 
            id="invoice-document" 
            className="bg-white border border-slate-200 rounded-lg shadow-md p-6 md:p-8 relative ledger-grid print:border-none print:p-0 print:m-0 print:shadow-none print:rounded-none"
          >
            {/* Real aesthetic design: classic drawing margin red rule guidelines mimicking custom ledger pad paper */}
            <div className="absolute left-6 top-0 bottom-0 ledger-margin-left pointer-events-none print:hidden" />
            <div className="absolute left-[24px] top-0 bottom-0 border-l border-slate-200 pointer-events-none print:hidden opacity-50" />

            {/* Document Export Action Bar - Screen Only (Hidden on Print) */}
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/60 print:hidden select-none z-30">
              <div className="flex items-center gap-2">
                <span className="w-2 rounded-full h-2 bg-blue-600 animate-pulse"></span>
                <span className="text-[11px] font-bold text-slate-700 font-mono uppercase tracking-wider">
                  Estimate Ledger • No. {activeInvoice.invoiceNo}
                </span>
              </div>
              
              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-1.5 bg-[#1d4ed8] hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2 rounded shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer h-9"
                title="Save this estimate as PDF using Chrome's Print mechanism"
                id="btn-print-pdf-document"
              >
                <Printer size={13} strokeWidth={2.5} />
                <span>Save / Export as PDF</span>
              </button>
            </div>

            {/* A. Letterhead Branding Block */}
            <InvoiceHeader
              invoice={activeInvoice}
              isEditing={isEditing}
              onUpdate={(fields) => handleUpdateInvoice(activeInvoice.id, fields)}
            />

            {/* B. Ledger Estimate Segment lists */}
            <div className="mt-8 space-y-8 print:mt-4 print:space-y-4">
              {activeInvoice.sections.map((sec, idx) => {
                const secTotal = totals.sectionTotals[sec.id] || 0;
                // Cumulative carried totals compute Section 1, Section 1+2, etc.
                const cumTotal = getCumulativeCarriedTotal(idx);

                return (
                  <InvoiceTable
                    key={sec.id}
                    section={sec}
                    isEditing={isEditing}
                    prefixIndex={idx + 1}
                    sectionTotal={secTotal}
                    cumulativeTotal={cumTotal}
                    onUpdateElements={(elems) => handleUpdateSectionElements(sec.id, elems)}
                    onUpdateTitle={(title) => handleUpdateSectionTitle(sec.id, title)}
                    onDeleteSection={() => handleDeleteSection(sec.id)}
                  />
                );
              })}

              {/* Action trigger to append whole new job segments (Screen-only) */}
              {isEditing && (
                <div className="pt-4 border-t border-dashed border-slate-300 text-center select-none print:hidden">
                  <button
                    onClick={() => {
                      const newSecId = `sec-${Date.now()}`;
                      const updatedSections = [
                        ...activeInvoice.sections,
                        {
                          id: newSecId,
                          title: `${activeInvoice.sections.length + 1} New Estimation Category`,
                          elements: [
                            {
                              id: `el-new-${Date.now()}`,
                              type: 'item',
                              code: 'A',
                              description: 'Sample description line item',
                              unit: 'Nr.',
                              qty: 1,
                              rate: 100
                            }
                          ]
                        }
                      ];
                      handleUpdateInvoice(activeInvoice.id, { sections: updatedSections });
                    }}
                    className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-blue-200 transition cursor-pointer"
                  >
                    <Plus size={14} /> Add Whole New Service Section
                  </button>
                </div>
              )}
            </div>

            {/* C. Budget Grand Summary card matching Page 3 */}
            <InvoiceSummary
              invoice={activeInvoice}
              isEditing={isEditing}
              buildingServicesTotal={totals.buildingServicesTotal}
              earthingTotal={totals.earthingTotal}
              grandTotal={totals.grandTotal}
              onUpdate={(fields) => handleUpdateInvoice(activeInvoice.id, fields)}
            />

            {/* Estimate notes and policies */}
            {activeInvoice.notes && (
              <div className="mt-8 border-t-2 border-slate-800 pt-4 font-sans text-xs italic text-slate-500 leading-relaxed print:mt-4 print:pt-2 print:text-[8px] print:text-black">
                <span className="font-bold uppercase tracking-wider text-slate-850 not-italic block mb-1">
                  General Quotation Terms &amp; Notes:
                </span>
                {isEditing ? (
                  <textarea
                    value={activeInvoice.notes}
                    onChange={(e) => handleUpdateInvoice(activeInvoice.id, { notes: e.target.value })}
                    className="w-full text-xs bg-slate-50 font-serif italic outline-none border border-slate-300 focus:border-blue-400 focus:bg-white rounded px-2.5 py-1.5 resize-y"
                    rows={2}
                  />
                ) : (
                  activeInvoice.notes
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 3. CORE PRINT BUTTON FLOOR BAR FOR SMALL SCREENS */}
      <div className="sticky bottom-4 left-4 right-4 z-30 select-none print:hidden flex md:hidden justify-center">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-5 border border-blue-700 rounded-full shadow-lg cursor-pointer"
        >
          <Printer size={15} />
          <span>Launch Print Engine (PDF)</span>
        </button>
      </div>

      {/* Elegant footer indicator */}
      <footer className="py-8 text-center text-xs text-slate-400 font-mono tracking-wider border-t border-slate-200 mt-12 bg-white print:hidden">
        <p>&copy; 2026 Fortune Electricals. Powered by custom estimation engine.</p>
      </footer>

      {/* --- HIGH DENSITY PRINT ENGINE SANDBOX HELPER DIALOG --- */}
      {showPrintModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity duration-200"
          id="print-helper-modal-backdrop"
          onClick={() => setShowPrintModal(false)}
        >
          <div 
            className="bg-white border border-slate-200 rounded-xl shadow-2xl p-6 max-w-md w-full text-slate-800 animate-scale-in"
            id="print-helper-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <AlertCircle size={22} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Print Engine Action Required</h3>
                <p className="text-xs text-slate-400 leading-none">Sandbox Safety Instruction</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-4 leading-relaxed font-sans">
              Because this app is running within a sandboxed frame on Google AI Studio, standard browser print dialogs are blocked for safety.
            </p>

            <div className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg p-3.5 my-4 space-y-2.5 transition">
              <p className="text-xs font-semibold text-slate-800">Please follow these quick steps:</p>
              
              <div className="space-y-2 text-[11px] text-slate-600">
                <div className="flex gap-2">
                  <span className="font-bold text-blue-600 font-mono">1.</span>
                  <p>Click the <b>"Open App in New Tab"</b> action button below.</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-blue-600 font-mono">2.</span>
                  <p>Select your estimate and click <b>"Print Ledger"</b> directly there.</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-blue-600 font-mono">3.</span>
                  <p>Ensure <b>"Background Graphics"</b> is checked in Chrome's print options to keep the guide lines intact.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowPrintModal(false)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded transition cursor-pointer shadow-sm text-center"
              >
                <ExternalLink size={13} />
                <span>Open App in New Tab</span>
              </a>
              <button
                onClick={() => setShowPrintModal(false)}
                className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 font-semibold text-xs py-2.5 px-4 rounded transition cursor-pointer text-center"
              >
                Cancel &amp; Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
