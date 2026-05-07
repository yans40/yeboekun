// Main app — assembles all screens into the design canvas with Tweaks.

const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakSlider, TweakToggle } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "gray",
  "density": "med",
  "depth": 5,
  "showAnnotations": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const palette = tweaks.palette;

  // Apply palette class globally to all artboards via CSS scope.
  // We pass `palette` to the Fan variants and let them recolor.
  // For non-fan screens, we toggle a class on .wf root.

  React.useEffect(() => {
    document.body.style.setProperty('--canvas-pal', palette);
  }, [palette]);

  // Wrap each artboard's content with a palette class so swatches change live.
  const wrap = (node) => (
    <div className={'wf ' + (palette === 'dark' ? 'dark' : palette === 'cool' ? 'cool' : '')}
      style={{ width: '100%', height: '100%' }}>
      {node}
    </div>
  );

  return (
    <>
      <DesignCanvas>
        {/* SECTION 1 — Vision & système */}
        <DCSection id="intro" title="GegeDot · Wireframes" subtitle="Atelier de l'historien moderne — 10 écrans, 4 variantes éventail, 3 palettes">
          <DCArtboard id="cover" label="00 · Manifeste" width={760} height={520}>
            <div className="wf" style={{ padding: '40px 44px' }}>
              <div className="wf-eyebrow">GegeDot · 2026</div>
              <h1 className="wf-serif" style={{ fontSize: 44, fontWeight: 400, lineHeight: 1.05, margin: '6px 0 12px', maxWidth: 580 }}>
                Une bibliothèque feutrée<br/>
                <span style={{ fontStyle: 'italic', color: 'var(--ink-3)' }}>pour explorer sa famille.</span>
              </h1>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 520, margin: '0 0 20px' }}>
                Wireframes haute-fidélité — gris chauds par défaut, deux palettes colorées proposées, mode sombre. Typographie : <span className="wf-serif">Fraunces</span> pour les patronymes, <span style={{ fontFamily: 'Geist' }}>Geist</span> pour l'UI. Aucun parchemin, aucun blason, aucune police gothique.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 24 }}>
                {[
                  ['Ivoire', '#F8F5F0'], ['Encre', '#1A1A1F'],
                  ['Sépia', '#B8593A'], ['Mousse', '#6B7C5A'],
                ].map(([n, c]) => (
                  <div key={n} style={{ border: '1px solid var(--line)', borderRadius: 6, padding: 8, background: 'var(--paper)' }}>
                    <div style={{ width: '100%', height: 30, background: c, borderRadius: 3, border: '1px solid var(--line-2)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span className="wf-serif" style={{ fontSize: 11 }}>{n}</span>
                      <span className="wf-mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{c}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="wf-divider" style={{ margin: '20px 0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                <div>
                  <div className="wf-eyebrow" style={{ marginBottom: 4 }}>Identité</div>
                  Vue éventail comme signature — déclinée en 4 variantes (demi-cercle, cercle complet, hybride, compressé).
                </div>
                <div>
                  <div className="wf-eyebrow" style={{ marginBottom: 4 }}>Données</div>
                  Modèle respecté à la lettre — 13 types de relation, statut décès libre, conjoints multiples avec fenêtres temporelles. Pas d'ADN, pas d'origines géographiques.
                </div>
                <div>
                  <div className="wf-eyebrow" style={{ marginBottom: 4 }}>Ton</div>
                  Sobre. Digne. La mort, la mer, les divorces — traités sans morbidité ni mièvrerie.
                </div>
              </div>
            </div>
          </DCArtboard>
        </DCSection>

        {/* SECTION 2 — Hub et hero */}
        <DCSection id="hub" title="Tableau de bord & vue principale" subtitle="L'ouverture de l'app et son écran-héros">
          <DCArtboard id="dash" label="01 · Dashboard d'accueil" width={1100} height={720}>
            {wrap(<ScreenDashboard />)}
          </DCArtboard>
          <DCArtboard id="fanA" label="02 · Éventail · demi-cercle (par défaut)" width={1100} height={720}>
            {wrap(<FanVariantA palette={palette} />)}
          </DCArtboard>
        </DCSection>

        {/* SECTION 3 — Variantes Éventail */}
        <DCSection id="fans" title="Vue éventail · 4 variantes" subtitle="Demi-cercle, cercle complet, hybride, compressé. Toutes commutables d'un clic depuis la même donnée.">
          <DCArtboard id="fanB" label="A · Cercle complet (asc + desc)" width={1100} height={720}>
            {wrap(<FanVariantB palette={palette} />)}
          </DCArtboard>
          <DCArtboard id="fanC" label="B · Hybride éventail ↔ arbre" width={1100} height={720}>
            {wrap(<FanVariantC palette={palette} />)}
          </DCArtboard>
          <DCArtboard id="fanD" label="C · Compression intelligente" width={1100} height={720}>
            {wrap(<FanVariantD palette={palette} />)}
          </DCArtboard>
        </DCSection>

        {/* SECTION 4 — Autres vues du même canvas */}
        <DCSection id="views" title="Autres vues · même donnée" subtitle="Arbre vertical et timeline — transitions animées entre vues.">
          <DCArtboard id="tree" label="03 · Arbre vertical" width={1100} height={720}>
            {wrap(<ScreenTree />)}
          </DCArtboard>
          <DCArtboard id="timeline" label="04 · Timeline" width={1100} height={720}>
            {wrap(<ScreenTimeline />)}
          </DCArtboard>
        </DCSection>

        {/* SECTION 5 — Fiche & édition */}
        <DCSection id="person" title="Fiche personne & édition" subtitle="Toujours en panneau latéral droit — l'arbre reste lisible derrière.">
          <DCArtboard id="panel" label="05 · Fiche personne (panneau)" width={1100} height={720}>
            {wrap(<ScreenPersonPanel />)}
          </DCArtboard>
          <DCArtboard id="edit" label="06 · Ajout / édition" width={1100} height={720}>
            {wrap(<ScreenAddEdit />)}
          </DCArtboard>
        </DCSection>

        {/* SECTION 6 — Outils */}
        <DCSection id="tools" title="Outils · Photos, Pistes, Recherche" subtitle="Le mur de souvenirs, l'IA bienveillante, et la palette ⌘K.">
          <DCArtboard id="photos" label="07 · Photos & Documents" width={1100} height={720}>
            {wrap(<ScreenPhotos />)}
          </DCArtboard>
          <DCArtboard id="hints" label="08 · Pistes (Hints)" width={1100} height={720}>
            {wrap(<ScreenHints />)}
          </DCArtboard>
          <DCArtboard id="search" label="09 · Recherche globale ⌘K" width={1100} height={720}>
            {wrap(<ScreenSearch />)}
          </DCArtboard>
        </DCSection>

        {/* SECTION 7 — Système */}
        <DCSection id="components" title="Composants atomiques & notes" subtitle="Vocabulaire visuel partagé, accessibilité, mobile à venir.">
          <DCArtboard id="comp" label="10 · Composants & accessibilité" width={1100} height={780}>
            {wrap(<ScreenComponents />)}
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <TweakRadio
            label="Couleurs"
            value={tweaks.palette}
            onChange={v => setTweak('palette', v)}
            options={[
              { value: 'gray', label: 'Gris' },
              { value: 'warm', label: 'Sépia' },
              { value: 'cool', label: 'Ardoise' },
              { value: 'dark', label: 'Sombre' },
            ]}
          />
        </TweakSection>
        <TweakSection label="Carte personne">
          <TweakRadio
            label="Densité"
            value={tweaks.density}
            onChange={v => setTweak('density', v)}
            options={[
              { value: 'min', label: 'Minimal' },
              { value: 'med', label: 'Moyen' },
              { value: 'rich', label: 'Riche' },
            ]}
          />
        </TweakSection>
        <TweakSection label="Éventail">
          <TweakSlider
            label="Profondeur (générations)"
            min={3} max={6} step={1}
            value={tweaks.depth}
            onChange={v => setTweak('depth', v)}
          />
          <TweakToggle
            label="Annotations visibles"
            value={tweaks.showAnnotations}
            onChange={v => setTweak('showAnnotations', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
