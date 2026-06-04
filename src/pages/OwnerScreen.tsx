import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserName } from '../App'

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

  // Salon profile state
  const [salonName, setSalonName]     = useState('')
  const [location, setLocation]       = useState('')
  const [phone, setPhone]             = useState('')
  const [webpage, setWebpage]         = useState('')
  const [booking, setBooking]         = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [saved, setSaved]             = useState(false)

  // Color inventory state
  const [view, setView]               = useState<'profile' | 'inventory'>('profile')
  const [colors, setColors]           = useState<Color[]>([
    { id: 1, name: 'Lavender Dusk',  brand: 'OPI',     hex: '#9B7DB8', type: 'Gel',     code: 'GC H008' },
    { id: 2, name: 'Berry Whisper',  brand: 'Gelish',  hex: '#8B5B8E', type: 'Gel',     code: '01708' },
    { id: 3, name: 'Ballet Slippers',brand: 'Essie',   hex: '#FFCDD9', type: 'Regular', code: '162' },
    { id: 4, name: 'Cherry Red',     brand: 'OPI',     hex: '#C62828', type: 'Gel',     code: 'GC L72' },
    { id: 5, name: 'Sage Green',     brand: 'Zoya',    hex: '#A5D6A7', type: 'Regular', code: 'ZP1012' },
  ])
  const [showAddColor, setShowAddColor] = useState(false)
  const [filterBrand, setFilterBrand]   = useState('All')
  const [filterType, setFilterType]     = useState('All')
  const [searchQ, setSearchQ]           = useState('')

  // New color form
  const [newName, setNewName]   = useState('')
  const [newBrand, setNewBrand] = useState('OPI')
  const [newHex, setNewHex]     = useState('#C4546A')
  const [newType, setNewType]   = useState<'Gel' | 'Regular' | 'SNS'>('Gel')
  const [newCode, setNewCode]   = useState('')
  const [suggestions, setSuggestions] = useState<Color[]>([])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoPreview(URL.createObjectURL(file))
  }

  const saveSalon = () => {
    if (!salonName) { alert('Please enter your salon name'); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const onColorNameInput = (val: string) => {
    setNewName(val)
    if (val.length < 2) { setSuggestions([]); return }
    const matches = colors.filter(c =>
      c.name.toLowerCase().includes(val.toLowerCase()) ||
      c.brand.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 4)
    setSuggestions(matches)
  }

  const addColor = () => {
    if (!newName) { alert('Please enter a color name'); return }
    setColors(prev => [...prev, {
      id: Date.now(), name: newName, brand: newBrand,
      hex: newHex, type: newType, code: newCode
    }])
    setNewName(''); setNewCode(''); setNewHex('#C4546A')
    setShowAddColor(false); setSuggestions([])
  }

  const deleteColor = (id: number) => {
    setColors(prev => prev.filter(c => c.id !== id))
  }

  const filteredColors = colors.filter(c => {
    const matchBrand = filterBrand === 'All' || c.brand === filterBrand
    const matchType  = filterType === 'All'  || c.type === filterType
    const matchSearch = !searchQ || c.name.toLowerCase().includes(searchQ.toLowerCase()) || c.brand.toLowerCase().includes(searchQ.toLowerCase())
    return matchBrand && matchType && matchSearch
  })

  const s = (extra?: object) => ({ fontFamily: 'Outfit, sans-serif', ...extra })

  return (
    <div style={s({ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: 80 })}>

      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px 4px', fontSize: 11, fontWeight: 500 }}>
        <span>9:41</span><span>●●●</span>
      </div>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 4px' }}>
        <img src="/logo.png" alt="HueMatch" style={{ height: 36, objectFit: 'contain' }} />
        <span style={{ fontSize: 11, color: '#6b6b80' }}>Owner dashboard</span>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', margin: '8px 18px 16px', background: '#f8f7f9', borderRadius: 10, padding: 3 }}>
        {[
          { id: 'profile',   label: '🏪 Salon profile' },
          { id: 'inventory', label: '💅 Polish inventory' },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id as 'profile' | 'inventory')}
            style={{ flex: 1, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: view === t.id ? 500 : 400, background: view === t.id ? 'white' : 'transparent', color: view === t.id ? '#C4546A' : '#6b6b80', boxShadow: view === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── SALON PROFILE VIEW ── */}
      {view === 'profile' && (
        <div style={{ padding: '0 18px' }}>

          {/* Logo upload */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            <button onClick={() => logoInputRef.current?.click()}
              style={{ width: 90, height: 90, borderRadius: '50%', border: '2px dashed #F4C0D1', background: logoPreview ? 'transparent' : '#FDF0F2', cursor: 'pointer', overflow: 'hidden', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, position: 'relative' }}>
              {logoPreview
                ? <img src={logoPreview} alt="salon logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24 }}>📷</div><div style={{ fontSize: 10, color: '#C4546A', marginTop: 3 }}>Upload logo</div></div>
              }
            </button>
            {logoPreview && (
              <button onClick={() => setLogoPreview('')}
                style={{ display: 'block', margin: '6px auto 0', fontSize: 10, color: '#C4546A', border: 'none', background: 'none', cursor: 'pointer' }}>
                Remove
              </button>
            )}
          </div>

          {/* Form fields */}
          {[
            { label: '🏪 Salon name',   value: salonName, set: setSalonName, placeholder: 'e.g. Luxe Nail Bar',           type: 'text' },
            { label: '📍 Location',     value: location,  set: setLocation,  placeholder: 'e.g. 123 Main St, Atlanta GA', type: 'text' },
            { label: '📞 Phone number', value: phone,     set: setPhone,     placeholder: 'e.g. (404) 555-0123',          type: 'tel' },
            { label: '🌐 Website',      value: webpage,   set: setWebpage,   placeholder: 'e.g. luxenailbar.com',          type: 'url' },
            { label: '📅 Booking link', value: booking,   set: setBooking,   placeholder: 'e.g. booksy.com/luxenailbar',  type: 'url' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={f.value}
                onChange={e => f.set(e.target.value)}
                style={{ width: '100%', height: 44, border: '0.5px solid #ddd', borderRadius: 10, padding: '0 14px', fontSize: 15, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif', color: '#1a1a2e' }}
              />
            </div>
          ))}

          {/* Polish inventory button */}
          <button onClick={() => setView('inventory')}
            style={{ width: '100%', height: 48, background: '#EEEDF8', border: '0.5px solid rgba(44,43,75,0.15)', borderRadius: 12, fontSize: 13, fontWeight: 500, color: '#2C2B4B', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            💅 Manage polish inventory ({colors.length} colors)
          </button>

          {/* Save button */}
          <button onClick={saveSalon}
            style={{ width: '100%', height: 50, background: saved ? '#1D9E75' : '#C4546A', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, fontFamily: 'Outfit, sans-serif', cursor: 'pointer', transition: 'background 0.3s' }}>
            {saved ? '✓ Saved!' : 'Save salon profile ✦'}
          </button>
        </div>
      )}

      {/* ── INVENTORY VIEW ── */}
      {view === 'inventory' && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>Polish inventory</p>
              <p style={{ fontSize: 11, color: '#a0a0b0', margin: '2px 0 0' }}>{colors.length} colors in your salon</p>
            </div>
            <button onClick={() => setShowAddColor(true)}
              style={{ height: 36, padding: '0 14px', background: '#C4546A', color: 'white', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 500, fontFamily: 'Outfit, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              + Add color
            </button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', margin: '0 18px 10px' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#a0a0b0' }}>🔍</span>
            <input placeholder="Search by name or brand..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
              style={{ width: '100%', height: 38, border: '0.5px solid #ddd', borderRadius: 20, padding: '0 12px 0 34px', fontSize: 13, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif', background: '#f8f7f9' }} />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 6, padding: '0 18px', marginBottom: 12, overflowX: 'auto', scrollbarWidth: 'none' as const }}>
            {['All', 'Gel', 'Regular', 'SNS'].map(f => (
              <button key={f} onClick={() => setFilterType(f)}
                style={{ flexShrink: 0, height: 28, padding: '0 12px', borderRadius: 20, border: filterType === f ? '1.5px solid #C4546A' : '0.5px solid #ddd', background: filterType === f ? '#FDF0F2' : 'white', color: filterType === f ? '#C4546A' : '#6b6b80', fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                {f}
              </button>
            ))}
            <div style={{ width: 1, height: 28, background: '#eee', flexShrink: 0 }} />
            {['All', ...BRANDS.slice(0, 6)].map(b => (
              <button key={b} onClick={() => setFilterBrand(b)}
                style={{ flexShrink: 0, height: 28, padding: '0 12px', borderRadius: 20, border: filterBrand === b ? '1.5px solid #2C2B4B' : '0.5px solid #ddd', background: filterBrand === b ? '#EEEDF8' : 'white', color: filterBrand === b ? '#2C2B4B' : '#6b6b80', fontSize: 11, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                {b}
              </button>
            ))}
          </div>

          {/* Color list */}
          {filteredColors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#a0a0b0' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💅</div>
              <p style={{ fontSize: 13, margin: 0 }}>No colors found</p>
              <p style={{ fontSize: 11, margin: '4px 0 0' }}>Try a different filter or add a new color</p>
            </div>
          ) : (
            filteredColors.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderBottom: '0.5px solid #eee' }}>
                <div style={{ width: 32, height: 42, borderRadius: 6, background: c.hex, border: '0.5px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: 10, color: '#6b6b80', margin: '2px 0 0' }}>{c.brand} {c.code ? '· ' + c.code : ''}</p>
                  <span style={{ display: 'inline-block', fontSize: 9, padding: '1px 7px', borderRadius: 999, marginTop: 3, background: c.type === 'Gel' ? '#E6F1FB' : c.type === 'SNS' ? '#FAEEDA' : '#EAF3DE', color: c.type === 'Gel' ? '#185FA5' : c.type === 'SNS' ? '#854F0B' : '#3B6D11' }}>
                    {c.type}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                  <input type="color" value={c.hex}
                    onChange={e => setColors(prev => prev.map(x => x.id === c.id ? { ...x, hex: e.target.value } : x))}
                    style={{ width: 28, height: 28, border: '0.5px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }}
                    title="Edit color" />
                  <button onClick={() => deleteColor(c.id)}
                    style={{ fontSize: 10, color: '#E24B4A', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── ADD COLOR POPUP ── */}
      {showAddColor && (
        <>
          <div onClick={() => setShowAddColor(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 40 }} />
          <div style={{ position: 'fixed', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: 390, background: 'white', borderRadius: 20, padding: '1.25rem 1.5rem 1.5rem', zIndex: 50, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <p style={{ fontSize: 16, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>Add polish color</p>
              <button onClick={() => { setShowAddColor(false); setSuggestions([]) }}
                style={{ width: 28, height: 28, borderRadius: '50%', background: '#f0f0f0', border: 'none', cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>

            {/* Color name with autocomplete */}
            <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>Color name</label>
            <div style={{ position: 'relative', marginBottom: suggestions.length ? 0 : 12 }}>
              <input placeholder="e.g. Lavender Dusk" value={newName} onChange={e => onColorNameInput(e.target.value)}
                style={{ width: '100%', height: 44, border: '0.5px solid #ddd', borderRadius: 10, padding: '0 14px', fontSize: 15, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif' }} />
              {suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '0.5px solid #ddd', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden' }}>
                  {suggestions.map(s => (
                    <button key={s.id} onClick={() => { setNewName(s.name); setNewBrand(s.brand); setNewHex(s.hex); setNewType(s.type); setNewCode(s.code); setSuggestions([]) }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' as const }}>
                      <div style={{ width: 24, height: 30, borderRadius: 4, background: s.hex, border: '0.5px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>{s.name}</p>
                        <p style={{ fontSize: 10, color: '#6b6b80', margin: 0 }}>{s.brand} — already in catalog</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Brand */}
            <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5, marginTop: 12 }}>Brand</label>
            <select value={newBrand} onChange={e => setNewBrand(e.target.value)}
              style={{ width: '100%', height: 44, border: '0.5px solid #ddd', borderRadius: 10, padding: '0 14px', fontSize: 15, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'Outfit, sans-serif', background: 'white', marginBottom: 12 }}>
              {BRANDS.map(b => <option key={b}>{b}</option>)}
            </select>

            {/* Type + Hex in a row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value as 'Gel' | 'Regular' | 'SNS')}
                  style={{ width: '100%', height: 44, border: '0.5px solid #ddd', borderRadius: 10, padding: '0 10px', fontSize: 14, outline: 'none', fontFamily: 'Outfit, sans-serif', background: 'white', boxSizing: 'border-box' as const }}>
                  <option>Gel</option>
                  <option>Regular</option>
                  <option>SNS</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#a0a0b0', display: 'block', marginBottom: 5 }}>Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, border: '0.5px solid #ddd', borderRadius: 10, padding: '0 10px', boxSizing: 'border-box' as const }}>
                  <input type="color" value={newHex} onChange={e => setNewHex(e.target.value)}
                    style={{ width: 30, height: 30, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 0, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#6b6b80' }}>{newHex}</span>
                </div>
              </div>
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
          { icon: '📊', label: 'analytics', active: false },
          { icon: '🏪', label: 'salon',     active: true },
          { icon: '📦', label: 'inventory', active: false },
          { icon: '👥', label: 'techs',     active: false },
        ].map(n => (
          <button key={n.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1, background: 'none', border: 'none', cursor: 'pointer', color: n.active ? '#C4546A' : '#a0a0b0', fontFamily: 'Outfit, sans-serif' }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 9 }}>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
