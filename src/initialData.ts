/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Invoice } from './types';

export const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'fortune-estimate-001',
    invoiceNo: 'FE/2026/042',
    title: 'Electrical Estimate - Mr & Mrs Patrick Murray',
    date: '2026-05-29',
    company: {
      name: 'FORTUNE ELECTRICALS',
      licenseTitle: 'Licensed Electrical Engineering Contractor',
      mobiles: ['+232 76 612054', '+232 77 612054'],
      email: 'fortune.electricals@yahoo.com'
    },
    client: {
      clientName: "Mr & Mrs Partrick Murray's",
      projectTitle: 'The proposed building',
      siteLocation: 'Mambo Village',
      summaryBuildingLocation: 'LAKKA Village Freetown'
    },
    currency: {
      symbol: 'Le',
      code: 'SLL'
    },
    summaryRefTitle: 'M&E BUDGET COST FOR THE Client premise',
    summaryTitle: 'PROPOSED Client premise',
    summaryBudgetTitle: 'Proposed Client Building sited at LAKKA Village Freetown',
    sections: [
      {
        id: 'sec-1-first-fix',
        title: '1 Electrical (First Fix)- Ground Floor',
        elements: [
          {
            id: 'el-1-0',
            type: 'note',
            description: "Supply and install electrical ‘’first fix’’ for the following  generally in concealed plastic conduit, fittings, including chasing walls where necessary in conduits and floor, through walls and ceiling plugged for fixing fitting MK boxes"
          },
          {
            id: 'el-1-1',
            type: 'subheading',
            description: 'Light Points:'
          },
          {
            id: 'el-1-a',
            type: 'item',
            code: 'A',
            description: 'Ceiling Mounted Light Points',
            unit: 'Nr.',
            qty: 16,
            rate: 150
          },
          {
            id: 'el-1-b',
            type: 'item',
            code: 'B',
            description: 'Outdoor Security Light Points',
            unit: 'Nr.',
            qty: 8,
            rate: 150
          },
          {
            id: 'el-1-c',
            type: 'item',
            code: 'C',
            description: 'wall Light Points',
            unit: 'Nr.',
            qty: 14,
            rate: 150
          },
          {
            id: 'el-1-d',
            type: 'item',
            code: 'D',
            description: 'Toilet Lights Points',
            unit: 'Nr.',
            qty: 4,
            rate: 150
          },
          {
            id: 'el-1-e',
            type: 'item',
            code: 'E',
            description: 'Spot lights Points',
            unit: 'Nr.',
            qty: 75,
            rate: 150
          },
          {
            id: 'el-1-2',
            type: 'subheading',
            description: 'Switched Socket Outlet Point:'
          },
          {
            id: 'el-1-f',
            type: 'item',
            code: 'F',
            description: '13A, Single/Double Socket Points',
            unit: 'Nr.',
            qty: 40,
            rate: 300
          },
          {
            id: 'el-1-g',
            type: 'item',
            code: 'G',
            description: 'Water heater switch Points',
            unit: 'Nr.',
            qty: 5,
            rate: 300
          },
          {
            id: 'el-1-3',
            type: 'subheading',
            description: 'Switchgear Point:'
          },
          {
            id: 'el-1-h',
            type: 'item',
            code: 'H',
            description: '125A, 8-way TP&N MCB Distribution Board',
            unit: 'Nr.',
            qty: 1,
            rate: 500
          },
          {
            id: 'el-1-i',
            type: 'item',
            code: 'I',
            description: '400/230V, 50Hz, 100Amps 4-pole Change over switchfor the ground Floor.',
            unit: 'Nr.',
            qty: 1,
            rate: 500
          }
        ]
      },
      {
        id: 'sec-2-second-fix',
        title: '2 Electrical Wiring (Second Fix)',
        elements: [
          {
            id: 'el-2-1',
            type: 'note',
            description: 'Supply and erect 1.5mm² 3-core pvc insulated cable and pvc sheathed cables in concealed 20mm diameter pvc conduit in circuit wiring from Distribution Board, to Light Switch to Light Point:'
          },
          {
            id: 'el-2-a',
            type: 'item',
            code: 'A',
            description: 'Ceiling Mounted Light Points',
            unit: 'Nr.',
            qty: 16,
            rate: 500
          },
          {
            id: 'el-2-b',
            type: 'item',
            code: 'B',
            description: 'Outdoor Security Light Points',
            unit: 'Nr.',
            qty: 8,
            rate: 500
          },
          {
            id: 'el-2-c',
            type: 'item',
            code: 'C',
            description: 'wall Light Points',
            unit: 'Nr.',
            qty: 14,
            rate: 500
          },
          {
            id: 'el-2-d',
            type: 'item',
            code: 'D',
            description: 'Toilet Lights Points',
            unit: 'Nr.',
            qty: 4,
            rate: 500
          },
          {
            id: 'el-2-e',
            type: 'item',
            code: 'E',
            description: 'Spot lights Points',
            unit: 'Nr.',
            qty: 75,
            rate: 500
          },
          {
            id: 'el-2-2',
            type: 'note',
            description: 'Supply and erect 2.5mm² 3-core pvc insulated cable and pvc sheathed cables in concealed 20mm diameter pvc conduit in ring mains circuit wiring from power socket outlets to Distribution Board'
          },
          {
            id: 'el-2-f',
            type: 'item',
            code: 'F',
            description: '13A, Single/Double Socket Points',
            unit: 'Nr.',
            qty: 40,
            rate: 550
          },
          {
            id: 'el-2-3',
            type: 'note',
            description: 'Supply and erect 4.0mm² 3-core pvc insulated cable and pvc sheathed cables in concealed 20mm diameter pvc conduit in radial circuit wiring from A/C Units Switch to Distribution Board:'
          },
          {
            id: 'el-2-g',
            type: 'item',
            code: 'G',
            description: '25Amps A/C Switch Points',
            unit: 'Nr.',
            qty: 6,
            rate: 630
          },
          {
            id: 'el-2-h',
            type: 'item',
            code: 'H',
            description: 'Water heater switch Points',
            unit: 'Nr.',
            qty: 5,
            rate: 630
          },
          {
            id: 'el-2-4',
            type: 'note',
            description: 'Supply and erect 4-core 10mm² cable secured in purposed made cable trench in radial circuit wiring from EDSA supply to 125A, 8-way Distribution Board - sockets-Lights-Fans and security lights'
          },
          {
            id: 'el-2-i',
            type: 'item',
            code: 'I',
            description: 'Circuit wiring from EDSA supply to 125A, 8-way Distribution Board',
            unit: 'M',
            qty: 40,
            rate: 660
          }
        ]
      },
      {
        id: 'sec-3-third-fix',
        title: '3 Fittings and Accessories (Third Fix)',
        elements: [
          {
            id: 'el-3-1',
            type: 'subheading',
            description: '(i) 10Amp Light Switches:'
          },
          {
            id: 'el-3-a',
            type: 'item',
            code: 'A',
            description: '1 gang 2-way switch - Legrand',
            unit: 'Nr.',
            qty: 15,
            rate: 90
          },
          {
            id: 'el-3-b',
            type: 'item',
            code: 'B',
            description: '2 gang 1-way switch - Legrand',
            unit: 'Nr.',
            qty: 15,
            rate: 130
          },
          {
            id: 'el-3-c',
            type: 'item',
            code: 'C',
            description: '3 gang 1-way switch - Legrand',
            unit: 'Nr.',
            qty: 0,
            rate: 160
          },
          {
            id: 'el-3-2',
            type: 'subheading',
            description: '(ii) Switched Socket Outlets:'
          },
          {
            id: 'el-3-d',
            type: 'item',
            code: 'D',
            description: '13Amps, Double Sockets',
            unit: 'Nr.',
            qty: 20,
            rate: 165
          },
          {
            id: 'el-3-e',
            type: 'item',
            code: 'E',
            description: '25Amps A/C Switches',
            unit: 'Nr.',
            qty: 6,
            rate: 200
          },
          {
            id: 'el-3-f',
            type: 'item',
            code: 'F',
            description: 'Water heater switches',
            unit: 'Nr.',
            qty: 5,
            rate: 200
          },
          {
            id: 'el-3-3',
            type: 'subheading',
            description: '(iii) Light Fixtures:'
          },
          {
            id: 'el-3-g',
            type: 'item',
            code: 'G',
            description: 'Ceiling Mounted Lights',
            unit: 'Nr.',
            qty: 16,
            rate: 240
          },
          {
            id: 'el-3-h',
            type: 'item',
            code: 'H',
            description: 'Outdoor Security Lights',
            unit: 'Nr.',
            qty: 8,
            rate: 550
          },
          {
            id: 'el-3-i',
            type: 'item',
            code: 'I',
            description: 'wall Lights',
            unit: 'Nr.',
            qty: 14,
            rate: 400
          },
          {
            id: 'el-3-j',
            type: 'item',
            code: 'J',
            description: 'Toilet Lights',
            unit: 'Nr.',
            qty: 4,
            rate: 100
          },
          {
            id: 'el-3-k',
            type: 'item',
            code: 'K',
            description: 'Spot lights Points',
            unit: 'Nr.',
            qty: 75,
            rate: 250
          },
          {
            id: 'el-3-4',
            type: 'subheading',
            description: '(iv) Sub-Mains Switchgears'
          },
          {
            id: 'el-3-note-sub',
            type: 'note',
            description: 'Supply and install the following boards, approved Sub-Mains Switchgears, fuse etc. and including 25mm² diameter'
          },
          {
            id: 'el-3-l',
            type: 'item',
            code: 'L',
            description: 'Supply, install and connect 400/230V, 50Hz, 125Amps 8-way TP&N MCB Distribution Board for the ground Floor.',
            unit: 'Nr.',
            qty: 1,
            rate: 4500
          },
          {
            id: 'el-3-m',
            type: 'item',
            code: 'M',
            description: 'Supply, install and connect 400/230V, 50Hz, 100Amps 4-pole Change over switchfor the ground Floor.',
            unit: 'Nr.',
            qty: 1,
            rate: 5500
          },
          {
            id: 'el-3-n',
            type: 'item',
            code: 'N',
            description: 'Allow for testing the complete house wiring network requirement for the Proposed',
            unit: 'Item',
            qty: 1,
            rate: 3000
          }
        ]
      },
      {
        id: 'sec-4-earthing',
        title: 'Earthing & Bonding System',
        elements: [
          {
            id: 'el-4-note',
            type: 'note',
            description: 'Supply and install Earthing & Bonding System complete with all necessary materials to complete the installation.'
          },
          {
            id: 'el-4-a',
            type: 'item',
            code: 'A',
            description: 'Measure 0.5m from the building foundation and excavate in trench 0.6m deep x 0.5m wide x 120m long around the foundation and run 25mm² 1core Single stranded bare copper cable within the excavated trench called Earth Ring (Faraday Cage) and connect to the Main Earth Point with 25mm² bare copper wire in the ground. Backfill and make good excavated surface',
            unit: 'M³',
            qty: 20,
            rate: 265
          },
          {
            id: 'el-4-b',
            type: 'item',
            code: 'B',
            description: '1800mm Pure Copper Earth Rod to BS 6651 installed in trench',
            unit: 'Nr.',
            qty: 2,
            rate: 450
          },
          {
            id: 'el-4-c',
            type: 'item',
            code: 'C',
            description: 'Pounded Charcoal',
            unit: 'Bags',
            qty: 2,
            rate: 100
          },
          {
            id: 'el-4-d',
            type: 'item',
            code: 'D',
            description: 'Industrial Salt',
            unit: 'Bags',
            qty: 1,
            rate: 350
          },
          {
            id: 'el-4-test-head',
            type: 'subheading',
            description: 'Testing:'
          },
          {
            id: 'el-4-e',
            type: 'item',
            code: 'E',
            description: 'Allow for testing the Proposed , Earthing & Bonding Protection System requirements for performance',
            unit: 'Item',
            qty: 1,
            rate: 3500
          },
          {
            id: 'el-4-limit',
            type: 'note',
            description: 'Note: Earth rod resistance readings shall be measured in accordance with BS 6651 requirements where the maximum system shall not exceed 5 ohms or as required by the contract.'
          }
        ]
      }
    ],
    notes: 'Payment terms: 60% Mobilization, 30% on First and Second Fix, 10% on Testing and Commissioning. All works carry a 1-year guarantee on workmanship.'
  }
];

