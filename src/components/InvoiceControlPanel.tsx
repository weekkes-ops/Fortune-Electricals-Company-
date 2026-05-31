/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Invoice } from '../types';
import { DEFAULT_INVOICES, createEmptyInvoice } from '../initialData';
import { 
  FileText, Plus, Copy, RotateCcw, Trash2, Printer, 
  Search, ShieldAlert, DollarSign, Edit, Eye, Check, Coins 
} from 'lucide-react';

interface InvoiceControlPanelProps {
  invoices: Invoice[];
  activeInvoiceId: string;
  isEditing: boolean;
  onSelectInvoice: (id: string) => void;
  onAddInvoice: (newInvoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onUpdateInvoice: (id: string, updated: Partial<Invoice>) => void;
  onResetToDefaults: () => void;
  onToggleEditMode: () => void;
  onPrint: () => void;
}

export default function InvoiceControlPanel({
  invoices,
  activeInvoiceId,
  isEditing,
  onSelectInvoice,
  onAddInvoice,
  onDeleteInvoice,
  onUpdateInvoice,
  onResetToDefaults,
  onToggleEditMode,
  onPrint
}: InvoiceControlPanelProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [showConfirmDeleteActive, setShowConfirmDeleteActive] = React.useState(false);

  const activeInvoice = invoices.find(inv => inv.id === activeInvoiceId) || invoices[0];

  const handleCreateNew = () => {
    onAddInvoice(createEmptyInvoice());
  };

  const handleDuplicate = () => {
    if (!activeInvoice) return;
    const duplicated: Invoice = {
      ...activeInvoice,
      id: `invoice-${Date.now()}`,
      invoiceNo: `${activeInvoice.invoiceNo}-COPY`,
      title: `${activeInvoice.title} (Copy)`,
      date: new Date().toISOString().split('T')[0],
      sections: activeInvoice.sections.map(sec => ({
        ...sec,
        id: `sec-${Date.now()}-${Math.random()}`,
        elements: sec.elements.map(el => ({ ...el, id: `el-${Date.now()}-${Math.random()}` }))
      }))
    };
    onAddInvoice(duplicated);
  };

  const handleCurrencyToggle = () => {
    if (!activeInvoice) return;
    const isLe = activeInvoice.currency.symbol === 'Le';
    onUpdateInvoice(activeInvoice.id, {
      currency: {
        symbol: isLe ? '$' : 'Le',
        code: isLe ? 'USD' : 'SLL'
      }
    });
  };

  const filteredInvoices = invoices.filter(inv => {
    const term = searchTerm.toLowerCase();
    return (
      inv.title.toLowerCase().includes(term) ||
      inv.client.clientName.toLowerCase().includes(term) ||
      inv.invoiceNo.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-slate-900 text-slate-200 p-4 rounded-xl shadow-lg flex flex-col gap-4 select-none print:hidden h-full max-h-[85vh] overflow-y-auto border border-slate-800">
      
      {/* Title with High Density Branding block */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
          F
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Fortune Electricals
          </h2>
          <p className="text-[10px] text-slate-400 font-mono leading-none">Management System</p>
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Editor Toggles */}
      <div className="space-y-2.5">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Document Actions</h3>
        
        <div className="grid grid-cols-2 gap-2">
          {/* Edit/View Mode */}
          <button
            onClick={onToggleEditMode}
            className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2.5 rounded transition-all focus:outline-none cursor-pointer border ${
              isEditing 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700/80'
            }`}
          >
            {isEditing ? (
              <>
                <Check size={13} className="animate-pulse" />
                <span>Editing On</span>
              </>
            ) : (
              <>
                <Edit size={13} />
                <span>Edit Ledger</span>
              </>
            )}
          </button>

          {/* Print Output */}
          <button
            onClick={onPrint}
            className="flex items-center justify-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-755 text-white font-semibold py-2 px-2.5 border border-slate-700 rounded transition-all cursor-pointer shadow-sm"
            title="Launch print engine"
          >
            <Printer size={13} />
            <span>Print Ledger</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* Modify Currency */}
          <button
            onClick={handleCurrencyToggle}
            className="flex items-center justify-between text-left text-xs bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 py-2 px-3 rounded transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Coins size={13} className="text-blue-400" />
              <span>Modify Currency</span>
            </div>
            <span className="font-mono bg-slate-900 text-blue-400 px-1.5 py-0.5 rounded font-bold text-[9px]">
              {activeInvoice?.currency.symbol} ({activeInvoice?.currency.code})
            </span>
          </button>
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Invoice Search and List Selection */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Ledger Registry</h3>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-0.5 text-[10px] text-blue-400 hover:text-blue-300 font-bold font-sans cursor-pointer"
          >
            <Plus size={11} /> New Quote
          </button>
        </div>

        {/* Search Input styled like the High Density template */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-800/80 text-white border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-2.5 pl-8 py-1.5 focus:outline-none placeholder-slate-500 transition-colors"
            placeholder="Search estimates or clients..."
          />
        </div>

        {/* Estimate Queue list with high density active highlights */}
        <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1 divide-y divide-slate-800/40">
          {filteredInvoices.map((inv) => {
            const isActive = inv.id === activeInvoiceId;
            const isConfirming = confirmDeleteId === inv.id;
            return (
              <div
                key={inv.id}
                className={`group w-full flex items-center justify-between p-1.5 pr-2.5 transition-all text-xs border-l-4 ${
                  isActive 
                    ? 'bg-blue-950/20 border-blue-500' 
                    : 'bg-transparent border-transparent hover:bg-slate-800/30'
                }`}
              >
                <button
                  onClick={() => {
                    onSelectInvoice(inv.id);
                    setConfirmDeleteId(null);
                  }}
                  className="flex-1 text-left min-w-0 pr-1 cursor-pointer focus:outline-none"
                >
                  <p className={`font-sans tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-300 font-medium'}`}>
                    {inv.client.clientName || 'Unnamed Client'}
                  </p>
                  <p className="text-[9px] font-mono text-slate-500 truncate mt-0.5">
                    {inv.invoiceNo} • {inv.client.siteLocation || 'No Location'}
                  </p>
                </button>
                
                {/* Delete trigger inside list item */}
                <div className="flex items-center gap-1 shrink-0 select-none">
                  {isConfirming ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        title="Confirm deletion"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteInvoice(inv.id);
                          setConfirmDeleteId(null);
                        }}
                        className="p-1 px-1.5 bg-red-650 text-white rounded text-[9px] font-semibold cursor-pointer shrink-0"
                      >
                        Delete?
                      </button>
                      <button
                        title="Cancel"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(null);
                        }}
                        className="p-1 text-slate-400 hover:text-white rounded text-[9px] cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      title="Delete estimate"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(inv.id);
                      }}
                      className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded cursor-pointer opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                  
                  {!isConfirming && (
                    <FileText size={12} className={isActive ? 'text-blue-400 shrink-0 ml-1' : 'text-slate-600 shrink-0 ml-1'} />
                  )}
                </div>
              </div>
            );
          })}
          {filteredInvoices.length === 0 && (
            <p className="text-[9px] text-slate-600 italic py-2 text-center">No estimates found</p>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Invoice Management Actions */}
      <div className="space-y-2 mt-auto">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-500">Estimate Operations</h3>
        
        <div className="grid grid-cols-1 gap-1.5">
          {/* Duplicate Active */}
          <button
            onClick={handleDuplicate}
            className="flex items-center gap-2 text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-300 p-2.5 rounded-lg transition-all border border-slate-800 hover:border-slate-750 cursor-pointer text-left font-sans font-medium"
          >
            <Copy size={13} className="text-teal-500" />
            <span>Duplicate Active Estimate</span>
          </button>

          {/* Reset back to default Patrick Murray PDF */}
          {showConfirmReset ? (
            <div className="bg-red-950/30 p-2.5 rounded-lg border border-red-900/65 space-y-2">
              <div className="flex items-start gap-1.5 text-[10px] text-red-400 font-sans leading-relaxed">
                <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                <span>Overwrites changes and restores original Mr &amp; Mrs Patrick Murray electrical ledger data! Proceed?</span>
              </div>
              <div className="flex gap-1.5 justify-end">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="text-[10px] bg-slate-800 text-slate-400 hover:text-slate-200 px-2 py-1 rounded cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onResetToDefaults();
                    setShowConfirmReset(false);
                  }}
                  className="text-[10px] bg-red-600 text-white hover:bg-red-700 px-2.5 py-1 rounded cursor-pointer font-bold"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-2 text-xs bg-slate-850/40 hover:bg-red-950/20 text-slate-400 hover:text-red-300 p-2.5 rounded-lg transition-all border border-slate-800 hover:border-red-900/40 cursor-pointer text-left font-sans font-medium"
              title="Resets work ledger to original PDF data"
            >
              <RotateCcw size={13} className="text-red-500" />
              <span>Restore Preloaded PDF Form</span>
            </button>
          )}

          {/* Delete Active */}
          {showConfirmDeleteActive ? (
            <div className="bg-red-950/30 p-2.5 rounded-lg border border-red-900/65 space-y-2">
              <div className="flex items-start gap-1.5 text-[10px] text-red-400 font-sans leading-relaxed">
                <Trash2 size={14} className="shrink-0 mt-0.5" />
                <span>Are you sure you want to delete this quote ({activeInvoice.invoiceNo})? This action cannot be undone!</span>
              </div>
              <div className="flex gap-1.5 justify-end">
                <button
                  onClick={() => setShowConfirmDeleteActive(false)}
                  className="text-[10px] bg-slate-800 text-slate-400 hover:text-slate-200 px-2 py-1 rounded cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDeleteInvoice(activeInvoiceId);
                    setShowConfirmDeleteActive(false);
                  }}
                  className="text-[10px] bg-red-600 text-white hover:bg-red-700 px-2.5 py-1 rounded cursor-pointer font-bold"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDeleteActive(true)}
              className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-red-950/20 text-slate-400 hover:text-red-400 p-2.5 rounded-lg transition-all border border-slate-800 hover:border-red-900/45 cursor-pointer text-left font-sans font-medium"
              title="Delete current estimate permanently"
            >
              <Trash2 size={13} className="text-red-400" />
              <span>Delete Active Estimate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
