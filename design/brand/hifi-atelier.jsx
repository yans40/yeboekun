// Screen 04 — Atelier : page personne pleine, hi-fi.
// Pierre Lefèvre · 1842–1893 · charpentier de marine · disparu en mer.

const { HF, Photo, Paper, HFTopBar, Avatar, Eyebrow, Chip } = window;

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
