// Shared wireframe primitives — sidebar, topbar, person card, fan SVG bits

const SIDE_ITEMS = [
  ['Tableau de bord', 'TB'],
  ['Éventail',        'EV', true],
  ['Arbre',           'AR'],
  ['Timeline',        'TL'],
  ['Photos',          'PH'],
  ['Documents',       'DC'],
  ['Pistes',          'PI'],
  ['Recherches',      'RS'],
  ['Réglages',        'RG'],
];

function Sidebar({ active = 'EV' }) {
  return (
    <div className="wf-side">
      <div className="logo">G.</div>
      {SIDE_ITEMS.map(([label, code]) => (
        <div key={code} className={'ico ' + (active === code ? 'active' : '')} title={label}>
          {code}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div className="ico" title="Profil">u</div>
    </div>
  );
}

function Topbar({ tree = 'Famille Lefèvre · 1640–', center = true }) {
  return (
    <div className="wf-top">
      <span className="tree-pick">▾ {tree}</span>
      {center && (
        <div className="search" style={{ margin: '0 auto' }}>
          <span style={{ fontFamily: 'var(--font-mono)' }}>⌕</span>
          <span>Rechercher une personne, un lieu, une date…</span>
          <span className="kbd" style={{ marginLeft: 'auto' }}>⌘K</span>
        </div>
      )}
      <div className="avatar">CL</div>
    </div>
  );
}

// Annotated arrow + handwritten note. anchor: {x,y} (the labelled point).
// note: {x,y} (the handwritten text origin). Optional.
function Anno({ note, x, y, w = 200, align = 'left', children }) {
  const style = {
    left: x, top: y, width: w, textAlign: align,
  };
  return <div className="wf-anno" style={style}>{children}</div>;
}

// Striped diagonal portrait placeholder (no SVG drawing of faces)
function Portrait({ size = 36, label = 'photo', round = true, dark = false }) {
  return (
    <div className={'wf-ph ' + (dark ? 'dark' : '')} style={{
      width: size, height: size,
      borderRadius: round ? '50%' : '4px',
      fontSize: Math.max(8, size * 0.18),
    }}>{label}</div>
  );
}

// Compact person card used inside fan/tree/timeline at small size.
// density: 'min' | 'med' | 'rich'
function PersonChip({
  name = 'Jean Lefèvre',
  dates = '1842–1893',
  job,
  status,            // e.g. 'Mort en Mer'
  living = false,
  density = 'med',
  width = 110,
  highlight = false,
  dimmed = false,
}) {
  const style = {
    width,
    border: '1px solid ' + (highlight ? 'var(--ink)' : 'var(--line)'),
    background: 'var(--paper)',
    borderRadius: 6,
    padding: '4px 6px 5px',
    fontSize: 9,
    lineHeight: 1.25,
    opacity: dimmed ? 0.4 : 1,
    boxShadow: highlight ? '0 0 0 2px rgba(184,89,58,0.18)' : 'none',
    position: 'relative',
  };
  return (
    <div style={style}>
      <div style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
        {density !== 'min' && <Portrait size={density === 'rich' ? 24 : 18} round />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="wf-serif" style={{ fontSize: 10.5, lineHeight: 1.1, color: 'var(--ink)' }}>{name}</div>
          <div className="wf-mono" style={{ fontSize: 8, color: 'var(--ink-3)', marginTop: 1 }}>
            {dates}{living ? ' ·' : ''}{living ? ' vivant' : ''}
          </div>
          {density === 'rich' && job && (
            <div style={{ fontSize: 8.5, color: 'var(--ink-2)', marginTop: 1 }}>{job}</div>
          )}
        </div>
      </div>
      {density === 'rich' && status && (
        <div style={{ marginTop: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <span className="wf-tag warn" style={{ fontSize: 7.5, padding: '0 4px' }}>⚓ {status}</span>
        </div>
      )}
    </div>
  );
}

// Minimal radial label for fan generation labels
function GenLabel({ cx, cy, r, angle, gen }) {
  const a = (angle - 90) * Math.PI / 180;
  return (
    <text x={cx + r * Math.cos(a)} y={cy + r * Math.sin(a)}
      textAnchor="middle" dominantBaseline="middle"
      fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-3)"
      style={{ letterSpacing: '0.1em' }}>
      G{gen}
    </text>
  );
}

// Build a polar arc path for fan sectors
function arcPath(cx, cy, r0, r1, a0, a1) {
  const toXY = (r, deg) => {
    const a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const [x0a, y0a] = toXY(r0, a0);
  const [x0b, y0b] = toXY(r0, a1);
  const [x1a, y1a] = toXY(r1, a0);
  const [x1b, y1b] = toXY(r1, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return [
    `M ${x0a} ${y0a}`,
    `A ${r0} ${r0} 0 ${large} 1 ${x0b} ${y0b}`,
    `L ${x1b} ${y1b}`,
    `A ${r1} ${r1} 0 ${large} 0 ${x1a} ${y1a}`,
    'Z',
  ].join(' ');
}

// Generate a generation's sectors (returns array of {path, midR, midA, gen, key})
function fanGen({ cx, cy, gen, startA, endA, r0, r1 }) {
  const count = Math.pow(2, gen);
  const span = (endA - startA) / count;
  const sectors = [];
  for (let i = 0; i < count; i++) {
    const a0 = startA + i * span;
    const a1 = a0 + span;
    sectors.push({
      key: `${gen}-${i}`,
      path: arcPath(cx, cy, r0, r1, a0, a1),
      midA: (a0 + a1) / 2,
      midR: (r0 + r1) / 2,
      span,
    });
  }
  return sectors;
}

// Polar->Cartesian helper for placing labels
function polar(cx, cy, r, deg) {
  const a = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

// Pre-baked sample names per generation (G0=ego, G1..)
const NAMES = {
  0: ['Camille Lefèvre'],
  1: ['Jean Lefèvre', 'Marguerite Roux'],
  2: ['Pierre Lefèvre', 'Anne Berthier', 'Étienne Roux', 'Louise Caron'],
  3: ['Henri L.', 'Sophie M.', 'Paul B.', 'Madeleine V.', 'François R.', 'Élise T.', 'Antoine C.', 'Jeanne D.'],
  4: Array.from({length: 16}, (_, i) => ['•','•','•','•'][i%4] + ' G4-' + (i+1)),
  5: Array.from({length: 32}, () => ''),
};

const DATES = {
  0: ['1981–'],
  1: ['1948–2019', '1952–'],
  2: ['1918–1981', '1922–2003', '1920–1995', '1925–2010'],
  3: ['1885–1962', '1890–1971', '1882–1958', '1888–1969', '1887–1955', '1893–1980', '1880–1950', '1895–1972'],
  4: Array(16).fill('1850–1920'),
  5: Array(32).fill(''),
};

const JOBS = {
  0: ['Architecte'],
  1: ['Charpentier de marine', 'Institutrice'],
  2: ['Pêcheur', 'Couturière', 'Forgeron', 'Sage-femme'],
  3: ['Marin', 'Lingère', 'Boulanger', '—', 'Vigneron', 'Modiste', 'Notaire', '—'],
};

const STATUS = {
  1: [{ kind: 'sea', label: 'Mort en Mer' }, null],
  2: [null, null, null, null],
  3: [{ kind: 'sea', label: 'Mort en Mer' }, null, null, null, null, null, null, null],
};

Object.assign(window, {
  Sidebar, Topbar, Anno, Portrait, PersonChip, GenLabel,
  arcPath, fanGen, polar, NAMES, DATES, JOBS, STATUS,
});
