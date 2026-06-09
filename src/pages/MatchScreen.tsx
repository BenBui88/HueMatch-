import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useMatchStore } from '../store/index'

const SKIN_TONES = [
  { hex: '#FDDBB4', name: 'Fair porcelain',  undertone: 'cool' },
  { hex: '#F5C99A', name: 'Light ivory',     undertone: 'neutral' },
  { hex: '#EAB98A', name: 'Light beige',     undertone: 'warm' },
  { hex: '#D4956A', name: 'Medium beige',    undertone: 'warm' },
  { hex: '#C07B4F', name: 'Medium tan',      undertone: 'warm' },
  { hex: '#A0622E', name: 'Medium brown',    undertone: 'warm' },
  { hex: '#8B4513', name: 'Caramel brown',   undertone: 'warm' },
  { hex: '#6B3A2A', name: 'Deep brown',      undertone: 'neutral' },
  { hex: '#4A2015', name: 'Deep espresso',   undertone: 'cool' },
  { hex: '#2D0D00', name: 'Deep ebony',      undertone: 'cool' },
]

const FALLBACK: Record<string, { name: string; brand: string; hex: string; match: number; reason: string }[]> = {
  Gel: [
    { name: 'Lavender Dusk',  brand: 'OPI GelColor', hex: '#9B7DB8', match: 97, reason: 'Analogous purple harmonizes with your outfit.' },
    { name: 'Berry Whisper',  brand: 'Gelish',        hex: '#8B5B8E', match: 93, reason: 'Deeper tone extends the cool-purple palette.' },
    { name: 'Plum Poetry',    brand: 'CND Shellac',   hex: '#6E4A7A', match: 89, reason: 'Jewel tone adds depth and richness.' },
    { name: 'Mauve Mist',     brand: 'Entity',        hex: '#B89AB8', match: 85, reason: 'Dusty variation — tonal and elegant.' },
    { name: 'Lilac Dream',    brand: 'IBD',           hex: '#C2A8D4', match: 80, reason: 'Lighter tint creates airy coordination.' },
    { name: 'Orchid Haze',    brand: 'Orly',          hex: '#B090C0', match: 75, reason: 'Neutral purple bridges outfit seamlessly.' },
  ],
  Regular: [
    { name: 'Violet Hour',    brand: 'OPI',           hex: '#8B6BAE', match: 96, reason: 'Classic analogous match in the same hue family.' },
    { name: 'Mystical Mauve', brand: 'Essie',         hex: '#9E7DA8', match: 91, reason: 'Muted violet echoes the outfit.' },
    { name: 'Grape Escape',   brand: 'Sally Hansen',  hex: '#7A5490', match: 87, reason: 'Mid-tone ties the entire look together.' },
    { name: 'Lavender Fields',brand: 'Zoya',          hex: '#B8A0CC', match: 83, reason: 'Soft pastel for airy coordination.' },
    { name: 'Purple Rain',    brand: 'China Glaze',   hex: '#6B4A8C', match: 78, reason: 'Bold deeper tone adds drama.' },
    { name: 'Orchid Haze',    brand: 'Butter London', hex: '#C0A0C8', match: 73, reason: 'Dusty orchid is chic and understated.' },
  ],
  SNS: [
    { name: 'Wisteria',       brand: 'SNS Signature', hex: '#9B7DC0', match: 95, reason: 'Perfect tonal match with violet shift.' },
    { name: 'Violet Mist',    brand: 'Kiara Sky',     hex: '#8A6BAA', match: 90, reason: 'Cool-toned match enhances undertones.' },
    { name: 'Purple Haze',    brand: 'Revel Nail',    hex: '#7058A0', match: 86, reason: 'Harmonious mid-purple pairs naturally.' },
    { name: 'Amethyst',       brand: 'SNS Natural',   hex: '#6A4890', match: 82, reason: 'Jewel-toned depth elevates the look.' },
    { name: 'Dusty Plum',     brand: 'Gelish Dip',    hex: '#8B6080', match: 77, reason: 'Understated muted plum.' },
    { name: 'Heather',        brand: 'DND DC',        hex: '#B090C0', match: 72, reason: 'Neutral purple — seamless bridge.' },
  ],
}

const SALONS = [
  { name: 'Luxe Nail Bar',   emoji: '💅', avail: '6 matches', dist: '0.3 mi', bColor: '#D4145A' },
  { name: 'The Nail Studio', emoji: '✨', avail: '4 matches', dist: '0.7 mi', bColor: null },
  { name: 'Pink & Polish',   emoji: '🌸', avail: '5 matches', dist: '1.2 mi', bColor: '#2D5BE3' },
]

