import { useNavigate } from 'react-router-dom'
import { getUserName } from '../App'

export default function TechHome() {
  const navigate = useNavigate()
  const name = getUserName()

  const ACTIONS = [
    { icon: '📷', title: 'Upload My Work',      sub: 'Showcase your best sets and build your portfolio.',       bg: '#FDF0F2', action: () => {} },
    { icon: '💅', title: 'Salon Color Tools',   sub: 'Add, update and manage your salon\'s color inventory.',   bg: '#F0EEF8', action: () => {} },
    { icon: '👗', title: 'Match Client Outfit', sub: 'Find the perfect nail colors to match any outfit.',       bg: '#FDF0F2', action: () => navigate('/match') },
    { icon: '⭐', title: 'My Portfolio',        sub: 'View and manage your saved work and designs.',            bg: '#FDF3E8', action: () => {} },
    { icon: '👥', title: 'My Clients',          sub: 'Keep client notes, favorites, and service history.',      bg: '#EEF8F4', action: () => {} },
    { icon: '📊', title: 'My Performance',      sub: 'Track your growth, stats, and client engagement.',        bg: '#F0EEF8', action: () => {} },
    { icon: '🔥', title: 'Trending Colors',     sub: 'See the most popular colors right now.',                  bg: '#FDF0F2', action: () => {} },
    { icon: '💡', title: 'Inspiration Gallery', sub: 'Get inspired with trending nail art and ideas.',          bg: '#FFFBF0', action: () => {} },
  ]

  const STATS = [
    { icon: '👥', value: '28', label: 'Clients Served' },
    { icon: '♡',  value: '17', label: 'Repeat Clients' },
    { icon: '⭐', value: '34', label: 'Portfolio Saves' },
    { icon: '📈', value: '4.9', label: 'Avg. Rating' },
  ]

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100%', background: '#FDF8F8', paddingBottom: 80, overflowY: 'auto' }}>

      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px 4px', fontSize: 11, fontWeight: 500 }}>
        <span>9:41</span>
        <span>●●●</span>
      </div>

      {/* Hero section */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 200 }}>

        {/* Pink abstract circle bg */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'linear-gradient(135deg, #F4C0D1, #E8A0B8)', opacity: 0.35, zIndex: 0 }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 12px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="HueMatch" style={{ height: 40, objectFit: 'contain' }} />
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#C4546A', color: 'white', fontWeight: 500 }}>PRO</span>
          </div>
          <button style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(196,84,106,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔔</button>
        </div>

        {/* Welcome text */}
        <div style={{ padding: '0 18px 16px', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 14, color: '#6b6b80', margin: '0 0 4px' }}>Welcome to</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontWeight: 400, color: '#2C2B4B', margin: '0 0 8px', lineHeight: 1.2 }}>
            <span style={{ color: '#C4546A' }}>Hue</span>Match <span style={{ color: '#2C2B4B' }}>Pro</span> ✦
          </h1>
          {name && <p style={{ fontSize: 13, color: '#C4546A', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 8px' }}>Hi, {name}!</p>}
          <p style={{ fontSize: 13, color: '#6b6b80', lineHeight: 1.6, margin: '0 0 16px', maxWidth: 220 }}>
            Helping nail professionals work smarter, serve clients better, and showcase their talent.
          </p>

          {/* 4 benefit icons */}
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { icon: '⚡', label: 'Work Smarter' },
              { icon: '♥', label: 'Serve Clients Better' },
              { icon: '✦', label: 'Grow Your Business' },
              { icon: '🏆', label: 'Be the Tech They Request' },
            ].map(b => (
              <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FDF0F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{b.icon}</div>
                <p style={{ fontSize: 9, color: '#6b6b80', textAlign: 'center', margin: 0, lineHeight: 1.3 }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What would you like to do today */}
      <div style={{ padding: '8px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(196,84,106,0.2)' }} />
          <p style={{ fontSize: 13, color: '#2C2B4B', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', margin: 0, whiteSpace: 'nowrap' as const }}>✦ What would you like to do today? ✦</p>
          <div style={{ flex: 1, height: 1, background: 'rgba(196,84,106,0.2)' }} />
        </div>

        {/* 2x4 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ACTIONS.map(a => (
            <button key={a.title} onClick={a.action}
              style={{ background: 'white', border: '0.5px solid #F0E8E8', borderRadius: 14, padding: '14px 12px', textAlign: 'left' as const, cursor: 'pointer', display: 'flex', flexDirection: 'column' as const, gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
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

      {/* This month stats */}
      <div style={{ margin: '0 18px 14px', background: 'white', borderRadius: 16, border: '0.5px solid #F0E8E8', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>Your This Month</p>
          <button style={{ fontSize: 12, color: '#C4546A', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
            View Dashboard <span>›</span>
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, marginBottom: 3 }}>{s.icon}</div>
              <p style={{ fontSize: 20, fontWeight: 600, color: '#1a1a2e', margin: '0 0 2px', fontFamily: 'Cormorant Garamond, serif' }}>{s.value}</p>
              <p style={{ fontSize: 9, color: '#a0a0b0', margin: 0, lineHeight: 1.3 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational card */}
      <div style={{ margin: '0 18px 20px', background: 'linear-gradient(135deg, #FDF0F2, #FAD8E0)', borderRadius: 16, border: '0.5px solid #F4C0D1', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(196,84,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>✦</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#C4546A', margin: '0 0 3px' }}>You were requested 17 times this month!</p>
          <p style={{ fontSize: 11, color: '#6b6b80', margin: 0, lineHeight: 1.4 }}>Keep shining and your clients will keep coming.</p>
        </div>
        <button style={{ flexShrink: 0, height: 34, padding: '0 12px', background: '#C4546A', color: 'white', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 500, fontFamily: 'Outfit, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
          View My Stats
        </button>
      </div>

      {/* Bottom nav */}
      <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 68, background: 'white', borderTop: '0.5px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 6px' }}>
        <button style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 3, flex: 1, background: 'none', border: 'none', cursor: 'pointer', color: '#C4546A' }}>
          <span style={{ fontSize: 20 }}>🏠</span>
          <span style={{ fontSize: 9, fontFamily: 'Outfit, sans-serif' }}>Home</span>
        </button>
        <button style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 3, flex: 1, background: 'none', border: 'none', cursor: 'pointer', color: '#a0a0b0' }}>
          <span style={{ fontSize: 20 }}>👥</span>
          <span style={{ fontSize: 9, fontFamily: 'Outfit, sans-serif' }}>Clients</span>
        </button>

        {/* Center camera FAB */}
        <button onClick={() => navigate('/match')}
          style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #C4546A, #A8405A)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(196,84,106,0.45)', marginTop: -20, flexShrink: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>

        <button style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 3, flex: 1, background: 'none', border: 'none', cursor: 'pointer', color: '#a0a0b0' }}>
          <span style={{ fontSize: 20 }}>🖼️</span>
          <span style={{ fontSize: 9, fontFamily: 'Outfit, sans-serif' }}>Portfolio</span>
        </button>
        <button style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 3, flex: 1, background: 'none', border: 'none', cursor: 'pointer', color: '#a0a0b0' }}>
          <span style={{ fontSize: 20 }}>👤</span>
          <span style={{ fontSize: 9, fontFamily: 'Outfit, sans-serif' }}>Profile</span>
        </button>
      </nav>
    </div>
  )
}
