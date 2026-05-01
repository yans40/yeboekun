// Screen 05 — Album : mur de souvenirs photo, mosaïque variable.
// Screen 06 — Pistes : suggestions automatiques + 1 enquête détaillée.

const { HF, Photo, Paper, HFTopBar, Avatar, Eyebrow, Chip } = window;

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

function Lead({ idx, kind, title, sub, variant='default', cta='Examiner', expanded }) {
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
          <Lead idx={1} kind="Doublon" variant="rust"
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
          <Lead idx={2} kind="Date" variant="rust"
            title="Mariage avant naissance"
            sub="Anne Berthier · mariage en 1918, née 1922 — incohérence de 4 ans"
            cta="Corriger"/>
          <Lead idx={3} kind="Branche"
            title="Trois personnes orphelines"
            sub="Aucun rattachement à l'arbre principal · importé du GEDCOM 2023"
            cta="Rattacher"/>
          <Lead idx={4} kind="Visage"
            title="Photo de mariage 1923 — sept visages non identifiés"
            sub="Reconnaître via les autres clichés ? · 4 candidats détectés"
            cta="Identifier"/>
          <Lead idx={5} kind="Lieu"
            title="Saint-Malo orthographié de quatre façons"
            sub="St-Malo · St Malo · Saint-Malo · St. Malo — 17 occurrences"
            cta="Normaliser"/>
        </div>
      </Paper>
    </div>
  );
}

Object.assign(window, { HFAlbum, HFPistes });
