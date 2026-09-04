// Official School Logo & Stamp Assets for Golden Horizon College & Primary School

// High-fidelity SVG reproduction of Golden Horizon College Crest (matching user attachment)
export const GOLDEN_HORIZON_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <path id="textArcTop" d="M 90,250 A 160,160 0 0,1 410,250" fill="none" />
    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15" />
    </filter>
  </defs>

  <!-- Background base -->
  <rect width="500" height="500" fill="transparent" />

  <!-- Outer Ring Details -->
  <circle cx="250" cy="230" r="195" fill="none" stroke="#122b54" stroke-width="2.5" />
  <circle cx="250" cy="230" r="186" fill="none" stroke="#122b54" stroke-width="1.2" stroke-dasharray="3 3" />
  <circle cx="250" cy="230" r="150" fill="none" stroke="#122b54" stroke-width="2" />

  <!-- Top Arc Text: GOLDEN HORIZON -->
  <text fill="#122b54" font-family="'Cinzel', 'Playfair Display', Georgia, serif" font-weight="900" font-size="28" letter-spacing="4">
    <textPath href="#textArcTop" startOffset="50%" text-anchor="middle">
      GOLDEN HORIZON
    </textPath>
  </text>

  <!-- Left & Right Small Dots on ring -->
  <circle cx="92" cy="230" r="3.5" fill="#122b54" />
  <circle cx="408" cy="230" r="3.5" fill="#122b54" />

  <!-- Center Solid Navy Disc -->
  <circle cx="250" cy="230" r="142" fill="#122b54" filter="url(#subtleShadow)" />
  <circle cx="250" cy="230" r="138" fill="none" stroke="#f1a80a" stroke-width="2.5" />

  <!-- Open Book (Left Icon) -->
  <g transform="translate(160, 160) scale(0.65)" fill="#f1a80a">
    <path d="M 0,20 C 15,10 35,10 50,18 C 65,10 85,10 100,20 L 100,55 C 85,45 65,45 50,53 C 35,45 15,45 0,55 Z" stroke="#122b54" stroke-width="2"/>
    <path d="M 50,18 L 50,53" stroke="#122b54" stroke-width="2.5" />
    <path d="M 12,28 C 22,23 35,23 46,27" stroke="#122b54" stroke-width="1.5" fill="none" />
    <path d="M 12,36 C 22,31 35,31 46,35" stroke="#122b54" stroke-width="1.5" fill="none" />
    <path d="M 54,27 C 65,23 78,23 88,28" stroke="#122b54" stroke-width="1.5" fill="none" />
    <path d="M 54,35 C 65,31 78,31 88,36" stroke="#122b54" stroke-width="1.5" fill="none" />
  </g>

  <!-- Star in Golden Ring (Center Icon) -->
  <g transform="translate(250, 175)">
    <circle cx="0" cy="0" r="22" fill="#f1a80a" />
    <circle cx="0" cy="0" r="18" fill="#122b54" />
    <!-- 5 pointed star -->
    <polygon points="0,-12 3.8,-3.5 12.3,-3.5 5.5,2 8,10.5 0,5.5 -8,10.5 -5.5,2 -12.3,-3.5 -3.8,-3.5" fill="#f1a80a" />
  </g>

  <!-- Graduation Cap (Right Icon) -->
  <g transform="translate(300, 160) scale(0.65)" fill="#f1a80a">
    <!-- Mortarboard Diamond -->
    <polygon points="50,15 95,30 50,45 5,30" stroke="#122b54" stroke-width="1.5" />
    <!-- Skull Cap -->
    <path d="M 25,37 L 25,50 C 25,58 75,58 75,50 L 75,37" stroke="#122b54" stroke-width="1.5" />
    <!-- Tassel -->
    <path d="M 50,30 L 90,42 L 92,56" fill="none" stroke="#f1a80a" stroke-width="2.5" />
    <circle cx="92" cy="57" r="3" fill="#f1a80a" />
  </g>

  <!-- Converging Golden Arches behind Shield -->
  <path d="M 215,225 C 225,195 240,190 250,186 C 260,190 275,195 285,225" fill="none" stroke="#f1a80a" stroke-width="4.5" stroke-linecap="round" />

  <!-- Center Golden Monogram Oval Shield -->
  <ellipse cx="250" cy="265" rx="55" ry="62" fill="#f1a80a" stroke="#122b54" stroke-width="4" />
  <ellipse cx="250" cy="265" rx="48" ry="55" fill="#f1a80a" stroke="#ffffff" stroke-width="1.5" opacity="0.4" />

  <!-- Monogram GHC Stylized in Shield -->
  <g transform="translate(250, 265)">
    <!-- Central letter H -->
    <path d="M -18,-35 L -18,25 M 18,-35 L 18,25 M -18,-5 L 18,-5" stroke="#122b54" stroke-width="7" stroke-linecap="round" />
    <!-- Curved letter G -->
    <path d="M 5,-28 C -22,-32 -38,-15 -38,3 C -38,22 -20,35 2,33 C 16,31 24,20 24,8 L -2,8" fill="none" stroke="#122b54" stroke-width="6.5" stroke-linecap="round" />
    <!-- Outer letter C loop -->
    <path d="M 12,-32 C 32,-30 42,-12 42,4 C 42,22 30,34 10,35" fill="none" stroke="#122b54" stroke-width="6" stroke-linecap="round" />
  </g>

  <!-- Laurel Wreath Leaves (Left and Right Flanks) -->
  <g fill="#122b54">
    <!-- Left Leaves -->
    <path d="M 175,300 C 160,290 150,270 148,255 C 158,260 168,272 172,288 Z" />
    <path d="M 160,320 C 145,310 135,290 135,275 C 145,280 153,295 156,310 Z" />
    <path d="M 148,340 C 132,330 125,312 126,298 C 136,303 143,318 144,332 Z" />
    <path d="M 140,365 C 125,355 120,336 122,322 C 132,327 137,342 136,356 Z" />
    <path d="M 142,390 C 128,382 125,362 130,348 C 138,355 142,370 139,382 Z" />
    <path d="M 152,410 C 140,405 138,388 145,375 C 152,382 153,395 149,404 Z" />

    <!-- Right Leaves -->
    <path d="M 325,300 C 340,290 350,270 352,255 C 342,260 332,272 328,288 Z" />
    <path d="M 340,320 C 355,310 365,290 365,275 C 355,280 347,295 344,310 Z" />
    <path d="M 352,340 C 368,330 375,312 374,298 C 364,303 357,318 356,332 Z" />
    <path d="M 360,365 C 375,355 380,336 378,322 C 368,327 363,342 364,356 Z" />
    <path d="M 358,390 C 372,382 375,362 370,348 C 362,355 358,370 361,382 Z" />
    <path d="M 348,410 C 360,405 362,388 355,375 C 348,382 347,395 351,404 Z" />
  </g>

  <!-- Banner Ribbon (COLLEGE) -->
  <g filter="url(#subtleShadow)">
    <!-- Ribbon Tails -->
    <polygon points="120,380 160,365 160,395 120,410 135,395" fill="#122b54" />
    <polygon points="380,380 340,365 340,395 380,410 365,395" fill="#122b54" />
    <polygon points="150,395 165,390 165,405" fill="#f1a80a" />
    <polygon points="350,395 335,390 335,405" fill="#f1a80a" />

    <!-- Ribbon Main Body -->
    <path d="M 155,368 Q 250,385 345,368 L 345,398 Q 250,415 155,398 Z" fill="#122b54" stroke="#f1a80a" stroke-width="1.5" />
    
    <text x="250" y="392" fill="#ffffff" font-family="'Cinzel', 'Times New Roman', serif" font-weight="900" font-size="19" text-anchor="middle" letter-spacing="5">
      COLLEGE
    </text>
  </g>

  <!-- School Motto Below Crest -->
  <text x="250" y="465" fill="#122b54" font-family="'Times New Roman', Georgia, serif" font-style="italic" font-weight="bold" font-size="18" text-anchor="middle" letter-spacing="0.8">
    Firm Roots, Global Reach
  </text>
