// Yeboekun brand identity — design tokens + Sankofa pictograms
// Three directions: A (editorial), B (custom Y-lettering), C (seal stamp)

const Y = {
  ink:    '#1F1A14',
  ink2:   '#3D342A',
  ink3:   '#766A58',
  ink4:   '#A89F8C',
  ivory:  '#F4EFE6',
  cream:  '#FAF6EC',
  paper2: '#ECE5D6',
  line:   '#CABFA6',
  line2:  '#DDD2B8',
  sepia:  '#7D5A36',
  rust:   '#A4502A',
};

// SANKOFA — DIRECTION A
// Très épuré, monoline 1.5px, oiseau qui se retourne — réduit à
// quelques arcs et une ligne pour l'œuf. Inscrit dans un carré 64×64.
function SankofaA({ size = 64, color = Y.ink, accent = Y.sepia, stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round"
      strokeLinejoin="round">
      {/* Body — long curved arc, head turning back */}
      <path d="M 14 44 Q 14 24, 32 24 Q 50 24, 50 38" />
      {/* Head turning back — small arc */}
      <path d="M 50 38 Q 50 46, 42 46 Q 36 46, 36 40" />
      {/* Beak — pointing back toward tail */}
      <path d="M 36 40 L 30 36" />
      {/* Tail feathers — angular, geometric */}
      <path d="M 14 44 L 10 50 M 14 44 L 16 52 M 14 44 L 22 50" />
      {/* Legs */}
      <path d="M 24 50 L 24 56 M 32 50 L 32 56" />
      {/* The egg — accent color, retrieved */}
      <ellipse cx="22" cy="20" rx="3.5" ry="4.2"
        stroke={accent} fill="none" strokeWidth={stroke}/>
    </svg>
  );
}

// SANKOFA — DIRECTION C (seal version, more circular & contained)
// Inscrit dans un cercle. Plus symbolique, lecture immédiate.
function SankofaC({ size = 64, color = Y.ink, accent = Y.rust, stroke = 1.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="32" cy="32" r="28" stroke={color} fill="none" strokeWidth={stroke}/>
      {/* Stylized bird looking back, contained in circle */}
      <path d="M 18 40 Q 18 22, 32 22 Q 44 22, 44 32 Q 44 40, 36 40 Q 30 40, 30 34" />
      {/* Beak going back to egg */}
      <path d="M 30 34 L 25 30" />
      {/* Egg */}
      <circle cx="22" cy="27" r="2.4" stroke={accent} fill="none" strokeWidth={stroke}/>
      {/* Tail */}
      <path d="M 18 40 L 14 46 M 18 40 L 22 46" />
      {/* Feet */}
      <path d="M 26 44 L 26 48 M 32 44 L 32 48" />
    </svg>
  );
}

// DIRECTION B — Custom Y as Sankofa
// La barre droite du Y se courbe vers l'arrière comme la tête de Sankofa.
// L'œuf est posé dans le creux du V à gauche.
function YSankofa({ size = 100, color = Y.ink, accent = Y.sepia }) {
  // viewbox 64×80 : Y of cap-height 64, with tail extending below
  return (
    <svg width={size*0.8} height={size} viewBox="0 0 80 100" fill="none"
      stroke={color} strokeWidth="2.4" strokeLinecap="round"
      strokeLinejoin="round">
      {/* Left branch of Y */}
      <path d="M 8 14 L 32 50" />
      {/* Right branch of Y curving back like Sankofa's head */}
      <path d="M 56 14 Q 60 30, 50 38 Q 40 44, 36 36 L 32 50" fill="none"/>
      {/* The trunk */}
      <path d="M 32 50 L 32 86" />
      {/* The egg in the V — accent */}
      <circle cx="22" cy="32" r="3.2" stroke={accent} fill="none"/>
    </svg>
  );
}

Object.assign(window, { Y, SankofaA, SankofaC, YSankofa });