export default function MatchScreen() {
  const navigate = useNavigate()
  const { userName } = useAuthStore()
  const { outfitHex, skinHex, skinName, undertone, nailType, setOutfit, setSkin, setNailType } = useMatchStore()

  const [outfitSet, setOutfitSet]   = useState(false)
  const [loading, setLoading]       = useState(false)
  const [thinking, setThinking]     = useState('')
  const [results, setResults]       = useState<typeof FALLBACK.Gel | null>(null)

  const demoOutfits = ['#C4546A','#4A7B9D','#5A8A5A','#C4934A','#7C5C8A']

  const pickOutfit = () => {
    const c = demoOutfits[Math.floor(Math.random() * demoOutfits.length)]
    setOutfit(c)
    setOutfitSet(true)
  }

  const steps = [
    `Reading outfit color ${outfitHex}...`,
    `Analyzing skin tone — ${skinName || 'medium beige'}...`,
    'Applying color harmony theory...',
    'Filtering salon inventories near you...',
    'Ranking by combined match score...',
  ]

  const runMatch = async () => {
    setResults(null)
    setLoading(true)
    let i = 0
    const iv = setInterval(() => { setThinking(steps[i] || steps[steps.length - 1]); i++ }, 700)
    try {
     const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/match-colors`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ outfitHex, skinName, skinHex, undertone, nailType })
        }
      )
      const colors = await res.json()
      setResults(Array.isArray(colors) ? colors : FALLBACK)
      })
      const data = await res.json()
      const text = data.content[0])
    } catch {
      setResults(FALLBACK[nailType] || FALLBACK.Gel)
    } finally {
      clearInterval(iv)
      setLoading(false)
    }
  }

  const s = { fontFamily: 'Outfit, sans-serif' }

  return (
    <div style={{ ...s, display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: 80 }}>

      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px 4px', fontSize: 11, fontWeight: 500 }}>
        <span>9:41</span><span>●●●</span>
      </div>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 4px' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 19, fontWeight: 600 }}>
          <span style={{ color: '#C4546A' }}>Hue</span><span style={{ color: '#2C2B4B' }}>Match</span>
        </span>
        <span style={{ fontSize: 11, color: '#6b6b80' }}>Hi, {userName?.split(' ')[0] || 'there'} 👋</span>
      </div>

      {/* Hero */}
      <div style={{ padding: '4px 18px 12px' }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#C4546A', marginBottom: 4 }}>Match your nails. Match your style.</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 300, lineHeight: 1.2, color: '#1a1a2e' }}>
          Find your<br /><em style={{ color: '#2C2B4B' }}>perfect</em> shade.
        </h1>
        <p style={{ fontSize: 12, color: '#6b6b80', marginTop: 6, lineHeight: 1.5 }}>Outfit color + skin tone — AI matches both at once.</p>
      </div>

      {/* Two column inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 18px', marginBottom: 14 }}>

        {/* Outfit */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a0a0b0', marginBottom: 6 }}>👗 Outfit</p>
          <div style={{ border: outfitSet ? '1.5px solid #C4546A' : '0.5px solid #ddd', borderRadius: 12, overflow: 'hidden' }}>
            <button onClick={pickOutfit} style={{ width: '100%', height: 88, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', border: 'none', background: outfitSet ? outfitHex + '22' : '#f8f7f9' }}>
              {outfitSet
                ? <><div style={{ width: 48, height: 48, borderRadius: '50%', background: outfitHex, border: '3px solid white' }} /><p style={{ fontSize: 10, color: '#C4546A' }}>Extracted ✦</p></>
                : <><span style={{ fontSize: 22 }}>📷</span><p style={{ fontSize: 10, color: '#a0a0b0' }}>Tap to pick</p></>
              }
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderTop: '0.5px solid #eee' }}>
              <input type="color" value={outfitHex} onChange={e => { setOutfit(e.target.value); setOutfitSet(true) }}
                style={{ width: 26, height: 26, border: '0.5px solid #ddd', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
              <input type="text" defaultValue={outfitHex} onChange={e => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) { setOutfit(e.target.value); setOutfitSet(true) } }}
                style={{ flex: 1, height: 26, border: '0.5px solid #ddd', borderRadius: 6, padding: '0 7px', fontSize: 11, minWidth: 0, outline: 'none' }} />
            </div>
          </div>
        </div>

        {/* Skin tone */}
        <div>
          <p style={{ fontSize: 10, fontW
