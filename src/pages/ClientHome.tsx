import { useNavigate } from 'react-router-dom'
import { getUserName } from '../App'

export default function ClientHome() {
  const navigate = useNavigate()
  const name = getUserName()

  const QUICK_ACTIONS = [
    { icon: '👗', title: 'Match My Outfit',   sub: 'Find colors that perfectly match your outfit.',  action: () => navigate('/match') },
    { icon: '📍', title: 'Find a Salon',      sub: 'Discover top-rated salons near you.',            action: () => {} },
    { icon: '💅', title: 'Find a Nail Tech',  sub: 'Locate skilled nail techs near you.',            action: () => {} },
    { icon: '✦',  title: 'Trending Colors',   sub: 'See what\'s popular right now.',                 action: () => {} },
  ]

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100%', background: '#FDF8F8', paddingBottom: 80, overflowY: 'auto' }}>

      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px 4px', fontSize: 11, fontWeight: 500 }}>
        <span>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="16" height="12" fill="currentColor" viewBox="0 0 16 12"><path d="M8 2.4C10.6 2.4 12.9 3.5 14.5 5.2L16 3.7C14 1.4 11.1 0 8 0S2 1.4 0 3.7l1.5 1.5C3.1 3.5 5.4 2.4 8 2.4z"/><path d="M8 5.5c1.7 0 3.2.7 4.3 1.8L14 5.6C12.5 4.1 10.4 3.1 8 3.1S3.5 4.1 2 5.6l1.7 1.7C4.8 6.2 6.3 5.5 8 5.5z"/><circle cx="8" cy="10" r="2"/></svg>
          <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor"><rect x="0" y="3" width="3" height="9" rx="1" opacity=".4"/><rect x="4" y="2" width="3" height="10" rx="1" opacity=".6"/><rect x="8" y="0" width="3" height="12" rx="1" opacity=".8"/><rect x="12" y="0" width="3" height="12" rx="1"/></svg>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity=".35"/><rect x="1.5" y="1.5" width="17" height="9" rx="2.5" fill="currentColor"/><path d="M23 4.5v3a1.5 1.5 0 000-3z" fill="currentColor" fillOpacity=".4"/></svg>
        </div>
      </div>

      {/* Logo */}
      <div style={{ textAlign: 'center', padding: '8px 0 0' }}>
        <img src="/logo.png" alt="HueMatch" style={{ width: 160, height: 160, objectFit: 'contain' }} />
      </div>

      {/* Welcome text */}
      <div style={{ textAlign: 'center', padding: '0 24px 20px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 400, color: '#2C2B4B', margin: '0 0 8px', lineHeight: 1.2 }}>
          Welcome to <span style={{ color: '#C4546A' }}>HueMatch</span>✦
        </h1>
        {name && (
          <p style={{ fontSize: 13, color: '#C4546A', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 6px' }}>
            Hi, {name}!
          </p>
        )}
        <p style={{ fontSize: 13, color: '#6b6b80', lineHeight: 1.6, margin: 0 }}>
          Find the perfect nail color for your style,<br />your outfit, and your next appointment.
        </p>
      </div>

      {/* Hero CTA — Match a Color */}
      <div style={{ padding: '0 18px 18px' }}>
        <button onClick={() => navigate('/match')}
          style={{ width: '100%', padding: '18px 20px', background: 'linear-gradient(135deg, #C4546A, #A8405A)', borderRadius: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 4px 20px rgba(196,84,106,0.35)' }}>
          {/* Camera icon circle */}
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
              <circle cx="18.5" cy="9.5" r=".5" fill="white"/>
            </svg>
          </div>
          <div style={{ flex: 1, textAlign: 'left' as const }}>
            <p style={{ fontSize: 20, fontWeight: 600, color: 'white', margin: '0 0 4px', fontFamily: 'Cormorant Garamond, serif' }}>Match a Color</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.4 }}>Upload a photo or take a picture<br />to find your perfect match.</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* How can we help */}
      <div style={{ padding: '0 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 0.5, background: 'rgba(196,84,106,0.25)' }} />
          <p style={{ fontSize: 13, color: '#2C2B4B', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', margin: 0, whiteSpace: 'nowrap' as const }}>✦ How can we help today? ✦</p>
          <div style={{ flex: 1, height: 0.5, background: 'rgba(196,84,106,0.25)' }} />
        </div>

        {/* 2x2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {QUICK_ACTIONS.map((a, i) => (
            <button key={a.title} onClick={a.action}
              style={{ background: 'white', border: '0.5px solid #F0E8E8', borderRadius: 14, padding: '14px 12px', textAlign: 'left' as const, cursor: 'pointer', display: 'flex', flexDirection: 'column' as const, gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'transform 0.12s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: i === 0 ? '#FDF0F2' : i === 1 ? '#EEF0FF' : i === 2 ? '#F0EEF8' : '#FDF3E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {a.icon}
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4546A" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0, lineHeight: 1.3 }}>{a.title}</p>
              <p style={{ fontSize: 11, color: '#6b6b80', margin: 0, lineHeight: 1.4 }}>{a.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Nail photo banner at bottom */}
      <div style={{ position: 'relative', margin: '0 0 0', overflow: 'hidden', height: 160, flexShrink: 0 }}>
        {/* Gradient overlay so it fades in nicely */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(to bottom, #FDF8F8, transparent)', zIndex: 1 }} />
        {/* Nail color strips as decorative element */}
        <div style={{ display: 'flex', height: '100%', gap: 0 }}>
          {['#FFCDD9','#F4A7B9','#E91E8C','#C4546A','#8B3A52','#9B7DB8','#6B4A8C','#F4C0D1','#E8A0B8','#D4537E'].map((c, i) => (
            <div key={i} style={{ flex: 1, background: c, opacity: 0.85 + (i % 3) * 0.05 }} />
          ))}
        </div>
        {/* Text overlay */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, background: 'rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 400, color: 'white', margin: 0, textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
              Your perfect shade is waiting ✦
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', margin: '4px 0 0', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              100+ colors · AI matched to your style
            </p>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 68, background: 'white', borderTop: '0.5px so
