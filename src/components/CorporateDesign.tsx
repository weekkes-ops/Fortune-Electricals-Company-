/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// --- HIGH-FIDELITY VECTOR REPLICAS OF THE PHYSICAL ASSETS ---

/**
 * M. B. FORTUNE - Licensed Electrical Contractor Circle Stamp Component
 * Modeled with high precision after the uploaded rubber stamp image from the user.
 */
export function CorporateStamp({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <div className={`relative shrink-0 select-none pointer-events-none print:mix-blend-multiply ${className}`}>
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2005/svg"
      >
        <defs>
          {/* Fractal noise filter to give the realistic ink bleed and slightly rough edges of a real rubber stamp seal */}
          <filter id="stamp-rough-ink" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Top text arc: Sweeps left to right over the top half */}
          <path id="stamp-top-text-path" d="M 28 100 A 72 72 0 0 1 172 100" />
          {/* Bottom text arc: Sweeps right to left under the bottom half so it reads left-to-right right-side-up */}
          <path id="stamp-bottom-text-path" d="M 172 100 A 72 72 0 0 1 28 100" />
          {/* Inner arcs for FORTUNE ELECTRICALS & SLEWRC LICENSE */}
          <path id="stamp-inner-top-path" d="M 43 100 A 57 57 0 0 1 157 100" />
          <path id="stamp-inner-bottom-path" d="M 157 100 A 57 57 0 0 1 43 100" />
        </defs>

        {/* Ink-bled group */}
        <g filter="url(#stamp-rough-ink)">
          {/* Outer concentric lines standard of a rubber stamp - styled in classic blue stamp ink */}
          {/* Main outer ring */}
          <circle cx="100" cy="100" r="94" stroke="#1d4ed8" strokeWidth="2.8" className="opacity-95" />
          {/* Accent thin outer ring */}
          <circle cx="100" cy="100" r="88" stroke="#1d4ed8" strokeWidth="1.2" className="opacity-90" />
          {/* Inner separator ring */}
          <circle cx="100" cy="100" r="63" stroke="#1d4ed8" strokeWidth="1.2" className="opacity-90" />
          {/* Central circle container */}
          <circle cx="100" cy="100" r="28" stroke="#1d4ed8" strokeWidth="1.8" className="opacity-95" />

          {/* Outer top text: M. B. FORTUNE */}
          <text fill="#1d4ed8" className="font-extrabold select-none" style={{ fontSize: '15.5px', fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 900, letterSpacing: '1.2px' }}>
            <textPath href="#stamp-top-text-path" startOffset="50%" textAnchor="middle">
              ★ M. B. FORTUNE ★
            </textPath>
          </text>

          {/* Outer bottom text: LICENSE ELECTRICAL CONTRACTOR */}
          <text fill="#1d4ed8" className="font-extrabold select-none" style={{ fontSize: '10.5px', fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 900, letterSpacing: '0.4px' }}>
            <textPath href="#stamp-bottom-text-path" startOffset="50%" textAnchor="middle">
              LICENSE ELECTRICAL CONTRACTOR
            </textPath>
          </text>

          {/* Inner top text: FORTUNE ELECTRICALS */}
          <text fill="#1d4ed8" className="font-extrabold select-none" style={{ fontSize: '11px', fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 900, letterSpacing: '0.2px' }}>
            <textPath href="#stamp-inner-top-path" startOffset="50%" textAnchor="middle">
              FORTUNE ELECTRICALS
            </textPath>
          </text>

          {/* Inner bottom text: SLEWRC-160005 */}
          <text fill="#1d4ed8" className="font-bold select-none" style={{ fontSize: '11px', fontFamily: '"JetBrains Mono", monospace', fontWeight: 800, letterSpacing: '0.5px' }}>
            <textPath href="#stamp-inner-bottom-path" startOffset="50%" textAnchor="middle">
              SLEWRC-160005
            </textPath>
          </text>

          {/* Center Detailed Electrical Lightning Spark Symbol - High fidelity tracing from the user upload */}
          <g stroke="#1d4ed8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="opacity-95">
            {/* Center triangular Y-hub connection points */}
            <path d="M 100 100 Q 100 92 98 86 L 104 80 L 98 78 L 103 68 L 101 64" /> {/* Top/Left spark */}
            <path d="M 100 100 Q 94 104 88 108 L 92 113 L 83 116 L 86 122 L 77 125" /> {/* Bottom/Left spark */}
            <path d="M 100 100 Q 106 104 112 108 L 108 113 L 117 116 L 114 122 L 123 125" /> {/* Bottom/Right spark */}
            
            {/* Authentic stray arc details as seen in rubber stamped logos */}
            <path d="M 94 90 Q 98 94 100 100" strokeWidth="1.2" />
            <path d="M 106 90 Q 102 94 100 100" strokeWidth="1.2" />
            <path d="M 100 110 L 100 115" strokeWidth="1.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * Blue Ink Hand-drawn Signature Component
 * Modeled with high precision after the uploaded cursive manager signature.
 */
export function CorporateSignature({ className = 'w-36 h-16' }: { className?: string }) {
  return (
    <div className={`relative shrink-0 select-none pointer-events-none print:mix-blend-multiply ${className}`} id="corporate-manager-signature">
      <svg
        viewBox="0 0 160 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2005/svg"
      >
        <defs>
          {/* Fractal noise filter to emulate organic ink stroke on heavy document stock */}
          <filter id="sig-organic-ink" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Artistic blue pen stroke replicating the hand-drawn signature uploaded by the user */}
        <g filter="url(#sig-organic-ink)" stroke="#1d4ed8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Re-creation of cursive flow from user attachment:
              Starting on left, steep downward dip, double loop cross-over, back up and finishing swoop */}
          <path d="M 32 36 L 40 58 Q 44 68 46 72 Q 44 64 38 48 T 34 24 Q 38 12 43 16 T 52 38 T 57 44 Q 55 45 62 40 T 82 36 Q 84 38 78 41 T 72 54 T 78 68 T 92 60 T 94 48 T 83 40 T 73 45 T 72 56 T 86 66 T 98 62 T 112 48 T 124 44" />
          
          {/* Double cross-loop line across signature core */}
          <path d="M 45 38 Q 72 37 105 35" strokeWidth="1.8" />
          <path d="M 75 39 Q 95 38 120 37" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Modern High-Fidelity Corporate Logo for FORTUNE ELECTRICALS (Letterhead Brand Icon)
 */
export function CorporateLogo({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <div className={`relative shrink-0 select-none ${className}`} id="corporate-logo-emblem">
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2005/svg"
      >
        {/* Outer glowing hexagonal circuit shield */}
        <polygon
          points="50,5 92,28 92,72 50,95 8,72 8,28"
          stroke="#1d4ed8"
          strokeWidth="3.5"
          strokeLinejoin="round"
          fill="#eff6ff"
          className="print:fill-none"
        />
        {/* Inner concentric thin design element */}
        <polygon
          points="50,11 86,31 86,69 50,89 14,69 14,31"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="4 2"
          strokeLinejoin="round"
          className="opacity-75"
        />

        {/* Electrical connection nodes / circuit points at vertices */}
        <circle cx="50" cy="5" r="3.5" fill="#1d4ed8" />
        <circle cx="92" cy="28" r="3.5" fill="#3b82f6" />
        <circle cx="92" cy="72" r="3.5" fill="#1d4ed8" />
        <circle cx="50" cy="95" r="3.5" fill="#3b82f6" />
        <circle cx="8" cy="72" r="3.5" fill="#1d4ed8" />
        <circle cx="8" cy="28" r="3.5" fill="#3b82f6" />

        {/* Sleek dual-tone electrical monogram "F" and "E" with central lightning discharge */}
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Main "F" shape in dark corporate blue */}
          <path
            d="M 33 28 L 68 28 M 33 28 L 33 72 M 33 48 L 58 48"
            stroke="#1d4ed8"
            strokeWidth="5.5"
          />
          
          {/* Main "E" shape integrated via electric blue prongs on right */}
          <path
            d="M 68 36 L 46 36 M 68 56 L 46 56 M 68 72 L 33 72"
            stroke="#3b82f6"
            strokeWidth="4.5"
          />

          {/* Central gold high-voltage lightning arc cutting through */}
          <path
            d="M 58 18 L 41 50 L 59 50 L 42 82"
            stroke="#f59e0b"
            strokeWidth="3"
            className="drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]"
          />
        </g>
      </svg>
    </div>
  );
}
