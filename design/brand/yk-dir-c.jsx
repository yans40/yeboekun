// Yeboekun — Direction C : Sceau / cachet d'éditeur
// Pictogramme Sankofa inscrit dans un cercle, wordmark en capitales tracking large.

const { Y, COR, MONO, Eyebrow, Section, Tile,
        WordmarkC, SankofaC, DirectionHeader } = window.YK;

function DirC() {
  return (
    <Section tone="paper" id="direction-c" style={{padding: '120px 96px'}}>
      <DirectionHeader
        letter="C"
        name="Sceau d'éditeur"
        accent={Y.rust}
        subtitle="Composition centrée verticale. Pictogramme circulaire qui évoque le sceau, le cachet, la marque imprimée. Wordmark en capitales tracking large, comme une devise gravée. Plus institutionnel, plus solennel."
        ref="Sceaux d'éditeurs anciens, marques d'imprimeurs du XVIᵉ. Logo de la NRF, blasons de bibliothèques. Une forme close, dense, à laquelle on ne peut rien ajouter."
      />

      <Tile tone="paper" label="Composition principale · sceau centré" code="C.01"
        style={{minHeight: 420, padding: 80}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32}}>
          <SankofaC size={144} color={Y.ink} accent={Y.rust} stroke={1.6}/>
          <div style={{width: 40, height: 1, background: Y.line}}/>
          <WordmarkC size={22}/>
        </div>
      </Tile>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16}}>
        <Tile tone="paper" label="Sceau seul" code="C.02">
          <SankofaC size={88} color={Y.ink} accent={Y.rust} stroke={1.6}/>
        </Tile>
        <Tile tone="paper" label="Horizontal · usage in-line" code="C.03">
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <SankofaC size={48} color={Y.ink} accent={Y.rust} stroke={1.8}/>
            <WordmarkC size={16}/>
          </div>
        </Tile>
        <Tile tone="paper" label="Empilé compact" code="C.04">
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
            <SankofaC size={64} color={Y.ink} accent={Y.rust} stroke={1.8}/>
            <WordmarkC size={13}/>
          </div>
        </Tile>
      </div>

      <div style={{marginTop: 64, marginBottom: 24}}>
        <Eyebrow>Études de tagline</Eyebrow>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
        {[
          ['Nous avons un socle commun', 'la traduction littérale'],
          ['L\'histoire en partage', 'le plus institutionnel'],
          ['La mémoire des liens', 'le plus poétique'],
        ].map(([t, n], i) => (
          <Tile key={t} tone={i===1?'ivory':'paper'} label={`Tagline ${String.fromCharCode(945+i)}`} code={`C.0${5+i}`}
            style={{padding: 48}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
              <SankofaC size={68} color={Y.ink} accent={Y.rust} stroke={1.6}/>
              <div style={{width: 32, height: 1, background: Y.line}}/>
              <WordmarkC size={15}/>
              <div style={{
                fontFamily: COR, fontSize: 14, fontStyle: 'italic',
                color: Y.ink2, marginTop: 8, textAlign: 'center',
              }}>« {t} »</div>
              <div style={{fontFamily: MONO, fontSize: 9, color: Y.ink4, letterSpacing: '0.06em'}}>note · {n}</div>
            </div>
          </Tile>
        ))}
      </div>

      <div style={{marginTop: 64, marginBottom: 24}}>
        <Eyebrow>Déclinaisons techniques</Eyebrow>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16}}>
        <Tile tone="paper" label="App icon · 512" code="C.08" style={{minHeight: 200}}>
          <div style={{
            width: 160, height: 160, background: Y.ivory,
            border: `1px solid ${Y.line2}`, borderRadius: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(40,28,12,0.12)',
          }}>
            <SankofaC size={120} color={Y.ink} accent={Y.rust} stroke={2}/>
          </div>
        </Tile>
        <Tile tone="paper" label="Favicon · 32" code="C.09" style={{minHeight: 200}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center'}}>
            <div style={{padding: 8, background: Y.ivory, border: `1px solid ${Y.line2}`}}>
              <SankofaC size={32} color={Y.ink} accent={Y.rust} stroke={2}/>
            </div>
            <div style={{fontFamily: MONO, fontSize: 9, color: Y.ink4, letterSpacing: '0.05em'}}>32 × 32 px</div>
          </div>
        </Tile>
        <Tile tone="paper" label="Inversé" code="C.10" style={{minHeight: 200, background: Y.ink}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
            <SankofaC size={88} color={Y.ivory} accent="#D9764A" stroke={1.6}/>
            <WordmarkC size={12} color={Y.ivory}/>
          </div>
        </Tile>
        <Tile tone="paper" label="Monochrome" code="C.11" style={{minHeight: 200}}>
          <SankofaC size={88} color={Y.ink} accent={Y.ink} stroke={1.6}/>
        </Tile>
      </div>

      <div style={{marginTop: 16}}>
        <Tile tone="ivory" label="TopBar · 48 px" code="C.12"
          style={{padding: 0, minHeight: 0, alignItems: 'stretch'}}>
          <div style={{
            height: 48, padding: '0 18px', display: 'flex', alignItems: 'center', gap: 14,
            borderBottom: `1px solid ${Y.line2}`, width: '100%',
            background: `linear-gradient(${Y.cream}, ${Y.ivory})`,
          }}>
            <SankofaC size={28} color={Y.ink} accent={Y.rust} stroke={2}/>
            <WordmarkC size={11}/>
            <span style={{
              fontFamily: MONO, fontSize: 10, color: Y.ink3,
              letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: 18,
            }}>Famille Lefèvre</span>
            <span style={{flex: 1}}/>
            <span style={{fontFamily: MONO, fontSize: 10, color: Y.ink4, letterSpacing: '0.05em'}}>chapitre · Album</span>
          </div>
        </Tile>
      </div>

      <div style={{marginTop: 16}}>
        <Tile tone="ivory" label="Splash 1440 × 900" code="C.13"
          style={{minHeight: 0, padding: 0}}>
          <div style={{
            width: '100%', aspectRatio: '1440/900', background: Y.ivory,
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${Y.line2}`,
          }}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36}}>
              <SankofaC size={196} color={Y.ink} accent={Y.rust} stroke={1.6}/>
              <div style={{width: 56, height: 1, background: Y.line}}/>
              <WordmarkC size={28}/>
              <span style={{
                fontFamily: COR, fontSize: 18, fontStyle: 'italic',
                color: Y.ink2, marginTop: 4,
              }}>« Nous avons un socle commun. »</span>
            </div>
            <span style={{
              position: 'absolute', bottom: 32, right: 48,
              fontFamily: MONO, fontSize: 10, color: Y.ink3, letterSpacing: '0.1em',
            }}>v 1.0 · MMXXVI</span>
          </div>
        </Tile>
      </div>

      <div style={{
        marginTop: 64, padding: '48px 0', borderTop: `1px solid ${Y.line}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48,
      }}>
        <div>
          <Eyebrow>Symbole retenu</Eyebrow>
          <p style={{fontFamily: COR, fontSize: 15, lineHeight: 1.6, color: Y.ink2, margin: '12px 0 0'}}>
            <strong style={{color: Y.ink}}>Sankofa</strong>, inscrit dans un cercle. La forme close évoque le sceau, le cachet d'éditeur, la médaille de bibliothèque. L'œuf, en rouille, perce le tracé comme une marque d'encre.
          </p>
        </div>
        <div>
          <Eyebrow>Construction</Eyebrow>
          <p style={{fontFamily: COR, fontSize: 15, lineHeight: 1.6, color: Y.ink2, margin: '12px 0 0'}}>
            Cercle extérieur de rayon 28 sur grille 64. Oiseau inscrit dans la moitié supérieure, tracé monoline 1.6 unités. L'œuf, à 9h, est tangent au cercle intérieur du tracé. Symétrie verticale conservée pour la base (pattes).
          </p>
        </div>
        <div>
          <Eyebrow>Espace de protection</Eyebrow>
          <p style={{fontFamily: COR, fontSize: 15, lineHeight: 1.6, color: Y.ink2, margin: '12px 0 0'}}>
            Marge égale à 1/4 du diamètre du sceau. Cette zone reste blanche (ivoire), même sur fond coloré. Le wordmark se positionne à au moins 1/2 diamètre sous le sceau, jamais à côté.
          </p>
        </div>
      </div>
    </Section>
  );
}

window.DirC = DirC;
