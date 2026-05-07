// Yeboekun — Direction B : Y monogramme custom
// La lettre Y devient elle-même un Sankofa. Pas de pictogramme séparé.

const { Y, COR, MONO, Eyebrow, Section, Tile,
        WordmarkA, WordmarkB, YSankofa, DirectionHeader } = window.YK;

function DirB() {
  return (
    <Section tone="cream" id="direction-b" style={{padding: '120px 96px'}}>
      <DirectionHeader
        letter="B"
        name="Y monogramme"
        accent={Y.sepia}
        subtitle="Pas de pictogramme séparé. La lettre Y du wordmark se courbe d'elle-même comme la tête de Sankofa : l'œuf est posé dans le creux du V. Économie totale."
        ref="Aesop, Apartamento, Are.na. Le geste est dans la lettre, pas à côté. La marque tient en un seul signe."
      />

      <Tile tone="cream" label="Wordmark à monogramme intégré · italique" code="B.01"
        style={{minHeight: 360, padding: 80}}>
        <WordmarkB size={132} color={Y.ink} accent={Y.sepia}/>
      </Tile>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16}}>
        <Tile tone="cream" label="Compact" code="B.02">
          <WordmarkB size={56} color={Y.ink} accent={Y.sepia}/>
        </Tile>
        <Tile tone="cream" label="Détail · le Y seul" code="B.03">
          <YSankofa size={140} color={Y.ink} accent={Y.sepia}/>
        </Tile>
        <Tile tone="cream" label="Sans accent · monochrome" code="B.04">
          <WordmarkB size={56} color={Y.ink} accent={Y.ink}/>
        </Tile>
      </div>

      <div style={{marginTop: 64, marginBottom: 24}}>
        <Eyebrow>Études de tagline</Eyebrow>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
        {[
          ['D\'où l\'on vient ensemble', 'collectif chaleureux'],
          ['Nos racines en commun', 'le plus direct'],
          ['Une mémoire à plusieurs', 'le plus humain'],
        ].map(([t, n], i) => (
          <Tile key={t} tone={i===1?'ivory':'cream'} label={`Tagline ${String.fromCharCode(945+i)}`} code={`B.0${5+i}`}
            style={{padding: 48, alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', gap: 24}}>
            <WordmarkB size={48} color={Y.ink} accent={Y.sepia}/>
            <div style={{
              fontFamily: MONO, fontSize: 11, color: Y.ink2,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              paddingTop: 12, borderTop: `1px solid ${Y.line2}`, alignSelf: 'stretch',
              marginTop: 'auto',
            }}>{t}</div>
            <div style={{fontFamily: MONO, fontSize: 9, color: Y.ink4, letterSpacing: '0.06em'}}>note · {n}</div>
          </Tile>
        ))}
      </div>

      <div style={{marginTop: 64, marginBottom: 24}}>
        <Eyebrow>Déclinaisons techniques</Eyebrow>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16}}>
        <Tile tone="cream" label="App icon · 512" code="B.08" style={{minHeight: 200}}>
          <div style={{
            width: 160, height: 160, background: Y.ivory,
            border: `1px solid ${Y.line2}`, borderRadius: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(40,28,12,0.12)',
          }}>
            <YSankofa size={120} color={Y.ink} accent={Y.sepia}/>
          </div>
        </Tile>
        <Tile tone="cream" label="Favicon · 32" code="B.09" style={{minHeight: 200}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center'}}>
            <div style={{padding: 8, background: Y.ivory, border: `1px solid ${Y.line2}`}}>
              <YSankofa size={36} color={Y.ink} accent={Y.sepia}/>
            </div>
            <div style={{fontFamily: MONO, fontSize: 9, color: Y.ink4, letterSpacing: '0.05em'}}>32 × 32 px</div>
          </div>
        </Tile>
        <Tile tone="cream" label="Inversé" code="B.10" style={{minHeight: 200, background: Y.ink}}>
          <WordmarkB size={56} color={Y.ivory} accent="#D9A56A"/>
        </Tile>
        <Tile tone="cream" label="Monochrome" code="B.11" style={{minHeight: 200}}>
          <WordmarkB size={56} color={Y.ink} accent={Y.ink}/>
        </Tile>
      </div>

      <div style={{marginTop: 16}}>
        <Tile tone="ivory" label="TopBar · 48 px" code="B.12"
          style={{padding: 0, minHeight: 0, alignItems: 'stretch'}}>
          <div style={{
            height: 48, padding: '0 18px', display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: `1px solid ${Y.line2}`, width: '100%',
            background: `linear-gradient(${Y.cream}, ${Y.ivory})`,
          }}>
            <WordmarkB size={22} color={Y.ink} accent={Y.sepia}/>
            <span style={{
              fontFamily: MONO, fontSize: 10, color: Y.ink3,
              letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: 24,
            }}>Famille Lefèvre</span>
            <span style={{flex: 1}}/>
            <span style={{fontFamily: MONO, fontSize: 10, color: Y.ink4, letterSpacing: '0.05em'}}>chapitre · Rivière</span>
          </div>
        </Tile>
      </div>

      <div style={{marginTop: 16}}>
        <Tile tone="ivory" label="Splash 1440 × 900" code="B.13"
          style={{minHeight: 0, padding: 0}}>
          <div style={{
            width: '100%', aspectRatio: '1440/900', background: Y.ivory,
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${Y.line2}`,
          }}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32}}>
              <WordmarkB size={120} color={Y.ink} accent={Y.sepia}/>
              <div style={{width: 64, height: 1, background: Y.line}}/>
              <span style={{
                fontFamily: MONO, fontSize: 13, color: Y.ink2,
                letterSpacing: '0.22em', textTransform: 'uppercase',
              }}>D'où l'on vient ensemble</span>
            </div>
            <span style={{
              position: 'absolute', bottom: 32, right: 48,
              fontFamily: MONO, fontSize: 10, color: Y.ink3, letterSpacing: '0.1em',
            }}>v 1.0 · 2026</span>
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
            <strong style={{color: Y.ink}}>Sankofa</strong>, mais fondu dans la première lettre. La branche droite du Y se courbe vers l'arrière, comme la tête qui se retourne. L'œuf, en sépia, est inscrit dans le creux du V.
          </p>
        </div>
        <div>
          <Eyebrow>Construction</Eyebrow>
          <p style={{fontFamily: COR, fontSize: 15, lineHeight: 1.6, color: Y.ink2, margin: '12px 0 0'}}>
            Hauteur de cap 64 unités. La branche droite quitte la diagonale standard à mi-hauteur, décrit un quart de cercle de rayon 14, retourne vers le centre. Tracé monoline 2.4 unités. L'œuf est un cercle de rayon 3.2, centré dans le V à 32 unités du sommet.
          </p>
        </div>
        <div>
          <Eyebrow>Espace de protection</Eyebrow>
          <p style={{fontFamily: COR, fontSize: 15, lineHeight: 1.6, color: Y.ink2, margin: '12px 0 0'}}>
            Égale à la hauteur de la lettre o du wordmark. Le Y monogramme ne doit jamais être utilisé seul à moins de 24 px : en dessous, basculer sur la version Direction A.
          </p>
        </div>
      </div>
    </Section>
  );
}

window.DirB = DirB;
