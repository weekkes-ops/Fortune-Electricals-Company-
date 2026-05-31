/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InvoiceSection, LedgerElement, LedgerElementType } from '../types';
import { getItemTotal, formatCurrency } from '../utils';
import { Trash2, ArrowUp, ArrowDown, Plus, MessageSquare, Heading, FileText, MoveHorizontal } from 'lucide-react';

interface InvoiceTableProps {
  key?: string | number;
  section: InvoiceSection;
  isEditing: boolean;
  prefixIndex: number; // e.g. 1 for first section
  sectionTotal: number;
  cumulativeTotal: number; // Cumulative total brought forward & carried forward
  onUpdateElements: (elements: LedgerElement[]) => void;
  onUpdateTitle: (title: string) => void;
  onDeleteSection: () => void;
}

export default function InvoiceTable({
  section,
  isEditing,
  prefixIndex,
  sectionTotal,
  cumulativeTotal,
  onUpdateElements,
  onUpdateTitle,
  onDeleteSection
}: InvoiceTableProps) {
  
  // Update a single element field
  const handleElementChange = (elId: string, field: keyof LedgerElement, value: any) => {
    const updated = section.elements.map(el => {
      if (el.id === elId) {
        const nextEl = { ...el, [field]: value };
        // Clear custom total if qty or rate is modified
        if (field === 'qty' || field === 'rate') {
          nextEl.isCustomTotal = false;
        }
        return nextEl;
      }
      return el;
    });
    onUpdateElements(updated);
  };

  // Add element of specific type
  const handleAddElement = (type: LedgerElementType) => {
    const alphabeticalCode = () => {
      // Find the next available letter A, B, C for items in this specific section
      const items = section.elements.filter(el => el.type === 'item');
      if (items.length === 0) return 'A';
      const lastCode = items[items.length - 1].code || '@';
      if (/^[A-Z]$/.test(lastCode)) {
        return String.fromCharCode(lastCode.charCodeAt(0) + 1);
      }
      return 'A';
    };

    const newElement: LedgerElement = {
      id: `el-${section.id}-${Date.now()}`,
      type,
      code: type === 'item' ? alphabeticalCode() : undefined,
      description: type === 'item' ? 'New Line Item description' : 
                   type === 'subheading' ? 'New Subheading:' :
                   type === 'note' ? 'New description note covering work standard details...' : '',
      unit: type === 'item' ? 'Nr.' : undefined,
      qty: type === 'item' ? 1 : undefined,
      rate: type === 'item' ? 100 : undefined
    };

    onUpdateElements([...section.elements, newElement]);
  };

  // Reorder elements
  const handleMoveElement = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= section.elements.length) return;
    
    const nextElements = [...section.elements];
    const temp = nextElements[index];
    nextElements[index] = nextElements[nextIndex];
    nextElements[nextIndex] = temp;
    
    // Auto-update alphabet item codes to maintain sequential A, B, C lists
    let charCode = 65; // 'A'
    const updatedWithCodes = nextElements.map(el => {
      if (el.type === 'item') {
        const mapped = { ...el, code: String.fromCharCode(charCode) };
        charCode++;
        return mapped;
      }
      return el;
    });

    onUpdateElements(updatedWithCodes);
  };

  // Delete element
  const handleDeleteElement = (elId: string) => {
    const filtered = section.elements.filter(el => el.id !== elId);
    
    // Auto-recode remaining items to maintain sequential letter codes (A, B, C, ...)
    let charCode = 65;
    const reCoded = filtered.map(el => {
      if (el.type === 'item') {
        const mapped = { ...el, code: String.fromCharCode(charCode) };
        charCode++;
        return mapped;
      }
      return el;
    });
    
    onUpdateElements(reCoded);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-6 page-section transition print:border-none print:shadow-none print:rounded-none print:mb-3">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900 text-white px-4 py-2.5 print:bg-white print:text-slate-900 print:p-0 print:border-b-2 print:border-slate-800">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={section.title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              className="text-base font-bold bg-slate-800 text-white border border-slate-700 rounded px-2 py-0.5 w-full max-w-xl focus:outline-none focus:border-blue-400"
              placeholder="e.g. 1 Electrical (First Fix)- Ground Floor"
            />
          ) : (
            <h3 className="text-base font-bold font-sans tracking-wide uppercase select-all print:text-xs">
              {section.title}
            </h3>
          )}
        </div>
        
        {isEditing && (
          <button
            onClick={onDeleteSection}
            className="text-xs bg-red-650 hover:bg-red-700 text-white font-medium px-2 py-0.5 rounded transition flex items-center gap-1 cursor-pointer print:hidden shrink-0 self-end sm:self-auto text-[10px]"
            title="Delete this entire section & its entries"
          >
            <Trash2 size={12} /> Delete Section
          </button>
        )}
      </div>

      {/* Ledger Sheet Matrix */}
      <div className="overflow-x-auto print:overflow-visible">
        <table className="w-full text-xs font-sans border-collapse text-left min-w-[650px] print:min-w-full print:text-[10px]">
          {/* Main Ledger Headers */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] uppercase tracking-wider text-slate-700 select-none print:bg-white print:border-b print:border-slate-850 print:text-[8px] print:text-black">
              <th className="py-2 px-3 border-r border-slate-200 w-16 text-center font-bold print:py-1">Item</th>
              <th className="py-2 px-4 border-r border-slate-200 print:py-1 print:px-2">Description</th>
              <th className="py-2 px-3 border-r border-slate-200 w-16 text-center print:py-1">Unit</th>
              <th className="py-2 px-3 border-r border-slate-200 w-20 text-right print:py-1">Qty.</th>
              <th className="py-2 px-4 border-r border-slate-200 w-32 text-right print:py-1">{`Rate (${section.id === 'sec-1-first-fix' ? 'Le' : 'Le'})`}</th>
              <th className="py-2 px-4 w-36 text-right font-bold print:py-1">Total</th>
              {isEditing && <th className="py-2 px-3 w-28 text-center print:hidden">Actions</th>}
            </tr>
          </thead>

          {/* Ledger Sheet Body */}
          <tbody className="divide-y divide-slate-250 print:divide-slate-200">
            {section.elements.map((el, idx) => {
              // Directives notes span the description as full-width blocks
              if (el.type === 'note') {
                return (
                  <tr key={el.id} className="bg-blue-50/20 hover:bg-slate-50/50 transition-colors print:bg-transparent">
                    <td className="py-2 px-3 border-r border-slate-200 text-center text-slate-400 font-mono print:py-1">-</td>
                    <td colSpan={4} className="py-2.5 px-4 border-r border-slate-200 font-serif leading-relaxed text-slate-700 italic select-text print:py-1">
                      {isEditing ? (
                        <textarea
                          value={el.description}
                          onChange={(e) => handleElementChange(el.id, 'description', e.target.value)}
                          className="w-full text-xs bg-slate-5 font-serif italic outline-none border border-slate-200 focus:border-blue-400 focus:bg-white rounded px-2 py-1 resize-y"
                          rows={2}
                          placeholder="Standards, pvc cabling, conduits, specifications details..."
                        />
                      ) : (
                        el.description
                      )}
                    </td>
                    <td className="py-2 px-4 border-r border-slate-200 bg-slate-50 font-mono text-center text-slate-300 select-none print:bg-transparent">-</td>
                    {isEditing && (
                      <td className="py-2 px-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleMoveElement(idx, 'up')} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer" title="Move Up"><ArrowUp size={13} /></button>
                          <button onClick={() => handleMoveElement(idx, 'down')} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer" title="Move Down"><ArrowDown size={13} /></button>
                          <button onClick={() => handleDeleteElement(el.id)} className="p-1 hover:bg-red-50 text-red-500 rounded cursor-pointer" title="Delete Note"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              }

              // Subheadings mark subsegments nicely
              if (el.type === 'subheading') {
                return (
                  <tr key={el.id} className="bg-slate-50/65 font-semibold text-slate-800 print:bg-transparent print:text-black">
                    <td className="py-2 px-3 border-r border-slate-200 text-center font-mono font-bold text-slate-600 print:py-1">-</td>
                    <td colSpan={4} className="py-2 px-4 border-r border-slate-200 underline tracking-wide print:py-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={el.description}
                          onChange={(e) => handleElementChange(el.id, 'description', e.target.value)}
                          className="w-full font-semibold focus:outline-none focus:border-blue-400 border border-transparent rounded px-1.5 py-0.5 bg-slate-100/50"
                          placeholder="e.g. Switched Socket Outlet:"
                        />
                      ) : (
                        el.description
                      )}
                    </td>
                    <td className="py-2 px-4 border-r border-slate-200 font-mono text-center text-slate-300 select-none">-</td>
                    {isEditing && (
                      <td className="py-2 px-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleMoveElement(idx, 'up')} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer" title="Move Up"><ArrowUp size={13} /></button>
                          <button onClick={() => handleMoveElement(idx, 'down')} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer" title="Move Down"><ArrowDown size={13} /></button>
                          <button onClick={() => handleDeleteElement(el.id)} className="p-1 hover:bg-red-50 text-red-500 rounded cursor-pointer" title="Delete Subheading"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              }

              // Spacer element handles aesthetic layout spacings
              if (el.type === 'spacer') {
                return (
                  <tr key={el.id} className="h-8 select-none print:h-6 hover:bg-slate-50/30">
                    <td className="border-r border-slate-200 px-3 text-center font-mono text-slate-300">-</td>
                    <td className="border-r border-slate-200 px-4 text-slate-300 italic text-xs">Blank Ledger line</td>
                    <td className="border-r border-slate-200"></td>
                    <td className="border-r border-slate-200"></td>
                    <td className="border-r border-slate-200"></td>
                    <td className="px-4 font-mono text-right text-slate-200">-</td>
                    {isEditing && (
                      <td className="py-1 px-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleMoveElement(idx, 'up')} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"><ArrowUp size={13} /></button>
                          <button onClick={() => handleMoveElement(idx, 'down')} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"><ArrowDown size={13} /></button>
                          <button onClick={() => handleDeleteElement(el.id)} className="p-1 hover:bg-red-50 text-red-500 rounded cursor-pointer"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              }

              // Standard Line Items
              const rowTotal = getItemTotal(el.qty, el.rate);
              return (
                <tr key={el.id} className="hover:bg-slate-50/40 transition-colors select-text">
                  {/* Code Column (e.g. A, B, C...) */}
                  <td className="py-2 px-3 border-r border-slate-200 text-center font-mono font-bold text-slate-800 print:py-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={el.code || ''}
                        onChange={(e) => handleElementChange(el.id, 'code', e.target.value)}
                        className="w-full text-center font-mono font-bold focus:bg-slate-100 focus:outline-none border-b border-transparent focus:border-blue-400"
                        placeholder="A"
                      />
                    ) : (
                      el.code || '-'
                    )}
                  </td>

                  {/* Description Column */}
                  <td className="py-2 px-4 border-r border-slate-200 text-slate-800 font-sans print:py-1 print:px-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={el.description}
                        onChange={(e) => handleElementChange(el.id, 'description', e.target.value)}
                        className="w-full text-xs font-sans focus:outline-none border border-transparent focus:border-blue-400 focus:bg-white rounded px-1.5 py-0.5"
                        placeholder="Description of item"
                      />
                    ) : (
                      el.description
                    )}
                  </td>

                  {/* Unit Column (Nr., M, etc.) */}
                  <td className="py-2 px-3 border-r border-slate-200 text-center text-slate-600 font-mono text-xs print:py-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={el.unit || ''}
                        onChange={(e) => handleElementChange(el.id, 'unit', e.target.value)}
                        className="w-full text-center font-mono focus:bg-slate-100 focus:outline-none"
                        placeholder="Nr."
                      />
                    ) : (
                      el.unit || 'Nr.'
                    )}
                  </td>

                  {/* Qty Column */}
                  <td className="py-2 px-3 border-r border-slate-200 text-right text-slate-800 font-mono font-medium print:py-1">
                    {isEditing ? (
                      <input
                        type="number"
                        value={el.qty === undefined ? '' : el.qty}
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : Number(e.target.value);
                          handleElementChange(el.id, 'qty', val);
                        }}
                        className="w-full text-right font-mono focus:bg-slate-100 focus:outline-none px-1"
                        placeholder="0"
                      />
                    ) : (
                      el.qty !== undefined ? el.qty : '-'
                    )}
                  </td>

                  {/* Rate Column */}
                  <td className="py-2 px-4 border-r border-slate-200 text-right text-slate-700 font-mono print:py-1">
                    {isEditing ? (
                      <input
                        type="number"
                        value={el.rate === undefined ? '' : el.rate}
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : Number(e.target.value);
                          handleElementChange(el.id, 'rate', val);
                        }}
                        className="w-full text-right font-mono focus:bg-slate-100 focus:outline-none px-1"
                        placeholder="0.00"
                      />
                    ) : (
                      el.rate !== undefined ? formatCurrency(el.rate, '') : '-'
                    )}
                  </td>

                  {/* Dynamic Inline Total Row */}
                  <td className="py-2 px-4 text-right text-slate-900 font-mono font-bold select-all bg-slate-50/40 print:bg-transparent print:py-1">
                    {formatCurrency(rowTotal, '')}
                  </td>

                  {/* Reordering and Actions Column */}
                  {isEditing && (
                    <td className="py-1 px-3 text-center print:hidden">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleMoveElement(idx, 'up')} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer" title="Move Up"><ArrowUp size={13} /></button>
                        <button onClick={() => handleMoveElement(idx, 'down')} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer" title="Move Down"><ArrowDown size={13} /></button>
                        <button onClick={() => handleDeleteElement(el.id)} className="p-1 hover:bg-red-50 text-red-500 rounded cursor-pointer" title="Delete Row"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>

          {/* Section Totals and Cumulative carried lines */}
          <tfoot>
            {/* Direct Section Summary Total */}
            <tr className="bg-slate-50/60 font-bold text-slate-800 border-t border-slate-200 print:bg-transparent print:border-t print:border-b-2 print:border-slate-850 print:text-black">
              <td colSpan={5} className="py-2.5 px-4 text-right font-mono tracking-wide uppercase text-[10px] print:py-1 print:text-[8px] border-r border-slate-200">
                Total for section ({section.title.split('-')[0].trim()}):
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-xs font-bold text-blue-600 border-r border-slate-200 select-all print:py-1 print:text-[10px] print:text-black">
                {formatCurrency(sectionTotal, 'Le')}
              </td>
              {isEditing && <td className="print:hidden border-r border-slate-200"></td>}
            </tr>

            {/* Brought Forward / Carried Forward visual ledger matching Page transitions */}
            <tr className="bg-slate-50 font-bold font-mono text-[10px] text-slate-600 uppercase border-t border-b border-slate-200 print:bg-transparent print:text-black print:border-b-2 print:border-slate-850">
              <td colSpan={5} className="py-2 px-4 text-right tracking-wider align-middle print:py-1 border-r border-slate-200 print:text-[8px]">
                Cumulative Balance Carried Forward (C/F):
              </td>
              <td className="py-2 px-4 text-right font-extrabold text-slate-800 bg-slate-100/40 print:py-1 border-r border-slate-200 print:text-[10px] print:bg-transparent">
                {formatCurrency(cumulativeTotal, 'Le')}
              </td>
              {isEditing && <td className="print:hidden border-r border-slate-200"></td>}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Editor Controls Overlay just under table - Hidden when Printing */}
      {isEditing && (
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-wrap gap-2.5 select-none print:hidden">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center pr-2 border-r border-slate-300">
            Add Element:
          </span>
          <button
            onClick={() => handleAddElement('item')}
            className="flex items-center gap-1.5 text-xs bg-white hover:bg-[#1e40af] hover:text-white text-[#1e40af] border border-[#1e40af] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus size={13} /> Line Item (A, B, C...)
          </button>
          <button
            onClick={() => handleAddElement('note')}
            className="flex items-center gap-1.5 text-xs bg-white hover:bg-teal-700 hover:text-white text-teal-700 border border-teal-600 font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <FileText size={13} /> Directive Note (Text block)
          </button>
          <button
            onClick={() => handleAddElement('subheading')}
            className="flex items-center gap-1.5 text-xs bg-white hover:bg-purple-700 hover:text-white text-purple-700 border border-purple-600 font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Heading size={13} /> Group Header (Bold label)
          </button>
          <button
            onClick={() => handleAddElement('spacer')}
            className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-600 hover:text-white text-slate-600 border border-slate-400 font-medium px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
            title="Adds clean ledger blank row for visual spacing"
          >
            <MoveHorizontal size={13} /> Spacer line
          </button>
        </div>
      )}
    </div>
  );
}
