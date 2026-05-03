// Screen 03 — Rivière : 9 colonnes générationnelles défilant horizontalement
// Cartes papier, portraits sépia, marqueurs « mort en mer », tags par génération.

const { HF, Paper, HFTopBar, Avatar, Eyebrow, Chip } = window;

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