export const createEmptyInvoice = (): Invoice => {
  const uniq = Math.random().toString(36).substring(2, 9).toUpperCase();
  const baseTime = Date.now();
  return {
    id: `invoice-${baseTime}`,
    invoiceNo: `FE/2026/${uniq}`,
    title: 'New Estimation / Invoice',
    date: new Date().toISOString().split('T')[0],
    company: {
      name: 'FORTUNE ELECTRICALS',
      licenseTitle: 'Licensed Electrical Engineering Contractor',
      mobiles: ['+232 76 612054', '+232 77 612054'],
      email: 'fortune.electricals@yahoo.com'
    },
    client: {
      clientName: 'New Client Name',
      projectTitle: 'Proposed Electrical Works',
      siteLocation: 'Site Location',
      summaryBuildingLocation: 'Freetown, Sierra Leone'
    },
    currency: {
      symbol: 'Le',
      code: 'SLL'
    },
    summaryRefTitle: 'M&E BUDGET COST FOR THE Client premise',
    summaryTitle: 'PROPOSED Client premise',
    summaryBudgetTitle: 'Proposed Client Building Sited at Location',
    sections: [
      {
        id: `sec-${baseTime}-1`,
        title: '1 Electrical (First Fix)',
        elements: [
          {
            id: `el-${baseTime}-1-note`,
            type: 'note',
            description: 'Supply and install electrical "first fix" generally in concealed plastic conduit and boxes'
          },
          {
            id: `el-${baseTime}-1-a`,
            type: 'item',
            code: 'A',
            description: 'Ceiling Mounted Light Points (Concealed conduit/boxes)',
            unit: 'Nr.',
            qty: 10,
            rate: 150
          }
        ]
      },
      {
        id: `sec-${baseTime}-2`,
        title: '2 Electrical Wiring (Second Fix)',
        elements: [
          {
            id: `el-${baseTime}-2-note`,
            type: 'note',
            description: 'Supply and erect insulated cables through the concealed conduit network'
          },
          {
            id: `el-${baseTime}-2-a`,
            type: 'item',
            code: 'A',
            description: '1.5mm² 3-core PVC insulated and sheathed cable wiring',
            unit: 'Nr.',
            qty: 10,
            rate: 500
          }
        ]
      },
      {
        id: `sec-${baseTime}-3`,
        title: '3 Fittings and Accessories (Third Fix)',
        elements: [
          {
            id: `el-${baseTime}-3-sub`,
            type: 'subheading',
            description: 'Legrand Accessories:'
          },
          {
            id: `el-${baseTime}-3-a`,
            type: 'item',
            code: 'A',
            description: '1 gang 2-way switch - Legrand',
            unit: 'Nr.',
            qty: 10,
            rate: 90
          }
        ]
      }
    ]
  };
};
