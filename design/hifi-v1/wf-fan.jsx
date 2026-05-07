// Fan view variants — the hero of the app, 4 takes.

// ─────────────────────────────────────────────────────────────
// Shared SVG fan renderer
// mode: 'half' | 'full' | 'inverted' | 'compressed' | 'hybrid'
// ─────────────────────────────────────────────────────────────
function FanSVG({
  cx = 380, cy = 440, generations = 5,
  startA = -90, endA = 90,           // half-circle by default
  r0 = 38, ringStep = 56,
  hoverSector = null,                 // {gen, idx}
  emptyMask = {},                      // gen -> Set of empty indices (compressed)
  palette = 'gray',
  showNames = true,
  width = 760, height = 480,
}) {
  // colors
  const PAL = {
    gray:   { fill: ['#f4f1eb','#ece8df','#e3ddd0','#d8d0bf','#cbc0aa'], stroke: '#c9c4ba', text: '#1a1a1f', sub: '#807e88' },
    warm:   { fill: ['#f8f1e6','#f0e3cf','#e8d3b6','#d9b890','#b8593a'], stroke: '#b89a78', text: '#1a1a1f', sub: '#705a48' },
    cool:   { fill: ['#eef1f5','#dfe5ed','#cdd6e2','#b3c0d2','#4a5a78'], stroke: '#94a3b8', text: '#16202c', sub: '#5a6a82' },
    dark:   { fill: ['#1f1f24','#262630','#2e2e38','#383844','#b8593a'], stroke: '#3a3a45', text: '#e8e6e1', sub: '#807e7a' },
  }[palette] || {};

  const sectors = [];
  for (let g = 1; g <= generations; g++) {
    const ring = fanGen({
      cx, cy, gen: g, startA, endA,
      r0: r0 + (g - 1) * ringStep,
      r1: r0 + g * ringStep,
    });
    ring.forEach((s, i) => {
      sectors.push({ ...s, gen: g, idx: i });
    });
  }

  // detect ancestor lineage from hovered sector (highlight all parents up the tree)
  const lineage = new Set();
  if (hoverSector) {
    let g = hoverSector.gen, i = hoverSector.idx;
    while (g >= 1) {
      lineage.add(`${g}-${i}`);
      i = Math.floor(i / 2); g--;
    }
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {/* Generation guide rings */}
      {Array.from({ length: generations }, (_, i) => i + 1).map(g => {
        // Build a thin path along the outer arc for the gen label
        const labelR = r0 + (g - 0.5) * ringStep;
        return (
          <text key={'lab' + g}
            x={cx} y={cy - labelR - 2}
            textAnchor="middle"
            fontFamily="'Geist Mono', monospace" fontSize="8"
            fill={PAL.sub}
            style={{ letterSpacing: '0.12em' }}>
            G{g}
          </text>
        );
      })}

      {/* Sectors */}
      {sectors.map(s => {
        const empty = emptyMask[s.gen]?.has(s.idx);
        const inLine = lineage.has(`${s.gen}-${s.idx}`);
        const fill = empty ? 'transparent' : PAL.fill[Math.min(s.gen - 1, PAL.fill.length - 1)];
        return (
          <path key={s.key} d={s.path}
            fill={fill}
            stroke={PAL.stroke}
            strokeWidth={inLine ? 1.4 : 0.6}
            strokeDasharray={empty ? '3 3' : 'none'}
            opacity={hoverSector && !inLine ? 0.55 : 1}
          />
        );
      })}

      {/* Ego (center) */}
      <circle cx={cx} cy={cy} r={r0 - 4} fill={PAL.fill[0]} stroke={PAL.stroke} strokeWidth="1" />
      <text x={cx} y={cy - 2} textAnchor="middle" fontFamily="'Fraunces', serif" fontSize="11" fill={PAL.text}>
        Camille
      </text>
      <text x={cx} y={cy + 9} textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="7" fill={PAL.sub}>
        1981–
      </text>

      {/* Sector labels — only for outer 3 generations to avoid clutter */}
      {showNames && sectors.map(s => {
        if (s.gen > 3) return null;
        if (emptyMask[s.gen]?.has(s.idx)) return null;
        const r = (r0 + (s.gen - 1) * ringStep + r0 + s.gen * ringStep) / 2;
        const p = polar(cx, cy, r, s.midA);
        const rotation = s.midA > 0 ? s.midA - 90 : s.midA + 90;
        const isInverted = startA > 0; // descendants below
        return (
          <g key={'l' + s.key} transform={`translate(${p.x},${p.y}) rotate(${rotation})`}>
            <text textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Fraunces', serif" fontSize={s.gen === 1 ? 10 : s.gen === 2 ? 9 : 7.5}
              fill={PAL.text}>
              {NAMES[s.gen]?.[s.idx] || ''}
            </text>
            {s.gen <= 2 && (
              <text textAnchor="middle" dominantBaseline="middle" y={9}
                fontFamily="'Geist Mono', monospace" fontSize="6.5"
                fill={PAL.sub}>
                {DATES[s.gen]?.[s.idx] || ''}
              </text>
            )}
            {/* Statut de décès picto */}
            {STATUS[s.gen]?.[s.idx] && s.gen <= 2 && (
              <text textAnchor="middle" dominantBaseline="middle" y={-9}
                fontSize="9" fill={PAL.fill[4]}>⚓</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Variant A — Demi-cercle classique 5 générations
// ─────────────────────────────────────────────────────────────
function FanVariantA({ palette = 'gray' }) {
  return (
    <div className="wf" style={{ display: 'flex' }}>
      <Sidebar active="EV" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        {/* View switcher */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px 6px', alignItems: 'center', borderBottom: '1px solid var(--line-2)' }}>
          <span className="wf-tag solid">Éventail</span>
          <span className="wf-tag">Arbre</span>
          <span className="wf-tag">Timeline</span>
          <span className="wf-tag">Liste</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span className="wf-eyebrow">Profondeur</span>
            <span className="wf-mono" style={{ fontSize: 10 }}>5 générations ▾</span>
          </span>
        </div>

        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          <FanSVG palette={palette} hoverSector={{ gen: 2, idx: 0 }} cx={380} cy={440} />
          {/* Floating toolbar (zoom etc) */}
          <div style={{ position: 'absolute', top: 14, left: 14,
            background: 'var(--paper)', border: '1px solid var(--line)',
            borderRadius: 8, padding: '4px 6px', display: 'flex', gap: 2,
            fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <span style={{ padding: '2px 6px' }}>−</span>
            <span style={{ padding: '2px 6px', borderLeft: '1px solid var(--line-2)', borderRight: '1px solid var(--line-2)' }}>100%</span>
            <span style={{ padding: '2px 6px' }}>+</span>
            <span style={{ padding: '2px 6px', borderLeft: '1px solid var(--line-2)' }}>⇄ inverser</span>
          </div>
          {/* Mini-map */}
          <div style={{ position: 'absolute', bottom: 14, right: 14,
            width: 110, height: 70, border: '1px solid var(--line)',
            background: 'var(--paper-2)', borderRadius: 6, padding: 4,
            fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--ink-3)' }}>
            <div style={{ position: 'absolute', top: 4, left: 6 }}>mini-map</div>
            <svg width="100%" height="100%" viewBox="0 0 110 70" style={{ position: 'absolute', inset: 0 }}>
              <path d={arcPath(55, 60, 8, 32, -90, 90)} fill="none" stroke="var(--line)" strokeWidth="0.5" />
              <rect x={28} y={28} width={42} height={26} fill="none" stroke="var(--accent)" strokeWidth="1" />
            </svg>
          </div>
          {/* Legend */}
          <div style={{ position: 'absolute', bottom: 14, left: 14,
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-3)',
            display: 'flex', gap: 10 }}>
            <span>↑ paternelle</span>
            <span>↑ maternelle</span>
            <span>⚓ statut décès</span>
          </div>

          {/* Annotations */}
          <Anno x={420} y={250} w={180}>
            survol → halo + lignée<br/>illuminée jusqu'à l'ego
          </Anno>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <path d="M 420 260 Q 380 280 320 320" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
          <Anno x={28} y={310} w={120}>
            secteur vide<br/>= G inconnue
          </Anno>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Variant B — Cercle complet (ascendants + descendants)
// ─────────────────────────────────────────────────────────────
function FanVariantB({ palette = 'gray' }) {
  return (
    <div className="wf" style={{ display: 'flex' }}>
      <Sidebar active="EV" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px 6px', alignItems: 'center', borderBottom: '1px solid var(--line-2)' }}>
          <span className="wf-tag solid">Éventail · cercle complet</span>
          <span className="wf-tag">⇅ ascendants ↑ + descendants ↓</span>
          <span style={{ marginLeft: 'auto' }} className="wf-mono" >4 + 2 générations</span>
        </div>

        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          <svg width="760" height="480" viewBox="0 0 760 480" style={{ display: 'block', margin: '0 auto' }}>
            {/* Top half (ascendants) */}
            <FanSVGInline cx={380} cy={240} startA={-90} endA={90} generations={4}
              r0={28} ringStep={42} palette={palette} />
            {/* Bottom half (descendants) — slimmer */}
            <FanSVGInline cx={380} cy={240} startA={90} endA={270} generations={2}
              r0={28} ringStep={42} palette={palette} inverted />
          </svg>
          <Anno x={520} y={120} w={160}>
            ascendants ↑<br/>(éventail traditionnel)
          </Anno>
          <Anno x={520} y={300} w={160}>
            descendants ↓<br/>onglets pour fratries multiples
          </Anno>
          <div style={{ position: 'absolute', top: 14, left: 14,
            background: 'var(--paper)', border: '1px solid var(--line)',
            borderRadius: 8, padding: '4px 6px', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
            ⇄ inverser · ⊕ étendre
          </div>
        </div>
      </div>
    </div>
  );
}

function FanSVGInline({ cx, cy, generations, startA, endA, r0, ringStep, palette, inverted }) {
  const PAL = {
    gray:   { fill: ['#f4f1eb','#ece8df','#e3ddd0','#d8d0bf'], stroke: '#c9c4ba', text: '#1a1a1f', sub: '#807e88' },
    warm:   { fill: ['#f8f1e6','#f0e3cf','#e8d3b6','#d9b890'], stroke: '#b89a78', text: '#1a1a1f', sub: '#705a48' },
    cool:   { fill: ['#eef1f5','#dfe5ed','#cdd6e2','#b3c0d2'], stroke: '#94a3b8', text: '#16202c', sub: '#5a6a82' },
    dark:   { fill: ['#1f1f24','#262630','#2e2e38','#383844'], stroke: '#3a3a45', text: '#e8e6e1', sub: '#807e7a' },
  }[palette] || {};

  const sectors = [];
  for (let g = 1; g <= generations; g++) {
    const ring = fanGen({ cx, cy, gen: g, startA, endA,
      r0: r0 + (g - 1) * ringStep, r1: r0 + g * ringStep });
    ring.forEach((s, i) => sectors.push({ ...s, gen: g, idx: i }));
  }

  return (
    <g>
      {sectors.map(s => (
        <path key={s.key} d={s.path}
          fill={PAL.fill[Math.min(s.gen - 1, PAL.fill.length - 1)]}
          stroke={PAL.stroke} strokeWidth="0.6" />
      ))}
      {sectors.filter(s => s.gen <= 2).map(s => {
        const r = (r0 + (s.gen - 1) * ringStep + r0 + s.gen * ringStep) / 2;
        const p = polar(cx, cy, r, s.midA);
        const rot = s.midA > 0 ? s.midA - 90 : s.midA + 90;
        const list = inverted ? ['Léa', 'Théo', 'Inès', 'Hugo'] : NAMES[s.gen] || [];
        return (
          <g key={'l' + s.key} transform={`translate(${p.x},${p.y}) rotate(${rot})`}>
            <text textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Fraunces', serif" fontSize={s.gen === 1 ? 9 : 7.5}
              fill={PAL.text}>
              {list[s.idx] || ''}
            </text>
          </g>
        );
      })}
      {!inverted && (
        <>
          <circle cx={cx} cy={cy} r={r0 - 4} fill={PAL.fill[0]} stroke={PAL.stroke} />
          <text x={cx} y={cy + 1} textAnchor="middle" fontFamily="'Fraunces', serif" fontSize="10" fill={PAL.text}>Camille</text>
        </>
      )}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// Variant C — Hybride éventail / arbre rectangulaire (split)
// ─────────────────────────────────────────────────────────────
function FanVariantC({ palette = 'gray' }) {
  return (
    <div className="wf" style={{ display: 'flex' }}>
      <Sidebar active="EV" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px 6px', alignItems: 'center', borderBottom: '1px solid var(--line-2)' }}>
          <span className="wf-tag solid">Mode hybride</span>
          <span className="wf-tag">éventail ↔ arbre</span>
          <span style={{ marginLeft: 'auto' }} className="wf-mono">⌥E pour basculer</span>
        </div>

        <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {/* left — fan, right — rectangular tree */}
          <div style={{ borderRight: '1px dashed var(--line)', position: 'relative' }}>
            <svg width="100%" height="460" viewBox="0 0 380 460">
              <FanSVGInline cx={190} cy={420} startA={-90} endA={90}
                generations={4} r0={28} ringStep={48} palette={palette} />
            </svg>
            <span className="wf-eyebrow" style={{ position: 'absolute', top: 8, left: 12 }}>Éventail · ascendants</span>
          </div>
          <div style={{ position: 'relative', padding: '20px 16px' }}>
            <span className="wf-eyebrow" style={{ position: 'absolute', top: 8, left: 12 }}>Arbre rectangulaire · même branche</span>
            {/* Rect tree */}
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 14, height: '92%', justifyContent: 'flex-start', marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <PersonChip name="Camille" dates="1981–" density="med" width={120} highlight />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <PersonChip name="Jean Lefèvre" dates="1948–2019" density="med" />
                <PersonChip name="Marguerite R." dates="1952–" density="med" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <PersonChip name="Pierre L." dates="1918–1981" density="min" width={80} />
                <PersonChip name="Anne B." dates="1922–2003" density="min" width={80} />
                <PersonChip name="Étienne R." dates="1920–1995" density="min" width={80} />
                <PersonChip name="Louise C." dates="1925–2010" density="min" width={80} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {Array(8).fill(0).map((_,i) => (
                  <PersonChip key={i} name="•••" dates="1885–" density="min" width={50} />
                ))}
              </div>
            </div>
            {/* connector lines (simple) */}
            <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} viewBox="0 0 380 460">
              <path d="M 190 110 V 130 H 95 V 145 M 190 130 H 285 V 145" stroke="var(--line)" strokeWidth="0.6" fill="none"/>
            </svg>
          </div>
          <Anno x={310} y={50} w={140}>
            même donnée<br/>2 lectures simultanées
          </Anno>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Variant D — Compressé (replie les générations vides)
// ─────────────────────────────────────────────────────────────
function FanVariantD({ palette = 'gray' }) {
  // emptyMask: gen 4 has half its sectors empty, gen 5 most empty → collapsed
  const empty = {
    3: new Set([0, 6]),
    4: new Set([0, 1, 2, 12, 13, 14, 15]),
  };
  return (
    <div className="wf" style={{ display: 'flex' }}>
      <Sidebar active="EV" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px 6px', alignItems: 'center', borderBottom: '1px solid var(--line-2)' }}>
          <span className="wf-tag solid">Compression intelligente</span>
          <span className="wf-tag">générations vides repliées</span>
          <span style={{ marginLeft: 'auto' }} className="wf-mono">7 secteurs masqués</span>
        </div>

        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          <FanSVG palette={palette} cx={380} cy={440} emptyMask={empty} />
          <Anno x={60} y={300} w={160}>
            secteurs hachurés =<br/>"à rechercher"<br/>cliquables → ajout
          </Anno>
          <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d="M 200 300 Q 240 320 290 360" stroke="var(--accent)" strokeDasharray="3 3" strokeWidth="1" fill="none"/>
          </svg>
          <Anno x={540} y={150} w={180}>
            zoom auto sur la branche<br/>la plus dense
          </Anno>
          <div style={{ position: 'absolute', bottom: 14, left: 14,
            background: 'var(--paper-2)', border: '1px solid var(--line)',
            borderRadius: 8, padding: '6px 10px', fontSize: 10,
            display: 'flex', gap: 14 }}>
            <span><span className="wf-mono" style={{ color: 'var(--ink)' }}>327</span> personnes</span>
            <span><span className="wf-mono" style={{ color: 'var(--ink)' }}>9</span> générations</span>
            <span><span className="wf-mono" style={{ color: 'var(--ink)' }}>74%</span> branches connues</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FanSVG, FanSVGInline, FanVariantA, FanVariantB, FanVariantC, FanVariantD });
