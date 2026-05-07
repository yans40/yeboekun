// Yeboekun — Decision matrix + footer

const { Y, COR, MONO, Eyebrow, Section } = window.YK;

function Decision() {
  const rows = [
    ['Lecture du nom',         'discrète, neutre',       'fondue dans la lettre Y',  'théâtrale, frontale'],
    ['Reconnaissance Adinkra', 'pour qui sait',          'pour qui regarde de près', 'pour qui s\'arrête'],
    ['Ton',                    'éditorial · institutionnel', 'contemporain · intime', 'cérémonial · héritage'],
    ['Échelle minimale',       '24 px',                  '36 px (sinon basculer A)', '32 px'],
    ['Coût d\'usage',          'faible · stable',        'moyen · police custom',    'moyen · sceau toujours visible'],
    ['Risque',                 'trop discret',           'illisible si mal rendu',   'trop solennel'],
  ];
  return (
    <Section tone="ivory" style={{padding: '120px 96px'}}>
      <div style={{display: 'grid', gridTemplateColumns: '320px 1fr', gap: 80}}>
        <div>
          <Eyebrow>Synthèse</Eyebrow>
          <h2 style={{
            fontFamily: COR, fontStyle: 'italic', fontWeight: 500,
            fontSize: 56, lineHeight: 0.95, margin: '12px 0 24px',
            color: Y.ink, letterSpacing: '-0.02em',
          }}>Comment trancher.</h2>
          <p style={{fontFamily: COR, fontSize: 16, lineHeight: 1.6, color: Y.ink2, margin: 0, maxWidth: 280}}>
            Trois partis pris vraiment distincts. Le tableau ci-contre permet de comparer sur les axes qui comptent : reconnaissance, ton, échelle minimale, risque.
          </p>
        </div>
        <div>
          <div style={{
            display: 'grid', gridTemplateColumns: '180px 1fr 1fr 1fr',
            borderTop: `1px solid ${Y.line}`,
          }}>
            <div style={{padding: '16px 20px', borderBottom: `1px solid ${Y.line2}`}}/>
            {[
              ['A', 'Sankofa éditorial', Y.sepia],
              ['B', 'Y monogramme',       Y.sepia],
              ['C', 'Sceau d\'éditeur',   Y.rust],
            ].map(([l, n, c]) => (
              <div key={l} style={{
                padding: '16px 20px', borderBottom: `1px solid ${Y.line2}`,
                borderLeft: `1px solid ${Y.line2}`,
              }}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
                  <span style={{
                    fontFamily: COR, fontStyle: 'italic', fontSize: 24,
                    color: c, fontWeight: 500, lineHeight: 1,
                  }}>{l}</span>
                  <span style={{fontFamily: COR, fontStyle: 'italic', fontSize: 17, color: Y.ink, fontWeight: 500}}>{n}</span>
                </div>
              </div>
            ))}
            {rows.map((r, i) => (
              <React.Fragment key={i}>
                <div style={{
                  padding: '16px 20px', borderBottom: `1px solid ${Y.line2}`,
                  fontFamily: MONO, fontSize: 10, color: Y.ink3,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{r[0]}</div>
                {r.slice(1).map((cell, j) => (
                  <div key={j} style={{
                    padding: '16px 20px', borderBottom: `1px solid ${Y.line2}`,
                    borderLeft: `1px solid ${Y.line2}`,
                    fontFamily: COR, fontSize: 14.5, color: Y.ink2,
                    fontStyle: 'italic',
                  }}>{cell}</div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div style={{
            marginTop: 48, padding: '32px 36px',
            background: Y.cream, border: `1px solid ${Y.line2}`,
          }}>
            <Eyebrow>Recommandation</Eyebrow>
            <p style={{
              fontFamily: COR, fontSize: 18, lineHeight: 1.55, color: Y.ink2,
              margin: '12px 0 0',
            }}>
              <strong style={{color: Y.ink}}>Direction A</strong> pour la robustesse — le pictogramme et le wordmark vivent indépendamment et passent toutes les échelles. <strong style={{color: Y.ink}}>Direction B</strong> si la marque doit signer en un seul geste, en pariant sur une exécution typographique soignée. <strong style={{color: Y.ink}}>Direction C</strong> si l'application doit revendiquer son sérieux institutionnel dès la première seconde.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <Section tone="ink" style={{padding: '64px 96px', color: Y.ivory}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <div>
          <span style={{
            fontFamily: COR, fontStyle: 'italic', fontSize: 56, fontWeight: 500,
            color: Y.ivory, letterSpacing: '-0.02em',
          }}>Yeboekun.</span>
          <div style={{
            fontFamily: MONO, fontSize: 11, color: 'rgba(244,239,230,0.55)',
            letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 12,
          }}>Identité de marque · spécification v1 · 03 mai 2026</div>
        </div>
        <div style={{
          fontFamily: MONO, fontSize: 10, color: 'rgba(244,239,230,0.45)',
          letterSpacing: '0.08em', textAlign: 'right', maxWidth: 320, lineHeight: 1.6,
        }}>
          Document interne · ne pas diffuser. Toute exécution finale exige la validation typographique (Cormorant Garamond, version sourcée).
        </div>
      </div>
    </Section>
  );
}

window.YKDecision = Decision;
window.YKFooter = Footer;
