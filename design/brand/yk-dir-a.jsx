// Yeboekun — Direction A : Sankofa éditorial
// Pictogramme Sankofa monoline + Cormorant regular. Sépia en accent.

const { Y, COR, MONO, Eyebrow, Section, Tile,
        WordmarkA, SankofaA, DirectionHeader } = window.YK;

function DirA() {
  return (
    <Section tone="ivory" id="direction-a" style={{padding: '120px 96px'}}>
      <DirectionHeader
        letter="A"
        name="Sankofa éditorial"
        accent={Y.sepia}
        subtitle="Pictogramme Sankofa épuré, dissocié du wordmark. Composition latérale calme, presque institutionnelle. La marque parle à voix basse."
        ref="Gallimard, Folio Histoire, Bibliothèque nationale. La sobriété d'un colophon d'éditeur sérieux. Le pictogramme se fait reconnaître seulement pour qui en connaît la grammaire."
      />

      {/* Hero composition */}
      <Tile tone="ivory" label="Composition principale · pictogramme + wordmark" code="A.01"
        style={{minHeight: 360, padding: 80}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
          <SankofaA size={120} color={Y.ink} accent={Y.sepia} stroke={2.2}/>
          <div style={{width: 1, height: 88, background: Y.line2}}/>
          <WordmarkA size={92}/>
        </div>
      </Tile>

      {/* Three lockups */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16}}>
        <Tile tone="ivory" label="Horizontal" code="A.02">
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <SankofaA size={64} color={Y.ink} accent={Y.sepia} stroke={2}/>
            <WordmarkA size={48}/>
          </div>
        </Tile>
        <Tile tone="ivory" label="Empilé centré" code="A.03">
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
            <SankofaA size={72} color={Y.ink} accent={Y.sepia} stroke={2}/>
            <WordmarkA size={40}/>
          </div>
        </Tile>
        <Tile tone="ivory" label="Wordmark seul · italique" code="A.04">
          <WordmarkA size={48} italic/>
        </Tile>
      </div>

      {/* Tagline studies */}
      <div style={{marginTop: 64, marginBottom: 24}}>
        <Eyebrow>Études de tagline · 03 propositions</Eyebrow>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
        {[
          ['Nos racines en commun', 'le plus direct'],
          ['L\'histoire en partage', 'le plus collectif'],
          ['La mémoire des liens', 'le plus émotif'],
        ].map(([t, n], i) => (
          <Tile key={t} tone={i===1?'cream':'ivory'} label={`Tagline ${String.fromCharCode(945+i)}`} code={`A.0${5+i}`}
            style={{padding: 48}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18}}>
              <SankofaA size={48} color={Y.ink} accent={Y.sepia} stroke={1.8}/>
              <WordmarkA size={42}/>
              <div style={{
                fontFamily: MONO, fontSize: 11, color: Y.ink2,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                paddingTop: 8, borderTop: `1px solid ${Y.line2}`, alignSelf: 'stretch',
              }}>{t}</div>
              <div style={{fontFamily: MONO, fontSize: 9, color: Y.ink4, letterSpacing: '0.06em'}}>note · {n}</div>
            </div>
          </Tile>
        ))}
      </div>

      {/* Technical declensions */}
      <div style={{marginTop: 64, marginBottom: 24}}>
        <Eyebrow>Déclinaisons techniques</Eyebrow>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16}}>
        <Tile tone="ivory" label="App icon · 512" code="A.08" style={{minHeight: 200}}>
          <div style={{
            width: 160, height: 160, background: Y.ivory,
            border: `1px solid ${Y.line2}`, borderRadius: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(40,28,12,0.12)',
          }}>
            <SankofaA size={108} color={Y.ink} accent={Y.sepia} stroke={2.4}/>
          </div>
        </Tile>
        <Tile tone="ivory" label="Favicon · 32" code="A.09" style={{minHeight: 200}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center'}}>
            <div style={{padding: 12, background: Y.cream, border: `1px solid ${Y.line2}`}}>
              <SankofaA size={32} color={Y.ink} accent={Y.sepia} stroke={2.6}/>
            </div>
            <div style={{fontFamily: MONO, fontSize: 9, color: Y.ink4, letterSpacing: '0.05em'}}>32 × 32 px</div>
          </div>
        </Tile>
        <Tile tone="ivory" label="Inversé" code="A.10" style={{minHeight: 200, background: Y.ink}}>
          <SankofaA size={88} color={Y.ivory} accent="#D9A56A" stroke={2}/>
        </Tile>
        <Tile tone="ivory" label="Monochrome" code="A.11" style={{minHeight: 200}}>
          <SankofaA size={88} color={Y.ink} accent={Y.ink} stroke={2}/>
        </Tile>
      </div>

      {/* TopBar */}
      <div style={{marginTop: 16}}>
        <Tile tone="cream" label="TopBar application · hauteur 48 px" code="A.12"
          style={{padding: 0, minHeight: 0, alignItems: 'stretch'}}>
          <div style={{
            height: 48, padding: '0 18px', display: 'flex', alignItems: 'center', gap: 14,
            borderBottom: `1px solid ${Y.line2}`, width: '100%',
            background: `linear-gradient(${Y.cream}, ${Y.ivory})`,
          }}>
            <SankofaA size={22} color={Y.ink} accent={Y.sepia} stroke={2.4}/>
            <span style={{fontFamily: COR, fontSize: 18, color: Y.ink, fontWeight: 500, letterSpacing: '-0.01em'}}>Yeboekun</span>
            <span style={{
              fontFamily: MONO, fontSize: 10, color: Y.ink3,
              letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: 18,
            }}>Famille Lefèvre</span>
            <span style={{flex: 1}}/>
            <span style={{fontFamily: MONO, fontSize: 10, color: Y.ink4, letterSpacing: '0.05em'}}>chapitre actuel · Atelier</span>
          </div>
        </Tile>
      </div>

      {/* Splash */}
      <div style={{marginTop: 16}}>
        <Tile tone="ivory" label="Splash 1440 × 900 · ouverture de l'application" code="A.13"
          style={{minHeight: 0, padding: 0}}>
          <div style={{
            width: '100%', aspectRatio: '1440/900', background: Y.ivory,
            position: 'relative', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', padding: '64px 96px',
            border: `1px solid ${Y.line2}`,
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <SankofaA size={56} color={Y.ink} accent={Y.sepia} stroke={2}/>
              <span style={{fontFamily: MONO, fontSize: 10, color: Y.ink3, letterSpacing: '0.1em'}}>v 1.0 · 2026</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
              <span style={{
                fontFamily: COR, fontStyle: 'italic', fontWeight: 500,
                fontSize: 124, lineHeight: 0.9, color: Y.ink,
                letterSpacing: '-0.025em',
              }}>Yeboekun.</span>
              <span style={{
                fontFamily: MONO, fontSize: 13, color: Y.ink2,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                marginTop: 24, paddingLeft: 4,
              }}>Nos racines en commun</span>
            </div>
          </div>
        </Tile>
      </div>

      {/* Construction notes */}
      <div style={{
        marginTop: 64, padding: '48px 0', borderTop: `1px solid ${Y.line}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48,
      }}>
        <div>
          <Eyebrow>Symbole retenu</Eyebrow>
          <p style={{fontFamily: COR, fontSize: 15, lineHeight: 1.6, color: Y.ink2, margin: '12px 0 0'}}>
            <strong style={{color: Y.ink}}>Sankofa.</strong> L'oiseau qui se retourne pour reprendre l'œuf qu'il a laissé derrière lui — emblème akan de la mémoire qu'on revient chercher. Lecture exacte pour une app de généalogie : on regarde en arrière pour comprendre devant.
          </p>
        </div>
        <div>
          <Eyebrow>Construction</Eyebrow>
          <p style={{fontFamily: COR, fontSize: 15, lineHeight: 1.6, color: Y.ink2, margin: '12px 0 0'}}>
            Tracé sur grille 64×64. Trait constant 2 px (proportion 1/32). Corps en arc continu, tête séparée par une rupture nette à 90°. Œuf circulaire indépendant, accent sépia, posé devant le bec.
          </p>
        </div>
        <div>
          <Eyebrow>Espace de protection</Eyebrow>
          <p style={{fontFamily: COR, fontSize: 15, lineHeight: 1.6, color: Y.ink2, margin: '12px 0 0'}}>
            Marge minimale égale à la hauteur de l'œuf (≈ 8 px sur grille 64). Aucun élément graphique dans cette zone. Sur fond photographique, accompagner d'un voile crème à 70 %.
          </p>
        </div>
      </div>
    </Section>
  );
}

window.DirA = DirA;
