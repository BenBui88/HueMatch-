import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ── Global state (simple — no separate store file needed) ──────────────
export type UserRole = 'client' | 'tech' | 'owner' | null

let globalRole: UserRole = null
let globalUserName: string = ''
let globalOutfitHex: string = '#7C5C8A'
let globalSkinHex: string = ''
let globalSkinName: string = ''
let globalUndertone: string = 'neutral'
let globalNailType: 'Gel' | 'Regular' | 'SNS' = 'Gel'

export function getRole() { return globalRole }
export function setRole(r: UserRole) { globalRole = r }
export function getUserName() { return globalUserName }
export function setUserName(n: string) { globalUserName = n }
export function getOutfitHex() { return globalOutfitHex }
export function setOutfitHex(h: string) { globalOutfitHex = h }
export function getSkinHex() { return globalSkinHex }
export function getSkinName() { return globalSkinName }
export function getUndertone() { return globalUndertone }
export function setSkin(hex: string, name: string, ut: string) { globalSkinHex = hex; globalSkinName = name; globalUndertone = ut }
export function getNailType() { return globalNailType }
export function setNailType(t: 'Gel' | 'Regular' | 'SNS') { globalNailType = t }

// ── Pages ──────────────────────────────────────────────────────────────
function LandingPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<UserRole>(null)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')

  const signIn = () => {
    setRole(selected ?? 'client')
    setUserName(name || email.split('@')[0] || 'User')
    navigate('/match')
  }

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '2rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FDF0F2', border: '2px solid #F4C0D1', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✦</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 300, margin: 0 }}>
          <span style={{ color: '#C4546A' }}>Hue</span><span style={{ color: '#2C2B4B' }}>Match</span>
        </h1>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', color: '#a0a0b0', marginTop: 4 }}>Match your nails. Match your style.</p>
      </div>

      <div style={{ background: '#f8f7f9', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', border: '0.5px solid #eee' }}>
        {[
          { icon: '💅', text: 'AI matches shades to your outfit + skin tone' },
          { icon: '⭐', text: 'Earn HuePoints on every booking' },
          { icon: '👥', text: 'Follow your favorite nail techs' },
          { icon: '🗺️', text: 'Discover salons by color near you' },
        ].map(b => (
          <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, color: '#6b6b80' }}>
            <span>{b.icon}</span>{b.text}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#a0a0b0', marginBottom: 12 }}>I am a...</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: '1.5rem' }}>
        {[
          { role: 'client' as UserRole, icon: '👤', title: 'Client',       sub: 'Find colors, book techs, earn points' },
          { role: 'tech'   as UserRole, icon: '⭐', title: 'Nail tech',    sub: 'Manage your portable profile' },
          { role: 'owner'  as UserRole, icon: '🏪', title: 'Salon owner',  sub: 'Analytics and team management' },
        ].map(r => (
          <button key={String(r.role)} onClick={() => setSelected(r.role)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: selected === r.role ? '#FDF0F2' : 'white', borderRadius: 12, border: selected === r.role ? '1.5px solid #C4546A' : '0.5px solid #eee', cursor: 'pointer', textAlign: 'left' as const, width: '100%' }}>
            <span style={{ fontSize: 22 }}>{r.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{r.title}</div>
              <div style={{ fontSize: 11, color: '#6b6b80', marginTop: 2 }}>{r.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ marginBottom: '1rem' }}>
          <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
            style={{ width: '100%', height: 40, border: '0.5px solid #ddd', borderRadius: 8, padding: '0 12px', fontSize: 13, marginBottom: 8, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif' }} />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', height: 40, border: '0.5px solid #ddd', borderRadius: 8, padding: '0 12px', fontSize: 13, marginBottom: 8, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif' }} />
        </div>
      )}

      <button onClick={signIn}
        style={{ width: '100%', height: 48, background: '#C4546A', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, fontFamily: 'Outfit, sans-serif', cursor: 'pointer' }}>
        Get started ✦
      </button>
    </div>
  )
}

function MatchScreen() {
  const navigate    = useNavigate()
  const [outfitHex, setOutfitHexState]   = useState('#7C5C8A')
  const [outfitSet, setOutfitSet]        = useState(false)
  const [skinHex,   setSkinHexState]     = useState('')
  const [skinName,  setSkinNameState]    = useState('')
  const [undertone, setUndertoneState]   = useState('neutral')
  const [nailType,  setNailTypeState]    = useState<'Gel'|'Regular'|'SNS'>('Gel')
  const [loading,   setLoading]          = useState(false)
  const [thinking,  setThinking]         = useState('')
  const [results,   setResults]          = useState<{name:string;brand:string;hex:string;match:number;reason:string}[]|null>(null)

  const SKIN_TONES = [
    {hex:'#FDDBB4',name:'Fair porcelain', ut:'cool'},
    {hex:'#F5C99A',name:'Light ivory',    ut:'neutral'},
    {hex:'#EAB98A',name:'Light beige',    ut:'warm'},
    {hex:'#D4956A',name:'Medium beige',   ut:'warm'},
    {hex:'#C07B4F',name:'Medium tan',     ut:'warm'},
    {hex:'#A0622E',name:'Medium brown',   ut:'warm'},
    {hex:'#8B4513',name:'Caramel brown',  ut:'warm'},
    {hex:'#6B3A2A',name:'Deep brown',     ut:'neutral'},
    {hex:'#4A2015',name:'Deep espresso',  ut:'cool'},
    {hex:'#2D0D00',name:'Deep ebony',     ut:'cool'},
  ]

  const FALLBACK = [
    {name:'Lavender Dusk',  brand:'OPI GelColor', hex:'#9B7DB8', match:97, reason:'Analogous purple harmonizes beautifully.'},
    {name:'Berry Whisper',  brand:'Gelish',        hex:'#8B5B8E', match:93, reason:'Deeper tone extends the palette.'},
    {name:'Plum Poetry',    brand:'CND Shellac',   hex:'#6E4A7A', match:89, reason:'Jewel tone adds depth.'},
    {name:'Mauve Mist',     brand:'Entity',        hex:'#B89AB8', match:85, reason:'Dusty, tonal and elegant.'},
    {name:'Lilac Dream',    brand:'IBD',           hex:'#C2A8D4', match:80, reason:'Lighter tint, airy coordination.'},
    {name:'Orchid Haze',    brand:'Orly',          hex:'#B090C0', match:75, reason:'Neutral purple bridge.'},
  ]

  const SALONS = [
    {name:'Luxe Nail Bar',   emoji:'💅', avail:'6 matches', dist:'0.3 mi', bColor:'#D4145A'},
    {name:'The Nail Studio', emoji:'✨', avail:'4 matches', dist:'0.7 mi', bColor:null},
    {name:'Pink & Polish',   emoji:'🌸', avail:'5 matches', dist:'1.2 mi', bColor:'#2D5BE3'},
  ]

  const pickOutfit = () => {
    const colors = ['#C4546A','#4A7B9D','#5A8A5A','#C4934A','#7C5C8A']
    const c = colors[Math.floor(Math.random() * colors.length)]
    setOutfitHexState(c); setOutfitHex(c); setOutfitSet(true)
  }

  const selectSkin = (t: typeof SKIN_TONES[0]) => {
    setSkinHexState(t.hex); setSkinNameState(t.name); setUndertoneState(t.ut)
    setSkin(t.hex, t.name, t.ut)
  }

  const steps = [
    `Reading outfit color ${outfitHex}...`,
    `Analyzing skin tone — ${skinName || 'medium beige'}...`,
    'Applying color harmony theory...', 'Filtering salon inventories...', 'Ranking by match score...',
  ]

  const runMatch = async () => {
    setResults(null); setLoading(true); let i = 0
    const iv = setInterval(() => { setThinking(steps[Math.min(i++, steps.length-1)]) }, 700)
    try {
      const res  = await fetch('https://api.anthropic.com/v1/messages', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1200,
          messages:[{role:'user', content:`Nail colorist. Outfit:${outfitHex}. Skin:${skinName||'medium'} (${undertone}, ${skinHex||'#D4956A'}). Type:${nailType}. Return ONLY JSON array of 6: [{"name":"","brand":"","hex":"#xxxxxx","match":95,"reason":""}]. Real brands. Sort by match desc.`}]})})
      const data = await res.json()
      setResults(JSON.parse(data.content[0].text.trim().replace(/```json|```/g,'')))
    } catch { setResults(FALLBACK) }
    finally { clearInterval(iv); setLoading(false) }
  }

  const sp = (extra?: object) => ({ fontFamily: 'Outfit, sans-serif', ...extra })

  return (
    <div style={sp({ display:'flex', flexDirection:'column', minHeight:'100%', paddingBottom:80 })}>
      <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 20px 4px', fontSize:11, fontWeight:500 }}><span>9:41</span><span>●●●</span></div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 18px 4px' }}>
        <span style={{ fontFamily:'Cormorant Garamond, serif', fontSize:19, fontWeight:600 }}><span style={{color:'#C4546A'}}>Hue</span><span style={{color:'#2C2B4B'}}>Match</span></span>
        <span style={{ fontSize:11, color:'#6b6b80' }}>Hi, {getUserName().split(' ')[0] || 'there'} 👋</span>
      </div>
      <div style={{ padding:'4px 18px 12px' }}>
        <p style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.18em', color:'#C4546A', marginBottom:4 }}>Match your nails. Match your style.</p>
        <h1 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:26, fontWeight:300, lineHeight:1.2, color:'#1a1a2e', margin:0 }}>Find your<br /><em style={{color:'#2C2B4B'}}>perfect</em> shade.</h1>
        <p style={{ fontSize:12, color:'#6b6b80', marginTop:6, lineHeight:1.5 }}>Outfit color + skin tone — AI matches both at once.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:'0 18px', marginBottom:14 }}>
        <div>
          <p style={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'#a0a0b0', marginBottom:6 }}>👗 Outfit</p>
          <div style={{ border: outfitSet ? '1.5px solid #C4546A':'0.5px solid #ddd', borderRadius:12, overflow:'hidden' }}>
            <button onClick={pickOutfit} style={{ width:'100%', height:88, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, cursor:'pointer', border:'none', background: outfitSet ? outfitHex+'22':'#f8f7f9' }}>
              {outfitSet ? <><div style={{width:48,height:48,borderRadius:'50%',background:outfitHex,border:'3px solid white'}}/><p style={{fontSize:10,color:'#C4546A',margin:0}}>Extracted ✦</p></>
                         : <><span style={{fontSize:22}}>📷</span><p style={{fontSize:10,color:'#a0a0b0',margin:0}}>Tap to pick</p></>}
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 8px', borderTop:'0.5px solid #eee' }}>
              <input type="color" value={outfitHex} onChange={e=>{setOutfitHexState(e.target.value);setOutfitHex(e.target.value);setOutfitSet(true)}} style={{width:26,height:26,border:'0.5px solid #ddd',borderRadius:6,cursor:'pointer',padding:2}}/>
              <input type="text" defaultValue={outfitHex} onChange={e=>{ if(/^#[0-9a-fA-F]{6}$/.test(e.target.value)){setOutfitHexState(e.target.value);setOutfitHex(e.target.value);setOutfitSet(true)} }} style={{flex:1,height:26,border:'0.5px solid #ddd',borderRadius:6,padding:'0 7px',fontSize:11,minWidth:0,outline:'none'}}/>
            </div>
          </div>
        </div>
        <div>
          <p style={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'#a0a0b0', marginBottom:6 }}>👆 Skin tone</p>
          <div style={{ border: skinHex ? '1.5px solid #C4546A':'0.5px solid #ddd', borderRadius:12, overflow:'hidden', padding:8 }}>
            {skinHex && <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:6}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:skinHex,border:'2px solid white',boxShadow:'0 0 0 1px #ddd',flexShrink:0}}/>
              <div><p style={{fontSize:10,fontWeight:500,color:'#1a1a2e',margin:0}}>{skinName}</p><p style={{fontSize:9,color:'#a0a0b0',margin:0}}>{undertone}</p></div>
              <button onClick={()=>{setSkinHexState('');setSkinNameState('');setSkin('','','')}} style={{marginLeft:'auto',fontSize:9,color:'#C4546A',border:'none',background:'none',cursor:'pointer'}}>Redo</button>
            </div>}
            <div style={{ display:'flex', flexWrap:'wrap', gap:4, justifyContent:'center' }}>
              {SKIN_TONES.map(t=>(
                <button key={t.hex} onClick={()=>selectSkin(t)} title={t.name}
                  style={{width:28,height:28,borderRadius:'50%',background:t.hex,border:skinHex===t.hex?'2px solid #2C2B4B':'2px solid transparent',cursor:'pointer',padding:0,transform:skinHex===t.hex?'scale(1.12)':'scale(1)',transition:'all 0.12s'}}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:'flex', gap:6, padding:'0 18px', marginBottom:12 }}>
        {(['Gel','Regular','SNS'] as const).map(t=>(
          <button key={t} onClick={()=>{setNailTypeState(t);setNailType(t)}}
            style={{flex:1,height:34,borderRadius:8,border:nailType===t?'1.5px solid #C4546A':'0.5px solid #ddd',background:nailType===t?'#FDF0F2':'transparent',color:nailType===t?'#C4546A':'#6b6b80',fontSize:11,cursor:'pointer',fontFamily:'Outfit, sans-serif'}}>
            {t==='SNS'?'SNS / Dip':t}
          </button>
        ))}
      </div>

      <div style={{ padding:'0 18px', marginBottom:12 }}>
        <button onClick={runMatch} disabled={loading} style={{width:'100%',height:48,background:'#C4546A',color:'white',border:'none',borderRadius:12,fontSize:13,fontWeight:500,fontFamily:'Outfit, sans-serif',cursor:'pointer',opacity:loading?0.7:1}}>
          ✦ Find my perfect shades
        </button>
      </div>

      {loading && (
        <div style={{margin:'0 18px 14px',padding:14,background:'#EEEDF8',borderRadius:12}}>
          <p style={{fontSize:12,fontWeight:500,color:'#2C2B4B',marginBottom:6}}>✦ Claude is analyzing...</p>
          <p style={{fontSize:11,color:'#6b6b80',fontStyle:'italic',lineHeight:1.5,margin:0}}>{thinking}</p>
        </div>
      )}

      {results && !loading && (
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'0 18px',marginBottom:8}}>
            <div style={{width:24,height:24,borderRadius:6,background:outfitHex,border:'0.5px solid rgba(0,0,0,0.08)'}}/>
            {skinHex && <div style={{width:22,height:22,borderRadius:'50%',background:skinHex,border:'2px solid white',boxShadow:'0 0 0 0.5px #ddd',marginLeft:-10}}/>}
            <div style={{flex:1}}><p style={{fontSize:12,fontWeight:500,color:'#1a1a2e',margin:0}}>Matched for your look</p><p style={{fontSize:10,color:'#a0a0b0',margin:0}}>{skinName||'Skin tone'} · {nailType}</p></div>
            <button onClick={()=>setResults(null)} style={{fontSize:10,color:'#C4546A',border:'none',background:'none',cursor:'pointer'}}>← Edit</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,padding:'0 18px',marginBottom:16}}>
            {results.map((c,i)=>(
              <div key={c.hex+i} style={{background:'white',borderRadius:12,border:i<2?'1.5px solid #C4546A':'0.5px solid #eee',overflow:'hidden'}}>
                <div style={{height:64,background:c.hex,position:'relative'}}>
                  {skinHex && <div style={{position:'absolute',bottom:0,left:0,right:0,height:6,background:skinHex}}/>}
                </div>
                <div style={{padding:7}}>
                  <p style={{fontSize:10,fontWeight:500,color:'#1a1a2e',lineHeight:1.3,margin:0}}>{c.name}</p>
                  <p style={{fontSize:9,color:'#6b6b80',marginTop:1,marginBottom:0}}>{c.brand}</p>
                  <span style={{display:'inline-block',fontSize:9,padding:'2px 6px',borderRadius:999,background:'#FDF0F2',color:'#C4546A',fontWeight:500,marginTop:3}}>{c.match}%</span>
                  <p style={{fontSize:9,color:'#a0a0b0',marginTop:3,lineHeight:1.4,fontStyle:'italic',marginBottom:0}}>{c.reason}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{fontSize:10,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.1em',color:'#a0a0b0',padding:'0 18px',marginBottom:6}}>Salons near you</p>
          {SALONS.map(s=>(
            <div key={s.name} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 18px',borderTop:'0.5px solid #eee'}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'#FDF0F2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{s.emoji}</div>
              <div style={{flex:1}}><p style={{fontSize:12,fontWeight:500,color:'#1a1a2e',margin:0}}>{s.name}</p><p style={{fontSize:10,color:'#6b6b80',margin:0}}>{s.avail} · {s.dist}</p></div>
              <button style={{fontSize:10,padding:'5px 12px',borderRadius:999,border:s.bColor?'none':'0.5px solid #C4546A',background:s.bColor||'transparent',color:s.bColor?'white':'#C4546A',cursor:'pointer',fontFamily:'Outfit, sans-serif'}}>{s.bColor?'Book':'Call'}</button>
            </div>
          ))}
        </div>
      )}

      <nav style={{position:'absolute',bottom:0,left:0,right:0,height:68,background:'white',borderTop:'0.5px solid #eee',display:'flex',alignItems:'center',justifyContent:'space-around',padding:'0 8px 6px'}}>
        {[{icon:'✦',label:'match',active:true},{icon:'🗺️',label:'discover',active:false},{icon:'👥',label:'community',active:false},{icon:'👤',label:'profile',active:false}].map(n=>(
          <button key={n.label} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,flex:1,background:'none',border:'none',cursor:'pointer',color:n.active?'#C4546A':'#a0a0b0',fontFamily:'Outfit, sans-serif'}}>
            <span style={{fontSize:20}}>{n.icon}</span>
            <span style={{fontSize:9}}>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ── Router ──────────────────────────────────────────────────────────────
const queryClient = new QueryClient()

function AppRoutes() {
  const role = getRole()
  return (
    <Routes>
      <Route path="/"      element={<LandingPage />} />
      <Route path="/match" element={<MatchScreen />} />
      <Route path="*"      element={<Navigate to={role ? '/match' : '/'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'1rem', background:'#ede9f0' }}>
          <div className="phone-frame">
            <AppRoutes />
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
