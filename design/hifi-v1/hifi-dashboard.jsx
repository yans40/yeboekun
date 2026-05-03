// Screen 01 — Tableau de bord (dashboard) hi-fi
// Welcome hero + family snapshot fan + stats + integrated timeline + leads.

const { HF, Photo, Paper, HFTopBar, Avatar, Eyebrow, Chip } = window;

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
