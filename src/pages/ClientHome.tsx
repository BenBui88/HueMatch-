import { useNavigate } from 'react-router-dom'
import { getUserName } from '../App'

export default function ClientHome() {
  const navigate = useNavigate()
  const name = getUserName()

  const QUICK_ACTIONS = [
    { icon: '👗', title: 'Match My Outfit',  sub: 'Find colors that perfectly match your outfit.', bg: '#FDF0F2', action: () => navigate('/match') },
    { icon: '📍', title: 'Find a Salon',     sub: 'Discover top-rated salons near you.',           bg: '#EEF0FF', action: () => {} },
    { icon: '💅', title: 'Find a Nail Tech', sub: 'Locate skilled nail techs near you.',           bg: '#F0EEF8', action: () => {} },
    { icon: '✦',  title: 'Trending Colors',  sub: "See what's popular right now.",                 bg: '#FDF3E8', action: () => {} },
  ]

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100%', background: '#FDF8F8', paddingBottom: 80, overflowY: 'auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px 4px', fontSize: 11, fontWeight: 500 }}>
        <span>9:41</span>
        <span>111 WiFi Bat</span>
      </div>

      <div style={{ textAlign: 'center', padding: '8px 0 0' }}>
        <img src="/logo.png" alt="HueMatch" style={{ width: 160, height: 160, objectFit: 'contain' }} />
      </div>

      <div style={{ textAlign: 'center', padding: '0 24px 20px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 400, color: '#2C2B4B', margin: '0 0 8px', lineHeight: 1.2 }}>
          Welcome to <span style={{ color: '#C4546A' }}>HueMatch</span> ✦
        </h1>
        {name && (
          <p style={{ fontSize: 14, color: '#C4546A', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', margin: '0 0 8px' }}>
            Hi, {name}!
          </p>
        )}
        <p style={{ fontSize: 13, color: '#6b6b80', lineHeight: 1.6, margin: 0 }}>
          Find the perfect nail color for your style,<br />your outfit, and your next appointment.
        </p>
      </div>

      <div style={{ padding: '0 18px 18px' }}>
        <button onClick={() => navigate('/match')}
          style={{ width: '100%', padding: '18px 20px', background: 'linear-gradient(135deg, #C4546A, #A8405A)', borderRadius: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 4px 20px rgba(196,84,106,0.35)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <div style={{ flex: 1, textAlign: 'left' as const }}>
            <p style={{ fontSize: 20, fontWeight: 600, color: 'white', margin: '0 0 4px', fontFamily: 'Cormorant Garamond, serif' }}>Match a Color</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.4 }}>Upload a photo or take a picture<br />to find your perfect match.</p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }}>›</span>
        </button>
      </div>

      <div style={{ padding: '0 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(196,84,106,0.2)' }} />
          <p style={{ fontSize: 13, color: '#2C2B4B', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', margin: 0, whiteSpace: 'nowrap' as const }}>
            ✦ How can we help today? ✦
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(196,84,106,0.2)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {QUICK_ACTIONS.map(a => (
            <button key={a.title} onClick={a.action}
              style={{ background: 'white', border: '0.5px solid #F0E8E8', borderRadius: 14, padding: '14px 12px', textAlign: 'left' as const, cursor: 'pointer', display: 'flex', flexDirection: 'column' as const, gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {a.icon}
                </div>
                <span style={{ color: '#C4546A', fontSize: 16 }}>›</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0, lineHeight: 1.3 }}>{a.title}</p>
              <p style={{ fontSize: 11, color: '#6b6b80', margin: 0, lineHeight: 1.4 }}>{a.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden', height: 130, flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(to bottom, #FDF8F8, transparent)', zIndex: 1 }} />
        <div style={{ display: 'flex', height: '100%' }}>
          {['#FFCDD9','#F4A7B9','#E91E8C','#C4546A','#8B3A52','#9B7DB8','#6B4A8C','#F4C0D1','#E8A0B8','#D4537E'].map((c, i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          ))}
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, background: 'rgba(0,0,0,0.1)' }}>
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

      <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 68, background: 'white', borderTop: '0.5px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 6px' }}>
        <button style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 3, flex: 1, background: 'none', border: 'none', cursor: 'pointer', color: '#C4546A' }}>
          <span style={{ fontSize: 20 }}>🏠</span>
          <span style={{ fontSize: 9, fontFamily: 'Outfit, sans-serif' }}>Home</span>
        </button>
        <button style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 3, flex: 1, background: 'none', border: 'none', cursor: 'pointer', color: '#a0a0b0' }}>
          <span style={{ fontSize: 20 }}>♡</span>
          <span style={{ fontSize: 9, fontFamily: 'Outfit, sans-serif' }}>Favorites</span>
        </button>
        <button onClick={() => navigate('/match')}
          style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #C4546A, #A8405A)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(196,84,106,0.45)', marginTop: -20, flexShrink: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
        <button style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 3, flex: 1, background: 'none', border: 'none', cursor: 'pointer', color: '#a0a0b0' }}>
          <span style={{ fontSize: 20 }}>🕐</span>
          <span style={{ fontSize: 9, fontFamily: 'Outfit, sans-serif' }}>History</span>
        </button>
        <button style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 3, flex: 1, background: 'none', border: 'none', cursor: 'pointer', color: '#a0a0b0' }}>
          <span style={{ fontSize: 20 }}>👤</span>
          <span style={{ fontSize: 9, fontFamily: 'Outfit, sans-serif' }}>Profile</span>
        </button>
      </nav>
    </div>
  )
}
