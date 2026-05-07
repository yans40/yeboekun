// Other screens — Dashboard, Tree, Timeline, Person panel, Add/Edit, Photos, Hints, ⌘K, Components

// ─────────────────────────────────────────────────────────────
// 1. Dashboard
// ─────────────────────────────────────────────────────────────
function ScreenDashboard() {
  return (
    <div className="wf" style={{ display: 'flex' }}>
      <Sidebar active="TB" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div style={{ flex: 1, padding: '24px 32px', overflow: 'hidden' }}>
          <div className="wf-eyebrow">Bienvenue</div>
          <h1 className="wf-serif" style={{ fontSize: 32, fontWeight: 400, margin: '4px 0 24px', lineHeight: 1.1 }}>
            Famille Lefèvre<br/>
            <span style={{ color: 'var(--ink-3)', fontStyle: 'italic', fontSize: 22 }}>327 vies, neuf générations.</span>
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
            {/* Snapshot fan */}
            <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 14, background: 'var(--paper-2)' }}>
              <div className="wf-eyebrow" style={{ marginBottom: 6 }}>Aperçu de l'arbre</div>
              <svg width="100%" height="220" viewBox="0 0 460 240">
                <FanSVGInline cx={230} cy={220} startA={-90} endA={90} generations={4} r0={20} ringStep={36} palette="gray" />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span className="wf-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>4 générations affichées</span>
                <span className="wf-btn ghost" style={{ fontSize: 10 }}>Ouvrir l'éventail →</span>
              </div>
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['327', 'personnes'],
                ['9', 'générations'],
                ['142', 'documents'],
                ['38', 'photos avec visages identifiés'],
              ].map(([n, l], i) => (
                <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 8,
                  padding: '10px 14px', background: 'var(--paper)', display: 'flex',
                  alignItems: 'baseline', gap: 12 }}>
                  <span className="wf-serif" style={{ fontSize: 26, lineHeight: 1 }}>{n}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-2)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 18 }}>
            <div>
              <div className="wf-eyebrow" style={{ marginBottom: 8 }}>Pistes du moment</div>
              {[
                ['Doublon probable', 'Jean Lefèvre × 2 (1842)', 'warn'],
                ['Date incohérente', 'Mariage avant naissance · Anne B.', 'warn'],
                ['Branche orpheline', '3 personnes sans rattachement', ''],
              ].map(([k, v, t], i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderTop: '1px solid var(--line-2)', alignItems: 'center' }}>
                  <span className={'wf-tag ' + (t || '')} style={{ minWidth: 110 }}>{k}</span>
                  <span style={{ fontSize: 12 }}>{v}</span>
                  <span className="wf-btn ghost" style={{ marginLeft: 'auto', fontSize: 10 }}>Examiner →</span>
                </div>
              ))}
            </div>
            <div>
              <div className="wf-eyebrow" style={{ marginBottom: 8 }}>Dernières fiches consultées</div>
              {[
                ['Marguerite Roux', '1952–', 'Institutrice'],
                ['Henri Lefèvre', '1885–1962', 'Marin'],
                ['Anne Berthier', '1922–2003', 'Couturière'],
                ['Étienne Roux', '1920–1995', 'Forgeron'],
              ].map(([n, d, j], i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderTop: '1px solid var(--line-2)', alignItems: 'center' }}>
                  <Portrait size={26} round />
                  <div style={{ flex: 1 }}>
                    <div className="wf-serif" style={{ fontSize: 13 }}>{n}</div>
                    <div className="wf-mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{d} · {j}</div>
                  </div>
                  <span className="wf-mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>il y a 2h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Vue Arbre vertical
// ─────────────────────────────────────────────────────────────
function ScreenTree() {
  const Row = ({ items, scale = 1 }) => (
    <div style={{ display: 'flex', justifyContent: 'space-around', gap: 6 }}>
      {items.map((p, i) => (
        <PersonChip key={i} {...p} width={120 * scale} density={scale > 0.85 ? 'med' : 'min'} />
      ))}
    </div>
  );
  return (
    <div className="wf" style={{ display: 'flex' }}>
      <Sidebar active="AR" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px 6px', borderBottom: '1px solid var(--line-2)' }}>
          <span className="wf-tag">Éventail</span>
          <span className="wf-tag solid">Arbre vertical</span>
          <span className="wf-tag">Timeline</span>
          <span className="wf-tag">Liste</span>
          <span style={{ marginLeft: 'auto' }} className="wf-mono">↕ orientation</span>
        </div>
        <div style={{ position: 'relative', flex: 1, padding: '20px 18px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            <Row items={Array(8).fill({ name: '•••', dates: '1850–', density: 'min' })} scale={0.55} />
            <Row items={[
              { name: 'Henri L.', dates: '1885–1962' }, { name: 'Sophie M.', dates: '1890–1971' },
              { name: 'Paul B.', dates: '1882–1958' }, { name: 'Madeleine V.', dates: '1888–1969' },
              { name: 'François R.', dates: '1887–1955' }, { name: 'Élise T.', dates: '1893–1980' },
              { name: 'Antoine C.', dates: '1880–1950' }, { name: 'Jeanne D.', dates: '1895–1972' },
            ]} scale={0.7} />
            <Row items={[
              { name: 'Pierre Lefèvre', dates: '1918–1981', job: 'Pêcheur', status: 'Mort en Mer' },
              { name: 'Anne Berthier', dates: '1922–2003', job: 'Couturière' },
              { name: 'Étienne Roux', dates: '1920–1995', job: 'Forgeron' },
              { name: 'Louise Caron', dates: '1925–2010', job: 'Sage-femme' },
            ]} />
            <Row items={[
              { name: 'Jean Lefèvre', dates: '1948–2019', job: 'Charpentier de marine', density: 'rich', status: 'Mort en Mer' },
              { name: 'Marguerite Roux', dates: '1952–', job: 'Institutrice', density: 'rich', living: true },
            ]} />
            <Row items={[{ name: 'Camille Lefèvre', dates: '1981–', job: 'Architecte', density: 'rich', highlight: true, living: true }]} />
          </div>
          {/* connectors layer (simplified) */}
          <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} viewBox="0 0 1000 600" preserveAspectRatio="none">
            <g stroke="var(--line)" strokeWidth="0.6" fill="none">
              <path d="M 250 470 V 510 H 500 V 540 M 750 470 V 510 H 500" />
            </g>
          </svg>
          <Anno x={680} y={20} w={160}>
            arbre = même donnée,<br/>autre lecture (mêmes cartes)
          </Anno>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Vue Timeline
// ─────────────────────────────────────────────────────────────
function ScreenTimeline() {
  const lives = [
    { name: 'Pierre Lefèvre', s: 1918, e: 1981, job: 'Pêcheur', sea: true },
    { name: 'Anne Berthier', s: 1922, e: 2003, job: 'Couturière' },
    { name: 'Étienne Roux', s: 1920, e: 1995, job: 'Forgeron' },
    { name: 'Louise Caron', s: 1925, e: 2010, job: 'Sage-femme' },
    { name: 'Jean Lefèvre', s: 1948, e: 2019, job: 'Charpentier', sea: true },
    { name: 'Marguerite Roux', s: 1952, e: null, job: 'Institutrice' },
    { name: 'Camille Lefèvre', s: 1981, e: null, job: 'Architecte' },
  ];
  const minY = 1900, maxY = 2030;
  const w = 700;
  const px = y => ((y - minY) / (maxY - minY)) * w;

  return (
    <div className="wf" style={{ display: 'flex' }}>
      <Sidebar active="TL" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px 6px', borderBottom: '1px solid var(--line-2)' }}>
          <span className="wf-tag">Éventail</span>
          <span className="wf-tag">Arbre</span>
          <span className="wf-tag solid">Timeline</span>
          <span className="wf-tag">Liste</span>
          <span style={{ marginLeft: 'auto' }} className="wf-mono">événements historiques en arrière-plan</span>
        </div>
        <div style={{ flex: 1, padding: '24px 24px 12px', position: 'relative', overflow: 'hidden' }}>
          {/* axis */}
          <div style={{ position: 'relative', height: 22, marginBottom: 8 }}>
            {[1900, 1920, 1940, 1960, 1980, 2000, 2020].map(y => (
              <div key={y} style={{ position: 'absolute', left: 110 + px(y), top: 0 }}>
                <div style={{ width: 1, height: 8, background: 'var(--line)' }} />
                <div className="wf-mono" style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 2 }}>{y}</div>
              </div>
            ))}
          </div>
          {/* historical event bands */}
          <div style={{ position: 'absolute', left: 110 + px(1914), top: 80,
            width: px(1918) - px(1914), height: 360,
            background: 'rgba(184,89,58,0.06)', border: '1px dashed rgba(184,89,58,0.3)' }}>
            <div className="wf-mono" style={{ fontSize: 8, color: 'var(--accent)', padding: '2px 4px' }}>1914–18</div>
          </div>
          <div style={{ position: 'absolute', left: 110 + px(1939), top: 80,
            width: px(1945) - px(1939), height: 360,
            background: 'rgba(184,89,58,0.06)', border: '1px dashed rgba(184,89,58,0.3)' }}>
            <div className="wf-mono" style={{ fontSize: 8, color: 'var(--accent)', padding: '2px 4px' }}>1939–45</div>
          </div>

          {/* life bars */}
          {lives.map((l, i) => {
            const end = l.e || 2026;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', height: 30, gap: 8 }}>
                <div style={{ width: 110, fontSize: 10.5 }} className="wf-serif">{l.name}</div>
                <div style={{ position: 'relative', width: w, height: 14 }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 6, height: 1, background: 'var(--line-2)' }} />
                  <div style={{ position: 'absolute', left: px(l.s), width: px(end) - px(l.s),
                    top: 0, height: 14,
                    background: 'var(--paper-2)', border: '1px solid var(--ink-2)', borderRadius: 7,
                    display: 'flex', alignItems: 'center', padding: '0 6px',
                    fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--ink-2)',
                    gap: 6 }}>
                    <span>{l.s}</span>
                    <span style={{ flex: 1 }} />
                    {l.sea && <span style={{ color: 'var(--accent)' }}>⚓</span>}
                    <span>{l.e || '·'}</span>
                  </div>
                  {!l.e && (
                    <div style={{ position: 'absolute', left: px(end), top: 4, fontSize: 8, color: 'var(--ink-3)' }}>vivant</div>
                  )}
                </div>
              </div>
            );
          })}

          <Anno x={580} y={70} w={160}>
            événements historiques<br/>en bandes pâles, jamais imposés
          </Anno>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Fiche personne (panneau latéral droit)
// ─────────────────────────────────────────────────────────────
function ScreenPersonPanel() {
  return (
    <div className="wf" style={{ display: 'flex' }}>
      <Sidebar active="EV" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', overflow: 'hidden' }}>
          {/* left: dimmed fan */}
          <div style={{ position: 'relative', overflow: 'hidden', opacity: 0.45 }}>
            <FanSVG palette="gray" cx={300} cy={420} />
          </div>
          {/* right: panel */}
          <aside style={{ borderLeft: '1px solid var(--line)', background: 'var(--paper)',
            padding: '16px 18px', overflowY: 'auto', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="wf-eyebrow">Fiche personne</span>
              <span className="wf-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>esc · ✕</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Portrait size={68} round={false} label="portrait" />
              <div>
                <h2 className="wf-serif" style={{ fontSize: 22, lineHeight: 1, margin: '2px 0 4px', fontWeight: 400 }}>Pierre<br/>Lefèvre</h2>
                <div style={{ fontSize: 11, color: 'var(--ink-2)', fontStyle: 'italic' }}>1842 – 1893, Charpentier de marine</div>
                <div style={{ marginTop: 4 }}>
                  <span className="wf-tag warn">⚓ Mort en Mer</span>
                </div>
              </div>
            </div>

            <div className="wf-divider" style={{ margin: '14px 0' }} />

            {/* Tabs for multiple spouses */}
            <div className="wf-eyebrow" style={{ marginBottom: 6 }}>Conjoints</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <span className="wf-tag solid">Marie Dupont · 1865–1880 · divorce</span>
              <span className="wf-tag">Jeanne Martin · 1882–1893</span>
            </div>

            {/* Vertical timeline */}
            <div className="wf-eyebrow" style={{ marginTop: 12, marginBottom: 6 }}>Vie</div>
            <div style={{ borderLeft: '1px solid var(--line)', marginLeft: 6, paddingLeft: 12, fontSize: 11, color: 'var(--ink-2)' }}>
              {[
                ['1842', 'Naissance', 'Saint-Malo'],
                ['1865', 'Mariage', 'Marie Dupont · Saint-Malo'],
                ['1868', 'Naissance enfant', 'Henri'],
                ['1880', 'Divorce', 'Marie Dupont'],
                ['1882', 'Mariage', 'Jeanne Martin'],
                ['1893', 'Décès en mer', 'Cap Fréhel · ⚓'],
              ].map(([y, t, sub], i) => (
                <div key={i} style={{ position: 'relative', padding: '4px 0' }}>
                  <span style={{ position: 'absolute', left: -17, top: 7, width: 7, height: 7,
                    borderRadius: '50%', background: 'var(--paper)', border: '1px solid var(--ink-2)' }} />
                  <span className="wf-mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginRight: 6 }}>{y}</span>
                  <span className="wf-serif" style={{ color: 'var(--ink)' }}>{t}</span>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 0 }}>{sub}</div>
                </div>
              ))}
            </div>

            <div className="wf-divider" style={{ margin: '14px 0' }} />
            <div className="wf-eyebrow" style={{ marginBottom: 6 }}>Enfants · 3</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Henri', 'Marie-Anne', 'Joseph'].map(n => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 5,
                  border: '1px solid var(--line)', padding: '3px 7px', borderRadius: 12, fontSize: 10 }}>
                  <Portrait size={18} round /> <span>{n}</span>
                </div>
              ))}
            </div>

            <div className="wf-divider" style={{ margin: '14px 0' }} />
            <div className="wf-eyebrow" style={{ marginBottom: 6 }}>Biographie · éditable</div>
            <div style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--ink-2)',
              borderLeft: '2px solid var(--line)', paddingLeft: 8, fontStyle: 'italic' }}>
              Charpentier de marine à Saint-Malo, embarqué sur la goélette <em>Étoile du Nord</em>. Disparu lors d'un coup de vent au large du Cap Fréhel, l'hiver 1893. Cliquer pour éditer…
            </div>

            <div className="wf-divider" style={{ margin: '14px 0' }} />
            <div className="wf-eyebrow" style={{ marginBottom: 6 }}>Documents · 4</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {['acte naissance', 'photo 1885', 'registre paroisse', 'avis décès'].map(l => (
                <div key={l} className="wf-ph" style={{ height: 50, fontSize: 8 }}>{l}</div>
              ))}
            </div>
          </aside>
          <Anno x={690} y={40} w={150}>
            panneau latéral 40%<br/>jamais une modale<br/>arbre reste lisible
          </Anno>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. Ajout / édition personne
