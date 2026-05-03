
// ===== hifi-shared.jsx =====
// Shared building blocks for the GegeDot high-fidelity mocks.
// Color, typography, photo placeholders, navigation chrome.

const HF = {
  paper:   '#f4efe6',
  paper2:  '#ece5d6',
  paper3:  '#e0d8c5',
  cream:   '#faf6ec',
  ink:     '#1f1a14',
  ink2:    '#3d342a',
  ink3:    '#766a58',
  ink4:    '#a89f8c',
  line:    '#cabfa6',
  line2:   '#ddd2b8',
  sepia:   '#7d5a36',
  sepiaLt: '#b08a5c',
  rust:    '#a4502a',
  olive:   '#6a7242',
  forest:  '#3f5037',
  ocean:   '#3a5566',
  gold:    '#b58a3b',
};

// Sepia-toned photographic placeholder.
// Striped diagonal gradient + dust grain to feel like an old print.
function Photo({ w='100%', h='100%', label='', tint='sepia', round=false, children, style={} }) {
  const tints = {
    sepia:  ['#a07a4d','#7d5a36','#3a2916'],
    indigo: ['#5e6f86','#3a5566','#1c2a36'],
    olive:  ['#8a916b','#6a7242','#3b3f24'],
    rust:   ['#c97f57','#a4502a','#5a2b13'],
    grey:   ['#9a9485','#6e695b','#37342c'],
  };
  const [c1,c2,c3] = tints[tint] || tints.sepia;
  return (
    <div style={{
      width:w, height:h, position:'relative', overflow:'hidden',
      borderRadius: round ? '50%' : 2,
      background:`
        radial-gradient(120% 90% at 30% 20%, ${c1} 0%, ${c2} 55%, ${c3} 100%),
        repeating-linear-gradient(135deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 3px)
      `,
      backgroundBlendMode:'overlay,normal',
      boxShadow: round ? 'inset 0 0 0 1px rgba(0,0,0,0.15)' : 'inset 0 0 0 1px rgba(0,0,0,0.18), inset 0 -28px 50px rgba(0,0,0,0.2)',
      ...style,
    }}>
      {/* film grain */}
      <div style={{position:'absolute', inset:0, opacity:0.18, mixBlendMode:'overlay',
        backgroundImage:`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        backgroundSize:'160px 160px',
      }}/>
      {label && (
        <span style={{
          position:'absolute', left:8, bottom:6,
          fontFamily:'Geist Mono, monospace', fontSize:9,
          color:'rgba(255,247,232,0.78)', letterSpacing:'0.06em',
          textTransform:'uppercase',
        }}>{label}</span>
      )}
      {children}
    </div>
  );
}

// Paper texture wrapper — adds subtle warm grain over a paper-coloured surface.
function Paper({ children, tone='paper', style={} }) {
  const bg = tone === 'cream' ? HF.cream : tone === 'paper2' ? HF.paper2 : HF.paper;
  return (
    <div style={{
      background:bg,
      backgroundImage:`
        radial-gradient(1200px 800px at 80% 0%, rgba(180,140,80,0.08), transparent 70%),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='p'><feTurbulence baseFrequency='.9' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .27 0 0 0 0 .15 0 0 0 .12 0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>")
      `,
      backgroundSize:'auto, 200px 200px',
      ...style,
    }}>{children}</div>
  );
}

// Top navigation bar — serif italic brand, mono breadcrumb, link nav.
function HFTopBar({ active='Atelier' }) {
  const items = ['Tableau','Rivière','Contemplation','Atelier','Album','Pistes'];
  return (
    <div style={{
      height:60, padding:'0 28px', display:'flex', alignItems:'center', gap:24,
      borderBottom:`1px solid ${HF.line2}`,
      background:`linear-gradient(${HF.cream}, ${HF.paper})`,
      position:'relative', flexShrink:0,
    }}>
      <div style={{display:'flex', alignItems:'baseline', gap:10}}>
        <span style={{
          fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
          fontSize:24, color:HF.ink, letterSpacing:'-0.01em',
        }}>gegedot</span>
        <span style={{width:4, height:4, borderRadius:'50%', background:HF.rust}}/>
      </div>
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        fontFamily:'Geist Mono, monospace', fontSize:10.5,
        color:HF.ink3, letterSpacing:'0.05em',
      }}>
        <span style={{
          padding:'2px 8px', borderRadius:3,
          background:HF.paper3, color:HF.ink2,
        }}>LEFÈVRE</span>
        <span>·</span><span>1640 — aujourd'hui</span>
      </div>
      <div style={{flex:1, display:'flex', justifyContent:'center', gap:26}}>
        {items.map(i => (
          <a key={i} style={{
            fontSize:13, color: i===active?HF.ink:HF.ink3,
            fontWeight: i===active?500:400,
            position:'relative', cursor:'default',
            letterSpacing:'0.01em',
          }}>
            {i}
            {i===active && (
              <span style={{
                position:'absolute', left:-2, right:-2, bottom:-20,
                height:2, background:HF.ink, borderRadius:1,
              }}/>
            )}
          </a>
        ))}
      </div>
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        border:`1px solid ${HF.line2}`, borderRadius:20,
        padding:'5px 12px', background:HF.cream,
        fontFamily:'Geist Mono, monospace', fontSize:11, color:HF.ink3,
        minWidth:200,
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={HF.ink3} strokeWidth="1.4">
          <circle cx="5" cy="5" r="3.4"/><path d="M7.5 7.5l2.5 2.5"/>
        </svg>
        <span>Rechercher</span>
        <span style={{flex:1}}/>
        <span style={{
          fontSize:9, padding:'1px 5px', border:`1px solid ${HF.line2}`,
          borderRadius:3, color:HF.ink4,
        }}>⌘K</span>
      </div>
      <div style={{
        width:32, height:32, borderRadius:'50%',
        background:`linear-gradient(135deg, ${HF.sepiaLt}, ${HF.sepia})`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color:HF.cream, fontFamily:'Cormorant Garamond, serif',
        fontStyle:'italic', fontSize:14, letterSpacing:'0.02em',
        boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.1)',
      }}>C</div>
    </div>
  );
}

// Small avatar
function Avatar({ size=28, tint='sepia', initial='' }) {
  return (
    <div style={{position:'relative', width:size, height:size, flexShrink:0}}>
      <Photo w={size} h={size} round tint={tint}/>
      {initial && (
        <span style={{
          position:'absolute', inset:0, display:'flex',
          alignItems:'center', justifyContent:'center',
          color:HF.cream, fontFamily:'Cormorant Garamond, serif',
          fontStyle:'italic', fontSize:size*0.42, opacity:0.7,
        }}>{initial}</span>
      )}
    </div>
  );
}

// Eyebrow label
function Eyebrow({ children, color }) {
  return (
    <div style={{
      fontFamily:'Geist Mono, monospace', fontSize:10,
      letterSpacing:'0.16em', textTransform:'uppercase',
      color: color || HF.ink3,
    }}>{children}</div>
  );
}

// Tag chip
function Chip({ children, variant='default' }) {
  const variants = {
    default: { bg:'transparent', fg:HF.ink2, bd:HF.line },
    solid:   { bg:HF.ink, fg:HF.cream, bd:HF.ink },
    rust:    { bg:'transparent', fg:HF.rust, bd:HF.rust },
    olive:   { bg:'transparent', fg:HF.olive, bd:HF.olive },
    cream:   { bg:HF.cream, fg:HF.ink2, bd:HF.line2 },
  };
  const v = variants[variant] || variants.default;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      fontFamily:'Geist Mono, monospace', fontSize:9.5,
      padding:'2px 9px', borderRadius:11,
      background:v.bg, color:v.fg, border:`1px solid ${v.bd}`,
      letterSpacing:'0.08em', textTransform:'uppercase',
      whiteSpace:'nowrap',
    }}>{children}</span>
  );
}

Object.assign(window, { HF, Photo, Paper, HFTopBar, Avatar, Eyebrow, Chip });


const { HF, Photo, Paper, HFTopBar, Avatar, Eyebrow, Chip } = window;

// ===== hifi-dashboard.jsx =====
// Screen 01 — Tableau de bord (dashboard) hi-fi
// Welcome hero + family snapshot fan + stats + integrated timeline + leads.


function Stat({ n, label, suffix }) {
  return (
    <div style={{
      borderRadius:8, padding:'18px 20px',
      background:HF.cream, border:`1px solid ${HF.line2}`,
      display:'flex', flexDirection:'column', gap:4,
      boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset, 0 1px 2px rgba(0,0,0,0.03)',
    }}>
      <div style={{display:'flex', alignItems:'baseline', gap:6}}>
        <span style={{
          fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
          fontSize:42, lineHeight:0.9, color:HF.ink, fontWeight:500,
        }}>{n}</span>
        {suffix && <span style={{fontFamily:'Geist Mono, monospace', fontSize:10, color:HF.ink3}}>{suffix}</span>}
      </div>
      <div style={{fontSize:11.5, color:HF.ink3, letterSpacing:'0.02em'}}>{label}</div>
    </div>
  );
}

function MiniFan() {
  const cx=240, cy=232, r0=24, step=30;
  const polar = (r,d)=>{const a=(d-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)];};
  const arc = (r1,r2,a0,a1) => {
    const [x0a,y0a]=polar(r1,a0),[x0b,y0b]=polar(r1,a1),[x1a,y1a]=polar(r2,a0),[x1b,y1b]=polar(r2,a1);
    return `M ${x0a} ${y0a} A ${r1} ${r1} 0 0 1 ${x0b} ${y0b} L ${x1b} ${y1b} A ${r2} ${r2} 0 0 0 ${x1a} ${y1a} Z`;
  };
  const empty = {4: new Set([0,7]), 5: new Set([0,1,12,15])};
  // Sepia tone progression — closer to ego is darker/richer
  const colors = ['#7d5a36','#9a7548','#b48b5d','#cba382','#dcc1a0'];
  const NAMES = {1:['Jean','Marguerite'], 2:['Pierre','Anne','Étienne','Louise']};
  const out = [];
  for (let g=1; g<=5; g++) {
    const n = Math.pow(2,g), span=180/n;
    for (let i=0;i<n;i++) {
      const a0=-180+i*span, a1=a0+span;
      const isEmpty = empty[g]?.has(i);
      out.push(<path key={`${g}-${i}`}
        d={arc(r0+(g-1)*step, r0+g*step, a0, a1)}
        fill={isEmpty?'transparent':colors[g-1]}
        stroke={HF.cream} strokeWidth="1.2"
        strokeDasharray={isEmpty?'2 3':'none'}
        opacity={isEmpty?0.55:1}
      />);
      if (g<=2 && !isEmpty) {
        const r=(r0+(g-1)*step + r0+g*step)/2, mid=(a0+a1)/2;
        const [tx,ty]=polar(r, mid);
        const rot = mid>0?mid-90:mid+90;
        out.push(<text key={`t-${g}-${i}`} x={tx} y={ty}
          transform={`rotate(${rot} ${tx} ${ty})`}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Cormorant Garamond" fontStyle="italic"
          fontSize={g===1?13:10.5} fill={HF.cream}>{NAMES[g][i]||''}</text>);
      }
    }
  }
  return (
    <svg width="100%" height="260" viewBox="0 0 480 260" style={{display:'block'}}>
      {out}
      <circle cx={cx} cy={cy} r={r0-4} fill={HF.paper} stroke={HF.ink2} strokeWidth="1"/>
      <text x={cx} y={cy-2} textAnchor="middle"
        fontFamily="Cormorant Garamond" fontStyle="italic"
        fontSize="13" fill={HF.ink}>Camille</text>
      <text x={cx} y={cy+11} textAnchor="middle"
        fontFamily="Geist Mono" fontSize="8" fill={HF.ink3}>1981</text>
    </svg>
  );
}

function Timeline() {
  const lives = [
    {n:'Pierre Lefèvre', s:1842, e:1893, sea:true, j:'charpentier'},
    {n:'Henri L.',       s:1885, e:1962, j:'marin'},
    {n:'Pierre L.',      s:1918, e:1981, j:'pêcheur'},
    {n:'Anne Berthier',  s:1922, e:2003, j:'couturière'},
    {n:'Jean Lefèvre',   s:1948, e:2019, sea:true, j:'charpentier'},
    {n:'Marguerite R.',  s:1952, e:null, j:'institutrice'},
    {n:'Camille',        s:1981, e:null, j:'architecte', ego:true},
  ];
  const minY=1840, maxY=2030, w=620;
  const px = y => ((y-minY)/(maxY-minY))*w;

  return (
    <div style={{
      borderRadius:10, padding:'22px 24px',
      background:HF.cream, border:`1px solid ${HF.line2}`,
      boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset',
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:14}}>
        <div>
          <Eyebrow>Frise chronologique</Eyebrow>
          <div style={{
            fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
            fontSize:22, color:HF.ink, marginTop:4, fontWeight:500,
          }}>Sept vies, deux siècles.</div>
        </div>
        <div style={{display:'flex', gap:6}}>
          <Chip>4 générations</Chip>
          <Chip variant="rust">⚓ 2 disparus</Chip>
        </div>
      </div>

      {/* axis */}
      <div style={{position:'relative', height:20, marginLeft:140}}>
        {[1840,1880,1920,1960,2000].map(y => (
          <div key={y} style={{position:'absolute', left:px(y), top:0}}>
            <div style={{width:1, height:6, background:HF.line}}/>
            <div style={{
              fontFamily:'Geist Mono, monospace', fontSize:9.5,
              color:HF.ink3, marginTop:3,
            }}>{y}</div>
          </div>
        ))}
      </div>

      <div style={{position:'relative', paddingTop:8}}>
        {/* WW1 / WW2 bands */}
        {[[1914,1918,'14–18'],[1939,1945,'39–45']].map(([s,e,l],i) => (
          <div key={i} style={{
            position:'absolute', left:140+px(s), top:0,
            width:px(e)-px(s), height:lives.length*26,
            background:'rgba(164,80,42,0.06)',
            borderLeft:`1px dashed ${HF.rust}`,
            borderRight:`1px dashed ${HF.rust}`,
            opacity:0.55, pointerEvents:'none',
          }}>
            <div style={{
              fontFamily:'Geist Mono, monospace', fontSize:8.5,
              color:HF.rust, padding:'3px 5px', letterSpacing:'0.05em',
            }}>{l}</div>
          </div>
        ))}
        {lives.map((l,i) => {
          const end = l.e || 2026;
          return (
            <div key={i} style={{display:'flex', alignItems:'center', height:26, gap:10}}>
              <div style={{
                width:130, display:'flex', alignItems:'center', gap:8,
              }}>
                <Avatar size={18}/>
                <span style={{
                  fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                  fontSize:13, color:HF.ink, fontWeight: l.ego?600:400,
                }}>{l.n}</span>
              </div>
              <div style={{position:'relative', width:w, height:14}}>
                <div style={{
                  position:'absolute', left:0, right:0, top:6, height:1,
                  background:HF.line2,
                }}/>
                <div style={{
                  position:'absolute', left:px(l.s), width:px(end)-px(l.s),
                  top:0, height:14, borderRadius:7,
                  background: l.ego
                    ? `linear-gradient(90deg, ${HF.ink}, ${HF.ink2})`
                    : `linear-gradient(90deg, ${HF.sepiaLt}, ${HF.sepia})`,
                  boxShadow:'0 1px 2px rgba(0,0,0,0.08)',
                  display:'flex', alignItems:'center', padding:'0 8px',
                  fontFamily:'Geist Mono, monospace', fontSize:8.5,
                  color: HF.cream, gap:6, letterSpacing:'0.04em',
                }}>
                  <span style={{opacity:0.85}}>{l.s}</span>
                  <span style={{flex:1, textAlign:'center', opacity:0.7,
                    fontStyle:'italic', fontFamily:'Cormorant Garamond, serif',
                    fontSize:10, letterSpacing:0,
                  }}>{l.j}</span>
                  {l.sea && <span style={{color:HF.cream}}>⚓</span>}
                  <span style={{opacity:0.85}}>{l.e || '·'}</span>
                </div>
                {!l.e && (
                  <div style={{
                    position:'absolute', left:px(end)+6, top:1,
                    fontFamily:'Geist Mono, monospace', fontSize:9,
                    color:HF.ink3,
                  }}>vivant</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Lead({ kind, title, sub, variant='default', cta='Examiner' }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12,
      padding:'14px 0', borderTop:`1px solid ${HF.line2}`,
    }}>
      <Chip variant={variant}>{kind}</Chip>
      <div style={{flex:1, minWidth:0}}>
        <div style={{
          fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
          fontSize:15.5, color:HF.ink, lineHeight:1.2,
        }}>{title}</div>
        <div style={{fontSize:11, color:HF.ink3, marginTop:2}}>{sub}</div>
      </div>
      <span style={{
        fontFamily:'Geist Mono, monospace', fontSize:10,
        color:HF.ink2, letterSpacing:'0.05em',
      }}>{cta} →</span>
    </div>
  );
}

function RecentCard({ name, dates, job, ago, tint }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12,
      padding:'12px 0', borderTop:`1px solid ${HF.line2}`,
    }}>
      <Avatar size={34} tint={tint}/>
      <div style={{flex:1}}>
        <div style={{
          fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
          fontSize:16, color:HF.ink, lineHeight:1.1,
        }}>{name}</div>
        <div style={{
          fontFamily:'Geist Mono, monospace', fontSize:9.5,
          color:HF.ink3, marginTop:3, letterSpacing:'0.04em',
        }}>{dates} · {job}</div>
      </div>
      <span style={{fontFamily:'Geist Mono, monospace', fontSize:9.5, color:HF.ink4}}>{ago}</span>
    </div>
  );
}

function HFDashboard() {
  return (
    <Paper style={{height:'100%', display:'flex', flexDirection:'column'}}>
      <HFTopBar active="Tableau"/>
      <div style={{flex:1, padding:'40px 56px 56px', overflow:'auto'}}>
        {/* Hero */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:36}}>
          <div>
            <Eyebrow>Bienvenue, Camille</Eyebrow>
            <h1 style={{
              fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
              fontSize:74, fontWeight:500, lineHeight:0.95,
              margin:'10px 0 6px', color:HF.ink, letterSpacing:'-0.02em',
            }}>Famille Lefèvre.</h1>
            <p style={{
              fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
              fontSize:22, color:HF.ink2, margin:0, fontWeight:400,
            }}>327 vies, neuf générations, deux disparus en mer.</p>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button style={{
              padding:'10px 18px', borderRadius:6,
              border:`1px solid ${HF.line}`, background:HF.cream,
              fontFamily:'Geist, sans-serif', fontSize:12, color:HF.ink,
              letterSpacing:'0.02em',
            }}>+ Ajouter une personne</button>
            <button style={{
              padding:'10px 18px', borderRadius:6,
              border:`1px solid ${HF.ink}`, background:HF.ink,
              color:HF.cream, fontFamily:'Geist, sans-serif', fontSize:12,
              letterSpacing:'0.02em',
            }}>Importer GEDCOM</button>
          </div>
        </div>

        {/* Snapshot + Stats */}
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20, marginBottom:24}}>
          <div style={{
            borderRadius:10, padding:'20px 24px',
            background:`linear-gradient(160deg, ${HF.cream}, ${HF.paper2})`,
            border:`1px solid ${HF.line2}`, position:'relative', overflow:'hidden',
            boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset, 0 2px 4px rgba(0,0,0,0.03)',
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
              <div>
                <Eyebrow>Aperçu de l'arbre</Eyebrow>
                <div style={{
                  fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                  fontSize:20, color:HF.ink, marginTop:4, fontWeight:500,
                }}>Cinq générations en arrière.</div>
              </div>
              <span style={{
                fontFamily:'Geist Mono, monospace', fontSize:10, color:HF.ink3,
                letterSpacing:'0.05em',
              }}>74% des branches connues</span>
            </div>
            <MiniFan/>
            <div style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              borderTop:`1px solid ${HF.line2}`, paddingTop:12,
            }}>
              <div style={{display:'flex', gap:6}}>
                <Chip>5 gén. ascendantes</Chip>
                <Chip>2 gén. descendantes</Chip>
              </div>
              <a style={{
                fontFamily:'Geist Mono, monospace', fontSize:11,
                color:HF.ink, letterSpacing:'0.05em',
              }}>Ouvrir l'éventail →</a>
            </div>
          </div>
          <div style={{display:'grid', gridTemplateRows:'1fr 1fr', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <Stat n="327" label="personnes"/>
            <Stat n="9" label="générations"/>
            <Stat n="142" label="documents"/>
            <Stat n="2" suffix="⚓" label="disparus en mer"/>
          </div>
        </div>

        <Timeline/>

        {/* Footer grids */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, marginTop:28}}>
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
              <Eyebrow>Pistes du moment · 5</Eyebrow>
              <a style={{fontFamily:'Geist Mono, monospace', fontSize:10, color:HF.ink3}}>tout voir →</a>
            </div>
            <Lead kind="Doublon" variant="rust" title="Jean Lefèvre apparaît deux fois" sub="Naissance 1842 · Saint-Malo"/>
            <Lead kind="Date" variant="rust" title="Mariage avant naissance" sub="Anne Berthier · 1918 vs 1922"/>
            <Lead kind="Branche" title="Trois personnes orphelines" sub="Aucun rattachement à l'arbre principal"/>
          </div>
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
              <Eyebrow>Dernières fiches consultées</Eyebrow>
              <a style={{fontFamily:'Geist Mono, monospace', fontSize:10, color:HF.ink3}}>historique →</a>
            </div>
            <RecentCard name="Marguerite Roux" dates="1952 — vivante" job="Institutrice" ago="il y a 2h" tint="grey"/>
            <RecentCard name="Henri Lefèvre" dates="1885 — 1962" job="Marin" ago="hier" tint="indigo"/>
            <RecentCard name="Anne Berthier" dates="1922 — 2003" job="Couturière" ago="3 jours" tint="rust"/>
          </div>
        </div>
      </div>
    </Paper>
  );
}

window.HFDashboard = HFDashboard;


// ===== hifi-contemplation.jsx =====
// Screen 02 — Contemplation : éventail bidirectionnel hi-fi
// Ascendants en haut (5 gén · sépia), descendants en bas (2 gén · olive)
// Centré sur l'ego — atmosphère contemplative, fond papier crème,
// halo doré, légère vignette, étiquettes serif italique.


function HFContemplation() {
  const cx=620, cy=420, r0=58, stepUp=64, stepDn=80;
  const polar = (r,d)=>{const a=(d-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)];};
  const arc = (r1,r2,a0,a1) => {
    const [x0a,y0a]=polar(r1,a0),[x0b,y0b]=polar(r1,a1),[x1a,y1a]=polar(r2,a0),[x1b,y1b]=polar(r2,a1);
    return `M ${x0a} ${y0a} A ${r1} ${r1} 0 0 1 ${x0b} ${y0b} L ${x1b} ${y1b} A ${r2} ${r2} 0 0 0 ${x1a} ${y1a} Z`;
  };
  const upEmpty = {3:new Set([0,7]), 4:new Set([0,1,2,13,14,15]), 5:new Set([0,1,2,3,4,26,27,28,29,30,31])};
  const upSectors = [];
  for (let g=1; g<=5; g++) {
    const n=Math.pow(2,g), span=180/n;
    for (let i=0;i<n;i++){
      const a0=-180+i*span, a1=a0+span;
      upSectors.push({d:arc(r0+(g-1)*stepUp, r0+g*stepUp, a0, a1),
        g, i, midA:(a0+a1)/2, isEmpty: upEmpty[g]?.has(i)});
    }
  }
  const dnLayout = [
    {n:2, names:['Léo','Inès']},
    {n:3, names:['Eva','Jules','Mia']},
  ];
  const dnSectors = [];
  for (let g=1; g<=2; g++) {
    const layout = dnLayout[g-1];
    const n=layout.n, span=180/n;
    for (let i=0;i<n;i++){
      const a0=i*span, a1=a0+span;
      dnSectors.push({d:arc(r0+(g-1)*stepDn, r0+g*stepDn, a0, a1),
        g, i, midA:(a0+a1)/2, name: layout.names[i]});
    }
  }
  const upColors = ['#7d5a36','#8a6741','#9d7a4f','#b3926a','#cbac88'];
  const dnColors = ['#6a7242','#8a8f5a'];
  const NAMES = {
    1:['Jean Lefèvre','Marguerite Roux'],
    2:['Pierre L.','Anne B.','Étienne R.','Louise V.'],
    3:['Henri L.','Sophie D.','Paul B.','Madel. F.','Émile R.','Cécile T.','—','—'],
  };
  const DATES = {
    1:['1948–2019','1952–'],
    2:['1918–1981','1922–2003','1920–95','1925–10'],
  };

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden'}}>
      <HFTopBar active="Contemplation"/>
      <Paper tone="paper2" style={{flex:1, position:'relative', overflow:'hidden'}}>
        {/* warm gold halo behind ego */}
        <div style={{
          position:'absolute', left:cx-340, top:cy-340, width:680, height:680,
          background:`radial-gradient(circle, rgba(181,138,59,0.18) 0%, rgba(181,138,59,0.06) 40%, transparent 70%)`,
          pointerEvents:'none',
        }}/>
        {/* vignette */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'radial-gradient(ellipse at center, transparent 50%, rgba(40,28,12,0.18) 100%)',
        }}/>

        {/* Header */}
        <div style={{position:'absolute', top:32, left:48, zIndex:2, maxWidth:380}}>
          <Eyebrow>Mode contemplation</Eyebrow>
          <div style={{
            fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
            fontSize:34, fontWeight:500, marginTop:8, lineHeight:1, color:HF.ink,
            letterSpacing:'-0.01em',
          }}>Ce qui nous précède,<br/>ce qui nous suit.</div>
          <div style={{display:'flex', gap:6, marginTop:14}}>
            <Chip variant="cream">↑ 5 ascendants</Chip>
            <Chip variant="cream">↓ 2 descendants</Chip>
          </div>
        </div>

        {/* Top axis label */}
        <div style={{position:'absolute', left:'50%', top:42, transform:'translateX(-50%)', textAlign:'center', zIndex:2, pointerEvents:'none'}}>
          <Eyebrow color={HF.sepia}>↑ Ascendants · 5 générations</Eyebrow>
        </div>
        {/* Right legend */}
        <div style={{position:'absolute', top:32, right:48, zIndex:2, textAlign:'right', display:'flex', flexDirection:'column', gap:10}}>
          <div style={{display:'flex', alignItems:'center', gap:8, justifyContent:'flex-end'}}>
            <span style={{
              fontFamily:'Geist Mono, monospace', fontSize:10, color:HF.ink3,
              letterSpacing:'0.05em',
            }}>ASCENDANTS</span>
            <span style={{width:14, height:14, background:upColors[0], borderRadius:2}}/>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:8, justifyContent:'flex-end'}}>
            <span style={{
              fontFamily:'Geist Mono, monospace', fontSize:10, color:HF.ink3,
              letterSpacing:'0.05em',
            }}>DESCENDANTS</span>
            <span style={{width:14, height:14, background:dnColors[0], borderRadius:2}}/>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:8, justifyContent:'flex-end'}}>
            <span style={{
              fontFamily:'Geist Mono, monospace', fontSize:10, color:HF.rust,
              letterSpacing:'0.05em',
            }}>À RECHERCHER</span>
            <span style={{
              width:14, height:14, border:`1px dashed ${HF.rust}`, borderRadius:2,
              background:'transparent',
            }}/>
          </div>
        </div>

        {/* Bottom axis label */}
        <div style={{position:'absolute', left:'50%', bottom:48, transform:'translateX(-50%)', zIndex:2, pointerEvents:'none', textAlign:'center'}}>
          <Eyebrow color={HF.olive}>↓ Descendants · 2 générations</Eyebrow>
        </div>

        <svg width="100%" height="100%" viewBox="0 0 1240 840" style={{position:'absolute', inset:0}}>
          {/* horizon line */}
          <line x1={120} x2={1120} y1={cy} y2={cy}
            stroke={HF.line} strokeDasharray="3 5" strokeWidth="1"/>

          {/* ASCENDANTS */}
          {upSectors.map((s,k)=>(
            <path key={'u'+k} d={s.d}
              fill={s.isEmpty?'transparent':upColors[Math.min(s.g-1,4)]}
              stroke={HF.cream} strokeWidth="1.4"
              strokeDasharray={s.isEmpty?'3 4':'none'}
              opacity={s.isEmpty?0.45:0.95}
            />
          ))}
          {/* DESCENDANTS */}
          {dnSectors.map((s,k)=>(
            <path key={'d'+k} d={s.d}
              fill={dnColors[Math.min(s.g-1,1)]}
              stroke={HF.cream} strokeWidth="1.4"
              opacity={0.92}
            />
          ))}

          {/* Ascendant labels — gen 1 & 2 */}
          {upSectors.filter(s=>s.g<=2 && !s.isEmpty).map((s,k)=>{
            const r=(r0+(s.g-1)*stepUp + r0+s.g*stepUp)/2;
            const [x,y]=polar(r,s.midA);
            const rot=s.midA>0?s.midA-90:s.midA+90;
            return (
              <g key={'lu'+k} transform={`translate(${x},${y}) rotate(${rot})`}>
                <text textAnchor="middle" dominantBaseline="middle"
                  fontFamily="Cormorant Garamond" fontStyle="italic"
                  fontWeight="500"
                  fontSize={s.g===1?17:13.5} fill={HF.cream}
                  style={{letterSpacing:'-0.01em'}}>
                  {NAMES[s.g][s.i]||''}
                </text>
                {DATES[s.g] && DATES[s.g][s.i] && (
                  <text textAnchor="middle" dominantBaseline="middle"
                    y={s.g===1?16:12}
                    fontFamily="Geist Mono" fontSize={s.g===1?9:8}
                    fill={HF.cream} opacity="0.75">
                    {DATES[s.g][s.i]}
                  </text>
                )}
              </g>
            );
          })}
          {/* Ascendant labels — gen 3 (compressed) */}
          {upSectors.filter(s=>s.g===3 && !s.isEmpty).map((s,k)=>{
            const r=(r0+(s.g-1)*stepUp + r0+s.g*stepUp)/2;
            const [x,y]=polar(r,s.midA);
            const rot=s.midA>0?s.midA-90:s.midA+90;
            return (
              <text key={'l3'+k} x={x} y={y}
                transform={`rotate(${rot} ${x} ${y})`}
                textAnchor="middle" dominantBaseline="middle"
                fontFamily="Cormorant Garamond" fontStyle="italic"
                fontSize="11" fill={HF.cream} opacity="0.85">
                {NAMES[3][s.i]||''}
              </text>
            );
          })}

          {/* Descendant labels */}
          {dnSectors.map((s,k)=>{
            const r=(r0+(s.g-1)*stepDn + r0+s.g*stepDn)/2;
            const [x,y]=polar(r,s.midA);
            const rot=s.midA>0?s.midA-90:s.midA+90;
            return (
              <text key={'ld'+k} x={x} y={y}
                transform={`rotate(${rot} ${x} ${y})`}
                textAnchor="middle" dominantBaseline="middle"
                fontFamily="Cormorant Garamond" fontStyle="italic"
                fontWeight="500"
                fontSize={s.g===1?15:12} fill={HF.cream}>
                {s.name}
              </text>
            );
          })}

          {/* "à rechercher" sectors get a tiny + */}
          {upSectors.filter(s=>s.isEmpty && s.g<=3).map((s,k)=>{
            const r=(r0+(s.g-1)*stepUp + r0+s.g*stepUp)/2;
            const [x,y]=polar(r,s.midA);
            return (
              <text key={'add'+k} x={x} y={y}
                textAnchor="middle" dominantBaseline="middle"
                fontFamily="Geist Mono" fontSize="13"
                fill={HF.rust} opacity="0.55">+</text>
            );
          })}

          {/* CENTER — ego */}
          <circle cx={cx} cy={cy} r={r0+2} fill="none"
            stroke={HF.gold} strokeWidth="0.8" opacity="0.5"/>
          <circle cx={cx} cy={cy} r={r0-4}
            fill={HF.cream} stroke={HF.ink} strokeWidth="1.2"/>
          <text x={cx} y={cy-6} textAnchor="middle"
            fontFamily="Cormorant Garamond" fontStyle="italic"
            fontWeight="500"
            fontSize="22" fill={HF.ink}>Camille</text>
          <text x={cx} y={cy+12} textAnchor="middle"
            fontFamily="Geist Mono" fontSize="9" fill={HF.ink3}
            letterSpacing="0.1em">1981 —</text>
          <text x={cx} y={cy+26} textAnchor="middle"
            fontFamily="Cormorant Garamond" fontStyle="italic"
            fontSize="11" fill={HF.ink3}>architecte</text>
        </svg>

        {/* Bottom-left meta */}
        <div style={{
          position:'absolute', bottom:24, left:48,
          display:'flex', gap:14,
          fontFamily:'Geist Mono, monospace', fontSize:10,
          color:HF.ink3, letterSpacing:'0.05em',
        }}>
          <span>327 personnes</span>
          <span style={{color:HF.line}}>·</span>
          <span>9 générations</span>
          <span style={{color:HF.line}}>·</span>
          <span>74% connues</span>
        </div>
        {/* Bottom-right hint */}
        <div style={{
          position:'absolute', bottom:24, right:48,
          fontFamily:'Geist Mono, monospace', fontSize:10,
          color:HF.ink3, letterSpacing:'0.05em',
          display:'flex', alignItems:'center', gap:8,
        }}>
          <span style={{
            border:`1px solid ${HF.line}`, padding:'2px 6px', borderRadius:3,
            background:HF.cream,
          }}>ESC</span>
          <span>revenir au tableau</span>
        </div>
      </Paper>
    </div>
  );
}

window.HFContemplation = HFContemplation;


// ===== hifi-river.jsx =====
// Screen 03 — Rivière : 9 colonnes générationnelles défilant horizontalement
// Cartes papier, portraits sépia, marqueurs « mort en mer », tags par génération.


function PersonCard({ name, dates, job, tag, ego, sea, tint }) {
  return (
    <div style={{
      borderRadius:6, padding:'10px 12px',
      background:ego ? `linear-gradient(${HF.cream}, ${HF.paper})` : HF.cream,
      border:`1px solid ${ego?HF.ink:HF.line2}`,
      boxShadow: ego
        ? `0 0 0 3px rgba(31,26,20,0.08), 0 1px 3px rgba(0,0,0,0.06)`
        : '0 1px 2px rgba(0,0,0,0.04)',
      position:'relative',
    }}>
      <div style={{display:'flex', gap:9, alignItems:'flex-start'}}>
        <Avatar size={32} tint={tint || 'sepia'}/>
        <div style={{flex:1, minWidth:0}}>
          <div style={{
            fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
            fontSize:14.5, fontWeight: ego?600:500, color:HF.ink,
            lineHeight:1.1, letterSpacing:'-0.005em',
          }}>{name}</div>
          <div style={{
            fontFamily:'Geist Mono, monospace', fontSize:9,
            color:HF.ink3, marginTop:3, letterSpacing:'0.04em',
          }}>{dates}</div>
          {job && job!=='—' && (
            <div style={{
              fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
              fontSize:11, color:HF.ink2, marginTop:2,
            }}>{job}</div>
          )}
        </div>
      </div>
      {sea && (
        <div style={{marginTop:6, paddingTop:6, borderTop:`1px dashed ${HF.line2}`}}>
          <Chip variant="rust">⚓ Mort en mer</Chip>
        </div>
      )}
    </div>
  );
}

function HFRiver() {
  const cols = [
    { gen:'IX', range:'1640–1700', n:'Origines', people:[
      ['Mathurin Lefèvre','1652–1718','laboureur','sepia'],
      ['Perrine T.','1655–1729','—','grey'],
    ]},
    { gen:'VIII', range:'1700–1760', people:[
      ['Yves L.','1690–1755','marin','indigo','','sea'],
      ['Marie L.','1693–1761','filandière','sepia'],
      ['Jacques B.','1701–1768','tonnelier','rust'],
      ['Anne C.','1705–1772','—','grey'],
    ]},
    { gen:'VII', range:'1760–1820', people:[
      ['Mathurin','1745–1812','—','sepia'],
      ['Renée','1748–1820','—','grey'],
      ['Jean','1750–1815','marin','indigo'],
      ['Marguerite','1755–1828','—','sepia'],
    ]},
    { gen:'VI', range:'1820–1860', people:[
      ['Pierre-Marie','1788–1849','cordier','rust'],
      ['Jeanne','1792–1860','lingère','sepia'],
      ['Henri','1798–1855','—','grey'],
      ['Sophie','1801–1868','—','olive'],
    ]},
    { gen:'V', range:'1860–1900', n:'Ère portuaire', people:[
      ['Pierre Lefèvre','1842–1893','charpentier','rust','','sea'],
      ['Marie Dupont','1844–1881','—','sepia'],
      ['Jeanne Martin','1851–1922','—','olive'],
    ]},
    { gen:'IV', range:'1900–1945', people:[
      ['Henri','1885–1962','marin','indigo'],
      ['Sophie','1890–1971','—','sepia'],
      ['Paul','1882–1958','boulanger','rust'],
      ['Madeleine','1888–1969','—','grey'],
    ]},
    { gen:'III', range:'1945–1985', people:[
      ['Pierre','1918–1981','pêcheur','indigo'],
      ['Anne','1922–2003','couturière','rust'],
      ['Étienne','1920–1995','forgeron','sepia'],
      ['Louise','1925–2010','sage-femme','olive'],
    ]},
    { gen:'II', range:'1985–', people:[
      ['Jean Lefèvre','1948–2019','charpentier','sepia','','sea'],
      ['Marguerite','1952–','institutrice','grey'],
    ]},
    { gen:'I', range:'ego', n:'Présent', people:[
      ['Camille','1981–','architecte','sepia','ego'],
    ]},
  ];

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column'}}>
      <HFTopBar active="Rivière"/>
      <Paper style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
        {/* Mode bar */}
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          padding:'14px 28px', borderBottom:`1px solid ${HF.line2}`,
          background:`linear-gradient(${HF.paper}, ${HF.paper2})`,
        }}>
          <span style={{
            fontFamily:'Geist Mono, monospace', fontSize:10,
            color:HF.ink3, letterSpacing:'0.1em', marginRight:10,
          }}>VUE</span>
          {[
            ['Rivière', true],
            ['Éventail', false],
            ['Arbre vertical', false],
            ['Liste', false],
          ].map(([t,active])=>(
            <button key={t} style={{
              padding:'5px 12px', borderRadius:14,
              fontFamily:'Geist, sans-serif', fontSize:11.5,
              border:`1px solid ${active?HF.ink:HF.line2}`,
              background:active?HF.ink:'transparent',
              color:active?HF.cream:HF.ink2,
              letterSpacing:'0.01em',
            }}>{t}</button>
          ))}
          <span style={{
            marginLeft:'auto', fontFamily:'Geist Mono, monospace',
            fontSize:10, color:HF.ink3, letterSpacing:'0.05em',
          }}>scroll horizontal · 9 générations · 327 personnes</span>
        </div>

        {/* River */}
        <div style={{flex:1, position:'relative', overflow:'hidden'}}>
          <div style={{
            display:'flex', height:'100%',
            paddingTop:24, paddingBottom:36,
          }}>
            {cols.map((c, ci) => (
              <div key={ci} style={{
                minWidth: ci===cols.length-1 ? 240 : 196,
                padding:'0 14px',
                borderRight: ci<cols.length-1 ? `1px dashed ${HF.line2}` : 'none',
                display:'flex', flexDirection:'column', gap:10,
                background: ci===cols.length-1
                  ? `linear-gradient(180deg, ${HF.paper2}, ${HF.paper3})`
                  : 'transparent',
                position:'relative',
              }}>
                {/* Header */}
                <div style={{paddingBottom:10, borderBottom:`1px solid ${HF.line}`}}>
                  <div style={{display:'flex', alignItems:'baseline', gap:6}}>
                    <span style={{
                      fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                      fontSize:24, color:HF.ink, fontWeight:500, lineHeight:1,
                    }}>{c.gen}</span>
                    <span style={{
                      fontFamily:'Geist Mono, monospace', fontSize:9.5,
                      color:HF.ink3, letterSpacing:'0.05em',
                    }}>{c.range}</span>
                  </div>
                  {c.n && (
                    <div style={{
                      fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                      fontSize:13, color:HF.rust, marginTop:3,
                    }}>{c.n}</div>
                  )}
                </div>
                {c.people.map((p, pi) => (
                  <PersonCard key={pi}
                    name={p[0]} dates={p[1]} job={p[2]}
                    tint={p[3]} ego={p[4]==='ego'} sea={p[5]==='sea'}/>
                ))}
                {ci<4 && (
                  <div style={{
                    border:`1px dashed ${HF.line}`, borderRadius:6,
                    padding:'12px 8px', textAlign:'center',
                    fontFamily:'Geist Mono, monospace', fontSize:9.5,
                    color:HF.ink3, letterSpacing:'0.05em',
                    background:'transparent',
                  }}>+ ancêtre</div>
                )}
              </div>
            ))}
          </div>
          {/* Right gradient fade */}
          <div style={{
            position:'absolute', right:0, top:0, bottom:0, width:60,
            background:`linear-gradient(90deg, transparent, ${HF.paper})`,
            pointerEvents:'none',
          }}/>
        </div>
      </Paper>
    </div>
  );
}

window.HFRiver = HFRiver;


// ===== hifi-atelier.jsx =====
// Screen 04 — Atelier : page personne pleine, hi-fi.
// Pierre Lefèvre · 1842–1893 · charpentier de marine · disparu en mer.


function HFAtelier() {
  const events = [
    ['1842','Naissance','Saint-Malo · paroisse de St-Servan'],
    ['1858','Apprentissage','Chantier Cunin & frères'],
    ['1865','Mariage','avec Marie Dupont · Saint-Malo'],
    ['1868','Naissance','de Henri, son fils aîné'],
    ['1871','Naissance','de Marie-Anne'],
    ['1874','Naissance','de Joseph'],
    ['1880','Divorce','Marie Dupont'],
    ['1882','Mariage','avec Jeanne Martin, veuve'],
    ['1893','Disparu en mer','Cap Fréhel · 14 décembre'],
  ];
  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column'}}>
      <HFTopBar active="Atelier"/>
      <Paper tone="cream" style={{flex:1, overflow:'auto'}}>
        <div style={{padding:'48px 64px 64px', maxWidth:1200, margin:'0 auto'}}>
          {/* Breadcrumb */}
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            fontFamily:'Geist Mono, monospace', fontSize:10,
            color:HF.ink3, letterSpacing:'0.06em', marginBottom:14,
          }}>
            <span>RIVIÈRE</span>
            <span style={{color:HF.line}}>›</span>
            <span>GÉN. V · 1860–1900</span>
            <span style={{color:HF.line}}>›</span>
            <span style={{color:HF.ink}}>PIERRE LEFÈVRE</span>
          </div>

          {/* Hero */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:48, alignItems:'flex-end'}}>
            <div>
              <Eyebrow>Génération V · branche paternelle</Eyebrow>
              <h1 style={{
                fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                fontSize:96, fontWeight:500, lineHeight:0.92,
                margin:'10px 0 14px', color:HF.ink, letterSpacing:'-0.03em',
              }}>Pierre<br/>Lefèvre.</h1>
              <div style={{display:'flex', alignItems:'baseline', gap:14, flexWrap:'wrap'}}>
                <span style={{
                  fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                  fontSize:22, color:HF.ink2,
                }}>1842 — 1893</span>
                <span style={{color:HF.line}}>·</span>
                <span style={{
                  fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                  fontSize:22, color:HF.ink2,
                }}>charpentier de marine</span>
                <Chip variant="rust">⚓ Disparu en mer · Cap Fréhel</Chip>
              </div>
            </div>
            <div style={{position:'relative'}}>
              <Photo w={300} h={360} tint="sepia" label="portrait · Saint-Malo, 1885"
                style={{boxShadow:'0 8px 32px rgba(40,28,12,0.25), 0 2px 8px rgba(0,0,0,0.15)'}}/>
              {/* corner photo tabs */}
              <div style={{
                position:'absolute', top:-6, left:-6, right:-6, bottom:-6,
                border:`1px solid ${HF.line}`, pointerEvents:'none',
                borderRadius:2,
              }}/>
            </div>
          </div>

          {/* Tab strip */}
          <div style={{
            display:'flex', gap:0, marginTop:48,
            borderBottom:`1px solid ${HF.line}`,
          }}>
            {['Biographie','Conjoints · 2','Enfants · 3','Documents · 4','Lieux · 6','Pistes · 1'].map((t,i) => (
              <div key={t} style={{
                padding:'12px 20px',
                borderBottom: i===0 ? `2px solid ${HF.ink}` : '2px solid transparent',
                fontFamily:'Geist, sans-serif', fontSize:12.5,
                color:i===0?HF.ink:HF.ink3, fontWeight:i===0?500:400,
                marginBottom:-1,
              }}>{t}</div>
            ))}
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:48, marginTop:32}}>
            {/* Left column — biography */}
            <div>
              <Eyebrow>Biographie · éditable inline</Eyebrow>
              <div style={{
                fontFamily:'Cormorant Garamond, serif',
                fontSize:18, lineHeight:1.65, color:HF.ink2,
                marginTop:14,
              }}>
                <p style={{marginTop:0}}>
                  <span style={{
                    fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                    fontSize:48, lineHeight:0.8, float:'left',
                    marginRight:8, marginTop:6, color:HF.sepia,
                  }}>C</span>harpentier
                  de marine à Saint-Malo, embarqué dès l'âge de seize ans sur des goélettes
                  terre-neuvas. Premier mariage avec Marie Dupont en 1865 — trois enfants,
                  séparation en 1880.
                </p>
                <p>
                  Second mariage en 1882 avec Jeanne Martin, veuve d'un matelot.
                  Disparu lors d'un coup de vent au large du Cap Fréhel en
                  décembre 1893 ; le corps n'a jamais été retrouvé.
                  <Chip variant="rust">à rechercher</Chip>
                </p>
                <p style={{
                  fontStyle:'italic', color:HF.ink3,
                  borderLeft:`3px solid ${HF.sepia}`, paddingLeft:18,
                  marginTop:24, fontSize:16,
                }}>
                  « Mon père partait au matin ; quand il revenait, le sel
                  blanchissait encore son visage. » <br/>
                  <span style={{
                    fontFamily:'Geist Mono, monospace', fontSize:10,
                    color:HF.ink4, letterSpacing:'0.05em', fontStyle:'normal',
                  }}>— Marie-Anne Lefèvre, lettre à sa fille, 1924</span>
                </p>
              </div>

              <div style={{height:1, background:HF.line2, margin:'32px 0'}}/>

              {/* Conjoints */}
              <Eyebrow>Conjoints · 2</Eyebrow>
              <div style={{display:'flex', gap:0, marginTop:14, borderBottom:`1px solid ${HF.line2}`}}>
                <div style={{
                  padding:'10px 18px 12px', borderBottom:`2px solid ${HF.ink}`,
                  marginBottom:-1, fontFamily:'Cormorant Garamond, serif',
                  fontStyle:'italic', fontSize:15, color:HF.ink, fontWeight:500,
                }}>
                  Marie Dupont
                  <span style={{
                    fontFamily:'Geist Mono, monospace', fontSize:10,
                    color:HF.ink3, marginLeft:10, fontStyle:'normal',
                    letterSpacing:'0.05em',
                  }}>1865 — 1880 · divorce</span>
                </div>
                <div style={{
                  padding:'10px 18px 12px',
                  fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                  fontSize:15, color:HF.ink3,
                }}>
                  Jeanne Martin
                  <span style={{
                    fontFamily:'Geist Mono, monospace', fontSize:10,
                    marginLeft:10, fontStyle:'normal', letterSpacing:'0.05em',
                  }}>1882 — 1893</span>
                </div>
              </div>
              <div style={{display:'flex', gap:16, marginTop:18, alignItems:'flex-start'}}>
                <Photo w={84} h={104} tint="sepia" label="1862"/>
                <div style={{flex:1}}>
                  <div style={{
                    fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                    fontSize:18, color:HF.ink, fontWeight:500,
                  }}>Marie Dupont <span style={{color:HF.ink3, fontSize:14}}>(1844 — 1881)</span></div>
                  <p style={{
                    fontFamily:'Cormorant Garamond, serif', fontSize:14,
                    lineHeight:1.55, color:HF.ink2, margin:'6px 0 0',
                  }}>
                    Fille de marin, rencontrée à la halle aux poissons.
                    Trois enfants : Henri (1868), Marie-Anne (1871),
                    Joseph (1874). Décédée en couches.
                  </p>
                </div>
              </div>

              <div style={{height:1, background:HF.line2, margin:'32px 0'}}/>

              {/* Enfants */}
              <Eyebrow>Enfants · 3</Eyebrow>
              <div style={{display:'flex', gap:14, marginTop:14, flexWrap:'wrap'}}>
                {[
                  ['Henri','1868–1942','marin','indigo'],
                  ['Marie-Anne','1871–1948','dentellière','sepia'],
                  ['Joseph','1874–1901','—','grey'],
                ].map(([n,d,j,t]) => (
                  <div key={n} style={{
                    display:'flex', alignItems:'center', gap:12,
                    border:`1px solid ${HF.line2}`, borderRadius:6,
                    padding:'10px 14px 10px 10px',
                    background:HF.cream, flex:1, minWidth:180,
                  }}>
                    <Avatar size={42} tint={t}/>
                    <div>
                      <div style={{
                        fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                        fontSize:16, color:HF.ink, fontWeight:500,
                      }}>{n}</div>
                      <div style={{
                        fontFamily:'Geist Mono, monospace', fontSize:9.5,
                        color:HF.ink3, marginTop:2, letterSpacing:'0.04em',
                      }}>{d}</div>
                      {j!=='—' && (
                        <div style={{
                          fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                          fontSize:11, color:HF.ink3, marginTop:1,
                        }}>{j}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — life timeline + docs */}
            <aside>
              <Eyebrow>Vie · 9 jalons</Eyebrow>
              <div style={{
                marginTop:14,
                borderLeft:`1px solid ${HF.line}`,
                paddingLeft:20,
              }}>
                {events.map(([y,t,d],i) => (
                  <div key={i} style={{position:'relative', padding:'8px 0'}}>
                    <span style={{
                      position:'absolute', left:-26, top:13,
                      width:9, height:9, borderRadius:'50%',
                      background: t==='Disparu en mer' ? HF.rust : HF.cream,
                      border:`1.5px solid ${t==='Disparu en mer' ? HF.rust : HF.ink2}`,
                    }}/>
                    <div style={{display:'flex', alignItems:'baseline', gap:10}}>
                      <span style={{
                        fontFamily:'Geist Mono, monospace', fontSize:10.5,
                        color: t==='Disparu en mer' ? HF.rust : HF.ink3,
                        letterSpacing:'0.05em', minWidth:34,
                      }}>{y}</span>
                      <div style={{
                        fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                        fontSize:14.5,
                        color: t==='Disparu en mer' ? HF.rust : HF.ink,
                        fontWeight:500,
                      }}>{t}</div>
                    </div>
                    <div style={{
                      fontSize:11, color:HF.ink3, marginLeft:44, marginTop:1,
                    }}>{d}</div>
                  </div>
                ))}
              </div>

              <div style={{height:1, background:HF.line2, margin:'28px 0 20px'}}/>

              <Eyebrow>Documents · 4</Eyebrow>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12}}>
                <Photo w="100%" h={92} tint="sepia" label="acte naissance"/>
                <Photo w="100%" h={92} tint="grey" label="photo · 1885"/>
                <Photo w="100%" h={92} tint="sepia" label="registre paroisse"/>
                <Photo w="100%" h={92} tint="rust" label="avis ⚓ 1893"/>
              </div>
              <button style={{
                marginTop:14, width:'100%', padding:'10px',
                border:`1px dashed ${HF.line}`, borderRadius:6,
                background:'transparent', fontFamily:'Geist Mono, monospace',
                fontSize:10.5, color:HF.ink3, letterSpacing:'0.08em',
              }}>+ AJOUTER UN DOCUMENT</button>
            </aside>
          </div>
        </div>
      </Paper>
    </div>
  );
}

window.HFAtelier = HFAtelier;


// ===== hifi-album-pistes.jsx =====
// Screen 05 — Album : mur de souvenirs photo, mosaïque variable.
// Screen 06 — Pistes : suggestions automatiques + 1 enquête détaillée.


function HFAlbum() {
  const tiles = [
    {w:3,h:2,l:'mariage Henri & Sophie · Saint-Malo, 1923',tint:'sepia',y:'1923'},
    {w:1,h:1,l:'Pierre L., 1885',tint:'sepia',y:'1885'},
    {w:1,h:1,l:'acte de naissance, 1842',tint:'grey',y:'1842'},
    {w:2,h:2,l:'famille Lefèvre · jardin, 1948',tint:'sepia',y:'1948'},
    {w:1,h:2,l:'lettre de Jeanne à Pierre, 1893',tint:'rust',y:'1893'},
    {w:1,h:1,l:'1962',tint:'indigo',y:'1962'},
    {w:1,h:1,l:'avis de décès en mer ⚓',tint:'rust',y:'1893'},
    {w:2,h:1,l:'classe de Mlle Lefèvre, 1958',tint:'sepia',y:'1958'},
    {w:1,h:1,l:'1978',tint:'olive',y:'1978'},
    {w:1,h:1,l:'1985',tint:'grey',y:'1985'},
    {w:2,h:1,l:'Camille · 1981',tint:'sepia',y:'1981'},
    {w:1,h:1,l:'cap Fréhel',tint:'indigo',y:'?'},
  ];
  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column'}}>
      <HFTopBar active="Album"/>
      <Paper style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
        <div style={{padding:'40px 56px 18px'}}>
          <Eyebrow>Mur de souvenirs · 142 documents</Eyebrow>
          <h1 style={{
            fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
            fontSize:64, fontWeight:500, margin:'8px 0 16px',
            lineHeight:0.95, color:HF.ink, letterSpacing:'-0.02em',
          }}>Le mur des souvenirs.</h1>
          <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
            <Chip variant="solid">Tous · 142</Chip>
            <Chip>Pierre L. · 18</Chip>
            <Chip>Branche maternelle · 47</Chip>
            <Chip>1900–1950 · 36</Chip>
            <Chip>Lettres · 23</Chip>
            <Chip>Actes · 41</Chip>
            <Chip>Photos · 78</Chip>
            <span style={{
              marginLeft:'auto',
              fontFamily:'Geist Mono, monospace', fontSize:10,
              color:HF.ink3, letterSpacing:'0.05em',
            }}>glisser sur une fiche pour rattacher</span>
          </div>
        </div>
        <div style={{flex:1, padding:'10px 56px 40px', overflow:'hidden'}}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(6, 1fr)',
            gridAutoRows:'130px', gap:14,
          }}>
            {tiles.map((t,i) => (
              <div key={i} style={{
                gridColumn:`span ${t.w}`, gridRow:`span ${t.h}`,
                position:'relative', borderRadius:2, overflow:'hidden',
                boxShadow:'0 4px 14px rgba(40,28,12,0.18), 0 1px 3px rgba(0,0,0,0.1)',
                transform: i%5===0 ? 'rotate(-0.6deg)' : i%4===0 ? 'rotate(0.4deg)' : 'none',
              }}>
                <Photo w="100%" h="100%" tint={t.tint}/>
                <div style={{
                  position:'absolute', inset:0,
                  background:'linear-gradient(180deg, transparent 50%, rgba(20,12,4,0.55))',
                  pointerEvents:'none',
                }}/>
                <div style={{
                  position:'absolute', left:10, top:10,
                  fontFamily:'Geist Mono, monospace', fontSize:9,
                  color:'rgba(255,247,232,0.85)', letterSpacing:'0.08em',
                  background:'rgba(20,12,4,0.4)', padding:'2px 6px', borderRadius:2,
                  backdropFilter:'blur(2px)',
                }}>{t.y}</div>
                <div style={{
                  position:'absolute', left:12, right:12, bottom:10,
                  fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                  fontSize:t.w>=2?16:13,
                  color:'rgba(255,247,232,0.95)', lineHeight:1.2,
                  textShadow:'0 1px 4px rgba(0,0,0,0.6)',
                }}>{t.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Paper>
    </div>
  );
}

function PisteCard({ idx, kind, title, sub, variant='default', cta='Examiner', expanded }) {
  return (
    <article style={{
      padding:'22px 0', borderTop:`1px solid ${HF.line2}`,
      display:'flex', flexDirection:'column', gap:16,
    }}>
      <div style={{display:'flex', alignItems:'center', gap:18}}>
        <span style={{
          fontFamily:'Geist Mono, monospace', fontSize:10.5,
          color:HF.ink3, minWidth:30, letterSpacing:'0.05em',
        }}>0{idx}</span>
        <Chip variant={variant}>{kind}</Chip>
        <div style={{flex:1}}>
          <h3 style={{
            fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
            fontSize:24, fontWeight:500, margin:0, lineHeight:1.15,
            color:HF.ink, letterSpacing:'-0.01em',
          }}>{title}</h3>
          <p style={{
            margin:'3px 0 0', fontSize:12, color:HF.ink3, lineHeight:1.45,
          }}>{sub}</p>
        </div>
        <button style={{
          padding:'8px 14px', borderRadius:5, fontFamily:'Geist, sans-serif',
          fontSize:11.5, color:HF.ink3, background:'transparent', border:'none',
        }}>plus tard</button>
        <button style={{
          padding:'8px 16px', borderRadius:5, fontFamily:'Geist, sans-serif',
          fontSize:11.5, color:HF.cream, background:HF.ink, border:`1px solid ${HF.ink}`,
          letterSpacing:'0.01em',
        }}>{cta}</button>
      </div>
      {expanded}
    </article>
  );
}

function HFPistes() {
  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column'}}>
      <HFTopBar active="Pistes"/>
      <Paper tone="cream" style={{flex:1, overflow:'auto'}}>
        <div style={{padding:'48px 64px 24px', maxWidth:1100, margin:'0 auto'}}>
          <Eyebrow>Pistes · 5 suggestions</Eyebrow>
          <h1 style={{
            fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
            fontSize:60, fontWeight:500, margin:'8px 0 12px',
            lineHeight:0.95, color:HF.ink, letterSpacing:'-0.02em',
          }}>Ce que l'app a remarqué.</h1>
          <p style={{
            maxWidth:560, fontSize:15, color:HF.ink2, margin:0, lineHeight:1.55,
            fontFamily:'Cormorant Garamond, serif',
          }}>
            Détecté à partir des données existantes. Rien n'est modifié sans
            votre accord — chaque piste peut être ignorée, archivée ou remise
            à plus tard.
          </p>
        </div>
        <div style={{padding:'0 64px 56px', maxWidth:1100, margin:'0 auto'}}>
          <PisteCard idx={1} kind="Doublon" variant="rust"
            title="Jean Lefèvre apparaît deux fois"
            sub="Naissances enregistrées en 1842 et 1843 · même paroisse, mêmes parents · score 94%"
            cta="Fusionner"
            expanded={
              <div style={{
                marginLeft:48, padding:'18px 22px',
                background:HF.paper, borderRadius:8,
                border:`1px solid ${HF.line2}`,
                display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:18, alignItems:'center',
              }}>
                <div style={{display:'flex', gap:12}}>
                  <Avatar size={48} tint="sepia"/>
                  <div>
                    <div style={{
                      fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                      fontSize:16, color:HF.ink, fontWeight:500,
                    }}>Jean Lefèvre</div>
                    <div style={{fontFamily:'Geist Mono, monospace', fontSize:10, color:HF.ink3, marginTop:2}}>né le 12 mars 1842 · St-Malo</div>
                    <div style={{fontFamily:'Geist Mono, monospace', fontSize:10, color:HF.ink3}}>père : Pierre · mère : Marie D.</div>
                  </div>
                </div>
                <div style={{
                  width:36, height:36, borderRadius:'50%',
                  background:HF.rust, color:HF.cream,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'Geist Mono, monospace', fontSize:14,
                }}>≈</div>
                <div style={{display:'flex', gap:12}}>
                  <Avatar size={48} tint="grey"/>
                  <div>
                    <div style={{
                      fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                      fontSize:16, color:HF.ink, fontWeight:500,
                    }}>Jean Lefèvre</div>
                    <div style={{fontFamily:'Geist Mono, monospace', fontSize:10, color:HF.ink3, marginTop:2}}>né le 14 mars 1843 · St-Malo</div>
                    <div style={{fontFamily:'Geist Mono, monospace', fontSize:10, color:HF.ink3}}>père : Pierre · mère : Marie D.</div>
                  </div>
                </div>
              </div>
            }/>
          <PisteCard idx={2} kind="Date" variant="rust"
            title="Mariage avant naissance"
            sub="Anne Berthier · mariage en 1918, née 1922 — incohérence de 4 ans"
            cta="Corriger"/>
          <PisteCard idx={3} kind="Branche"
            title="Trois personnes orphelines"
            sub="Aucun rattachement à l'arbre principal · importé du GEDCOM 2023"
            cta="Rattacher"/>
          <PisteCard idx={4} kind="Visage"
            title="Photo de mariage 1923 — sept visages non identifiés"
            sub="Reconnaître via les autres clichés ? · 4 candidats détectés"
            cta="Identifier"/>
          <PisteCard idx={5} kind="Lieu"
            title="Saint-Malo orthographié de quatre façons"
            sub="St-Malo · St Malo · Saint-Malo · St. Malo — 17 occurrences"
            cta="Normaliser"/>
        </div>
      </Paper>
    </div>
  );
}

Object.assign(window, { HFAlbum, HFPistes });