</svg>`;

// High-fidelity Official School Stamp SVG for Golden Horizon Schools
export const GOLDEN_HORIZON_STAMP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
  <defs>
    <path id="stampArcTop" d="M 40,150 A 110,110 0 0,1 260,150" fill="none" />
    <path id="stampArcBottom" d="M 260,150 A 110,110 0 0,1 40,150" fill="none" />
  </defs>

  <!-- Circular Outer Ink Ring -->
  <circle cx="150" cy="150" r="136" fill="none" stroke="#1e3a8a" stroke-width="4" stroke-dasharray="300 3" opacity="0.9" />
  <circle cx="150" cy="150" r="128" fill="none" stroke="#1e3a8a" stroke-width="1.5" opacity="0.85" />
  <circle cx="150" cy="150" r="88" fill="none" stroke="#1e3a8a" stroke-width="2.5" opacity="0.9" />

  <!-- Curved Text: School Name Top -->
  <text fill="#1e3a8a" font-family="'Cinzel', 'Georgia', serif" font-weight="900" font-size="14.5" letter-spacing="2.5" opacity="0.95">
    <textPath href="#stampArcTop" startOffset="50%" text-anchor="middle">
      GOLDEN HORIZON SCHOOLS
    </textPath>
  </text>

  <!-- Curved Text: Official Certification Bottom -->
  <text fill="#1e3a8a" font-family="'Cinzel', 'Georgia', serif" font-weight="800" font-size="11.5" letter-spacing="3" opacity="0.95">
    <textPath href="#stampArcBottom" startOffset="50%" text-anchor="middle">
      OFFICIAL SEAL • VERIFIED
    </textPath>
  </text>

  <!-- Side Stars -->
  <text x="36" y="154" fill="#1e3a8a" font-size="14" text-anchor="middle">★</text>
  <text x="264" y="154" fill="#1e3a8a" font-size="14" text-anchor="middle">★</text>

  <!-- Inner Center Content -->
  <g transform="translate(150, 150)" text-anchor="middle">
    <!-- Center Crest Shield / Emblem outline -->
    <path d="M -22,-42 L 22,-42 C 22,-20 32,5 0,22 C -32,5 -22,-20 -22,-42 Z" fill="none" stroke="#1e3a8a" stroke-width="2" opacity="0.75" />
    <text y="-25" fill="#1e3a8a" font-family="'Cinzel', serif" font-weight="900" font-size="12" letter-spacing="1">GHC</text>
    <text y="-12" fill="#1e3a8a" font-family="'Cinzel', serif" font-weight="700" font-size="8" letter-spacing="0.5">ACCREDITED</text>

    <!-- Stamp Decision Banner -->
    <rect x="-68" y="2" width="136" height="22" rx="4" fill="#1e3a8a" opacity="0.92" />
    <text y="17" fill="#ffffff" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11.5" letter-spacing="2">
      APPROVED
    </text>

    <text y="38" fill="#1e3a8a" font-family="monospace" font-weight="bold" font-size="9" letter-spacing="1">
      OFFICE OF THE PRINCIPAL
    </text>
    <text y="50" fill="#1e3a8a" font-family="monospace" font-weight="bold" font-size="8.5" opacity="0.8">
      &amp; HEAD TEACHER
    </text>
  </g>
</svg>`;

// Convert SVG to Data URI for portable <img> src compatibility
export const DEFAULT_SCHOOL_LOGO_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(GOLDEN_HORIZON_LOGO_SVG)}`;
export const DEFAULT_SCHOOL_STAMP_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(GOLDEN_HORIZON_STAMP_SVG)}`;
