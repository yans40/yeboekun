// Yeboekun — brand identity specification page
// Long-scroll editorial document presenting 3 distinct directions

const { Y, SankofaA, SankofaC, YSankofa } = window;

const COR = "'Cormorant Garamond', serif";
const MONO = "'Geist Mono', monospace";
const SANS = "'Geist', sans-serif";

// =================================================================
// Reusable layout primitives
// =================================================================
function Eyebrow({ children, color = Y.ink3 }) {
  return <div style={{
    fontFamily: MONO, fontSize: 10, letterSpacing: '0.18em',
    textTransform: 'uppercase', color,
  }}>{children}</div>;
}

function Section({ children, tone = 'ivory', style = {}, id }) {
  const bg = tone === 'ink' ? Y.ink : tone === 'cream' ? Y.cream
           : tone === 'paper' ? Y.paper2 : Y.ivory;
  return <section id={id} style={{
    background: bg, padding: '120px 96px', position: 'relative',
    ...style,
  }}>{children}</section>;
}

function Tile({ tone = 'ivory', children, style = {}, label, code }) {
  const bg = tone === 'ink' ? Y.ink : tone === 'cream' ? Y.cream
           : tone === 'paper' ? Y.paper2 : Y.ivory;
  const fg = tone === 'ink' ? Y.ivory : Y.ink;
  return (
    <figure style={{
      margin: 0, display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{
        background: bg, color: fg, padding: 56,
        border: tone === 'ivory' ? `1px solid ${Y.line2}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', minHeight: 240,
        ...style,
      }}>{children}</div>
      {(label || code) && (
        <figcaption style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: MONO, fontSize: 10, color: Y.ink3,
          letterSpacing: '0.06em', paddingTop: 4,
        }}>
          {label && <span>{label}</span>}
          {code && <span style={{color: Y.ink4}}>{code}</span>}
        </figcaption>
      )}
    </figure>
  );
}

// =================================================================
// Wordmarks — three different lockups per direction
// =================================================================

// DIRECTION A — Cormorant Garamond regular, calm, editorial
function WordmarkA({ size = 64, color = Y.ink, italic = false }) {
  return (
    <span style={{
      fontFamily: COR, fontWeight: 500,
      fontStyle: italic ? 'italic' : 'normal',
      fontSize: size, color, letterSpacing: '-0.02em',
      lineHeight: 0.9, whiteSpace: 'nowrap',
    }}>Yeboekun</span>
  );
}

// DIRECTION B — Cormorant Italic, custom Y
function WordmarkB({ size = 64, color = Y.ink, accent = Y.sepia }) {
  // Render: custom Y SVG followed by 'eboekun' in italic
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 0,
      fontFamily: COR, fontStyle: 'italic', fontWeight: 500,
      fontSize: size, color, letterSpacing: '-0.025em',
      lineHeight: 0.9, whiteSpace: 'nowrap',
    }}>
      <span style={{position:'relative', width: size*0.78, height: size, display:'inline-block'}}>
        <span style={{position:'absolute', left: -size*0.06, top: -size*0.04}}>
          <YSankofa size={size*1.05} color={color} accent={accent}/>
        </span>
      </span>
      <span style={{marginLeft: -size*0.05}}>eboekun</span>
    </span>
  );
}

// DIRECTION C — All-caps tracked, Tenor-like serif feel via Cormorant
function WordmarkC({ size = 28, color = Y.ink }) {
  return (
    <span style={{
      fontFamily: COR, fontWeight: 500,
      fontSize: size, color, letterSpacing: '0.32em',
      lineHeight: 1, whiteSpace: 'nowrap',
      textTransform: 'uppercase', paddingLeft: '0.32em',
    }}>YEBOEKUN</span>
  );
}

// =================================================================
// Hero
// =================================================================
function Hero() {
  return (
    <Section tone="ivory" style={{padding: '88px 96px 80px', borderBottom: `1px solid ${Y.line2}`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 96}}>
        <Eyebrow>Identité de marque · spécification v1</Eyebrow>
        <div style={{display: 'flex', gap: 36, fontFamily: MONO, fontSize: 10, color: Y.ink3, letterSpacing: '0.06em'}}>
          <span>03 mai 2026</span>
          <span>document interne</span>
          <span>03 directions</span>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'flex-end'}}>
        <div>
          <h1 style={{
            fontFamily: COR, fontStyle: 'italic', fontWeight: 500,
            fontSize: 168, lineHeight: 0.88, margin: 0, color: Y.ink,
            letterSpacing: '-0.03em',
          }}>Yeboekun.</h1>
          <p style={{
            fontFamily: COR, fontSize: 30, lineHeight: 1.35,
            color: Y.ink2, margin: '32px 0 0', maxWidth: 720,
            fontStyle: 'italic', fontWeight: 400,
          }}>
            « Nous avons un socle commun. »
          </p>
        </div>
        <div style={{
          borderLeft: `1px solid ${Y.line}`, paddingLeft: 32,
          paddingTop: 12, paddingBottom: 12,
        }}>
          <Eyebrow>Étymologie</Eyebrow>
          <p style={{
            fontFamily: COR, fontSize: 17, lineHeight: 1.55,
            color: Y.ink2, margin: '12px 0 0',
          }}>
            <span style={{fontFamily: MONO, fontSize: 13, color: Y.ink, letterSpacing: '0.05em'}}>yé-bo-é-koun</span> · akan / twi · <em>nous · avons · un socle commun</em>. Langue parlée au Ghana et en Côte d'Ivoire. La marque est à la fois le nom et la promesse : retrouver les racines partagées.
          </p>
        </div>
      </div>
    </Section>
  );
}

// =================================================================
// Foundations — typography, palette
// =================================================================
function Foundations() {
  return (
    <Section tone="cream" style={{padding: '88px 96px'}}>
      <div style={{display: 'grid', gridTemplateColumns: '320px 1fr', gap: 80}}>
        <div>
          <Eyebrow>Chapitre 01</Eyebrow>
          <h2 style={{
            fontFamily: COR, fontStyle: 'italic', fontWeight: 500,
            fontSize: 56, lineHeight: 0.95, margin: '12px 0 24px',
            color: Y.ink, letterSpacing: '-0.02em',
          }}>Fondations.</h2>
          <p style={{
            fontFamily: COR, fontSize: 16, lineHeight: 1.6, color: Y.ink2,
            margin: 0, maxWidth: 280,
          }}>
            Système typographique et palette communs aux trois directions. Toute déclinaison s'inscrit dans ces deux contraintes.
          </p>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 64}}>
          {/* Type system */}
          <div>
            <Eyebrow>Typographie</Eyebrow>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16,
            }}>
              <div style={{borderTop: `1px solid ${Y.line2}`, paddingTop: 20}}>
                <div style={{
                  fontFamily: COR, fontStyle: 'italic', fontSize: 84,
                  color: Y.ink, lineHeight: 1, fontWeight: 500,
                  letterSpacing: '-0.02em',
                }}>Aa</div>
                <div style={{marginTop: 16, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 10.5, color: Y.ink3, letterSpacing: '0.05em'}}>
                  <span>Cormorant Garamond</span>
                  <span>500 italic</span>
                </div>
                <p style={{fontFamily: COR, fontSize: 14, color: Y.ink2, margin: '12px 0 0', lineHeight: 1.5}}>Wordmark, titres, chapeaux. Italique pour l'expressif, regular pour les usages institutionnels.</p>
              </div>
              <div style={{borderTop: `1px solid ${Y.line2}`, paddingTop: 20}}>
                <div style={{
                  fontFamily: MONO, fontSize: 64, color: Y.ink,
                  letterSpacing: '0.04em', lineHeight: 1, fontWeight: 500,
                }}>Aa</div>
                <div style={{marginTop: 16, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 10.5, color: Y.ink3, letterSpacing: '0.05em'}}>
                  <span>Geist Mono</span>
                  <span>400 / 500</span>
                </div>
                <p style={{fontFamily: COR, fontSize: 14, color: Y.ink2, margin: '12px 0 0', lineHeight: 1.5}}>Tagline, métadonnées, étiquettes. Letter-spacing 0.08–0.18em selon la taille.</p>
              </div>
            </div>
          </div>

          {/* Palette */}
          <div>
            <Eyebrow>Palette</Eyebrow>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 14, marginTop: 16, borderTop: `1px solid ${Y.line2}`, paddingTop: 20,
            }}>
              {[
                ['Encre profonde', Y.ink, '#1F1A14', 'wordmark · principal'],
                ['Encre tiède',   Y.ink2, '#3D342A', 'wordmark alt.'],
                ['Sépia',         Y.sepia, '#7D5A36', 'accent · pictogr.'],
                ['Rouille',       Y.rust, '#A4502A', 'accent alt.'],
                ['Crème',         Y.cream, '#FAF6EC', 'fond clair'],
                ['Ivoire',        Y.ivory, '#F4EFE6', 'fond standard'],
              ].map(([n,c,h,u]) => (
                <div key={c} style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                  <div style={{
                    aspectRatio: '1', background: c,
                    border: c === Y.cream || c === Y.ivory ? `1px solid ${Y.line2}` : 'none',
                  }}/>
                  <div>
                    <div style={{fontFamily: COR, fontStyle: 'italic', fontSize: 15, color: Y.ink, fontWeight: 500}}>{n}</div>
                    <div style={{fontFamily: MONO, fontSize: 9.5, color: Y.ink3, letterSpacing: '0.05em', marginTop: 2}}>{h}</div>
                    <div style={{fontFamily: MONO, fontSize: 9, color: Y.ink4, letterSpacing: '0.04em', marginTop: 2}}>{u}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forbidden territory */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
            paddingTop: 24, borderTop: `1px solid ${Y.line2}`,
          }}>
            <div>
              <Eyebrow color={Y.ink2}>Champ autorisé</Eyebrow>
              <ul style={{fontFamily: COR, fontSize: 15, lineHeight: 1.7, color: Y.ink2, margin: '10px 0 0', paddingLeft: 18}}>
                <li>Géométrie monoline, tracé constant 1.5–2.4 px</li>
                <li>Référence Adinkra discrète, lisible pour qui sait</li>
                <li>Hiérarchie sérif italique / mono espacé</li>
                <li>Couleurs terreuses, palette unique</li>
              </ul>
            </div>
            <div>
              <Eyebrow color={Y.rust}>Champ interdit</Eyebrow>
              <ul style={{fontFamily: COR, fontSize: 15, lineHeight: 1.7, color: Y.ink2, margin: '10px 0 0', paddingLeft: 18}}>
                <li>Arbres, branches, feuilles littérales</li>
                <li>Mains qui se tiennent, globe, parchemin</li>
                <li>Calligraphie « africaine » stéréotypée</li>
                <li>Dégradés, 3D, couleurs primaires saturées</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// =================================================================
// Direction header
// =================================================================
function DirectionHeader({ letter, name, subtitle, ref, accent }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '160px 1fr 280px',
      gap: 48, alignItems: 'flex-end',
      borderBottom: `1px solid ${Y.line}`, paddingBottom: 32, marginBottom: 56,
    }}>
      <div>
        <div style={{
          fontFamily: COR, fontStyle: 'italic', fontWeight: 500,
          fontSize: 144, lineHeight: 0.85, color: accent,
          letterSpacing: '-0.04em',
        }}>{letter}</div>
      </div>
      <div>
        <Eyebrow color={accent}>Direction {letter}</Eyebrow>
        <h2 style={{
          fontFamily: COR, fontStyle: 'italic', fontWeight: 500,
          fontSize: 64, lineHeight: 0.95, margin: '10px 0 0',
          color: Y.ink, letterSpacing: '-0.025em',
        }}>{name}.</h2>
        <p style={{
          fontFamily: COR, fontSize: 18, lineHeight: 1.5, color: Y.ink2,
          margin: '14px 0 0', fontStyle: 'italic', maxWidth: 540, fontWeight: 400,
        }}>{subtitle}</p>
      </div>
      <div style={{
        borderLeft: `1px solid ${Y.line}`, paddingLeft: 24,
      }}>
        <Eyebrow>Référence</Eyebrow>
        <p style={{
          fontFamily: COR, fontSize: 13.5, lineHeight: 1.55,
          color: Y.ink2, margin: '10px 0 0',
        }}>{ref}</p>
      </div>
    </div>
  );
}

window.YK = {
  Y, COR, MONO, SANS,
  Eyebrow, Section, Tile,
  WordmarkA, WordmarkB, WordmarkC,
  Hero, Foundations, DirectionHeader,
  SankofaA, SankofaC, YSankofa,
};
