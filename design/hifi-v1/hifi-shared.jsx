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
