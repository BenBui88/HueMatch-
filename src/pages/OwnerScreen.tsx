import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const DEFAULT_BRANDS = ['OPI', 'Essie', 'Gelish', 'CND Shellac', 'Zoya', 'China Glaze', 'Sally Hansen', 'Kiara Sky', 'SNS', 'Revel Nail', 'Orly', 'Butter London']

interface Color {
  id: string
  name: string
  brand: string
  hex: string
  types: string[]
  code: string
}

interface Salon {
  id: string
  name: string
  address: string
  phone: string
  website: string
  booking_url: string
}

export default function OwnerScreen() {
  const navigate = useNavigate()
  const logoInputRef  = useRef<HTMLInputElement>(null)
  const profileImgRef = useRef<HTMLInputElement>(null)
  const polishCamRef  = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<'salon'|'inventory'|'analytics'|'profile'>('salon')

  // Salon
  const [salonId,     setSalonId]     = useState<string | null>(null)
  const [salonName,   setSalonName]   = useState('')
  const [location,    setLocation]    = useState('')
  const [phone,       setPhone]       = useState('')
  const [webpage,     setWebpage]     = useState('')
  const [booking,     setBooking]     = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [saved,       setSaved]       = useState(false)
  const [saving,      setSaving]      = useState(false)

  // Profile
  const [ownerName,     setOwnerName]     = useState('Salon Owner')
  const [ownerEmail,    setOwnerEmail]    = useState('')
  const [profileImg,    setProfileImg]    = useState('')
  const [notifications, setNotifications] = useState(true)
  const [mapVisible,    setMapVisible]    = useState(true)
  const [clientMsg,     setClientMsg]     = useState(true)
  const [profileSaved,  setProfileSaved]  = useState(false)

  // Brands
  const [brands,       setBrands]       = useState<string[]>(DEFAULT_BRANDS)
  const [showAddBrand, setShowAddBrand] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')

  // Colors
  const [colors,        setColors]        = useState<Color[]>([])
  const [loadingColors, setLoadingColors] = useState(false)
  const [showAddColor,  setShowAddColor]  = useState(false)
  const [filterType,    setFilterType]    = useState('All')
  const [searchQ,       setSearchQ]       = useState('')

  // New color form
  const [newName,       setNewName]       = useState('')
  const [newBrand,      setNewBrand]      = useState('OPI')
  const [newHex,        setNewHex]        = useState('#C4546A')
  const [newTypes,      setNewTypes]      = useState<string[]>(['Gel'])
  const [newCode,       setNewCode]       = useState('')
  const [suggestions,   setSuggestions]   = useState<Color[]>([])

  // Polish photo
  const [polishPreview, setPolishPreview] = useState('')
  const [scanningColor, setScanningColor] = useState(false)
  const [aiColorNote,   setAiColorNote]   = useState('')

  // ── Load data from Supabase on mount ─────────────────────────────────
  useEffect(() => {
    loadSalon()
  }, [])

  useEffect(() => {
    if (salonId) loadColors()
  }, [salonId])

  const loadSalon = async () => {
    try {
      const { data, error } = await supabase
        .from('salons')
        .select('*')
        .limit(1)
        .single()

      if (data && !error) {
        setSalonId(data.id)
        setSalonName(data.name || '')
        setLocation(data.address || '')
        setPhone(data.phone || '')
        setWebpage(data.website || '')
        setBooking(data.booking_url || '')
      }
    } catch (e) {
      console.log('No salon yet — will create on save')
    }
  }

  const loadColors = async () => {
    if (!salonId) return
    setLoadingColors(true)
    try {
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .eq('salon_id', salonId)
        .order('created_at', { ascending: true })

      if (data && !error) {
        setColors(data.map(c => ({
          id: c.id,
          name: c.name,
          brand: c.brand || '',
          hex: c.hex || '#C4546A',
          types: c.types || ['Gel'],
          code: c.code || '',
        })))
      }
    } catch (e) {
      console.log('Error loading colors:', e)
    } finally {
      setLoadingColors(false)
    }
  }

  // ── Save salon to Supabase ────────────────────────────────────────────
  const saveSalon = async () => {
    if (!salonName) { alert('Please enter your salon name'); return }
    setSaving(true)
    try {
      if (salonId) {
        // Update existing
        await supabase.from('salons').update({
          name: salonName,
          address: location,
          phone,
          website: webpage,
          booking_url: booking,
        }).eq('id', salonId)
      } else {
        // Create new
        const { data } = await supabase.from('salons').insert({
          name: salonName,
          address: location,
          phone,
          website: webpage,
          booking_url: booking,
        }).select().single()
        if (data) setSalonId(data.id)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      alert('Error saving salon. Check your Supabase connection.')
    } finally {
      setSaving(false)
    }
  }

  // ── Add color to Supabase ─────────────────────────────────────────────
  const addColor = async () => {
    if (!newName) { alert('Please enter a color name'); return }
    if (newTypes.length === 0) { alert('Please select at least one type'); return }

    // If no salon yet, save salon first
    let currentSalonId = salonId
    if (!currentSalonId) {
      if (!salonName) {
        alert('Please save your salon profile first before adding colors.')
        setActiveTab('salon')
        return
      }
      const { data } = await supabase.from('salons').insert({
        name: salonName, address: location, phone, website: webpage, booking_url: booking,
      }).select().single()
      if (data) { setSalonId(data.id); currentSalonId = data.id }
    }

    try {
      const { data, error } = await supabase.from('colors').insert({
        salon_id: currentSalonId,
        name: newName,
        brand: newBrand,
        hex: newHex,
        types: newTypes,
        code: newCode,
      }).select().single()

      if (data && !error) {
        setColors(prev => [...prev, {
          id: data.id, name: data.name, brand: data.brand || '',
          hex: data.hex || '#C4546A', types: data.types || ['Gel'], code: data.code || '',
        }])
        resetColorForm()
        setShowAddColor(false)
      }
    } catch (e) {
      alert('Error saving color. Please try again.')
    }
  }

  // ── Delete color from Supabase ────────────────────────────────────────
  const deleteColor = async (id: string) => {
    try {
      await supabase.from('colors').delete().eq('id', id)
      setColors(prev => prev.filter(c => c.id !== id))
    } catch (e) {
      alert('Error removing color.')
    }
  }

  // ── Update color hex ──────────────────────────────────────────────────
  const updateColorHex = async (id: string, hex: string) => {
    setColors(prev => prev.map(c => c.id === id ? { ...c, hex } : c))
    await supabase.from('colors').update({ hex }).eq('id', id)
  }

  // ── Polish photo handlers ─────────────────────────────────────────────
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleProfileImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setProfileImg(URL.createObjectURL(file))
  }

  const handlePolishPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setPolishPreview(URL.createObjectURL(file))
    setAiColorNote('')
    setScanningColor(false)
  }

  const sampleAndAI = (pctX: number, pctY: number, imgEl: HTMLImageElement) => {
    const canvas = document.createElement('canvas')
    canvas.width = imgEl.naturalWidth
    canvas.height = imgEl.naturalHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(imgEl, 0, 0)
    const px = Math.round(pctX * imgEl.naturalWidth)
    const py = Math.round(pctY * imgEl.naturalHeight)
    const area = 10
    const d = ctx.getImageData(Math.max(0, px-area), Math.max(0, py-area), area*2, area*2).data
    let r = 0, g = 0, b = 0, cnt = 0
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i+1]; b += d[i+2]; cnt++ }
    r = Math.round(r/cnt); g = Math.round(g/cnt); b = Math.round(b/cnt)
    const tappedHex = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('')
    setNewHex(tappedHex)
    setAiColorNote('')
    setScanningColor(true)

   fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/match-colors`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ outfitHex: tappedHex, skinName: 'polish bottle', skinHex: tappedHex, undertone: 'neutral', nailType: 'Gel' })
      }
    )
    .then(res => res.json())
    .then(data => {
      const p = JSON.parse(data.content[0].text.trim().replace(/```json|```/g,''))
      setNewHex(p.hex)
      setAiColorNote(`AI matched: ${p.description}`)
    })
    .catch(() => setAiColorNote('Color sampled from photo'))
    .finally(() => setScanningColor(false))
  }

  const handleImageTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pctX = (e.clientX - rect.left) / rect.width
    const pctY = (e.clientY - rect.top) / rect.height
    const imgEl = e.currentTarget.querySelector('img') as HTMLImageElement
    if (imgEl) sampleAndAI(pctX, pctY, imgEl)
  }

  const addCustomBrand = () => {
    const trimmed = newBrandName.trim(); if (!trimmed) return
    if (!brands.includes(trimmed)) setBrands(prev => [...prev, trimmed])
    setNewBrand(trimmed)
    setNewBrandName('')
    setShowAddBrand(false)
  }

  const toggleType = (t: string) => {
    setNewTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const onColorNameInput = (val: string) => {
    setNewName(val)
    if (val.length < 2) { setSuggestions([]); return }
    setSuggestions(colors.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0,4))
  }

  const resetColorForm = () => {
    setNewName(''); setNewBrand('OPI'); setNewHex('#C4546A')
    setNewTypes(['Gel']); setNewCode('')
    setPolishPreview(''); setAiColorNote(''); setScanningColor(false)
    setSuggestions([])
  }

  const saveProfile = () => {
    setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2000)
  }

  const filteredColors = colors.filter(c => {
    const matchType   = filterType === 'All' || c.types.includes(filterType)
    const matchSearch = !searchQ || c.name.toLowerCase().includes(searchQ.toLowerCase()) || c.brand.toLowerCase().includes(searchQ.toLowerCase())
    return matchType && matchSearch
  })

  // ── Mini components ───────────────────────────────────────────────────
  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button onClick={onChange} style={{ width:40, height:22, borderRadius:11, border:'none', cursor:'pointer', background: on ? '#1D9E75' : '#ddd', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ position:'absolute', top:3, left: on ? 21 : 3, width:16, height:16, borderRadius:'50%', background:'white', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }} />
    </button>
  )

  const SettingRow = ({ icon, label, sub, right, onClick }: { icon:string; label:string; sub?:string; right?:React.ReactNode; onClick?:()=>void }) => (
    <div onClick={onClick} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 18px', borderBottom:'0.5px solid #eee', cursor: onClick ? 'pointer' : 'default' }}>
      <span style={{ fontSize:18, width:24, textAlign:'center' as const, flexShrink:0 }}>{icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:13, fontWeight:500, color:'#1a1a2e', margin:0 }}>{label}</p>
        {sub && <p style={{ fontSize:11, color:'#a0a0b0', margin:'2px 0 0' }}>{sub}</p>}
      </div>
      {right || (onClick && <span style={{ color:'#ddd', fontSize:16 }}>›</span>)}
    </div>
  )

  const SectionLabel = ({ label }: { label:string }) => (
    <div style={{ padding:'14px 18px 6px', fontSize:10, fontWeight:500, textTransform:'uppercase' as const, letterSpacing:'0.1em', color:'#a0a0b0' }}>{label}</div>
  )

  const TypeBadge = ({ type }: { type:string }) => (
    <span style={{ display:'inline-block', fontSize:9, padding:'1px 7px', borderRadius:999, marginRight:3, marginTop:3,
      background: type==='Gel' ? '#E6F1FB' : type==='SNS' ? '#FAEEDA' : '#EAF3DE',
      color: type==='Gel' ? '#185FA5' : type==='SNS' ? '#854F0B' : '#3B6D11' }}>
      {type}
    </span>
  )

  const inp = (extra?: object): React.CSSProperties => ({ width:'100%', height:44, border:'0.5px solid #ddd', borderRadius:10, padding:'0 14px', fontSize:15, boxSizing:'border-box', outline:'none', fontFamily:'Outfit, sans-serif', color:'#1a1a2e', ...extra })
  const lbl: React.CSSProperties = { fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', color:'#a0a0b0', display:'block', marginBottom:5 }

  return (
    <div style={{ fontFamily:'Outfit, sans-serif', display:'flex', flexDirection:'column', minHeight:'100%', paddingBottom:80 }}>

      <input ref={logoInputRef}  type="file" accept="image/*" onChange={handleLogoUpload}  style={{ display:'none' }} />
      <input ref={profileImgRef} type="file" accept="image/*" onChange={handleProfileImg}  style={{ display:'none' }} />
      <input ref={polishCamRef}  type="file" accept="image/*" onChange={handlePolishPhoto} style={{ display:'none' }} />

      {/* Status bar */}
      <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 20px 4px', fontSize:11, fontWeight:500 }}>
        <span>9:41</span><span>●●●</span>
      </div>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 18px 12px' }}>
        <img src="/logo.png" alt="HueMatch" style={{ height:36, objectFit:'contain' }} />
        <span style={{ fontSize:12, fontWeight:500, color:'#6b6b80' }}>
          {activeTab==='salon' ? '🏪 Salon' : activeTab==='inventory' ? '💅 Inventory' : activeTab==='analytics' ? '📊 Analytics' : '👤 Profile'}
        </span>
      </div>

      {/* ══ SALON TAB ══════════════════════════════════════════════════ */}
      {activeTab === 'salon' && (
        <div style={{ padding:'0 18px' }}>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <button onClick={() => logoInputRef.current?.click()}
              style={{ width:90, height:90, borderRadius:'50%', border:'2px dashed #F4C0D1', background: logoPreview ? 'transparent' : '#FDF0F2', cursor:'pointer', overflow:'hidden', display:'inline-flex', alignItems:'center', justifyContent:'center', padding:0 }}>
              {logoPreview
                ? <img src={logoPreview} alt="logo" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <div style={{ textAlign:'center' }}><div style={{ fontSize:24 }}>📷</div><div style={{ fontSize:10, color:'#C4546A', marginTop:3 }}>Upload logo</div></div>}
            </button>
            {logoPreview && <button onClick={() => setLogoPreview('')} style={{ display:'block', margin:'6px auto 0', fontSize:10, color:'#C4546A', border:'none', background:'none', cursor:'pointer' }}>Remove</button>}
          </div>

          {[
            { label:'🏪 Salon name',   value:salonName, set:setSalonName, placeholder:'e.g. Luxe Nail Bar',           type:'text' },
            { label:'📍 Location',     value:location,  set:setLocation,  placeholder:'e.g. 123 Main St, Atlanta GA', type:'text' },
            { label:'📞 Phone number', value:phone,     set:setPhone,     placeholder:'e.g. (404) 555-0123',          type:'tel'  },
            { label:'🌐 Website',      value:webpage,   set:setWebpage,   placeholder:'e.g. luxenailbar.com',          type:'url'  },
            { label:'📅 Booking link', value:booking,   set:setBooking,   placeholder:'e.g. booksy.com/luxenailbar',  type:'url'  },
          ].map(f => (
            <div key={f.label} style={{ marginBottom:14 }}>
              <label style={lbl}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={f.value} onChange={e => f.set(e.target.value)} style={inp()} />
            </div>
          ))}

          <button onClick={() => setActiveTab('inventory')}
            style={{ width:'100%', height:48, background:'#EEEDF8', border:'0.5px solid rgba(44,43,75,0.15)', borderRadius:12, fontSize:13, fontWeight:500, color:'#2C2B4B', cursor:'pointer', fontFamily:'Outfit, sans-serif', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            💅 Manage polish inventory ({colors.length} colors)
          </button>

          <button onClick={saveSalon} disabled={saving}
            style={{ width:'100%', height:50, background: saved ? '#1D9E75' : '#C4546A', color:'white', border:'none', borderRadius:12, fontSize:14, fontWeight:500, fontFamily:'Outfit, sans-serif', cursor:'pointer', transition:'background 0.3s', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : saved ? '✓ Saved to database!' : 'Save salon profile ✦'}
          </button>
        </div>
      )}

      {/* ══ INVENTORY TAB ══════════════════════════════════════════════ */}
      {activeTab === 'inventory' && (
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 18px', marginBottom:12 }}>
            <div>
              <p style={{ fontSize:14, fontWeight:500, color:'#1a1a2e', margin:0 }}>Polish inventory</p>
              <p style={{ fontSize:11, color:'#a0a0b0', margin:'2px 0 0' }}>
                {loadingColors ? 'Loading...' : `${colors.length} colors saved`}
              </p>
            </div>
            <button onClick={() => { resetColorForm(); setShowAddColor(true) }}
              style={{ height:36, padding:'0 14px', background:'#C4546A', color:'white', border:'none', borderRadius:10, fontSize:12, fontWeight:500, fontFamily:'Outfit, sans-serif', cursor:'pointer' }}>
              + Add color
            </button>
          </div>

          {/* Search */}
          <div style={{ position:'relative', margin:'0 18px 10px' }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'#a0a0b0' }}>🔍</span>
            <input placeholder="Search colors..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
              style={{ width:'100%', height:38, border:'0.5px solid #ddd', borderRadius:20, padding:'0 12px 0 34px', fontSize:13, boxSizing:'border-box', outline:'none', fontFamily:'Outfit, sans-serif', background:'#f8f7f9' }} />
          </div>

          {/* Type filter */}
          <div style={{ display:'flex', gap:6, padding:'0 18px', marginBottom:12 }}>
            {['All','Gel','Regular','SNS'].map(f => (
              <button key={f} onClick={() => setFilterType(f)}
                style={{ height:28, padding:'0 12px', borderRadius:20, border: filterType===f ? '1.5px solid #C4546A' : '0.5px solid #ddd', background: filterType===f ? '#FDF0F2' : 'white', color: filterType===f ? '#C4546A' : '#6b6b80', fontSize:11, cursor:'pointer', fontFamily:'Outfit, sans-serif' }}>
                {f}
              </button>
            ))}
          </div>

          {/* Color list */}
          {loadingColors ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'#a0a0b0' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>⏳</div>
              <p style={{ fontSize:13 }}>Loading your colors...</p>
            </div>
          ) : filteredColors.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem 1rem', color:'#a0a0b0' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>💅</div>
              <p style={{ fontSize:13, margin:'0 0 4px' }}>{colors.length === 0 ? 'No colors yet' : 'No colors found'}</p>
              <p style={{ fontSize:11 }}>{colors.length === 0 ? 'Tap + Add color to build your inventory' : 'Try a different filter'}</p>
            </div>
          ) : (
            filteredColors.map(c => (
              <div key={c.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 18px', borderBottom:'0.5px solid #eee' }}>
                <div style={{ width:32, height:42, borderRadius:6, background:c.hex, border:'0.5px solid rgba(0,0,0,0.08)', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:500, color:'#1a1a2e', margin:0 }}>{c.name}</p>
                  <p style={{ fontSize:10, color:'#6b6b80', margin:'2px 0 0' }}>{c.brand}{c.code ? ' · '+c.code : ''}</p>
                  <div>{c.types.map(t => <TypeBadge key={t} type={t} />)}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5 }}>
                  <input type="color" value={c.hex}
                    onChange={e => updateColorHex(c.id, e.target.value)}
                    style={{ width:28, height:28, border:'0.5px solid #ddd', borderRadius:6, cursor:'pointer', padding:2 }} />
                  <button onClick={() => deleteColor(c.id)}
                    style={{ fontSize:10, color:'#E24B4A', border:'none', background:'none', cursor:'pointer', padding:0 }}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ══ ANALYTICS TAB ══════════════════════════════════════════════ */}
      {activeTab === 'analytics' && (
        <div style={{ textAlign:'center', padding:'3rem 1.5rem', color:'#a0a0b0' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📊</div>
          <p style={{ fontSize:14, fontWeight:500, color:'#1a1a2e', margin:'0 0 6px' }}>Analytics coming soon</p>
          <p style={{ fontSize:12, lineHeight:1.5 }}>Top matched colors, client retention, peak hours and tech performance will appear here.</p>
        </div>
      )}

      {/* ══ PROFILE TAB ════════════════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <div>
          <div style={{ textAlign:'center', padding:'0 18px 20px' }}>
            <button onClick={() => profileImgRef.current?.click()}
              style={{ width:80, height:80, borderRadius:'50%', border:'2px dashed #F4C0D1', background: profileImg ? 'transparent' : '#FDF0F2', cursor:'pointer', overflow:'hidden', display:'inline-flex', alignItems:'center', justifyContent:'center', padding:0, marginBottom:10 }}>
              {profileImg ? <img src={profileImg} alt="profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontSize:28 }}>👤</span>}
            </button>
            <p style={{ fontFamily:'Cormorant Garamond, serif', fontSize:22, fontWeight:400, color:'#1a1a2e', margin:'0 0 2px' }}>{ownerName || 'Salon Owner'}</p>
            <p style={{ fontSize:12, color:'#a0a0b0', margin:0 }}>{salonName || 'Your salon'} · {location || 'Location'}</p>
          </div>

          <SectionLabel label="Salon" />
          <SettingRow icon="🏪" label="Edit salon info"      sub="Name, location, phone, website" onClick={() => setActiveTab('salon')} />
          <SettingRow icon="💅" label="Polish inventory"     sub={`${colors.length} colors saved`} onClick={() => setActiveTab('inventory')} />
          <SettingRow icon="📅" label="Booking link"         sub={booking || 'Not set'} />
          <SettingRow icon="⏰" label="Business hours"       sub="Set your open hours" />

          <SectionLabel label="Team" />
          <SettingRow icon="👥" label="Manage nail techs"    sub="Add, remove, view performance" />
          <SettingRow icon="⭐" label="Rewards & leaderboard" sub="Set milestones and prizes" />

          <SectionLabel label="Account" />
          <div style={{ padding:'10px 18px', borderBottom:'0.5px solid #eee' }}>
            <label style={lbl}>Your name</label>
            <input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Your name" style={inp()} />
          </div>
          <div style={{ padding:'10px 18px', borderBottom:'0.5px solid #eee' }}>
            <label style={lbl}>Email address</label>
            <input value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} placeholder="you@email.com" type="email" style={inp()} />
          </div>
          <SettingRow icon="🔒" label="Change password" />

          <SectionLabel label="HueMatch" />
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 18px', borderBottom:'0.5px solid #eee' }}>
            <span style={{ fontSize:18, width:24, textAlign:'center' as const }}>🗺️</span>
            <div style={{ flex:1 }}><p style={{ fontSize:13, fontWeight:500, color:'#1a1a2e', margin:0 }}>Visible on salon map</p><p style={{ fontSize:11, color:'#a0a0b0', margin:'2px 0 0' }}>Clients can find your salon</p></div>
            <Toggle on={mapVisible} onChange={() => setMapVisible(!mapVisible)} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 18px', borderBottom:'0.5px solid #eee' }}>
            <span style={{ fontSize:18, width:24, textAlign:'center' as const }}>🔔</span>
            <div style={{ flex:1 }}><p style={{ fontSize:13, fontWeight:500, color:'#1a1a2e', margin:0 }}>Notifications</p><p style={{ fontSize:11, color:'#a0a0b0', margin:'2px 0 0' }}>Bookings, reviews, rewards</p></div>
            <Toggle on={notifications} onChange={() => setNotifications(!notifications)} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 18px', borderBottom:'0.5px solid #eee' }}>
            <span style={{ fontSize:18, width:24, textAlign:'center' as const }}>💬</span>
            <div style={{ flex:1 }}><p style={{ fontSize:13, fontWeight:500, color:'#1a1a2e', margin:0 }}>Client messaging</p><p style={{ fontSize:11, color:'#a0a0b0', margin:'2px 0 0' }}>Allow clients to message</p></div>
            <Toggle on={clientMsg} onChange={() => setClientMsg(!clientMsg)} />
          </div>

          <SectionLabel label="Support" />
          <SettingRow icon="❓" label="Help center" />
          <SettingRow icon="📞" label="Contact HueMatch" />
          <SettingRow icon="📄" label="Terms & privacy" />

          <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:10 }}>
            <button onClick={saveProfile}
              style={{ width:'100%', height:48, background: profileSaved ? '#1D9E75' : '#C4546A', color:'white', border:'none', borderRadius:12, fontSize:14, fontWeight:500, fontFamily:'Outfit, sans-serif', cursor:'pointer', transition:'background 0.3s' }}>
              {profileSaved ? '✓ Saved!' : 'Save profile ✦'}
            </button>
            <button onClick={() => navigate('/')}
              style={{ width:'100%', height:44, background:'transparent', color:'#E24B4A', border:'0.5px solid #E24B4A', borderRadius:12, fontSize:13, fontWeight:500, fontFamily:'Outfit, sans-serif', cursor:'pointer' }}>
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* ══ ADD COLOR POPUP ════════════════════════════════════════════ */}
      {showAddColor && (
        <>
          <div onClick={() => { setShowAddColor(false); resetColorForm() }}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:40 }} />
          <div style={{ position:'fixed', top:'3%', left:'50%', transform:'translateX(-50%)', width:'92%', maxWidth:390, background:'white', borderRadius:20, padding:'1.25rem 1.25rem 1.5rem', zIndex:50, boxShadow:'0 4px 24px rgba(0,0,0,0.2)', maxHeight:'92vh', overflowY:'auto' }}>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
              <p style={{ fontSize:16, fontWeight:500, color:'#1a1a2e', margin:0 }}>Add polish color</p>
              <button onClick={() => { setShowAddColor(false); resetColorForm() }}
                style={{ width:28, height:28, borderRadius:'50%', background:'#f0f0f0', border:'none', cursor:'pointer', fontSize:14 }}>✕</button>
            </div>

            {/* Color name */}
            <label style={lbl}>Color name</label>
            <div style={{ position:'relative', marginBottom:12 }}>
              <input placeholder="e.g. Lavender Dusk" value={newName} onChange={e => onColorNameInput(e.target.value)} style={inp()} />
              {suggestions.length > 0 && (
                <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'white', border:'0.5px solid #ddd', borderRadius:10, boxShadow:'0 4px 12px rgba(0,0,0,0.1)', zIndex:10, overflow:'hidden' }}>
                  {suggestions.map(s => (
                    <button key={s.id} onClick={() => { setNewName(s.name); setNewBrand(s.brand); setNewHex(s.hex); setNewTypes(s.types); setNewCode(s.code); setSuggestions([]) }}
                      style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 12px', border:'none', background:'transparent', cursor:'pointer', textAlign:'left' as const }}>
                      <div style={{ width:24, height:30, borderRadius:4, background:s.hex, flexShrink:0 }} />
                      <div>
                        <p style={{ fontSize:12, fontWeight:500, color:'#1a1a2e', margin:0 }}>{s.name}</p>
                        <p style={{ fontSize:10, color:'#6b6b80', margin:0 }}>{s.brand}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Brand */}
            <label style={lbl}>Brand</label>
            <div style={{ display:'flex', gap:6, marginBottom:12 }}>
              <select value={newBrand} onChange={e => setNewBrand(e.target.value)}
                style={{ flex:1, height:44, border:'0.5px solid #ddd', borderRadius:10, padding:'0 10px', fontSize:14, outline:'none', fontFamily:'Outfit, sans-serif', background:'white' }}>
                {brands.map(b => <option key={b}>{b}</option>)}
              </select>
              <button onClick={() => setShowAddBrand(true)}
                style={{ height:44, padding:'0 12px', background:'#EEEDF8', border:'0.5px solid rgba(44,43,75,0.15)', borderRadius:10, fontSize:12, color:'#2C2B4B', cursor:'pointer', fontFamily:'Outfit, sans-serif', whiteSpace:'nowrap' as const }}>
                + New brand
              </button>
            </div>

            {showAddBrand && (
              <div style={{ background:'#f8f7f9', borderRadius:10, padding:'10px 12px', marginBottom:12, border:'0.5px solid #eee' }}>
                <p style={{ fontSize:11, fontWeight:500, color:'#2C2B4B', margin:'0 0 7px' }}>Add new brand</p>
                <div style={{ display:'flex', gap:6 }}>
                  <input autoFocus placeholder="e.g. Cirque Colors" value={newBrandName} onChange={e => setNewBrandName(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && addCustomBrand()}
                    style={{ flex:1, height:38, border:'0.5px solid #ddd', borderRadius:8, padding:'0 10px', fontSize:13, outline:'none', fontFamily:'Outfit, sans-serif' }} />
                  <button onClick={addCustomBrand}
                    style={{ height:38, padding:'0 12px', background:'#C4546A', color:'white', border:'none', borderRadius:8, fontSize:12, cursor:'pointer', fontFamily:'Outfit, sans-serif' }}>Add</button>
                  <button onClick={() => { setShowAddBrand(false); setNewBrandName('') }}
                    style={{ height:38, padding:'0 10px', background:'transparent', border:'0.5px solid #ddd', borderRadius:8, fontSize:12, cursor:'pointer', color:'#6b6b80' }}>✕</button>
                </div>
              </div>
            )}

            {/* Type multi-select */}
            <label style={{ ...lbl, marginBottom:5 }}>
              Type <span style={{ fontSize:10, fontWeight:400, textTransform:'none' as const, letterSpacing:0 }}>(select all that apply)</span>
            </label>
            <div style={{ display:'flex', gap:8, marginBottom:14 }}>
              {(['Gel','Regular','SNS'] as const).map(t => (
                <button key={t} onClick={() => toggleType(t)}
                  style={{ flex:1, height:44, borderRadius:10, border: newTypes.includes(t) ? '2px solid #C4546A' : '0.5px solid #ddd', background: newTypes.includes(t) ? '#FDF0F2' : 'white', color: newTypes.includes(t) ? '#C4546A' : '#6b6b80', fontSize:12, fontWeight: newTypes.includes(t) ? 500 : 400, cursor:'pointer', fontFamily:'Outfit, sans-serif' }}>
                  {newTypes.includes(t) ? '✓ ' : ''}{t==='SNS' ? 'SNS/Dip' : t}
                </button>
              ))}
            </div>

            {/* Color section */}
            <label style={lbl}>Color</label>

            {/* Step 1 — Instructions + upload */}
            {!polishPreview && (
              <>
                <div style={{ background:'#FFFBF0', border:'0.5px solid #FAC775', borderRadius:10, padding:'10px 12px', marginBottom:10 }}>
                  <p style={{ fontSize:11, fontWeight:500, color:'#C4700A', margin:'0 0 6px' }}>📋 For best color accuracy:</p>
                  {[
                    '📄 Place polish on a plain white background',
                    '☀️ Avoid strong shadows and direct glare',
                    '🎯 Center the color sample in the photo',
                  ].map(tip => (
                    <p key={tip} style={{ fontSize:11, color:'#6b6b80', margin:'3px 0', lineHeight:1.4 }}>{tip}</p>
                  ))}
                </div>
                <button onClick={() => polishCamRef.current?.click()}
                  style={{ width:'100%', height:72, border:'1.5px dashed #F4C0D1', borderRadius:10, background:'#FDF0F2', cursor:'pointer', marginBottom:10, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                  <span style={{ fontSize:26 }}>📷</span>
                  <div style={{ textAlign:'left' as const }}>
                    <p style={{ fontSize:13, fontWeight:500, color:'#C4546A', margin:0 }}>Take photo or upload</p>
                    <p style={{ fontSize:10, color:'#a0a0b0', margin:'2px 0 0' }}>Then tap to pick the exact color</p>
                  </div>
                </button>
              </>
            )}

            {/* Step 2 — Tap to pick */}
            {polishPreview && !scanningColor && !aiColorNote && (
              <>
                <div style={{ background:'#EEEDF8', border:'0.5px solid rgba(44,43,75,0.15)', borderRadius:10, padding:'8px 12px', marginBottom:8, display:'flex', alignItems:'center', gap:7 }}>
                  <span style={{ fontSize:16 }}>👆</span>
                  <p style={{ fontSize:11, color:'#2C2B4B', margin:0, lineHeight:1.4 }}>
                    <strong>Tap the color area</strong> on your photo to extract that exact shade
                  </p>
                </div>
                <div style={{ position:'relative', borderRadius:10, overflow:'hidden', marginBottom:8, border:'1.5px solid #C4546A', cursor:'crosshair' }}
                  onClick={handleImageTap}>
                  <img src={polishPreview} alt="polish" crossOrigin="anonymous"
                    style={{ width:'100%', maxHeight:200, objectFit:'contain', display:'block', background:'#f8f8f8' }} />
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                    <div style={{ background:'rgba(196,84,106,0.15)', border:'1.5px solid rgba(196,84,106,0.5)', borderRadius:8, padding:'5px 12px' }}>
                      <p style={{ fontSize:11, color:'#C4546A', margin:0, fontWeight:500 }}>Tap color to extract ✦</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setPolishPreview(''); setAiColorNote('') }}
                  style={{ fontSize:11, color:'#6b6b80', border:'none', background:'none', cursor:'pointer', marginBottom:8, display:'block' }}>
                  ← Retake photo
                </button>
              </>
            )}

            {/* Step 3 — Scanning */}
            {scanningColor && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:'#EEEDF8', borderRadius:10, marginBottom:10 }}>
                <span style={{ fontSize:16 }}>✦</span>
                <div>
                  <p style={{ fontSize:12, fontWeight:500, color:'#2C2B4B', margin:0 }}>AI is cleaning up the color...</p>
                  <p style={{ fontSize:10, color:'#6b6b80', margin:'2px 0 0' }}>Correcting for lighting and bottle glare</p>
                </div>
              </div>
            )}

            {/* Step 4 — AI result */}
            {aiColorNote && !scanningColor && (
              <div style={{ marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#E1F5EE', borderRadius:10, border:'0.5px solid #A5D6C0', marginBottom:8 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:newHex, border:'0.5px solid rgba(0,0,0,0.1)', flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12, fontWeight:500, color:'#1D9E75', margin:0 }}>✓ {aiColorNote}</p>
                    <p style={{ fontSize:10, color:'#6b6b80', margin:'2px 0 0' }}>Tap a different spot to re-pick</p>
                  </div>
                  <button onClick={() => { setPolishPreview(''); setAiColorNote('') }}
                    style={{ fontSize:10, color:'#C4546A', border:'none', background:'none', cursor:'pointer', flexShrink:0 }}>Retake</button>
                </div>
                <div style={{ position:'relative', borderRadius:10, overflow:'hidden', border:'0.5px solid #ddd', cursor:'crosshair' }}
                  onClick={handleImageTap}>
                  <img src={polishPreview} alt="polish" crossOrigin="anonymous"
                    style={{ width:'100%', maxHeight:120, objectFit:'contain', display:'block', background:'#f8f8f8' }} />
                </div>
              </div>
            )}

            {/* Manual color */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, padding:'8px 10px', background:'#f8f7f9', borderRadius:10, border:'0.5px solid #eee' }}>
              <input type="color" value={newHex} onChange={e => setNewHex(e.target.value)}
                style={{ width:40, height:40, border:'0.5px solid #ddd', borderRadius:8, cursor:'pointer', padding:3, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:10, color:'#a0a0b0', margin:'0 0 3px' }}>Or adjust manually</p>
                <input type="text" value={newHex} onChange={e => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setNewHex(e.target.value) }}
                  style={{ width:'100%', height:30, border:'0.5px solid #ddd', borderRadius:7, padding:'0 8px', fontSize:12, outline:'none', fontFamily:'Outfit, sans-serif', boxSizing:'border-box' }} />
              </div>
              <div style={{ width:40, height:40, borderRadius:8, background:newHex, border:'0.5px solid rgba(0,0,0,0.08)', flexShrink:0 }} />
            </div>

            {/* Product code */}
            <label style={lbl}>Product code (optional)</label>
            <input placeholder="e.g. GC H008" value={newCode} onChange={e => setNewCode(e.target.value)}
              style={{ ...inp(), marginBottom:16 }} />

            <button onClick={addColor}
              style={{ width:'100%', height:50, background:'#C4546A', color:'white', border:'none', borderRadius:12, fontSize:14, fontWeight:500, fontFamily:'Outfit, sans-serif', cursor:'pointer' }}>
              Add to inventory ✦
            </button>
          </div>
        </>
      )}

      {/* Bottom nav */}
      <nav style={{ position:'absolute', bottom:0, left:0, right:0, height:68, background:'white', borderTop:'0.5px solid #eee', display:'flex', alignItems:'center', justifyContent:'space-around', padding:'0 8px 6px' }}>
        {[
          { icon:'📊', label:'analytics', tab:'analytics' },
          { icon:'🏪', label:'salon',     tab:'salon'     },
          { icon:'💅', label:'inventory', tab:'inventory' },
          { icon:'👤', label:'profile',   tab:'profile'   },
        ].map(n => (
          <button key={n.tab} onClick={() => setActiveTab(n.tab as typeof activeTab)}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, flex:1, background:'none', border:'none', cursor:'pointer', color: activeTab===n.tab ? '#C4546A' : '#a0a0b0', fontFamily:'Outfit, sans-serif' }}>
            <span style={{ fontSize:20 }}>{n.icon}</span>
            <span style={{ fontSize:9 }}>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