// ─────────────────────────────────────────────────────────────
function ScreenAddEdit() {
  const Field = ({ label, value, ph, hint, error, w = '100%' }) => (
    <label style={{ display: 'block', width: w, marginBottom: 12 }}>
      <div className="wf-eyebrow" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{ border: '1px solid ' + (error ? 'var(--accent)' : 'var(--line)'),
        borderRadius: 6, padding: '7px 10px', fontSize: 12, color: value ? 'var(--ink)' : 'var(--ink-3)',
        background: 'var(--paper)' }}>
        {value || ph}
      </div>
      {hint && <div className="wf-mono" style={{ fontSize: 9, color: error ? 'var(--accent)' : 'var(--ink-3)', marginTop: 3 }}>{hint}</div>}
    </label>
  );

  return (
    <div className="wf" style={{ display: 'flex' }}>
      <Sidebar active="EV" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 420px', overflow: 'hidden' }}>
          <div style={{ opacity: 0.4, position: 'relative', overflow: 'hidden' }}>
            <FanSVG palette="gray" cx={300} cy={420} />
          </div>
          <aside style={{ borderLeft: '1px solid var(--line)', background: 'var(--paper)',
            padding: '16px 18px', overflowY: 'auto' }}>
            <div className="wf-eyebrow">Nouvelle personne</div>
            <h2 className="wf-serif" style={{ fontSize: 20, fontWeight: 400, margin: '4px 0 14px' }}>Ajouter à l'arbre</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Prénom" value="Pierre" />
              <Field label="Deuxième prénom" ph="—" />
              <Field label="Nom" value="Lefèvre" />
              <Field label="Genre" value="Masculin" />
            </div>

            <div className="wf-divider" style={{ margin: '8px 0 14px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Naissance" value="14 mars 1842" />
              <Field label="Lieu" value="Saint-Malo" />
              <Field label="Décès" value="hiver 1893" hint="date approximative acceptée" />
              <Field label="Lieu de décès" value="Cap Fréhel" />
            </div>
            <Field label="Statut de décès · texte libre" value="Mort en Mer" hint="↳ affiche un picto ⚓ sur la carte" />

            <div className="wf-divider" style={{ margin: '8px 0 14px' }} />
            <Field label="Profession" value="Charpentier de marine" />
            <Field label="Mariage(s)" ph="+ Ajouter un conjoint (gérer multiples)" />
            <div style={{ display: 'flex', gap: 6, marginTop: -6, marginBottom: 12 }}>
              <span className="wf-tag">Marie Dupont · 1865–1880 · divorce</span>
              <span className="wf-tag">Jeanne Martin · 1882–1893</span>
              <span className="wf-tag" style={{ borderStyle: 'dashed', color: 'var(--ink-3)' }}>+ ajouter</span>
            </div>

            <Field label="Biographie" ph="Quelques mots, histoires, anecdotes…" />
            <Field label="Photo de profil" ph="↑ déposer un fichier ou choisir depuis Documents" />

            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
              <button className="wf-btn ghost">Annuler</button>
              <button className="wf-btn">Enregistrer brouillon</button>
              <button className="wf-btn primary">Ajouter à l'arbre</button>
            </div>

            <div style={{ marginTop: 14, padding: 10, border: '1px dashed var(--line)',
              borderRadius: 6, fontSize: 10, color: 'var(--ink-2)',
              background: 'var(--paper-2)' }}>
              <span className="wf-mono" style={{ color: 'var(--accent-2)' }}>VALIDATION</span><br/>
              Aucune incohérence détectée. La date de décès est approximative — Pistes proposera de l'affiner.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. Photos & Documents (bento)
// ─────────────────────────────────────────────────────────────
function ScreenPhotos() {
  const items = [
    { w: 2, h: 2, l: 'photo · 1912' },
    { w: 1, h: 1, l: 'acte naissance' },
    { w: 1, h: 2, l: 'lettre 1894' },
    { w: 2, h: 1, l: 'mariage 1923' },
    { w: 1, h: 1, l: 'registre' },
    { w: 1, h: 1, l: 'photo · 1948' },
    { w: 1, h: 1, l: 'avis décès' },
    { w: 2, h: 1, l: 'portrait studio' },
    { w: 1, h: 1, l: 'photo · 1962' },
    { w: 1, h: 2, l: 'carnet' },
    { w: 1, h: 1, l: 'photo · 1978' },
    { w: 1, h: 1, l: 'lettre' },
  ];
  return (
    <div className="wf" style={{ display: 'flex' }}>
      <Sidebar active="PH" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div style={{ display: 'flex', gap: 10, padding: '12px 18px', borderBottom: '1px solid var(--line-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="wf-eyebrow">Filtres</span>
          {['Toutes', 'Pierre L.', 'Marguerite R.', 'Branche maternelle', '1900–1950', 'Photos', 'Lettres', 'Actes'].map((t,i) => (
            <span key={t} className={'wf-tag ' + (i === 0 ? 'solid' : '')}>{t}</span>
          ))}
          <span style={{ marginLeft: 'auto' }} className="wf-mono">142 documents</span>
        </div>
        <div style={{ flex: 1, padding: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: '90px', gap: 10 }}>
            {items.map((it, i) => (
              <div key={i} className="wf-ph"
                style={{ gridColumn: `span ${it.w}`, gridRow: `span ${it.h}`,
                  borderRadius: 6, fontSize: 9, padding: 8, alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                {it.l}
              </div>
            ))}
          </div>
          <Anno x={520} y={120} w={170}>
            glisser sur une fiche<br/>= rattacher le document
          </Anno>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. Pistes (Hints)
// ─────────────────────────────────────────────────────────────
function ScreenHints() {
  const hints = [
    { type: 'Doublon', sev: 'warn', title: 'Jean Lefèvre apparaît deux fois', sub: 'Naissance 1842 · Saint-Malo · DuplicateDetectionService', cta: 'Fusionner' },
    { type: 'Date', sev: 'warn', title: 'Mariage avant naissance', sub: 'Anne Berthier · mariage en 1918, née 1922', cta: 'Corriger' },
    { type: 'Branche', sev: '', title: 'Branche orpheline · 3 personnes', sub: 'Aucune relation connue avec l\'arbre principal', cta: 'Rattacher' },
    { type: 'Visage', sev: '', title: 'Photo sans visage identifié', sub: 'Mariage 1923 · 7 personnes non taggées', cta: 'Identifier' },
    { type: 'Lieu', sev: 'cool', title: 'Lieu mal orthographié ?', sub: 'St-Malo, St Malo, Saint-Malo · 4 fiches concernées', cta: 'Normaliser' },
  ];
  return (
    <div className="wf" style={{ display: 'flex' }}>
      <Sidebar active="PI" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div style={{ flex: 1, padding: '24px 32px', overflow: 'hidden' }}>
          <div className="wf-eyebrow">Pistes</div>
          <h1 className="wf-serif" style={{ fontSize: 26, fontWeight: 400, margin: '4px 0 4px', lineHeight: 1.1 }}>
            5 suggestions à examiner
          </h1>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', maxWidth: 480, margin: '0 0 18px' }}>
            Détectées automatiquement à partir des données existantes. Chaque piste peut être ignorée ou archivée — rien n'est modifié sans votre accord.
          </p>
          <div>
            {hints.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 4px', borderTop: '1px solid var(--line-2)' }}>
                <span className={'wf-tag ' + (h.sev || '')} style={{ minWidth: 90 }}>{h.type}</span>
                <div style={{ flex: 1 }}>
                  <div className="wf-serif" style={{ fontSize: 14 }}>{h.title}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{h.sub}</div>
                </div>
                <button className="wf-btn ghost" style={{ fontSize: 10 }}>Ignorer</button>
                <button className="wf-btn">{h.cta}</button>
              </div>
            ))}
          </div>
          <Anno x={620} y={80} w={170}>
            tri par sévérité +<br/>par fraîcheur · archivable
          </Anno>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. Recherche globale ⌘K
// ─────────────────────────────────────────────────────────────
function ScreenSearch() {
  const sections = [
    ['Personnes', [
      ['Pierre Lefèvre', '1842–1893 · Charpentier · Saint-Malo'],
      ['Pierre Lefèvre', '1918–1981 · Pêcheur · Cancale'],
      ['Pierre-Marie Lefèvre', '1788–1849 · Cordier'],
    ]],
    ['Lieux', [
      ['Saint-Malo', '14 personnes · 4 générations'],
      ['Cap Fréhel', '2 événements · ⚓ décès en mer'],
    ]],
    ['Métiers', [
      ['Charpentier de marine', '6 personnes'],
    ]],
    ['Documents', [
      ['Acte de mariage 1865 · Pierre × Marie', 'PDF · 2 pages'],
    ]],
  ];
  return (
    <div className="wf" style={{ display: 'flex', position: 'relative' }}>
      <Sidebar active="EV" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', filter: 'blur(1px) brightness(0.92)', opacity: 0.6 }}>
        <Topbar />
        <div style={{ flex: 1, position: 'relative' }}>
          <FanSVG palette="gray" cx={300} cy={420} />
        </div>
      </div>
      {/* dim overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,15,0.32)' }} />
      {/* command palette */}
      <div style={{ position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)',
        width: 540, background: 'var(--paper)', borderRadius: 10,
        border: '1px solid var(--line)', boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--line-2)' }}>
          <span className="wf-mono" style={{ color: 'var(--ink-3)' }}>⌕</span>
          <span style={{ fontSize: 14 }} className="wf-serif">pierre</span>
          <span style={{ width: 1, height: 14, background: 'var(--ink)', animation: 'none' }} />
          <span className="wf-mono" style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--ink-3)' }}>esc</span>
        </div>
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {sections.map(([title, items], i) => (
            <div key={i}>
              <div className="wf-eyebrow" style={{ padding: '10px 16px 4px' }}>{title}</div>
              {items.map(([t, sub], j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 16px',
                  background: i === 0 && j === 0 ? 'var(--paper-2)' : 'transparent' }}>
                  <Portrait size={22} round />
                  <div style={{ flex: 1 }}>
                    <div className="wf-serif" style={{ fontSize: 13 }}>{t}</div>
                    <div className="wf-mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{sub}</div>
                  </div>
                  {i === 0 && j === 0 && <span className="wf-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>↩</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, padding: '8px 16px', borderTop: '1px solid var(--line-2)',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)' }}>
          <span>↑↓ naviguer</span><span>↩ ouvrir</span><span>⌘+↩ panneau</span><span>⌘+. pistes</span>
        </div>
      </div>
      <Anno x={20} y={80} w={140}>
        ⌘K depuis n'importe où · résultats catégorisés
      </Anno>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. Composants atomiques
// ─────────────────────────────────────────────────────────────
function ScreenComponents() {
  const Box = ({ title, hint, mui, children }) => (
    <div style={{ border: '1px dashed var(--line)', borderRadius: 8, padding: 12, position: 'relative' }}>
      <div className="wf-eyebrow" style={{ marginBottom: 8 }}>{title}</div>
      {children}
      {hint && <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 8, fontStyle: 'italic' }}>{hint}</div>}
      {mui && <span className="wf-tag cool" style={{ position: 'absolute', top: 10, right: 10, fontSize: 7.5 }}>{mui}</span>}
    </div>
  );
  return (
    <div className="wf" style={{ overflow: 'auto' }}>
      <div style={{ padding: '24px 32px' }}>
        <div className="wf-eyebrow">Système</div>
        <h1 className="wf-serif" style={{ fontSize: 28, fontWeight: 400, margin: '4px 0 18px' }}>
          Composants atomiques
          <span style={{ color: 'var(--ink-3)', fontStyle: 'italic', fontSize: 16 }}> · indication MUI vs custom</span>
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <Box title="Carte personne · 3 densités" mui="custom">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <PersonChip name="Pierre L." dates="1842–1893" density="min" width={90} />
              <PersonChip name="Pierre L." dates="1842–1893" density="med" />
              <PersonChip name="Pierre L." dates="1842–1893" job="Charpentier" status="Mort en Mer" density="rich" />
            </div>
          </Box>
          <Box title="Tag relation · 13 types" mui="MUI Chip">
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {['Parent','Enfant','Conjoint','Frère','Grand-parent','Petit-enfant','Oncle','Tante','Cousin','Beau-parent','Bel-enfant','P. adoptif','E. adopté'].map(t => (
                <span key={t} className="wf-tag">{t}</span>
              ))}
            </div>
          </Box>
          <Box title="Statut décès · texte libre" mui="custom">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="wf-tag warn">⚓ Mort en Mer</span>
              <span className="wf-tag warn">† Tombé en 1916</span>
              <span className="wf-tag warn">⚱ Disparue</span>
            </div>
          </Box>
          <Box title="Toolbar flottante éventail" mui="custom">
            <div style={{ display: 'inline-flex', border: '1px solid var(--line)', borderRadius: 8, padding: '4px 6px', fontFamily: 'var(--font-mono)', fontSize: 11, gap: 8 }}>
              <span>−</span><span>100%</span><span>+</span><span>|</span><span>⇄</span><span>5G</span><span>⌘E</span>
            </div>
          </Box>
          <Box title="Champ de formulaire" mui="MUI TextField">
            <div style={{ border: '1px solid var(--line)', borderRadius: 6, padding: '7px 10px', fontSize: 12 }}>
              Saint-Malo
            </div>
            <div className="wf-mono" style={{ fontSize: 9, color: 'var(--ink-3)', marginTop: 3 }}>↳ autocomplétion lieux</div>
          </Box>
          <Box title="Boutons" mui="MUI Button">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button className="wf-btn primary">Ajouter</button>
              <button className="wf-btn">Annuler</button>
              <button className="wf-btn ghost">Ignorer</button>
            </div>
          </Box>
          <Box title="Onglets conjoints" mui="custom">
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="wf-tag solid">Marie · 1865–1880 · divorce</span>
              <span className="wf-tag">Jeanne · 1882–1893</span>
            </div>
          </Box>
          <Box title="Mini-map éventail" mui="custom">
            <svg width="120" height="80" viewBox="0 0 120 80">
              <path d={arcPath(60, 70, 8, 38, -90, 90)} fill="var(--paper-2)" stroke="var(--line)" strokeWidth="0.5" />
              <rect x={28} y={28} width={42} height={26} fill="none" stroke="var(--accent)" />
            </svg>
          </Box>
          <Box title="Cellule recherche ⌘K" mui="custom">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 6, background: 'var(--paper-2)', borderRadius: 5 }}>
              <Portrait size={22} round />
              <div style={{ flex: 1 }}>
                <div className="wf-serif" style={{ fontSize: 12 }}>Pierre Lefèvre</div>
                <div className="wf-mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>1842–1893</div>
              </div>
              <span className="wf-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>↩</span>
            </div>
          </Box>
        </div>

        <div className="wf-divider" style={{ margin: '24px 0' }} />
        <div className="wf-eyebrow">Notes d'accessibilité</div>
        <ul style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--ink-2)', margin: '6px 0', paddingLeft: 20 }}>
          <li>WCAG AA · contraste vérifié sur les 3 palettes (gris / chaude / sombre)</li>
          <li>Éventail SVG : <code className="wf-mono">role="tree"</code>, chaque secteur <code className="wf-mono">role="treeitem"</code> avec aria-level = génération</li>
          <li>Navigation clavier : flèches pour changer de secteur, ↑/↓ génération, Entrée pour ouvrir le panneau</li>
          <li>Lecteur d'écran annonce : nom, dates, lien de parenté avec l'ego, statut</li>
          <li>Raccourcis visibles partout (footer ou tooltip ⌘?)</li>
        </ul>

        <div className="wf-divider" style={{ margin: '24px 0' }} />
        <div className="wf-eyebrow">Zones desktop-only à repenser pour mobile</div>
        <ul style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--ink-2)', margin: '6px 0', paddingLeft: 20 }}>
          <li>Panneau latéral 40% → bottom-sheet 80% sur mobile, swipe pour fermer</li>
          <li>Éventail 5 générations → 3 max en portrait, geste pinch-to-zoom essentiel</li>
          <li>Toolbar flottante → barre du bas fixe avec 3 actions principales</li>
          <li>Mini-map masquée par défaut, accessible via long-press</li>
          <li>⌘K → bouton recherche en topbar, plein écran à l'ouverture</li>
        </ul>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenDashboard, ScreenTree, ScreenTimeline, ScreenPersonPanel,
  ScreenAddEdit, ScreenPhotos, ScreenHints, ScreenSearch, ScreenComponents,
});
