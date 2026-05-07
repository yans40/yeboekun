// Screen 02 — Contemplation : éventail bidirectionnel hi-fi
// Ascendants en haut (5 gén · sépia), descendants en bas (2 gén · olive)
// Centré sur l'ego — atmosphère contemplative, fond papier crème,
// halo doré, légère vignette, étiquettes serif italique.

const { HF, Paper, HFTopBar, Eyebrow, Chip } = window;

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
