import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_BRANDS = ['OPI', 'Essie', 'Gelish', 'CND Shellac', 'Zoya', 'China Glaze', 'Sally Hansen', 'Kiara Sky', 'SNS', 'Revel Nail', 'Orly', 'Butter London']

interface Color {
  id: number
  name: string
  brand: string
  hex: string
  types: ('Gel' | 'Regular' | 'SNS')[]
  code: string
}

export default function OwnerScreen() {
  const navigate = useNavigate()
  const logoInputRef    = useRef<HTMLInputElement>(null)
  const profileImgRef   = useRef<HTMLInputElement>(null)
  const polishCamRef    = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<'salon' | 'inventory' | 'analytics' | 'profile'>('salon')

  // Salon
  const [salonName, setSalonName]     = useState('Luxe Nail Bar')
  const [location, setLocation]       = useState('Atlanta, GA')
  const [phone, setPhone]             = useState('')
  const [webpage, setWebpage]         = useState('')
  const [booking, setBooking]         = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [saved, setSaved]             = useState(false)

  // Profile
  const [ownerName, setOwnerName]         = useState('Salon Owner')
  const [ownerEmail, setOwnerEmail]       = useState('')
  const [profileImg, setProfileImg]       = useState('')
  const [notifications, setNotifications] = useState(true)
  const [mapVisible, setMapVisible]       = useState(true)
  const [clientMsg, setClientMsg]         = useState(true)
  const [profileSaved, setProfileSaved]   = useState(false)

  // Brands — user can add custom ones
  const [brands, setBrands]       = useState<string[]>(DEFAULT_BRANDS)
  const [showAddBrand, setShowAddBrand] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')

  // Colors
  const [colors, setColors] = useState<Color[]>([
    { id: 1, name: 'Lavender Dusk',   brand: 'OPI',    hex: '#9B7DB8', types: ['Gel'],              code: 'GC H008' },
    { id: 2, name: 'Berry Whisper',   brand: 'Gelish', hex: '#8B5B8E', types: ['Gel'],              code: '01708'   },
    { id: 3, name: 'Ballet Slippers', brand: 'Essie',  hex: '#FFCDD9', types: ['Regular'],          code: '162'     },
    { id: 4, name: 'Cherry Red',      brand: 'OPI',    hex: '#C62828', types: ['Gel', 'Regular'],   code: 'GC L72'  },
    { id: 5, name: 'Sage Green',      brand: 'Zoya',   hex: '#A5D6A7', types: ['Regular', 'SNS'],   code: 'ZP1012'  },
  ])
  const [showAddColor, setShowAddColor] = useState(false)
  const [filterType, setFilterType]     = useState('All')
  const [searchQ, setSearchQ]           = useState('')

  // New color form
  const [newName, setNewName]         = useState('')
  const [newBrand, setNewBrand]       = useState('OPI')
  const [newHex, setNewHex]           = useState('#C4546A')
  const [newTypes, setNewTypes]       = useState<('Gel'|'Regular'|'SNS')[]>(['Gel'])
  const [newCode, setNewCode]         = useState('')
  const [suggestions, setSuggestions] = useState<Color[]>([])

  // Polish camera / AI
  const [polishPreview, setPolishPreview]   = useState('')
  const [scanningColor, setScanningColor]   = useState(false)
  const [aiColorNote, setAiColorNote]       = useState('')

  // ── Handlers ────────────────────────────────────────────────────────
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleProfileImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setProfileImg(URL.createObjectURL(file))
  }

  // Scan polish bottle photo → extract dominant color → AI cleanup
  const handlePolishPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const preview = URL.createObjectURL(file)
    setPolishPreview(preview)
    setScanningColor(true)
    setAiColorNote('')

    // Step 1 — extract raw color from center of image
    const img = new Image()
    img.onload = async () => {
      const canvas = document.createElement('canvas')
      canvas.width = 100; canvas.height = 100
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, 100, 100)

      // Sample center region (avoid background)
      const cx = 30, cy = 30, cw = 40, ch = 40
      const d = ctx.getImageData(cx, cy, cw, ch).data
      let r = 0, g = 0, b = 0, cnt = 0
      for (let i = 0; i < d.length; i += 4) {
        // Skip near-white (background) pixels
        if (d[i] > 230 && d[i+1] > 230 && d[i+2] > 230) continue
        r += d[i]; g += d[i+1]; b += d[i+2]; cnt++
      }
      if (cnt === 0) { r = d[0]; g = d[1]; b = d[2]; cnt = 1 }
      r = Math.round(r/cnt); g = Math.round(g/cnt); b = Math.round(b/cnt)
      const rawHex = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('')

      // Step 2 — ask Claude to clean up and identify the best nail polish hex
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 200,
            messages: [{ role: 'user', content: `A nail polish bottle photo was analyzed. The extracted average color hex is ${rawHex}. This may be affected by lighting, reflections, or background. Based on this hex, return the most accurate nail polish hex color it likely represents — accounting for typical nail polish finish (glossy, slightly saturated). Also give a 3-5 word description of the color. Return ONLY JSON: {"hex":"#xxxxxx","description":"..."}` }]
          })
        })
        const data = await res.json()
        const parsed = JSON.parse(data.content[0].text.trim().replace(/```json|```/g,''))
        setNewHex(parsed.hex)
        setAiColorNote(`AI matched: ${parsed.description}`)
      } catch {
        // Fallback to raw extraction if AI unavailable
        setNewHex(rawHex)
        setAiColorNote('Color extracted from photo')
      }
      setScanningColor(false)
    }
    img.src = preview
  }

  const addCustomBrand = () => {
    const trimmed = newBrandName.trim()
    if (!trimmed) return
    if (!brands.includes(trimmed)) setBrands(prev => [...prev, trimmed])
    setNewBrand(trimmed)
    setNewBrandName('')
    setShowAddBrand(false)
  }

  const toggleType = (t: 'Gel' | 'Regular' | 'SNS') => {
    setNewTypes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  const onColorNameInput = (val: string) => {
    setNewName(val)
    if (val.length < 2) { setSuggestions([]); return }
    setSuggestions(colors.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0,4))
  }

  const addColor = () => {
    if (!newName) { alert('Please enter a color name'); return }
    if (newTypes.length === 0) { alert('Please select at least one type'); return }
    setColors(prev => [...prev, {
      id: Date.now(), name: newName, brand: newBrand,
      hex: newHex, types: newTypes, code: newCode
    }])
    // Reset form
    setNewName(''); setNewCode(''); setNewHex('#C4546A')
    setNewTypes(['Gel']); setPolishPreview(''); setAiColorNote('')
    setShowAddColor(false); setSuggestions([])
  }

  const filteredColors = colors.filter(c => {
    const matchType   = filterType === 'All' || c.types.includes(filterType as any)
    const matchSearch = !searchQ || c.name.toLowerCase().includes(searchQ.toLowerCase()) || c.brand.toLowerCase().includes(searchQ.toLowerCase())
    return matchType && matchSearch
  })

  const saveSalon = () => {
    if (!salonName) { alert('Please enter your salon name'); return }
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const saveProfile = () => {
    setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2000)
  }

  // ── Mini components ──────────────────────────────────────────────────
  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: on ? '#1D9E75' : '#ddd', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </button>
  )

  const SettingRow = ({ icon, label, sub, right, onClick }: { icon: string; label: string; sub?: string; right?: React.ReactNode; onClick?: () => void }) => (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: '0.5px solid #eee', cursor: onClick ? 'pointer' : 'default' }}>
      <span style={{ fontSize: 18, width: 24, textAlign: 'center' as const, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: '#a0a0b0', margin: '2px 0 0' }}>{sub}</p>}
      </div>
      {right || (onClick && <span style={{ color: '#ddd', fontSize: 16 }}>›</span>)}
    </div>
  )

  const SectionLabel = ({ label }: { label: string }) => (
    <div style={{ padding: '14px 18px 6px', fontSize: 10, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#a0a0b0' }}>{label}</div>
  )

  const TypeBadge = ({ type }: { type: string }) => (
    <span style={{ display: 'inline-block', fontSize: 9, padding: '1px 7px', borderRadius: 999, marginRight: 3, marginTop: 3,
      background: type === 'Gel' ? '#E6F1FB' : type === 'SNS' ? '#FAEEDA' : '#EAF3DE',
      color: type === 'Gel' ? '#185FA5' : type === 'SNS' ? '#854F0B' : '#3B6D11' }}>
      {type}
    </span>
  )

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: 80 }}>

      {/* Hidden inputs */}
      <input ref={logoInputRef}  type="file" accept="image/*" onChange={handleLogoUpload}  style={{ display: 'none' }} />
      <input ref={profileImgRef} type="file" accept="image/*" onChange={handleProfileImg}  style={{ display: 'none' }} />
      <input ref={polishCamRef}  type="file" accept="image/*" onChange={handlePolishPhoto} style={{ display: 'none' }} />

      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px 4px', fontSize: 11, fontWeight: 500 }}>
        <span>9:41</span><span>●●●</span>
      </div>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 12px' }}>
        <img src="/logo.png" alt="HueMatch" style={{ height: 36, objectFit: 'contain' }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: '#6b6b80' }}>
          {activeTab === 'salon' ? '🏪 Salon' : activeTab === 'inventory' ? '💅 Inventory' : activeTab === 'analytics' ? '📊 Analytics' : '👤 Profile'}
        </span>
      </div>

      {/* ══ SALON TAB ══════════════════════════════════════════════════ */}
      {activeTab === 'salon' && (
        <div style={{ padding: '0 18px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <button onClick={() => logoInputRef.current?.click()}
              style={{ width: 90, height: 90, borderRadius: '50%', border: '2px dashed #F4C0D1', background: logoPreview ? 'transparent' : '#FDF0F2', cursor: 'pointer', overflow: 'hidden', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
              {logoPreview
                ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24 }}>📷</div><div style={{ fontSize: 10, color: '#C4546A', marginTop: 3 }}>Upload logo</div></div>
              }
            </button>
            {logoPreview && <button onClick={() => setLogoPreview('')} style={{ display: 'block', margin: '6px auto 0', fontSize: 10, color: '#C4546A', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>}
          </div>

          {[
            { label: '🏪 Salon name',   value: salonName, set: setSalonName, placeholder: 'e.g. Luxe Nail Bar',           type: 'text' },
            { label: '📍 Location',     value: location,  set: setLocation,  placeholder: 'e.g. 123 Main St, Atlanta GA', type: 'text' },
            { label: '📞 Phone number', value: phone,     set: setPhone,     placeholder: 'e.g. (404) 555-0123',          type: 'tel'  },
            { label: '🌐 Website',      value: webpage,   set: setWebpage,   placeholder: 'e.g. luxenailbar.com',          type: 'url'  },
            { label: '📅 Booking link', value: booking,   set: setBooking,   placeholder: 'e.g. booksy.com/luxenailbar',  type: 'url'  },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={f.value} onChange={e => f.set(e.target.value)}
                style={{ width: '100%', height: 44, border: '0.5px solid #ddd', borderRadius: 10, padding: '0 14px', fontSize: 15, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif', color: '#1a1a2e' }} />
            </div>
          ))}

          <button onClick={() => setActiveTab('inventory')}
            style={{ width: '100%', height: 48, background: '#EEEDF8', border: '0.5px solid rgba(44,43,75,0.15)', borderRadius: 12, fontSize: 13, fontWeight: 500, color: '#2C2B4B', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            💅 Manage polish inventory ({colors.length} colors)
          </button>

          <button onClick={saveSalon}
            style={{ width: '100%', height: 50, background: saved ? '#1D9E75' : '#C4546A', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, fontFamily: 'Outfit, sans-serif', cursor: 'pointer', transition: 'background 0.3s' }}>
            {saved ? '✓ Saved!' : 'Save salon profile ✦'}
          </button>
        </div>
      )}

      {/* ══ INVENTORY TAB ══════════════════════════════════════════════ */}
      {activeTab === 'inventory' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>Polish inventory</p>
              <p style={{ fontSize: 11, color: '#a0a0b0', margin: '2px 0 0' }}>{colors.length} colors in your salon</p>
            </div>
            <button onClick={() => setShowAddColor(true)}
              style={{ height: 36, padding: '0 14px', background: '#C4546A', color: 'white', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 500, fontFamily: 'Outfit, sans-serif', cursor: 'pointer' }}>
              + Add color
            </button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', margin: '0 18px 10px' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#a0a0b0' }}>🔍</span>
            <input placeholder="Search colors..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
              style={{ width: '100%', height: 38, border: '0.5px solid #ddd', borderRadius: 20, padding: '0 12px 0 34px', fontSize: 13, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif', background: '#f8f7f9' }} />
          </div>

          {/* Type filter */}
          <div style={{ display: 'flex', gap: 6, padding: '0 18px', marginBottom: 12 }}>
            {['All', 'Gel', 'Regular', 'SNS'].map(f => (
              <button key={f} onClick={() => setFilterType(f)}
                style={{ height: 28, padding: '0 12px', borderRadius: 20, border: filterType === f ? '1.5px solid #C4546A' : '0.5px solid #ddd', background: filterType === f ? '#FDF0F2' : 'white', color: filterType === f ? '#C4546A' : '#6b6b80', fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                {f}
              </button>
            ))}
          </div>

          {/* Color list */}
          {filteredColors.length === 0
            ? <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#a0a0b0' }}><div style={{ fontSize: 32, marginBottom: 8 }}>💅</div><p style={{ fontSize: 13 }}>No colors found</p></div>
            : filteredColors.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderBottom: '0.5px solid #eee' }}>
                <div style={{ width: 32, height: 42, borderRadius: 6, background: c.hex, border: '0.5px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: 10, color: '#6b6b80', margin: '2px 0 0' }}>{c.brand}{c.code ? ' · ' + c.code : ''}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const }}>
                    {c.types.map(t => <TypeBadge key={t} type={t} />)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 5 }}>
                  <input type="color" value={c.hex}
                    onChange={e => setColors(prev => prev.map(x => x.id === c.id ? { ...x, hex: e.target.value } : x))}
                    style={{ width: 28, height: 28, border: '0.5px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                  <button onClick={() => setColors(prev => prev.filter(x => x.id !== c.id))}
                    style={{ fontSize: 10, color: '#E24B4A', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>Remove</button>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* ══ ANALYTICS TAB ══════════════════════════════════════════════ */}
      {activeTab === 'analytics' && (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#a0a0b0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: '0 0 6px' }}>Analytics coming soon</p>
          <p style={{ fontSize: 12, lineHeight: 1.5 }}>Top matched colors, client retention, peak hours and tech performance will appear here.</p>
        </div>
      )}

      {/* ══ PROFILE TAB ════════════════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <div>
          <div style={{ textAlign: 'center', padding: '0 18px 20px' }}>
            <button onClick={() => profileImgRef.current?.click()}
              style={{ width: 80, height: 80, borderRadius: '50%', border: '2px dashed #F4C0D1', background: profileImg ? 'transparent' : '#FDF0F2', cursor: 'pointer', overflow: 'hidden', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, marginBottom: 10 }}>
              {profileImg ? <img src={profileImg} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 28 }}>👤</span>}
            </button>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 400, color: '#1a1a2e', margin: '0 0 2px' }}>{ownerName || 'Salon Owner'}</p>
            <p style={{ fontSize: 12, color: '#a0a0b0', margin: 0 }}>{salonName} · {location}</p>
          </div>

          <SectionLabel label="Salon" />
          <SettingRow icon="🏪" label="Edit salon info"     sub="Name, location, phone, website"   onClick={() => setActiveTab('salon')} />
          <SettingRow icon="💅" label="Polish inventory"    sub={`${colors.length} colors`}        onClick={() => setActiveTab('inventory')} />
          <SettingRow icon="📅" label="Booking link"        sub={booking || 'Not set'} />
          <SettingRow icon="⏰" label="Business hours"      sub="Set your open hours" />

          <SectionLabel label="Team" />
          <SettingRow icon="👥" label="Manage nail techs"   sub="Add, remove, view performance" />
          <SettingRow icon="⭐" label="Rewards & leaderboard" sub="Set milestones and prizes" />

          <SectionLabel label="Account" />
          <div style={{ padding: '10px 18px', borderBottom: '0.5px solid #eee' }}>
            <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>Your name</label>
            <input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Your name"
              style={{ width: '100%', height: 42, border: '0.5px solid #ddd', borderRadius: 10, padding: '0 12px', fontSize: 14, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif' }} />
          </div>
          <div style={{ padding: '10px 18px', borderBottom: '0.5px solid #eee' }}>
            <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>Email address</label>
            <input value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} placeholder="you@email.com" type="email"
              style={{ width: '100%', height: 42, border: '0.5px solid #ddd', borderRadius: 10, padding: '0 12px', fontSize: 14, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif' }} />
          </div>
          <SettingRow icon="🔒" label="Change password" />

          <SectionLabel label="HueMatch" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: '0.5px solid #eee' }}>
            <span style={{ fontSize: 18, width: 24, textAlign: 'center' as const }}>🗺️</span>
            <div style={{ flex: 1 }}><p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>Visible on salon map</p><p style={{ fontSize: 11, color: '#a0a0b0', margin: '2px 0 0' }}>Clients can find your salon</p></div>
            <Toggle on={mapVisible} onChange={() => setMapVisible(!mapVisible)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: '0.5px solid #eee' }}>
            <span style={{ fontSize: 18, width: 24, textAlign: 'center' as const }}>🔔</span>
            <div style={{ flex: 1 }}><p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>Notifications</p><p style={{ fontSize: 11, color: '#a0a0b0', margin: '2px 0 0' }}>Bookings, reviews, rewards</p></div>
            <Toggle on={notifications} onChange={() => setNotifications(!notifications)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: '0.5px solid #eee' }}>
            <span style={{ fontSize: 18, width: 24, textAlign: 'center' as const }}>💬</span>
            <div style={{ flex: 1 }}><p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>Client messaging</p><p style={{ fontSize: 11, color: '#a0a0b0', margin: '2px 0 0' }}>Allow clients to message</p></div>
            <Toggle on={clientMsg} onChange={() => setClientMsg(!clientMsg)} />
          </div>

          <SectionLabel label="Support" />
          <SettingRow icon="❓" label="Help center" />
          <SettingRow icon="📞" label="Contact HueMatch" />
          <SettingRow icon="📄" label="Terms & privacy" />

          <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            <button onClick={saveProfile}
              style={{ width: '100%', height: 48, background: profileSaved ? '#1D9E75' : '#C4546A', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, fontFamily: 'Outfit, sans-serif', cursor: 'pointer', transition: 'background 0.3s' }}>
              {profileSaved ? '✓ Saved!' : 'Save profile ✦'}
            </button>
            <button onClick={() => navigate('/')}
              style={{ width: '100%', height: 44, background: 'transparent', color: '#E24B4A', border: '0.5px solid #E24B4A', borderRadius: 12, fontSize: 13, fontWeight: 500, fontFamily: 'Outfit, sans-serif', cursor: 'pointer' }}>
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* ══ ADD COLOR POPUP ════════════════════════════════════════════ */}
      {showAddColor && (
        <>
          <div onClick={() => setShowAddColor(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 40 }} />
          <div style={{ position: 'fixed', top: '3%', left: '50%', transform: 'translateX(-50%)', width: '92%', maxWidth: 390, background: 'white', borderRadius: 20, padding: '1.25rem 1.25rem 1.5rem', zIndex: 50, boxShadow: '0 4px 24px rgba(0,0,0,0.2)', maxHeight: '92vh', overflowY: 'auto' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <p style={{ fontSize: 16, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>Add polish color</p>
              <button onClick={() => { setShowAddColor(false); setSuggestions([]); setPolishPreview(''); setAiColorNote('') }}
                style={{ width: 28, height: 28, borderRadius: '50%', background: '#f0f0f0', border: 'none', cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>

            {/* ── Color name ── */}
            <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>Color name</label>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <input placeholder="e.g. Lavender Dusk" value={newName} onChange={e => onColorNameInput(e.target.value)}
                style={{ width: '100%', height: 44, border: '0.5px solid #ddd', borderRadius: 10, padding: '0 14px', fontSize: 15, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif' }} />
              {suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '0.5px solid #ddd', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden' }}>
                  {suggestions.map(s => (
                    <button key={s.id} onClick={() => { setNewName(s.name); setNewBrand(s.brand); setNewHex(s.hex); setNewTypes(s.types); setNewCode(s.code); setSuggestions([]) }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' as const }}>
                      <div style={{ width: 24, height: 30, borderRadius: 4, background: s.hex, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>{s.name}</p>
                        <p style={{ fontSize: 10, color: '#6b6b80', margin: 0 }}>{s.brand}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Brand with add custom ── */}
            <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>Brand</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              <select value={newBrand} onChange={e => setNewBrand(e.target.value)}
                style={{ flex: 1, height: 44, border: '0.5px solid #ddd', borderRadius: 10, padding: '0 10px', fontSize: 14, outline: 'none', fontFamily: 'Outfit, sans-serif', background: 'white' }}>
                {brands.map(b => <option key={b}>{b}</option>)}
              </select>
              <button onClick={() => setShowAddBrand(true)}
                style={{ height: 44, padding: '0 12px', background: '#EEEDF8', border: '0.5px solid rgba(44,43,75,0.15)', borderRadius: 10, fontSize: 12, color: '#2C2B4B', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' as const }}>
                + New brand
              </button>
            </div>

            {/* Add brand inline */}
            {showAddBrand && (
              <div style={{ background: '#f8f7f9', borderRadius: 10, padding: '10px 12px', marginBottom: 12, border: '0.5px solid #eee' }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: '#2C2B4B', margin: '0 0 7px' }}>Add new brand</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input autoFocus placeholder="e.g. Cirque Colors" value={newBrandName} onChange={e => setNewBrandName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomBrand()}
                    style={{ flex: 1, height: 38, border: '0.5px solid #ddd', borderRadius: 8, padding: '0 10px', fontSize: 13, outline: 'none', fontFamily: 'Outfit, sans-serif' }} />
                  <button onClick={addCustomBrand}
                    style={{ height: 38, padding: '0 12px', background: '#C4546A', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Add</button>
                  <button onClick={() => { setShowAddBrand(false); setNewBrandName('') }}
                    style={{ height: 38, padding: '0 10px', background: 'transparent', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 12, cursor: 'pointer', color: '#6b6b80' }}>✕</button>
                </div>
              </div>
            )}

            {/* ── Type — multi select ── */}
            <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>
              Type <span style={{ fontSize: 10, color: '#a0a0b0', fontWeight: 400, textTransform: 'none' as const, letterSpacing: 0 }}>(select all that apply)</span>
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {(['Gel', 'Regular', 'SNS'] as const).map(t => (
                <button key={t} onClick={() => toggleType(t)}
                  style={{ flex: 1, height: 42, borderRadius: 10, border: newTypes.includes(t) ? '2px solid #C4546A' : '0.5px solid #ddd', background: newTypes.includes(t) ? '#FDF0F2' : 'white', color: newTypes.includes(t) ? '#C4546A' : '#6b6b80', fontSize: 12, fontWeight: newTypes.includes(t) ? 500 : 400, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <span>{newTypes.includes(t) ? '✓' : ''}</span>
                  {t === 'SNS' ? 'SNS / Dip' : t}
                </button>
              ))}
            </div>

            {/* ── Color — camera + AI ── */}
            <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>
              Color
            </label>

            {/* Photo scan area */}
            <button onClick={() => polishCamRef.current?.click()}
              style={{ width: '100%', height: polishPreview ? 'auto' : 72, border: '1px dashed #F4C0D1', borderRadius: 10, background: '#FDF0F2', cursor: 'pointer', marginBottom: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 5, padding: polishPreview ? 0 : '12px' }}>
              {polishPreview
                ? <img src={polishPreview} alt="polish" style={{ width: '100%', maxHeight: 120, objectFit: 'cover' }} />
                : <>
                  <span style={{ fontSize: 22 }}>📷</span>
                  <p style={{ fontSize: 11, color: '#C4546A', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Take photo of polish bottle</p>
                  <p style={{ fontSize: 10, color: '#a0a0b0', margin: 0, fontFamily: 'Outfit, sans-serif' }}>AI will match the exact color</p>
                </>
              }
            </button>

            {/* Scanning indicator */}
            {scanningColor && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#EEEDF8', borderRadius: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>✦</span>
                <p style={{ fontSize: 12, color: '#2C2B4B', margin: 0 }}>AI is analyzing the color...</p>
              </div>
            )}

            {/* AI result note */}
            {aiColorNote && !scanningColor && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: '#E1F5EE', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: newHex, border: '0.5px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
                <p style={{ fontSize: 11, color: '#1D9E75', margin: 0 }}>✓ {aiColorNote}</p>
                <button onClick={() => polishCamRef.current?.click()}
                  style={{ marginLeft: 'auto', fontSize: 10, color: '#C4546A', border: 'none', background: 'none', cursor: 'pointer', flexShrink: 0 }}>Retake</button>
              </div>
            )}

            {/* Manual color row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <input type="color" value={newHex} onChange={e => setNewHex(e.target.value)}
                style={{ width: 44, height: 44, border: '0.5px solid #ddd', borderRadius: 10, cursor: 'pointer', padding: 3, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: '#6b6b80', margin: '0 0 2px' }}>Or pick manually</p>
                <input type="text" value={newHex} onChange={e => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setNewHex(e.target.value) }}
                  style={{ width: '100%', height: 32, border: '0.5px solid #ddd', borderRadius: 7, padding: '0 10px', fontSize: 13, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' as const }} />
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: newHex, border: '0.5px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
            </div>

            {/* Product code */}
            <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>Product code (optional)</label>
            <input placeholder="e.g. GC H008" value={newCode} onChange={e => setNewCode(e.target.value)}
              style={{ width: '100%', height: 44, border: '0.5px solid #ddd', borderRadius: 10, padding: '0 14px', fontSize: 15, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif', marginBottom: 16 }} />

            <button onClick={addColor}
              style={{ width: '100%', height: 50, background: '#C4546A', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, fontFamily: 'Outfit, sans-serif', cursor: 'pointer' }}>
              Add to inventory ✦
            </button>
          </div>
        </>
      )}

      {/* Bottom nav */}
      <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 68, background: 'white', borderTop: '0.5px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 6px' }}>
        {[
          { icon: '📊', label: 'analytics', tab: 'analytics' },
          { icon: '🏪', label: 'salon',     tab: 'salon'     },
          { icon: '💅', label: 'inventory', tab: 'inventory' },
          { icon: '👤', label: 'profile',   tab: 'profile'   },
        ].map(n => (
          <button key={n.tab} onClick={() => setActiveTab(n.tab as typeof activeTab)}
            style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 3, flex: 1, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === n.tab ? '#C4546A' : '#a0a0b0', fontFamily: 'Outfit, sans-serif' }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 9 }}>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
