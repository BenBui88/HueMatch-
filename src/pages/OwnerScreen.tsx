import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const BRANDS = ['OPI', 'Essie', 'Gelish', 'CND Shellac', 'Zoya', 'China Glaze', 'Sally Hansen', 'Kiara Sky', 'SNS', 'Revel Nail', 'Orly', 'Butter London', 'Other']

interface Color {
  id: number
  name: string
  brand: string
  hex: string
  type: 'Gel' | 'Regular' | 'SNS'
  code: string
}

export default function OwnerScreen() {
  const navigate = useNavigate()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const profileImgRef = useRef<HTMLInputElement>(null)

  // Bottom nav
  const [activeTab, setActiveTab] = useState<'salon' | 'inventory' | 'analytics' | 'profile'>('salon')

  // Salon profile
  const [salonName, setSalonName]     = useState('Luxe Nail Bar')
  const [location, setLocation]       = useState('Atlanta, GA')
  const [phone, setPhone]             = useState('')
  const [webpage, setWebpage]         = useState('')
  const [booking, setBooking]         = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [saved, setSaved]             = useState(false)

  // Owner profile
  const [ownerName, setOwnerName]         = useState('Salon Owner')
  const [ownerEmail, setOwnerEmail]       = useState('')
  const [profileImg, setProfileImg]       = useState('')
  const [notifications, setNotifications] = useState(true)
  const [mapVisible, setMapVisible]       = useState(true)
  const [clientMsg, setClientMsg]         = useState(true)
  const [profileSaved, setProfileSaved]   = useState(false)

  // Colors
  const [colors, setColors]           = useState<Color[]>([
    { id: 1, name: 'Lavender Dusk',   brand: 'OPI',    hex: '#9B7DB8', type: 'Gel',     code: 'GC H008' },
    { id: 2, name: 'Berry Whisper',   brand: 'Gelish', hex: '#8B5B8E', type: 'Gel',     code: '01708' },
    { id: 3, name: 'Ballet Slippers', brand: 'Essie',  hex: '#FFCDD9', type: 'Regular', code: '162' },
    { id: 4, name: 'Cherry Red',      brand: 'OPI',    hex: '#C62828', type: 'Gel',     code: 'GC L72' },
    { id: 5, name: 'Sage Green',      brand: 'Zoya',   hex: '#A5D6A7', type: 'Regular', code: 'ZP1012' },
  ])
  const [showAddColor, setShowAddColor] = useState(false)
  const [filterType, setFilterType]     = useState('All')
  const [searchQ, setSearchQ]           = useState('')
  const [newName, setNewName]           = useState('')
  const [newBrand, setNewBrand]         = useState('OPI')
  const [newHex, setNewHex]             = useState('#C4546A')
  const [newType, setNewType]           = useState<'Gel' | 'Regular' | 'SNS'>('Gel')
  const [newCode, setNewCode]           = useState('')
  const [suggestions, setSuggestions]   = useState<Color[]>([])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleProfileImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfileImg(URL.createObjectURL(file))
  }

  const saveSalon = () => {
    if (!salonName) { alert('Please enter your salon name'); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const saveProfile = () => {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const onColorNameInput = (val: string) => {
    setNewName(val)
    if (val.length < 2) { setSuggestions([]); return }
    setSuggestions(colors.filter(c =>
      c.name.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 4))
  }

  const addColor = () => {
    if (!newName) { alert('Please enter a color name'); return }
    setColors(prev => [...prev, { id: Date.now(), name: newName, brand: newBrand, hex: newHex, type: newType, code: newCode }])
    setNewName(''); setNewCode(''); setNewHex('#C4546A')
    setShowAddColor(false); setSuggestions([])
  }

  const filteredColors = colors.filter(c => {
    const matchType   = filterType === 'All' || c.type === filterType
    const matchSearch = !searchQ || c.name.toLowerCase().includes(searchQ.toLowerCase()) || c.brand.toLowerCase().includes(searchQ.toLowerCase())
    return matchType && matchSearch
  })

  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: on ? '#1D9E75' : '#ddd', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </button>
  )

  const SettingRow = ({ icon, label, sub, right }: { icon: string; label: string; sub?: string; right?: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: '0.5px solid #eee' }}>
      <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: '#a0a0b0', margin: '2px 0 0' }}>{sub}</p>}
      </div>
      {right || <span style={{ color: '#ddd', fontSize: 16 }}>›</span>}
    </div>
  )

  const SectionLabel = ({ label }: { label: string }) => (
    <div style={{ padding: '14px 18px 6px', fontSize: 10, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#a0a0b0' }}>
      {label}
    </div>
  )

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: 80 }}>

      {/* Hidden inputs */}
      <input ref={logoInputRef}   type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
      <input ref={profileImgRef}  type="file" accept="image/*" onChange={handleProfileImg} style={{ display: 'none' }} />

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

      {/* ══ SALON TAB ══════════════════════════════════════ */}
      {activeTab === 'salon' && (
        <div style={{ padding: '0 18px' }}>

          {/* Logo upload */}
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
            { label: '📞 Phone number', value: phone,     set: setPhone,     placeholder: 'e.g. (404) 555-0123',          type: 'tel' },
            { label: '🌐 Website',      value: webpage,   set: setWebpage,   placeholder: 'e.g. luxenailbar.com',          type: 'url' },
            { label: '📅 Booking link', value: booking,   set: setBooking,   placeholder: 'e.g. booksy.com/luxenailbar',  type: 'url' },
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

      {/* ══ INVENTORY TAB ══════════════════════════════════ */}
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

          {/* Type filters */}
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
                  <span style={{ display: 'inline-block', fontSize: 9, padding: '1px 7px', borderRadius: 999, marginTop: 3, background: c.type === 'Gel' ? '#E6F1FB' : c.type === 'SNS' ? '#FAEEDA' : '#EAF3DE', color: c.type === 'Gel' ? '#185FA5' : c.type === 'SNS' ? '#854F0B' : '#3B6D11' }}>
                    {c.type}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                  <input type="color" value={c.hex}
                    onChange={e => setColors(prev => prev.map(x => x.id === c.id ? { ...x, hex: e.target.value } : x))}
                    style={{ width: 28, height: 28, border: '0.5px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }} title="Edit color" />
                  <button onClick={() => setColors(prev => prev.filter(x => x.id !== c.id))}
                    style={{ fontSize: 10, color: '#E24B4A', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>Remove</button>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* ══ ANALYTICS TAB ══════════════════════════════════ */}
      {activeTab === 'analytics' && (
        <div style={{ padding: '0 18px' }}>
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#a0a0b0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: '0 0 6px' }}>Analytics coming soon</p>
            <p style={{ fontSize: 12, lineHeight: 1.5 }}>Top matched colors, client retention, peak hours and tech performance will appear here.</p>
          </div>
        </div>
      )}

      {/* ══ PROFILE TAB ════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <div>

          {/* Profile hero */}
          <div style={{ textAlign: 'center', padding: '0 18px 20px' }}>
            <button onClick={() => profileImgRef.current?.click()}
              style={{ width: 80, height: 80, borderRadius: '50%', border: '2px dashed #F4C0D1', background: profileImg ? 'transparent' : '#FDF0F2', cursor: 'pointer', overflow: 'hidden', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, marginBottom: 10 }}>
              {profileImg
                ? <img src={profileImg} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 28 }}>👤</span>
              }
            </button>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 400, color: '#1a1a2e', margin: '0 0 2px' }}>{ownerName || 'Salon Owner'}</p>
            <p style={{ fontSize: 12, color: '#a0a0b0', margin: 0 }}>{salonName} · {location}</p>
          </div>

          {/* Salon section */}
          <SectionLabel label="Salon" />
          <div onClick={() => setActiveTab('salon')}><SettingRow icon="🏪" label="Edit salon info" sub="Name, location, phone, website" /></div>
          <div onClick={() => setActiveTab('inventory')}><SettingRow icon="💅" label="Polish inventory" sub={`${colors.length} colors in your salon`} /></div>
          <SettingRow icon="📅" label="Booking link" sub={booking || 'Not set'} />
          <SettingRow icon="⏰" label="Business hours" sub="Set your open hours" />

          {/* Team section */}
          <SectionLabel label="Team" />
          <SettingRow icon="👥" label="Manage nail techs" sub="Add, remove, view performance" />
          <SettingRow icon="⭐" label="Rewards & leaderboard" sub="Set milestones and prizes" />

          {/* Account section */}
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
          <SettingRow icon="🔒" label="Change password"
